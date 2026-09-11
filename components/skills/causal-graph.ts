import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "causal-graph", n: 21, name: "Causal Graph", shelf: "reasoning", wishCost: 1,
    blurb: "List causes \u2192 effects \u2192 interventions.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a system or incident.",
    run: (input: string) => {if(!input.trim()) return "Paste a system or incident.";
  return `Causal graph (text)\nFocus: ${input.trim().slice(0,160)}\n\nDrivers → mechanisms → outcomes\nInterventions (leverage points):\n1. ...\n2. ...\nUnintended effects to watch\n\nNext: pick one intervention you can test this week.`;
    },
  };
export default skill;
