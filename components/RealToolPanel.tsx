"use client";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { resolveFreeToolId } from "./constants";

function copyText(text: string) {
  try {
    void navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function PasteTool() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [copied, setCopied] = useState(false);
  function clean() {
    let t = input;
    t = t.replace(
      /([?&])(utm_[^=&]*|fbclid|gclid|mc_eid|mc_cid|igshid|ref|ref_src|_hsenc|_hsmi)=[^&#\s]*/gi,
      "$1"
    );
    t = t.replace(/[?&]$/g, "").replace(/\?&/g, "?").replace(/&&+/g, "&");
    t = t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    setOut(t);
    setCopied(false);
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        Paste
        <textarea
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/?utm_source=x&fbclid=y …"
        />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={clean}>
          Clean
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={!out}
          onClick={() => {
            if (copyText(out)) setCopied(true);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {out !== "" && <pre className="try-out">{out}</pre>}
    </div>
  );
}

function TimerTool() {
  const [mins, setMins] = useState(25);
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      return;
    }
    const id = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, left]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="real-tool">
      <label className="try-label">
        Minutes
        <input
          className="email-field"
          type="number"
          min={1}
          max={180}
          value={mins}
          disabled={running}
          onChange={(e) => {
            const v = Math.max(1, Math.min(180, Number(e.target.value) || 1));
            setMins(v);
            setLeft(v * 60);
          }}
        />
      </label>
      <p className="timer-face">
        {mm}:{ss}
      </p>
      <div className="tool-actions">
        <button
          className="btn"
          type="button"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            setRunning(false);
            setLeft(mins * 60);
          }}
        >
          Reset
        </button>
      </div>
      {left === 0 && <p className="msg ok">Time&apos;s up — lamp soft chime.</p>}
    </div>
  );
}

type CheckItem = { id: string; text: string; done: boolean };
function ChecklistTool() {
  const [items, setItems] = useState<CheckItem[]>([]);
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tg-checklist");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("tg-checklist", JSON.stringify(items));
    } catch {}
  }, [items, ready]);
  return (
    <div className="real-tool">
      <div className="tool-actions" style={{ alignItems: "stretch" }}>
        <input
          className="email-field"
          style={{ margin: 0, flex: 1 }}
          value={text}
          placeholder="New item…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              setItems((prev) => [
                {
                  id: String(Date.now()),
                  text: text.trim(),
                  done: false,
                },
                ...prev,
              ]);
              setText("");
            }
          }}
        />
        <button
          className="btn"
          type="button"
          onClick={() => {
            if (!text.trim()) return;
            setItems((prev) => [
              { id: String(Date.now()), text: text.trim(), done: false },
              ...prev,
            ]);
            setText("");
          }}
        >
          Add
        </button>
      </div>
      <div className="grid" style={{ marginTop: 8 }}>
        {items.map((it) => (
          <div className="row" key={it.id}>
            <label style={{ display: "flex", gap: 10, alignItems: "center", flex: 1 }}>
              <input
                type="checkbox"
                checked={it.done}
                onChange={() =>
                  setItems((prev) =>
                    prev.map((x) =>
                      x.id === it.id ? { ...x, done: !x.done } : x
                    )
                  )
                }
              />
              <span style={{ textDecoration: it.done ? "line-through" : "none", color: "var(--fg)" }}>
                {it.text}
              </span>
            </label>
            <button
              className="btn ghost"
              type="button"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
            >
              Del
            </button>
          </div>
        ))}
        {!items.length && <p className="card-blurb">Empty list — add something.</p>}
      </div>
    </div>
  );
}

function WordsTool() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const lines = text === "" ? 0 : text.split(/\n/).length;
  return (
    <div className="real-tool">
      <label className="try-label">
        Text
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste…"
        />
      </label>
      <p className="stat-line">
        {words} words · {chars} chars · {lines} lines
      </p>
    </div>
  );
}

function JsonTool() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  function run(pretty: boolean) {
    try {
      const v = JSON.parse(input);
      setOut(pretty ? JSON.stringify(v, null, 2) : JSON.stringify(v));
      setErr("");
    } catch (e) {
      setOut("");
      setErr(e instanceof Error ? e.message : "Invalid JSON");
    }
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        JSON
        <textarea
          rows={7}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"ok":true}'
        />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={() => run(true)}>
          Pretty
        </button>
        <button className="btn ghost" type="button" onClick={() => run(false)}>
          Minify
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={!out}
          onClick={() => copyText(out)}
        >
          Copy
        </button>
      </div>
      {err && <p className="msg" style={{ color: "var(--danger)" }}>{err}</p>}
      {out && <pre className="try-out">{out}</pre>}
    </div>
  );
}

function DiffTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const rows = useMemo(() => {
    const la = a.split("\n");
    const lb = b.split("\n");
    const setALines = new Set(la);
    const setBLines = new Set(lb);
    const out: { kind: "same" | "add" | "del"; text: string }[] = [];
    for (const line of la) {
      if (!setBLines.has(line)) out.push({ kind: "del", text: line });
      else out.push({ kind: "same", text: line });
    }
    for (const line of lb) {
      if (!setALines.has(line)) out.push({ kind: "add", text: line });
    }
    return out;
  }, [a, b]);
  return (
    <div className="real-tool">
      <label className="try-label">
        Left
        <textarea rows={4} value={a} onChange={(e) => setA(e.target.value)} />
      </label>
      <label className="try-label">
        Right
        <textarea rows={4} value={b} onChange={(e) => setB(e.target.value)} />
      </label>
      <div className="diff-out">
        {rows.map((r, i) => (
          <div key={i} className={"diff-line diff-" + r.kind}>
            {r.kind === "add" ? "+ " : r.kind === "del" ? "− " : "  "}
            {r.text || " "}
          </div>
        ))}
      </div>
    </div>
  );
}

const LENGTH: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  ft: 0.3048,
  in: 0.0254,
};
const MASS: Record<string, number> = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
  oz: 0.028349523125,
};
function UnitsTool() {
  const [cat, setCat] = useState<"length" | "mass" | "temp">("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [val, setVal] = useState("1");
  useEffect(() => {
    if (cat === "length") {
      setFrom("m");
      setTo("ft");
    } else if (cat === "mass") {
      setFrom("kg");
      setTo("lb");
    } else {
      setFrom("C");
      setTo("F");
    }
  }, [cat]);
  const result = useMemo(() => {
    const n = Number(val);
    if (!Number.isFinite(n)) return "—";
    if (cat === "temp") {
      let c = n;
      if (from === "F") c = ((n - 32) * 5) / 9;
      if (from === "K") c = n - 273.15;
      let out = c;
      if (to === "F") out = (c * 9) / 5 + 32;
      if (to === "K") out = c + 273.15;
      return String(Math.round(out * 10000) / 10000);
    }
    const table = cat === "length" ? LENGTH : MASS;
    const meters = n * (table[from] || 1);
    const out = meters / (table[to] || 1);
    return String(Math.round(out * 1e8) / 1e8);
  }, [cat, from, to, val]);
  const opts =
    cat === "length"
      ? Object.keys(LENGTH)
      : cat === "mass"
        ? Object.keys(MASS)
        : ["C", "F", "K"];
  return (
    <div className="real-tool">
      <div className="hilo-bets">
        {(["length", "mass", "temp"] as const).map((c) => (
          <button
            key={c}
            className={"btn" + (cat === c ? "" : " ghost")}
            type="button"
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <label className="try-label">
        Value
        <input
          className="email-field"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </label>
      <div className="tool-actions">
        <select
          className="email-field"
          style={{ margin: 0 }}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        >
          {opts.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="seal">→</span>
        <select
          className="email-field"
          style={{ margin: 0 }}
          value={to}
          onChange={(e) => setTo(e.target.value)}
        >
          {opts.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <p className="stat-line">
        = {result} {to}
      </p>
    </div>
  );
}

function CaseTool() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  function words(s: string) {
    return s
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_\-]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }
  function apply(mode: string) {
    const w = words(input);
    let r = input;
    if (mode === "lower") r = input.toLowerCase();
    if (mode === "upper") r = input.toUpperCase();
    if (mode === "title")
      r = w.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(" ");
    if (mode === "snake") r = w.map((x) => x.toLowerCase()).join("_");
    if (mode === "kebab") r = w.map((x) => x.toLowerCase()).join("-");
    if (mode === "camel")
      r = w
        .map((x, i) =>
          i === 0
            ? x.toLowerCase()
            : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()
        )
        .join("");
    setOut(r);
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        Text
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="hello world / helloWorld"
        />
      </label>
      <div className="hilo-bets">
        {["lower", "UPPER", "Title", "snake", "kebab", "camel"].map((m) => (
          <button
            key={m}
            className="btn ghost"
            type="button"
            onClick={() => apply(m === "UPPER" ? "upper" : m === "Title" ? "title" : m)}
          >
            {m}
          </button>
        ))}
      </div>
      {out !== "" && (
        <>
          <pre className="try-out">{out}</pre>
          <button className="btn ghost" type="button" onClick={() => copyText(out)}>
            Copy
          </button>
        </>
      )}
    </div>
  );
}

function RegexTool() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+\\.\\w+)");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("hi a@b.co and x@y.org");
  const result = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; groups: string[]; index: number }[] = [];
      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        const r = new RegExp(pattern, flags);
        while ((m = r.exec(text)) !== null) {
          matches.push({
            match: m[0],
            groups: m.slice(1),
            index: m.index,
          });
          if (m[0] === "") r.lastIndex++;
        }
      } else {
        const m = re.exec(text);
        if (m)
          matches.push({ match: m[0], groups: m.slice(1), index: m.index });
      }
      return { ok: true as const, matches };
    } catch (e) {
      return {
        ok: false as const,
        error: e instanceof Error ? e.message : "Invalid regex",
      };
    }
  }, [pattern, flags, text]);
  return (
    <div className="real-tool">
      <label className="try-label">
        Pattern
        <input
          className="email-field"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />
      </label>
      <label className="try-label">
        Flags
        <input
          className="email-field"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="gimsu"
        />
      </label>
      <label className="try-label">
        Test string
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      {!result.ok ? (
        <p className="msg" style={{ color: "var(--danger)" }}>{result.error}</p>
      ) : (
        <div className="try-out">
          <div className="stat-line">{result.matches.length} match(es)</div>
          {result.matches.map((m, i) => (
            <div key={i} style={{ marginTop: 8 }}>
              <b>#{i + 1}</b> @ {m.index}: <code>{m.match}</code>
              {m.groups.length > 0 && (
                <div className="card-blurb">
                  groups: {m.groups.map((g, gi) => `[${gi + 1}]=${JSON.stringify(g)}`).join(" · ")}
                </div>
              )}
            </div>
          ))}
          {!result.matches.length && <p className="card-blurb">No matches.</p>}
        </div>
      )}
    </div>
  );
}

function b64urlDecode(seg: string) {
  const s = seg.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s + "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(pad);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function JwtTool() {
  const [token, setToken] = useState("");
  const decoded = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return null;
    try {
      const header = JSON.parse(b64urlDecode(parts[0]));
      const payload = JSON.parse(b64urlDecode(parts[1]));
      return { header, payload };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Decode failed" };
    }
  }, [token]);
  return (
    <div className="real-tool">
      <p className="seal">decode only · not verified</p>
      <label className="try-label">
        JWT
        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOi…"
        />
      </label>
      {decoded && "error" in decoded && (
        <p className="msg" style={{ color: "var(--danger)" }}>{decoded.error}</p>
      )}
      {decoded && "header" in decoded && (
        <>
          <h2>Header</h2>
          <pre className="try-out">{JSON.stringify(decoded.header, null, 2)}</pre>
          <h2>Payload</h2>
          <pre className="try-out">{JSON.stringify(decoded.payload, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

function detectDelimiter(csv: string) {
  const first = csv.split(/\r?\n/).find((l) => l.trim()) || "";
  const counts = [",", ";", "\t", "|"].map((d) => ({
    d,
    n: (first.match(new RegExp("\\" + d, "g")) || []).length,
  }));
  counts.sort((a, b) => b.n - a.n);
  return counts[0].n > 0 ? counts[0].d : ",";
}

function parseCsv(csv: string, delim: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (inQ) {
      if (c === '"') {
        if (csv[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === delim) {
      row.push(cur);
      cur = "";
    } else if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c !== "\r") cur += c;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function CsvJsonTool() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  function toJson() {
    try {
      const delim = detectDelimiter(input);
      const rows = parseCsv(input, delim);
      if (!rows.length) throw new Error("No rows");
      const headers = rows[0].map((h) => h.trim() || "col");
      const data = rows.slice(1).map((r) => {
        const o: Record<string, string> = {};
        headers.forEach((h, i) => {
          o[h] = r[i] ?? "";
        });
        return o;
      });
      setOut(JSON.stringify(data, null, 2));
      setErr(`delimiter: ${JSON.stringify(delim)} · ${data.length} rows`);
    } catch (e) {
      setOut("");
      setErr(e instanceof Error ? e.message : "CSV parse failed");
    }
  }
  function toCsv() {
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (!arr.length) throw new Error("Empty JSON");
      const headers = Array.from(
        new Set(arr.flatMap((o) => Object.keys(o || {})))
      );
      const esc = (v: unknown) => {
        const s = v == null ? "" : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const lines = [
        headers.join(","),
        ...arr.map((o) => headers.map((h) => esc((o as Record<string, unknown>)[h])).join(",")),
      ];
      setOut(lines.join("\n"));
      setErr(`${arr.length} rows`);
    } catch (e) {
      setOut("");
      setErr(e instanceof Error ? e.message : "JSON→CSV failed");
    }
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        CSV or JSON
        <textarea
          rows={7}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'name,age\nAda,36\n— or —\n[{"name":"Ada"}]'}
        />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={toJson}>
          → JSON
        </button>
        <button className="btn ghost" type="button" onClick={toCsv}>
          → CSV
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={!out}
          onClick={() => copyText(out)}
        >
          Copy
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={!out}
          onClick={() =>
            downloadBlob(
              out.trimStart().startsWith("[") || out.trimStart().startsWith("{")
                ? "data.json"
                : "data.csv",
              out,
              "text/plain"
            )
          }
        >
          Download
        </button>
      </div>
      {err && <p className="card-blurb">{err}</p>}
      {out && <pre className="try-out">{out}</pre>}
    </div>
  );
}

function HashTool() {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<"SHA-256" | "SHA-1" | "SHA-512">("SHA-256");
  const [hex, setHex] = useState("");
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    try {
      const data = new TextEncoder().encode(input);
      const buf = await crypto.subtle.digest(algo, data);
      const bytes = Array.from(new Uint8Array(buf));
      setHex(bytes.map((b) => b.toString(16).padStart(2, "0")).join(""));
    } catch (e) {
      setHex(e instanceof Error ? e.message : "Hash failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        Text
        <textarea rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="hilo-bets">
        {(["SHA-256", "SHA-1", "SHA-512"] as const).map((a) => (
          <button
            key={a}
            className={"btn" + (algo === a ? "" : " ghost")}
            type="button"
            onClick={() => setAlgo(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="tool-actions">
        <button className="btn" type="button" disabled={busy} onClick={run}>
          Digest
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={!hex}
          onClick={() => copyText(hex)}
        >
          Copy
        </button>
      </div>
      {hex && <pre className="try-out">{hex}</pre>}
    </div>
  );
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function toIcsStamp(local: string) {
  // local datetime-local → floating YYYYMMDDTHHMMSS
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return (
    d.getFullYear() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    "T" +
    pad2(d.getHours()) +
    pad2(d.getMinutes()) +
    pad2(d.getSeconds())
  );
}
function IcsTool() {
  const [title, setTitle] = useState("Lamp meet");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loc, setLoc] = useState("");
  const [note, setNote] = useState("");
  function build() {
    const s = toIcsStamp(start);
    const e = toIcsStamp(end);
    if (!s || !e) {
      setNote("Set valid start and end datetimes.");
      return;
    }
    const uid = `tg-${Date.now()}@2oolzgenie`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//2oolzgenie//ICS//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${s}`,
      `DTSTART:${s}`,
      `DTEND:${e}`,
      `SUMMARY:${title.replace(/\n/g, " ")}`,
      loc ? `LOCATION:${loc.replace(/\n/g, " ")}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");
    downloadBlob("meeting.ics", ics, "text/calendar");
    setNote("Downloaded meeting.ics (floating local times).");
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        Title
        <input className="email-field" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="try-label">
        Start
        <input
          className="email-field"
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </label>
      <label className="try-label">
        End
        <input
          className="email-field"
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </label>
      <label className="try-label">
        Location
        <input className="email-field" value={loc} onChange={(e) => setLoc(e.target.value)} />
      </label>
      <button className="btn" type="button" onClick={build}>
        Download .ics
      </button>
      {note && <p className="msg ok">{note}</p>}
    </div>
  );
}

function parseField(field: string, min: number, max: number): number[] | null {
  if (field === "*") {
    const all: number[] = [];
    for (let i = min; i <= max; i++) all.push(i);
    return all;
  }
  const out = new Set<number>();
  for (const part of field.split(",")) {
    const stepMatch = part.match(/^(\*|\d+)(?:-(\d+))?\/(\d+)$/);
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (stepMatch) {
      const start = stepMatch[1] === "*" ? min : Number(stepMatch[1]);
      const end = stepMatch[2] != null ? Number(stepMatch[2]) : max;
      const step = Number(stepMatch[3]);
      for (let i = start; i <= end; i += step) if (i >= min && i <= max) out.add(i);
    } else if (rangeMatch) {
      const a = Number(rangeMatch[1]);
      const b = Number(rangeMatch[2]);
      for (let i = a; i <= b; i++) if (i >= min && i <= max) out.add(i);
    } else if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n >= min && n <= max) out.add(n);
      else return null;
    } else return null;
  }
  return [...out].sort((a, b) => a - b);
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function CronTool() {
  const [expr, setExpr] = useState("*/15 9-17 * * 1-5");
  const parsed = useMemo(():
    | { error: string }
    | { english: string; next: Date[] } => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5)
      return { error: "Need exactly 5 fields: min hour dom mon dow" };
    const [mi, hh, dom, mon, dow] = parts;
    const minutes = parseField(mi, 0, 59);
    const hours = parseField(hh, 0, 23);
    const days = parseField(dom, 1, 31);
    const months = parseField(mon, 1, 12);
    const dows = parseField(dow, 0, 7);
    if (!minutes || !hours || !days || !months || !dows)
      return { error: "Could not parse one or more fields" };
    // cron: 7 == Sunday
    const dowNorm = [...new Set(dows.map((d) => (d === 7 ? 0 : d)))];
    const english = [
      `Minutes: ${mi === "*" ? "every" : mi}`,
      `Hours: ${hh === "*" ? "every" : hh}`,
      `Day of month: ${dom === "*" ? "every" : dom}`,
      `Month: ${mon === "*" ? "every" : mon}`,
      `Weekday: ${dow === "*" ? "every" : dow} (${dowNorm.map((d) => DOW[d]).join(", ") || "—"})`,
    ].join("\n");
    const next: Date[] = [];
    const cursor = new Date();
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);
    for (let guard = 0; guard < 366 * 24 * 60 && next.length < 5; guard++) {
      const m = cursor.getMonth() + 1;
      const d = cursor.getDate();
      const h = cursor.getHours();
      const min = cursor.getMinutes();
      const w = cursor.getDay();
      if (
        months.includes(m) &&
        days.includes(d) &&
        hours.includes(h) &&
        minutes.includes(min) &&
        dowNorm.includes(w)
      ) {
        next.push(new Date(cursor));
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }
    return { english, next };
  }, [expr]);
  return (
    <div className="real-tool">
      <label className="try-label">
        Cron (5 fields)
        <input
          className="email-field"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="*/15 9-17 * * 1-5"
        />
      </label>
      {"error" in parsed ? (
        <p className="msg" style={{ color: "var(--danger)" }}>{parsed.error}</p>
      ) : (
        <>
          <pre className="try-out">{parsed.english}</pre>
          <h2>Next fires (local)</h2>
          <ul className="howto">
            {parsed.next.map((d, i) => (
              <li key={i}>
                {DOW[d.getDay()]} {MON[d.getMonth()]} {d.getDate()}{" "}
                {pad2(d.getHours())}:{pad2(d.getMinutes())}
              </li>
            ))}
            {!parsed.next.length && (
              <li>No hits in the next year — check fields.</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}

const RUNNERS: Record<string, () => ReactElement> = {
  paste: PasteTool,
  timer: TimerTool,
  check: ChecklistTool,
  words: WordsTool,
  json: JsonTool,
  diff: DiffTool,
  units: UnitsTool,
  case: CaseTool,
  regex: RegexTool,
  jwt: JwtTool,
  csvjson: CsvJsonTool,
  hash: HashTool,
  ics: IcsTool,
  cron: CronTool,
};

export function RealToolPanel({ toolId }: { toolId: string }) {
  const id = resolveFreeToolId(toolId);
  const Comp = RUNNERS[id];
  if (!Comp) {
    return <p className="card-blurb">No runner for this shelf id yet.</p>;
  }
  return <Comp />;
}
