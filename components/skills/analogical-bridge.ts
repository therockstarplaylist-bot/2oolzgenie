import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "analogical-bridge", n: 19, name: "Analogical Bridge", shelf: "reasoning", wishCost: 1,
    blurb: "Map problem to 2 analogies + transfer limits.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste the problem.",
    run: (input: string) => {if(!input.trim()) return "Paste a problem.";
  return `Analogical bridge\nProblem: ${input.trim().slice(0,160)}\n\nAnalogy 1: (domain) — maps how? limits?\nAnalogy 2: (domain) — maps how? limits?\nTransferable move: one technique to try now\n\nNext: try the transferable move for 15 minutes.`;
    },
  };
export default skill;
