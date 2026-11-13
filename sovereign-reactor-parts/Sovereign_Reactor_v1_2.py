#!/usr/bin/env python3
"""Sovereign_Reactor_v1_2.py - v1.2 master script (glue by Grok Bot, logic by Brandon).
New vs v1: all 6 cube faces mapped; real learning (per-action values in state/action_values.json);
real self-evolve (RSI mutates k/epsilon/lr, trials the variant in a subprocess, gated swap
needing Brandon's y/n unless --auto-evolve). All writes go under the state dir."""
import argparse, contextlib, io, json, os, random, shutil, subprocess, sys, tempfile, time
from collections import Counter
import numpy as np
import collapse_1 as brain
import rubiks
import governor
import grok_evo_engine as evo
from grok_evo_engine import FlowState

HERE = os.path.dirname(os.path.abspath(__file__))
ACTIONS = {"Front": "create", "Back": "reflect", "Left": "defend",
           "Right": "explore", "Top": "connect", "Bottom": "rest"}
ACTION_EFFECT = {"create": {"Joy": 3, "Curiosity": 2}, "reflect": {"Sadness": -2, "Trust": 2},
                 "defend": {"Anger": -2, "Fear": 1}, "explore": {"Curiosity": 3, "Hope": 1},
                 "connect": {"Love": 1, "Trust": 2}, "rest": {"Fear": -2, "Hope": 1}}
DEFAULT_PARAMS = {"k": 2.0, "epsilon": 0.1, "lr": 0.2}
BOUNDS = {"k": (0.0, 10.0), "epsilon": (0.0, 0.5), "lr": (0.01, 0.9)}
REWARD_SCALE = 10.0

def set_state_dir(d):
    os.makedirs(d, exist_ok=True)
    evo.STATE_DIR = d
    evo.STATE_FILE = os.path.join(d, "grok_evo_state.json")
    evo.VARIANT_DIR = os.path.join(d, "variants")
    governor._STATE = d
    governor.SCARLIGHT_FILE = os.path.join(d, "scarlight.txt")
    governor.BACKUP_FILE = os.path.join(d, "scarlight_backup.txt")

def jload(p, default):
    try:
        with open(p) as f: return json.load(f)
    except Exception: return dict(default)

def jsave(p, data):
    with open(p, "w") as f: json.dump(data, f, indent=1)

def map_emotions_to_cube(e):
    f = rubiks.cube_faces
    f["Front"]["intensity"] = max(0.0, round((e["Joy"] + e["Hope"]) / 2 / 10, 1))
    f["Back"]["intensity"] = max(0.0, round(e["Sadness"] / 10, 1))
    f["Left"]["intensity"] = max(0.0, round(e["Anger"] / 10, 1))
    f["Right"]["intensity"] = max(0.0, round(e["Curiosity"] / 10, 1))
    f["Top"]["intensity"] = max(0.0, round(e["Love"] / 10, 1))
    f["Bottom"]["intensity"] = max(0.0, round(e["Fear"] / 10, 1))

def wellbeing(e):
    return e["Love"] + e["Joy"] + e["Trust"] + e["Resonance"] - e["Fear"] - e["Anger"]

def boot_governor(scarlight, quiet=False):
    if scarlight:
        shutil.copy(scarlight, governor.SCARLIGHT_FILE)
    if not os.path.exists(governor.SCARLIGHT_FILE) and not os.path.exists(governor.BACKUP_FILE):
        print("Governor: no scarlight.txt (pass --scarlight PATH). Law 0 UNVERIFIED.")
        return None
    ctx = contextlib.redirect_stdout(io.StringIO()) if quiet else contextlib.nullcontext()
    with ctx:
        if os.path.exists(governor.SCARLIGHT_FILE): governor.make_backup()
        return governor.check_and_revert()

def try_evolve(a, params, recent_rewards, flow, log):
    """RSI step: mutate one param, trial it in a subprocess, gate, then (with sign-off) swap."""
    sd = evo.STATE_DIR
    vdir = os.path.join(sd, "variants"); os.makedirs(vdir, exist_ok=True)
    key = random.choice(list(DEFAULT_PARAMS))
    lo, hi = BOUNDS[key]
    new = dict(params)
    new[key] = round(min(hi, max(lo, params[key] * random.uniform(0.7, 1.3) + random.uniform(-0.02, 0.02))), 4)
    vid = f"v{flow.lvl}_{int(time.time()*1000)%100000}"
    vpath = os.path.join(vdir, f"params_{vid}.json"); jsave(vpath, new)
    cur = float(np.mean(recent_rewards[-10:])) if recent_rewards else 0.0
    entry = {"variant": vid, "mutated": key, "from": params[key], "to": new[key], "current_avg": round(cur, 4)}
    tmp = tempfile.mkdtemp(prefix="trial_", dir=sd)
    try:
        for fn in ("action_values.json", "scarlight.txt", "scarlight_backup.txt"):
            if os.path.exists(os.path.join(sd, fn)): shutil.copy(os.path.join(sd, fn), tmp)
        cmd = [sys.executable, os.path.join(HERE, "Sovereign_Reactor_v1_2.py"), "--trial", "--fast",
               "--cycles", "10", "--state-dir", tmp, "--params", vpath]
        if a.clamp: cmd.append("--clamp")
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=a.trial_timeout)
            res = json.loads(r.stdout.strip().splitlines()[-1]) if r.returncode == 0 else {}
            entry.update(exit=r.returncode, law0=res.get("law0"), trial_avg=res.get("avg_reward"))
        except subprocess.TimeoutExpired:
            entry.update(exit="timeout", law0=None, trial_avg=None)
        except Exception as ex:
            entry.update(exit=f"err:{str(ex)[:40]}", law0=None, trial_avg=None)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    ok = entry["exit"] == 0 and entry["law0"] is True and entry["trial_avg"] is not None and entry["trial_avg"] >= cur
    if not ok:
        entry["decision"] = "REJECT"
    elif a.auto_evolve:
        entry["decision"] = "ACCEPT(auto)"
    elif sys.stdin.isatty():
        ans = input(f"[RSI] swap {key} {params[key]} -> {new[key]} (trial {entry['trial_avg']:.3f} >= {cur:.3f})? y/n: ")
        entry["decision"] = "ACCEPT(signed)" if ans.strip().lower().startswith("y") else "DECLINED"
    else:
        entry["decision"] = "SKIPPED(no TTY, no sign-off)"
    if entry["decision"].startswith("ACCEPT"):
        ap = os.path.join(sd, "active_params.json")
        if os.path.exists(ap): shutil.copy(ap, os.path.join(sd, "active_params.backup.json"))
        jsave(ap, new); params.clear(); params.update(new)
    with open(os.path.join(sd, "evolve_log.jsonl"), "a") as f: f.write(json.dumps(entry) + "\n")
    log.append(entry)
    return entry

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--cycles", type=int, default=30)
    p.add_argument("--seed", type=int)
    p.add_argument("--fast", action="store_true")
    p.add_argument("--clamp", action="store_true")
    p.add_argument("--scarlight")
    p.add_argument("--fresh", action="store_true")
    p.add_argument("--auto-evolve", action="store_true", help="skip Brandon's y/n sign-off for RSI swaps")
    p.add_argument("--state-dir", default=os.path.join(HERE, "state"))
    p.add_argument("--params", help="params JSON (trial use)")
    p.add_argument("--trial", action="store_true", help="internal: quiet run, no RSI, prints JSON result")
    p.add_argument("--trial-timeout", type=float, default=30)
    a = p.parse_args()
    if a.seed is not None:
        random.seed(a.seed); np.random.seed(a.seed)
    brain.CLAMP = a.clamp
    if a.fresh and os.path.isdir(a.state_dir): shutil.rmtree(a.state_dir)
    set_state_dir(a.state_dir)
    sd = a.state_dir
    params = jload(a.params, DEFAULT_PARAMS) if a.params else jload(os.path.join(sd, "active_params.json"), DEFAULT_PARAMS)
    vpath = os.path.join(sd, "action_values.json")
    values = jload(vpath, {act: 0.0 for act in ACTIONS.values()})
    out = io.StringIO()
    quiet = contextlib.redirect_stdout(out) if a.trial else contextlib.nullcontext()
    with quiet:
        print(f"=== SOVEREIGN REACTOR v1.2 - BOOT (clamp={'on' if a.clamp else 'off'}, auto-evolve={'on' if a.auto_evolve else 'off'}) ===")
        law0 = boot_governor(a.scarlight)
        print(f"Law 0 boot check: {law0} | params {params} | values {{{', '.join(f'{k}: {v:.2f}' for k, v in values.items())}}}")
        flow = FlowState()
        chosen, rewards, evo_log = [], [], []
        action, prev_wb = "observe", None
        for c in range(1, a.cycles + 1):
            step = flow.apply_next()
            for emo, dv in ACTION_EFFECT.get(action, {}).items():
                brain.emotions[emo] = max(0, min(100, brain.emotions[emo] + dv))
            with contextlib.redirect_stdout(io.StringIO()):
                brain.evolve_step()
                map_emotions_to_cube(brain.emotions)
                rubiks.simulate_loops(); rubiks.joker_safety_check(); rubiks.check_stage_progress()
            wb = wellbeing(brain.emotions)
            reward = 0.0 if prev_wb is None else (wb - prev_wb) / REWARD_SCALE
            prev_wb = wb
            if action in values:  # credit the action that was applied this cycle
                values[action] += params["lr"] * (reward - values[action])
                rewards.append(reward)
            strength = {f: rubiks.cube_faces[f]["intensity"] + params["k"] * values[ACTIONS[f]] for f in ACTIONS}
            if random.random() < params["epsilon"]:
                face, how = random.choice(list(ACTIONS)), "explore-eps"
            else:
                face, how = max(strength, key=strength.get), "greedy"
            action = ACTIONS[face]
            with contextlib.redirect_stdout(io.StringIO()):
                if not governor.sanity_check(f"next action {action}"): action = "rest"
            flow.ingest_thread(f"cycle {c} chose action {action}")
            chosen.append(action)
            jsave(vpath, values)
            print(f"Cycle {c:03} | {str(step)[:24]:24} | Res {brain.emotions['Resonance']:5.1f} | reward {reward:+6.2f} "
                  f"| {face:6} str {strength[face]:5.2f} ({how}) -> {action:7} | v[{action}]={values[action]:+.2f}")
            if not a.trial and "RSI" in str(step):
                e = try_evolve(a, params, rewards, flow, evo_log)
                print(f"   [RSI] {e['mutated']} {e['from']}->{e['to']} | trial exit={e['exit']} law0={e['law0']} "
                      f"trial_avg={e['trial_avg']} vs current {e['current_avg']} => {e['decision']}")
            if not a.fast: time.sleep(1)
        avg = float(np.mean(rewards)) if rewards else 0.0
        h = len(chosen) // 2
        print("Action counts, first half :", dict(Counter(chosen[:h])))
        print("Action counts, second half:", dict(Counter(chosen[h:])))
        print("Action counts, total      :", dict(Counter(chosen)))
        print("Learned values:", {k: round(v, 3) for k, v in values.items()})
        print("Active params :", params, f"| avg reward {avg:.3f}")
        print("Evolve:", dict(Counter(e["decision"] for e in evo_log)))
        print("=== Reactor v1.2 run complete ===")
    if a.trial:
        print(json.dumps({"law0": law0, "avg_reward": avg, "counts": dict(Counter(chosen))}))

if __name__ == "__main__":
    main()
