"use client";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import {
  b64,
  copyText,
  deepJsonDiff,
  deriveAesKey,
  downloadBlob,
  fromB64,
} from "./helpers";

type Note = { id: string; title: string; body: string; t: number };

export function MemoryTool(): ReactElement {
  const [pass, setPass] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [cipherBlob, setCipherBlob] = useState<string | null>(null);

  useEffect(() => {
    try {
      setCipherBlob(localStorage.getItem("tg-wish-vault") || null);
    } catch {}
  }, []);

  async function encryptAll(list: Note[]) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveAesKey(pass, salt);
    const pt = new TextEncoder().encode(JSON.stringify(list));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, pt);
    const pack = JSON.stringify({
      v: 1,
      salt: b64(salt),
      iv: b64(iv),
      ct: b64(ct),
    });
    localStorage.setItem("tg-wish-vault", pack);
    setCipherBlob(pack);
  }

  async function unlock() {
    if (!pass) {
      setMsg("Need passphrase.");
      return;
    }
    if (!cipherBlob) {
      setNotes([]);
      setUnlocked(true);
      setMsg("Empty vault — add notes.");
      return;
    }
    try {
      const pack = JSON.parse(cipherBlob);
      const key = await deriveAesKey(pass, fromB64(pack.salt));
      const pt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fromB64(pack.iv) },
        key,
        fromB64(pack.ct)
      );
      setNotes(JSON.parse(new TextDecoder().decode(pt)));
      setUnlocked(true);
      setMsg("Unlocked.");
    } catch {
      setMsg("Bad passphrase or corrupt vault.");
    }
  }

  async function addNote() {
    if (!title.trim()) return;
    const next = [
      { id: String(Date.now()), title: title.trim(), body, t: Date.now() },
      ...notes,
    ];
    setNotes(next);
    setTitle("");
    setBody("");
    try {
      await encryptAll(next);
      setMsg("Saved encrypted.");
    } catch {
      setMsg("Encrypt failed.");
    }
  }

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(needle) ||
        n.body.toLowerCase().includes(needle)
    );
  }, [notes, q]);

  return (
    <div className="real-tool">
      <label className="try-label">
        Passphrase
        <input
          className="email-field"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          disabled={unlocked}
        />
      </label>
      <div className="tool-actions">
        {!unlocked ? (
          <button className="btn" type="button" onClick={() => void unlock()}>
            Unlock
          </button>
        ) : (
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setUnlocked(false);
              setNotes([]);
              setMsg("Locked.");
            }}
          >
            Lock
          </button>
        )}
        <button
          className="btn ghost"
          type="button"
          disabled={!cipherBlob}
          onClick={() => cipherBlob && downloadBlob("vault.json", cipherBlob, "application/json")}
        >
          Export ciphertext
        </button>
        <label className="btn ghost" style={{ cursor: "pointer" }}>
          Import
          <input
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const t = await f.text();
              localStorage.setItem("tg-wish-vault", t);
              setCipherBlob(t);
              setUnlocked(false);
              setMsg("Imported — unlock with passphrase.");
            }}
          />
        </label>
      </div>
      {unlocked && (
        <>
          <label className="try-label">
            Title
            <input className="email-field" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="try-label">
            Note
            <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
          <button className="btn" type="button" onClick={() => void addNote()}>
            Add encrypted
          </button>
          <label className="try-label">
            Search
            <input className="email-field" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <ul className="hint-list">
            {filtered.map((n) => (
              <li key={n.id}>
                <b>{n.title}</b>
                <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>
                  {n.body}
                </pre>
              </li>
            ))}
          </ul>
        </>
      )}
      {msg && <p className="msg ok">{msg}</p>}
    </div>
  );
}

export function DistillTool(): ReactElement {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const lines = input.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const decisions: string[] = [];
    const questions: string[] = [];
    const actions: string[] = [];
    for (const l of lines) {
      if (/\?$/.test(l) || /^(who|what|when|where|why|how|should|can we)\b/i.test(l))
        questions.push(l);
      else if (
        /^(decided|decision|we will|we'll|agreed|going with)\b/i.test(l) ||
        /\b(decided|decision|approved)\b/i.test(l)
      )
        decisions.push(l);
      else if (
        /^(todo|action|next|owner:)/i.test(l) ||
        /\b(TODO|we should|let's|follow[- ]?up|action item)\b/i.test(l) ||
        /^[-*•]\s+/.test(l)
      )
        actions.push(l.replace(/^[-*•]\s+/, ""));
      else if (/^(ok|ship|lock|yes)\b/i.test(l)) decisions.push(l);
    }
    const block = (h: string, xs: string[]) =>
      `## ${h}\n` + (xs.length ? xs.map((x) => `- ${x}`).join("\n") : "- (none found)");
    setOut(
      `# Thread Distiller\n\n${block("Decisions", decisions)}\n\n${block(
        "Open questions",
        questions
      )}\n\n${block("Actions", actions)}\n\n_Heuristic extract — verify before acting._`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        Paste thread
        <textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>
          Distill
        </button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>
          Copy
        </button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function JsonDiffTool(): ReactElement {
  const [a, setA] = useState("{\n  \"a\": 1\n}");
  const [b, setB] = useState("{\n  \"a\": 2,\n  \"b\": true\n}");
  const [out, setOut] = useState("");
  function run() {
    try {
      const left = JSON.parse(a);
      const right = JSON.parse(b);
      const diffs = deepJsonDiff(left, right);
      if (!diffs.length) {
        setOut("No differences.");
        return;
      }
      setOut(
        diffs
          .map((d) => {
            if (d.kind === "added") return `+ ${d.path} = ${JSON.stringify(d.b)}`;
            if (d.kind === "removed") return `− ${d.path} (was ${JSON.stringify(d.a)})`;
            return `~ ${d.path}: ${JSON.stringify(d.a)} → ${JSON.stringify(d.b)}`;
          })
          .join("\n")
      );
    } catch (e) {
      setOut(e instanceof Error ? e.message : String(e));
    }
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        JSON A
        <textarea rows={5} value={a} onChange={(e) => setA(e.target.value)} />
      </label>
      <label className="try-label">
        JSON B
        <textarea rows={5} value={b} onChange={(e) => setB(e.target.value)} />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>
          Diff
        </button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>
          Copy
        </button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function PromptsTool(): ReactElement {
  type Ver = { v: number; system: string; user: string; t: number };
  type Entry = { name: string; versions: Ver[] };
  const [list, setList] = useState<Entry[]>([]);
  const [name, setName] = useState("default");
  const [system, setSystem] = useState("");
  const [user, setUser] = useState("");
  const [ready, setReady] = useState(false);
  const [vA, setVA] = useState(1);
  const [vB, setVB] = useState(1);
  const [diff, setDiff] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tg-wish-prompts");
      if (raw) setList(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("tg-wish-prompts", JSON.stringify(list));
    } catch {}
  }, [list, ready]);

  function save() {
    const n = name.trim() || "default";
    const cur = list.find((e) => e.name === n);
    const ver: Ver = {
      v: (cur?.versions[0]?.v || 0) + 1,
      system,
      user,
      t: Date.now(),
    };
    if (cur) {
      setList(list.map((e) => (e.name === n ? { ...e, versions: [ver, ...e.versions] } : e)));
    } else {
      setList([{ name: n, versions: [ver] }, ...list]);
    }
  }

  const entry = list.find((e) => e.name === name.trim());
  function doDiff() {
    if (!entry) return;
    const A = entry.versions.find((x) => x.v === vA);
    const B = entry.versions.find((x) => x.v === vB);
    if (!A || !B) {
      setDiff("Pick two existing versions.");
      return;
    }
    setDiff(
      `# Prompt diff v${A.v} → v${B.v}\n\n## System\n--- A ---\n${A.system}\n--- B ---\n${B.system}\n\n## User\n--- A ---\n${A.user}\n--- B ---\n${B.user}`
    );
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">Storage + versioning only. No jailbreak / refusal-bypass copy.</p>
      <label className="try-label">
        Name
        <input className="email-field" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="try-label">
        System
        <textarea rows={3} value={system} onChange={(e) => setSystem(e.target.value)} />
      </label>
      <label className="try-label">
        User
        <textarea rows={3} value={user} onChange={(e) => setUser(e.target.value)} />
      </label>
      <button className="btn" type="button" onClick={save}>
        Save version
      </button>
      {entry && (
        <>
          <p className="seal">Versions: {entry.versions.map((v) => "v" + v.v).join(", ")}</p>
          <div className="tool-actions">
            <label className="try-label">
              A
              <input
                className="email-field"
                type="number"
                value={vA}
                onChange={(e) => setVA(Number(e.target.value) || 1)}
              />
            </label>
            <label className="try-label">
              B
              <input
                className="email-field"
                type="number"
                value={vB}
                onChange={(e) => setVB(Number(e.target.value) || 1)}
              />
            </label>
            <button className="btn ghost" type="button" onClick={doDiff}>
              Diff versions
            </button>
          </div>
        </>
      )}
      {diff && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{diff}</pre>}
    </div>
  );
}
