"use client";
import { useState, type ReactElement } from "react";
import { copyText } from "./helpers";

function scorePrompt(p: string, task: string) {
  const clarity = Math.min(5, 1 + (p.length > 40 ? 1 : 0) + (/^#{1,3}|^\d+\./m.test(p) ? 1 : 0) + (p.split(/\n/).length > 3 ? 1 : 0) + (/\b(you will|output|format)\b/i.test(p) ? 1 : 0));
  const constraints = Math.min(5, 1 + (/\b(must|never|only|do not|don't|constraint)\b/i.test(p) ? 2 : 0) + (/\b(json|markdown|bullet)\b/i.test(p) ? 1 : 0) + (task && p.toLowerCase().includes(task.toLowerCase().slice(0, 12)) ? 1 : 0));
  const testability = Math.min(5, 1 + (/\b(example|acceptance|test|verify|check)\b/i.test(p) ? 2 : 0) + (/\b(given|when|then|pass|fail)\b/i.test(p) ? 1 : 0) + (p.includes("?") ? 0 : 1));
  return { clarity, constraints, testability, total: clarity + constraints + testability };
}

export function PromptAbTool(): ReactElement {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [task, setTask] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const sa = scorePrompt(a, task);
    const sb = scorePrompt(b, task);
    const winner = sa.total === sb.total ? "Tie" : sa.total > sb.total ? "A" : "B";
    const reason =
      winner === "Tie"
        ? "equal heuristic totals — pick by taste / domain."
        : winner === "A"
          ? "A scored higher on clarity/constraints/testability heuristics."
          : "B scored higher on clarity/constraints/testability heuristics.";
    setOut(
`# Prompt A/B Ledger
Task: ${task || "(none)"}

| Axis | A | B |
|---|---|---|
| Clarity | ${sa.clarity} | ${sb.clarity} |
| Constraints | ${sa.constraints} | ${sb.constraints} |
| Testability | ${sa.testability} | ${sb.testability} |
| Total | ${sa.total} | ${sb.total} |

Winner: **${winner}**
Reason: ${reason}

_Advisory desk scores — not model quality. Unverified._`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">Task<input className="email-field" value={task} onChange={(e) => setTask(e.target.value)} /></label>
      <label className="try-label">Prompt A<textarea rows={4} value={a} onChange={(e) => setA(e.target.value)} /></label>
      <label className="try-label">Prompt B<textarea rows={4} value={b} onChange={(e) => setB(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Compare</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function RubricTool(): ReactElement {
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [out, setOut] = useState("");
  function overlap(a: string, b: string) {
    const A = new Set(a.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2));
    const B = b.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);
    if (!A.size || !B.length) return 0;
    let hit = 0;
    B.forEach((t) => {
      if (A.has(t)) hit++;
    });
    return hit / Math.max(A.size, 1);
  }
  function run() {
    const o = overlap(expected, actual);
    const accuracy = Math.min(5, Math.round(o * 5) || 1);
    const completeness = Math.min(5, Math.round((actual.length / Math.max(expected.length, 1)) * 3) + (o > 0.3 ? 1 : 0));
    const constraint = Math.min(5, 1 + (/\b(must|never|only)\b/i.test(expected) ? (new RegExp(expected.match(/\b(must|never|only)\b[^.?]*/i)?.[0] || "a^", "i").test(actual) ? 3 : 1) : 2));
    const actionability = Math.min(5, 1 + (/^[-*•]|\d+\./m.test(actual) ? 2 : 0) + (/\b(next|todo|file|run|ship)\b/i.test(actual) ? 1 : 0) + (actual.length > 80 ? 1 : 0));
    const total = accuracy + completeness + constraint + actionability;
    const pass = total >= 12;
    setOut(
`# Eval Rubric Runner
| Axis | Score /5 |
|---|---|
| Accuracy | ${accuracy} |
| Completeness | ${completeness} |
| Constraint-respect | ${constraint} |
| Actionability | ${actionability} |
| Total | ${total} / 20 |

Result: **${pass ? "PASS" : "FAIL"}** (threshold 12)

_Automated keyword/overlap heuristics — unverified. Use as a desk, not gospel._`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">Expected<textarea rows={4} value={expected} onChange={(e) => setExpected(e.target.value)} /></label>
      <label className="try-label">Actual<textarea rows={4} value={actual} onChange={(e) => setActual(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Score</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function WishIssueTool(): ReactElement {
  const [wish, setWish] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const title = wish.trim().split(/\n/)[0].slice(0, 72) || "Wish";
    const labels = ["enhancement"];
    if (/\bbug|fix|broken\b/i.test(wish)) labels.push("bug");
    if (/\bauth|security|encrypt\b/i.test(wish)) labels.push("security");
    if (/\bui|ux|mobile\b/i.test(wish)) labels.push("ui");
    setOut(
`# Wish → Issue Pack

## Issue title
${title}

## Issue body
### Problem
${wish.trim()}

### Acceptance sketch
- [ ] Core path works on Production
- [ ] No preview alias to www
- [ ] Auth providers still 200

### Notes
Claims in the wish are [unverified] until checked.

## Suggested labels
${labels.map((l) => `\`${l}\``).join(", ")}

## PR description
### Summary
Implements: ${title}

### Test plan
- [ ] Manual run of the new tool/runner
- [ ] \`npm run build\` green
- [ ] Production deploy verified
`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">Wish<textarea rows={6} value={wish} onChange={(e) => setWish(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Pack</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function SpecTool(): ReactElement {
  const [wish, setWish] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const lines = wish.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const goal = lines[0] || "feature";
    const bullets = lines.filter((l) => /^[-*•]/.test(l)).map((l) => l.replace(/^[-*•]\s*/, ""));
    const checks = (bullets.length ? bullets : lines.slice(0, 3)).slice(0, 5);
    setOut(
`# Spec Contract
Wish: ${goal}

## Acceptance (Given / When / Then)
${checks
  .map(
    (c, i) => `### ${i + 1}
Given the lamp is on Production
When ${c}
Then the outcome is observable and reversible
`
  )
  .join("\n")}

## Out of scope
- Jailbreak / refusal-bypass tooling
- Preview deploys aliased to www
- Server-side secrets leaving the browser for client-only desks

_Draft contract — verify before treating as binding._`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">Wish<textarea rows={6} value={wish} onChange={(e) => setWish(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Contract</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}

export function DecisionTool(): ReactElement {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  function run() {
    const lines = input.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const decision = lines[0] || "(decision)";
    const alts = lines.filter((l) => /\b(or|vs|alternative|option)\b/i.test(l)).slice(0, 4);
    const revisit = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    setOut(
`# Decision Log
## Decision
${decision}

## Context
${lines.slice(1).join("\n") || "(add context)"}

## Assumptions [unverified]
- (fill) premise that must hold
- (fill) dependency available

## Alternatives considered
${(alts.length ? alts : ["(name at least one alternative)"]).map((a) => `- ${a}`).join("\n")}

## Reversal triggers
- Metric X moves against us for Y days
- Constraint Z becomes binding
- New evidence falsifies an assumption above

## Revisit date
${revisit}
`
    );
  }
  return (
    <div className="real-tool">
      <label className="try-label">Decision + context<textarea rows={6} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>Log</button>
        <button className="btn ghost" type="button" disabled={!out} onClick={() => copyText(out)}>Copy</button>
      </div>
      {out && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </div>
  );
}
