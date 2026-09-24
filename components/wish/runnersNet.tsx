"use client";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { copyText, downloadBlob, simpleMarkdown } from "./helpers";

export function PemTool(): ReactElement {
  const [pem, setPem] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const blocks = [...pem.matchAll(/-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g)];
    if (!blocks.length) {
      setOut("No PEM blocks found.");
      return;
    }
    const parts = blocks.map((m, i) => {
      const type = m[1].trim();
      const b64 = m[2].replace(/\s+/g, "");
      let bytes = new Uint8Array(0);
      try {
        const bin = atob(b64);
        bytes = new Uint8Array(bin.length);
        for (let j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
      } catch {
        return `# Block ${i + 1}\nType: ${type}\nError: bad base64`;
      }
      const head = [...bytes.slice(0, 16)].map((x) => x.toString(16).padStart(2, "0")).join(" ");
      return `# Block ${i + 1}\nType: ${type}\nDER bytes: ${bytes.length}\nHead: ${head}\n_Note: light decode only — not a full X.509 validator._`;
    });
    setOut(parts.join("\n\n"));
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        PEM
        <textarea rows={8} value={pem} onChange={(e) => setPem(e.target.value)} placeholder="-----BEGIN CERTIFICATE-----" />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Decode</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function HarTool(): ReactElement {
  const [raw, setRaw] = useState("");
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState("");
  const entries = useMemo(() => {
    try {
      const j = JSON.parse(raw);
      const list = j.log?.entries || (Array.isArray(j) ? j : j.request ? [j] : []);
      return list as any[];
    } catch {
      return [] as any[];
    }
  }, [raw]);

  function build(kind: "curl" | "fetch") {
    const e = entries[idx];
    if (!e) {
      setOut("Paste HAR JSON or pick an entry.");
      return;
    }
    const req = e.request || e;
    const method = (req.method || "GET").toUpperCase();
    const url = req.url || "";
    const headers: { name: string; value: string }[] = req.headers || [];
    const body = req.postData?.text || "";
    if (kind === "curl") {
      const hs = headers
        .filter((h) => !/^content-length$/i.test(h.name))
        .map((h) => `-H ${JSON.stringify(h.name + ": " + h.value)}`)
        .join(" \\\n  ");
      setOut(
        `curl -X ${method} ${JSON.stringify(url)} \\\n  ${hs}` +
          (body ? ` \\\n  --data-raw ${JSON.stringify(body)}` : "")
      );
    } else {
      const hobj: Record<string, string> = {};
      headers.forEach((h) => {
        if (!/^content-length$/i.test(h.name)) hobj[h.name] = h.value;
      });
      setOut(
        `await fetch(${JSON.stringify(url)}, {\n  method: ${JSON.stringify(method)},\n  headers: ${JSON.stringify(
          hobj,
          null,
          2
        )},${body ? `\n  body: ${JSON.stringify(body)},` : ""}\n});`
      );
    }
  }

  return (
    <div className="real-tool">
      <label className="try-label">
        HAR JSON
        <textarea rows={6} value={raw} onChange={(e) => setRaw(e.target.value)} />
      </label>
      {entries.length > 0 && (
        <label className="try-label">
          Entry ({entries.length})
          <select className="email-field" value={idx} onChange={(e) => setIdx(Number(e.target.value))}>
            {entries.map((e, i) => (
              <option key={i} value={i}>
                {(e.request?.method || "?") + " " + (e.request?.url || "").slice(0, 80)}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="tool-actions">
        <button className="btn" type="button" onClick={() => build("curl")}>curl</button>
        <button className="btn ghost" type="button" onClick={() => build("fetch")}>fetch</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function MdTool(): ReactElement {
  const [md, setMd] = useState("# Stage\n\nWrite **markdown** here.\n\n- one\n- two");
  const html = simpleMarkdown(md);
  return (
    <div className="real-tool">
      <label className="try-label">
        Markdown
        <textarea rows={8} value={md} onChange={(e) => setMd(e.target.value)} />
      </label>
      <div className="tool-actions">
        <button className="btn ghost" type="button" onClick={() => copyText(html)}>Copy HTML</button>
        <button className="btn ghost" type="button" onClick={() => downloadBlob("stage.html", html, "text/html")}>Download HTML</button>
      </div>
      <div className="try-out" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export function TfidfTool(): ReactElement {
  const [docs, setDocs] = useState("Doc A about lamps and coins.\n---\nDoc B about forge and wishes.\n---\nDoc C about sqlite and pdf archive.");
  const [q, setQ] = useState("forge wishes");
  const [out, setOut] = useState("");

  function tokenize(s: string) {
    return s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  }
  function run() {
    const parts = docs.split(/\n---\n/).map((d) => d.trim()).filter(Boolean);
    if (!parts.length) {
      setOut("Need docs separated by ---");
      return;
    }
    const toks = parts.map(tokenize);
    const df = new Map<string, number>();
    toks.forEach((ts) => {
      new Set(ts).forEach((t) => df.set(t, (df.get(t) || 0) + 1));
    });
    const N = parts.length;
    const qT = tokenize(q);
    const scored = parts.map((doc, i) => {
      const tf = new Map<string, number>();
      toks[i].forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
      let score = 0;
      for (const t of qT) {
        const termTf = (tf.get(t) || 0) / Math.max(1, toks[i].length);
        const idf = Math.log((N + 1) / ((df.get(t) || 0) + 1)) + 1;
        score += termTf * idf;
      }
      return { i, score, snippet: doc.slice(0, 220) };
    });
    scored.sort((a, b) => b.score - a.score);
    setOut(
      scored
        .map((s, rank) => `#${rank + 1} score=${s.score.toFixed(4)}\n${s.snippet}`)
        .join("\n\n") + "\n\n_TF–IDF keyword retrieval — not an LLM._"
    );
  }

  return (
    <div className="real-tool">
      <label className="try-label">
        Documents (--- split)
        <textarea rows={6} value={docs} onChange={(e) => setDocs(e.target.value)} />
      </label>
      <label className="try-label">
        Query
        <input className="email-field" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <button className="btn" type="button" onClick={run}>Ask</button>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

type ClaimRow = { id: string; claim: string; evidence: string; confidence: number };

export function ClaimsTool(): ReactElement {
  const [rows, setRows] = useState<ClaimRow[]>([]);
  const [claim, setClaim] = useState("");
  const [evidence, setEvidence] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tg-wish-claims");
      if (raw) setRows(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("tg-wish-claims", JSON.stringify(rows));
    } catch {}
  }, [rows, ready]);

  return (
    <div className="real-tool">
      <label className="try-label">Claim<textarea rows={2} value={claim} onChange={(e) => setClaim(e.target.value)} /></label>
      <label className="try-label">Evidence<textarea rows={2} value={evidence} onChange={(e) => setEvidence(e.target.value)} /></label>
      <label className="try-label">Confidence {confidence}%
        <input type="range" min={0} max={100} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={() => {
          if (!claim.trim()) return;
          setRows([{ id: String(Date.now()), claim: claim.trim(), evidence, confidence }, ...rows]);
          setClaim(""); setEvidence("");
        }}>Add</button>
        <button className="btn ghost" type="button" onClick={() => downloadBlob("claims.json", JSON.stringify(rows, null, 2), "application/json")}>Export</button>
      </div>
      <ul className="hint-list">
        {rows.map((r) => (
          <li key={r.id}><b>{r.confidence}%</b> — {r.claim}<div className="card-blurb">{r.evidence || "(no evidence yet — unverified)"}</div></li>
        ))}
      </ul>
    </div>
  );
}

export function OpenApiTool(): ReactElement {
  const [raw, setRaw] = useState("");
  const [out, setOut] = useState("");
  function run() {
    try {
      const spec = JSON.parse(raw);
      const paths = spec.paths || {};
      const lines: string[] = [];
      for (const [path, methods] of Object.entries(paths as Record<string, any>)) {
        for (const [method, op] of Object.entries(methods as Record<string, any>)) {
          if (!/^(get|post|put|patch|delete|head|options)$/i.test(method)) continue;
          lines.push(`${method.toUpperCase().padEnd(7)} ${path}  —  ${op.summary || op.operationId || ""}`);
        }
      }
      setOut(lines.length ? lines.join("\n") : "No paths found.");
    } catch (e) {
      setOut(e instanceof Error ? e.message : String(e));
    }
  }
  return (
    <div className="real-tool">
      <label className="try-label">OpenAPI JSON<textarea rows={8} value={raw} onChange={(e) => setRaw(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Flatten</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function SwissTool(): ReactElement {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"b64e" | "b64d" | "hexe" | "hexd">("b64e");
  const [out, setOut] = useState("");
  function run() {
    try {
      if (mode === "b64e") setOut(btoa(unescape(encodeURIComponent(input))));
      else if (mode === "b64d") setOut(decodeURIComponent(escape(atob(input.replace(/\s+/g, "")))));
      else if (mode === "hexe") setOut([...new TextEncoder().encode(input)].map((b) => b.toString(16).padStart(2, "0")).join(""));
      else {
        const clean = input.replace(/\s+/g, "");
        const u8 = new Uint8Array(clean.length / 2);
        for (let i = 0; i < u8.length; i++) u8[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
        setOut(new TextDecoder().decode(u8));
      }
    } catch (e) {
      setOut(e instanceof Error ? e.message : String(e));
    }
  }
  return (
    <div className="real-tool">
      <label className="try-label">Input<textarea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool-actions">
        {(["b64e", "b64d", "hexe", "hexd"] as const).map((m) => (
          <button key={m} className={"btn" + (mode === m ? "" : " ghost")} type="button" onClick={() => setMode(m)}>{m}</button>
        ))}
        <button className="btn" type="button" onClick={run}>Run</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function JwtLiteTool(): ReactElement {
  const [tok, setTok] = useState("");
  const [out, setOut] = useState("");
  function run() {
    try {
      const parts = tok.trim().split(".");
      if (parts.length < 2) throw new Error("Need header.payload");
      const dec = (p: string) => JSON.stringify(JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/"))), null, 2);
      setOut(`// decode only — signature NOT verified\nHeader:\n${dec(parts[0])}\n\nPayload:\n${dec(parts[1])}`);
    } catch (e) {
      setOut(e instanceof Error ? e.message : String(e));
    }
  }
  return (
    <div className="real-tool">
      <label className="try-label">JWT<textarea rows={3} value={tok} onChange={(e) => setTok(e.target.value)} /></label>
      <button className="btn" type="button" onClick={run}>Decode</button>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}
