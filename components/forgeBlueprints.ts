/** Runnable forge blueprints — matched from the user's need text. */
export type ForgeBlueprint = {
  id: string;
  name: string;
  keywords: string[];
  blurb: string;
  how: string[];
  placeholder: string;
  runLabel?: string;
  run: (input: string, brief: string) => string;
};


export const FORGE_BLUEPRINTS: ForgeBlueprint[] = [
  {
    id: "list-tidy",
    name: "List Tidy",
    keywords: ["list", "bullet", "sort", "dedupe", "lines", "todo", "checklist"],
    blurb: "Sort, dedupe, and number whatever you paste.",
    how: [
      "Paste messy lines or bullets",
      "Tap Run",
      "Copy the cleaned numbered list",
    ],
    placeholder: "one item per line…",
    runLabel: "Tidy list",
    run: (input) => {
      const lines = input
        .split(/\n+/)
        .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
        .filter(Boolean);
      if (!lines.length) return "Paste at least one line.";
      const uniq = [...new Set(lines.map((l) => l.toLowerCase()))].map(
        (low) => lines.find((l) => l.toLowerCase() === low) || low
      );
      const sorted = [...uniq].sort((a, b) => a.localeCompare(b));
      return (
        `List Tidy · ${sorted.length} items\n\n` +
        sorted.map((l, i) => `${i + 1}. ${l}`).join("\n")
      );
    },
  },
  {
    id: "decision-split",
    name: "Decision Split",
    keywords: [
      "decide",
      "decision",
      "pros",
      "cons",
      "should",
      "vs",
      "choose",
      "option",
    ],
    blurb: "Turn a messy choice into pros, cons, and a next step.",
    how: [
      "Paste the decision and any options",
      "Tap Run",
      "Do only the Next action",
    ],
    placeholder: "Should I…? Options: A / B. Context: …",
    runLabel: "Split it",
    run: (input, brief) => {
      const text = (input.trim() || brief).trim();
      if (!text) return "Paste a decision.";
      const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
      return (
        `Decision Split\nFocus: ${lines[0].slice(0, 160)}\n\n` +
        `Pros (force 3):\n1. \n2. \n3. \n\n` +
        `Cons (force 3):\n1. \n2. \n3. \n\n` +
        `Reversible? Yes / No\nKill criterion: what would make you stop?\n\n` +
        `Next: pick the smallest test you can finish today.`
      );
    },
  },
  {
    id: "json-tidy",
    name: "JSON Tidy",
    keywords: ["json", "api", "pretty", "format", "parse", "object", "payload"],
    blurb: "Pretty-print or explain broken JSON.",
    how: ["Paste JSON", "Tap Run", "Copy the formatted output"],
    placeholder: '{"hello":"lamp"}',
    runLabel: "Format JSON",
    run: (input) => {
      const raw = input.trim();
      if (!raw) return "Paste JSON.";
      try {
        return JSON.stringify(JSON.parse(raw), null, 2);
      } catch (e) {
        return `Could not parse JSON.\n${e instanceof Error ? e.message : String(e)}\n\nTip: check trailing commas and single quotes.`;
      }
    },
  },
  {
    id: "outline-cut",
    name: "Outline Cut",
    keywords: [
      "outline",
      "notes",
      "markdown",
      "summary",
      "headings",
      "doc",
      "write",
      "essay",
    ],
    blurb: "Compress notes into a tight markdown outline.",
    how: ["Paste notes", "Tap Run", "Keep only the outline headings you need"],
    placeholder: "Paste rough notes or a dump…",
    runLabel: "Cut outline",
    run: (input, brief) => {
      const text = (input.trim() || brief).trim();
      if (!text) return "Paste notes.";
      const parts = text
        .split(/[\n.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 12);
      const top = parts.slice(0, 12);
      return (
        `Outline Cut\n\n# Focus\n- ${top[0] || text.slice(0, 80)}\n\n## Beats\n` +
        top
          .slice(1)
          .map((p, i) => `${i + 1}. ${p.slice(0, 100)}`)
          .join("\n") +
        `\n\nNext: expand only beat #1 into a paragraph.`
      );
    },
  },
  {
    id: "claim-check",
    name: "Claim Check",
    keywords: [
      "claim",
      "confidence",
      "brier",
      "calibrat",
      "hypothesis",
      "evidence",
      "true",
      "false",
    ],
    blurb: "Force a confidence score and a falsify-next check.",
    how: [
      "Paste a claim",
      "Tap Run",
      "Fill confidence and the kill test",
    ],
    placeholder: "Claim: …",
    runLabel: "Check claim",
    run: (input, brief) => {
      const claim = (input.trim() || brief).trim();
      if (!claim) return "Paste a claim.";
      return (
        `Claim Check\nClaim: ${claim.slice(0, 240)}\n\n` +
        `Confidence (0–1): ___\nEvidence you could cite today:\n1. \n2. \n\n` +
        `Strongest disconfirming observation:\n- \n\n` +
        `Next: write the kill criterion in one sentence before you argue further.`
      );
    },
  },
  {
    id: "wish-brief",
    name: "Wish Brief",
    keywords: ["tool", "forge", "build", "app", "helper", "genie", "wish"],
    blurb: "Turn a vague wish into a 5-step build brief you can actually ship.",
    how: [
      "Your forge wish is pre-loaded as context",
      "Optional: paste more detail",
      "Tap Run for a concrete brief",
    ],
    placeholder: "Add constraints, inputs, or success criteria…",
    runLabel: "Build brief",
    run: (input, brief) => {
      const wish = (brief || input).trim();
      if (!wish) return "Describe the tool first on Forge.";
      const extra = input.trim() && input.trim() !== wish ? `\nExtra: ${input.trim().slice(0, 200)}` : "";
      return (
        `Wish Brief\nWish: ${wish.slice(0, 200)}${extra}\n\n` +
        `1. User: who runs this once?\n` +
        `2. Input: what do they paste or tap?\n` +
        `3. Output: what must appear in under 3 seconds?\n` +
        `4. Non-goal: what will this NOT do?\n` +
        `5. Tiny test: one example input → expected output\n\n` +
        `Next: implement only step 3 as a Try-it runner.`
      );
    },
  },
];

export function matchForge(need: string): ForgeBlueprint {
  const q = need.toLowerCase();
  let best = FORGE_BLUEPRINTS[FORGE_BLUEPRINTS.length - 1];
  let score = 0;
  for (const bp of FORGE_BLUEPRINTS) {
    let s = 0;
    for (const k of bp.keywords) {
      if (q.includes(k)) s += k.length > 4 ? 2 : 1;
    }
    if (s > score) {
      score = s;
      best = bp;
    }
  }
  return best;
}

export function getForgeBlueprint(id: string | undefined) {
  if (!id) return null;
  return FORGE_BLUEPRINTS.find((b) => b.id === id) || null;
}

export function runForge(id: string, input: string, brief: string) {
  const bp = getForgeBlueprint(id);
  if (!bp) return "Unknown forge tool.";
  return bp.run(input, brief);
}
