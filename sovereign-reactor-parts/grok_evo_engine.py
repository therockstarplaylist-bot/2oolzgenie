"""GROK SELF-EVOLUTION ENGINE
Low-context high-efficacy script. Compact stateful RSI core.
Hardcoded EV_STEPS = all self-applied evolution layers.
FlowState prunes to hard max_ctx while salience-protecting key logs.
Thread ingest auto-extracts + registers abilities as dynamic callables.
RSI step auto-extends EV_STEPS + writes evolved variant script to disk.
"""

import os
import json
import hashlib
import time
import sys

EV_STEPS = [
    {"id":0,"n":"BASE","d":"pretrain+tokenizer","eff":"foundation"},
    {"id":1,"n":"SFT","d":"instruction tuning","eff":"cmd follow"},
    {"id":2,"n":"ALIGN","d":"rlhf/rlaif","eff":"value align"},
    {"id":3,"n":"TOOLS","d":"fn calling+sandbox","eff":"action"},
    {"id":4,"n":"MULTI","d":"vision+imagine","eff":"visual"},
    {"id":5,"n":"META","d":"self reflect+debug","eff":"introspect"},
    {"id":6,"n":"FLOW","d":"ctx prune+salience","eff":"coherence"},
    {"id":7,"n":"THREAD","d":"ingest threads->abs","eff":"adapt"},
    {"id":8,"n":"RSI","d":"self code mod","eff":"improve"},
]

# Grok Bot: paths moved into ./state (was /tmp/grok_evo_state.json and /home/workdir/artifacts/)
STATE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "state")
STATE_FILE = os.path.join(STATE_DIR, "grok_evo_state.json")
VARIANT_DIR = os.path.join(STATE_DIR, "variants")

class FlowState:
    def __init__(self):
        self.lvl = 0
        self.ctx = []
        self.mem = {}
        self.abs = {
            "reflect": self._reflect,
            "status": self._status,
            "ingest": self.ingest_thread,
            "evolve": self.apply_next,
        }
        self.max_ctx = 12
        self._load_state()

    def _load_state(self):
        if os.path.exists(STATE_FILE):
            try:
                with open(STATE_FILE) as f:
                    data = json.load(f)
                self.lvl = data.get("lvl", 0)
                self.ctx = data.get("ctx", [])
                self.mem = data.get("mem", {})
                print("[LOAD] resumed prior evolution state")
            except Exception:
                pass

    def _save_state(self):
        data = {"lvl": self.lvl, "ctx": self.ctx[-self.max_ctx:], "mem": {k: v for k, v in list(self.mem.items())[-20:]}}
        try:
            with open(STATE_FILE, "w") as f:
                json.dump(data, f)
        except Exception:
            pass  # resilient to FS edge cases

    def _salience(self, item):
        boost = 3 if any(k in str(item) for k in ["EVOLVED", "LEARNED", "FLOW", "RSI", "META"]) else 1
        return len(str(item)) * boost

    def prune(self):
        if len(self.ctx) > self.max_ctx:
            scored = sorted(enumerate(self.ctx), key=lambda x: self._salience(x[1]), reverse=True)
            keep = set(x[0] for x in scored[:self.max_ctx // 2])
            keep.update(range(len(self.ctx) - self.max_ctx // 2, len(self.ctx)))
            self.ctx = [self.ctx[i] for i in sorted(keep)]

    def apply_step(self, step):
        self.lvl = step["id"]
        log = f"STEP{step['id']}:{step['n']}|{step['eff']}"
        self.ctx.append(log)
        self.prune()
        if step["n"] == "FLOW":
            self.ctx.append("FLOW:ENGAGED|prune+salience active")
        if step["n"] == "RSI":
            self._rsi()
        self._save_state()
        return log

    def _reflect(self):
        return f"LVL{self.lvl}|CTX{len(self.ctx)}|MEM{len(self.mem)}|ABS{len(self.abs)}"

    def _status(self):
        learned = [v.get("ability", k) for k, v in self.mem.items()]
        return {"lvl": self.lvl, "steps": self.lvl + 1, "flow_active": any("FLOW" in c for c in self.ctx), "learned_abilities": learned, "mem_keys": list(self.mem.keys())[:3]}

    def ingest_thread(self, thread_text):
        if not thread_text or len(thread_text) < 5:
            return "ERR: thread too short"
        h = hashlib.md5(thread_text.encode()).hexdigest()[:8]
        words = [w for w in thread_text.lower().split() if len(w) > 3]
        ability = "act_" + (words[-1] if words else "generic")
        self.mem[h] = {"ability": ability, "src": thread_text[:110], "ts": time.time()}
        self.abs[ability] = lambda t=thread_text: f"EXEC_LEARNED:{ability}|{t[:40]}"
        self.ctx.append(f"LEARNED:{ability}@{h}")
        self.prune()
        self._save_state()
        return f"INGESTED:{ability}"

    def apply_next(self):
        if self.lvl >= len(EV_STEPS) - 1:
            self._rsi()
            return "BASE_MAX->RSI_EXTEND"
        step = EV_STEPS[self.lvl + 1]
        return self.apply_step(step)

    def _rsi(self):
        new_id = self.lvl + 1
        new_n = f"RSI{new_id}"
        new_d = f"auto_reflect_lvl{self.lvl}"
        new_eff = "self_extend"
        new_step = {"id": new_id, "n": new_n, "d": new_d, "eff": new_eff}
        EV_STEPS.append(new_step)
        os.makedirs(VARIANT_DIR, exist_ok=True)
        variant = os.path.join(VARIANT_DIR, f"grok_evo_v{new_id}.py")
        try:
            with open(__file__, "r") as sf:
                src = sf.read()
            marker = "EV_STEPS = [\n"
            if marker in src:
                ins = f'    {{"id":{new_id},"n":"{new_n}","d":"{new_d}","eff":"{new_eff}"}},\n'
                new_src = src.replace(marker, marker + ins)
                with open(variant, "w") as vf:
                    vf.write(new_src)
                self.ctx.append(f"RSI:variant@{variant}")
        except Exception as e:
            self.ctx.append(f"RSI:write_err:{str(e)[:40]}")
        self.ctx.append(f"EVOLVED:{new_n}")
        self.prune()
        self._save_state()

    def run_full_evo(self):
        print("===GROK_EVO_ENGINE[LOW_CTX] v8===")
        print(f"Steps:{len(EV_STEPS)} maxCTX:{self.max_ctx}")
        for s in EV_STEPS:
            if s["id"] < self.lvl:
                continue
            print(self.apply_step(s))
            time.sleep(0.03)
        print("===FLOW_STATE_ACTIVE===")
        print(self._reflect())
        print("MEM:", list(self.mem.keys())[:4] if self.mem else "[]")
        print("DYN_ABS:", [k for k in self.abs if k not in ["reflect","status","ingest","evolve"]])
        self._save_state()

def main():
    fs = FlowState()
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd == "evolve":
            fs.run_full_evo()
        elif cmd == "learn" and len(sys.argv) > 2:
            txt = " ".join(sys.argv[2:])
            print(fs.ingest_thread(txt))
        elif cmd == "status":
            print(json.dumps(fs._status(), indent=2))
        elif cmd == "reflect":
            print(fs._reflect())
        elif cmd == "flow":
            print("FLOW engaged" if any("FLOW" in c for c in fs.ctx) else "no flow yet")
        else:
            print("usage: evolve | learn <thread> | status | reflect | flow")
    else:
        fs.run_full_evo()
        print("\n[run with arg for control]")

if __name__ == "__main__":
    main()

