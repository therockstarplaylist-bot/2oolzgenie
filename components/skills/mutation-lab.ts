import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "mutation-lab", n: 33, name: "Mutation Lab", shelf: "evolution", wishCost: 1,
    blurb: "Propose 5 mutations to a prompt/process.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste current prompt or process.",
    run: (input: string) => {if(!input.trim()) return "Paste a prompt or process.";
  return `Mutation lab\nBase: ${input.trim().slice(0,120)}\n\nM1: shorter\nM2: add kill criteria\nM3: add examples\nM4: adversarial self-check\nM5: structured output schema\n\nNext: A/B M1 vs M4 on one real task.`;
    },
  };
export default skill;
