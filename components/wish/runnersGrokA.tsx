"use client";
import { useState, type ReactElement } from "react";
import { copyText, looksVerified, roughTokens, splitClaims } from "./helpers";

export function ResumeTool(): ReactElement {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const lines = input.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const files = lines.filter((l) => /\/[\w.-]+|\.(ts|tsx|js|mjs|json|md|css)\b|workspace|components\//i.test(l));
    const decisions = lines.filter((l) => /\b(decided|decision|we will|agreed|going with)\b/i.test(l));
    const constraints = lines.filter((l) => /\b(must|cannot|don't|do not|never|only|constraint|require)\b/i.test(l));
    const actions = lines.filter((l) => /\b(todo|next|should|need to|action)\b/i.test(l) || /^[-*•]/.test(l));
    const goal = lines[0] || "(set goal)";
    const next3 = (actions.length ? actions : lines.slice(-3)).slice(0, 3);
    setOut(
`# Session Resume Card
_Boot this in the next Grok chat. Unverified claims marked — confirm before acting._

## Goal
${goal}

## Constraints
${(constraints.length ? constraints : ["(none extracted — add manually)"]).map((x) => `- ${x}`).join("\n")}

## Open decisions
${(decisions.length ? decisions : ["(none extracted)"]).map((x) => `- ${x} [unverified]`).join("\n")}

## Files / paths
${(files.length ? files : ["(none extracted)"]).map((x) => `- \`${x}\``).join("\n")}

## Next 3 actions
${next3.map((x, i) => `${i + 1}. ${x.replace(/^[-*•]\s*/, "")}`).join("\n")}

## Raw notes (trimmed)
\`\`\`
${input.slice(0, 2500)}
\`\`\`
`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">End-of-chat notes<textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Build card</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function PackerTool(): ReactElement {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const lines = input.split(/\n/);
    const keep: string[] = [];
    const dropped: string[] = [];
    const seen = new Set<string>();
    for (const l of lines) {
      const t = l.trim();
      if (!t) continue;
      const key = t.toLowerCase();
      if (seen.has(key)) {
        dropped.push(t.slice(0, 120));
        continue;
      }
      const important =
        /^#{1,3}\s/.test(t) ||
        /^[-*•]/.test(t) ||
        /^```/.test(t) ||
        /\b(must|never|constraint|TODO|file:|path:)\b/i.test(t) ||
        t.length < 140;
      if (important || keep.length < 40) {
        seen.add(key);
        keep.push(t);
      } else dropped.push(t.slice(0, 120));
    }
    const block = keep.join("\n");
    setOut(
`# Context Pack
Rough tokens: ~${roughTokens(block)} (chars/4)
Source tokens: ~${roughTokens(input)}
Kept lines: ${keep.length} · Dropped: ${dropped.length}

## System-prompt block
\`\`\`
${block.slice(0, 6000)}
\`\`\`

## Dropped (sample)
${dropped.slice(0, 20).map((d) => `- ${d}`).join("\n") || "- (none)"}
`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">Long paste<textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Pack</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function ClaimGateTool(): ReactElement {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const claims = splitClaims(input);
    const tagged = claims.map((c) => {
      const v = looksVerified(c);
      return `${c.replace(/[.!?]?$/, "")} ${v ? "[verified]" : "[unverified]"}.`;
    });
    const need = claims.filter((c) => !looksVerified(c));
    setOut(
`# Claim Gate rewrite
${tagged.join("\n\n")}

## Needs evidence (${need.length})
${need.map((c) => `- ${c}`).join("\n") || "- (none)"}

_Default is [unverified] unless URL/RFC/SHA/citation cues appear. Heuristic — not truth._`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">Prose<textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Gate</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function FalsifierTool(): ReactElement {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const claim = input.trim() || "(empty claim)";
    setOut(
`# Falsifier Desk
Claim: ${claim}

1. **Measurement** — What numeric metric would go the wrong way if this is false? Record baseline now.
2. **Counterexample hunt** — Name one concrete case that should break the claim; try to produce it.
3. **Time-box** — If X does not happen within a stated window, treat the claim as provisionally false.
4. **Independent check** — Who/what outside the original source could refute it? Run that check.
5. **Kill criterion** — Write the exact observation that would make you abandon the claim.

## Settling evidence
- Positive settle: reproducible observation that matches the claim under the measurement above.
- Negative settle: any of #2–#5 firing with a written artifact.

_Proposed tests only — not proof. Mark results [verified]/[unverified]._`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">Claim / hypothesis<textarea rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Falsify</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}
