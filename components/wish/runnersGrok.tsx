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
