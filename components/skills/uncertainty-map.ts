import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "uncertainty-map", n: 5, name: "Uncertainty Map", shelf: "meta", wishCost: 1,
    blurb: "Separate knowns / unknowns / unknowables with next checks.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a decision or research question.",
    run: (input: string) => {if(!input.trim()) return "Paste a decision or research question.";
  return `Uncertainty map\nFocus: ${input.trim().slice(0,160)}\n\nKnowns: facts you could cite today\nUnknowns: learnable with a defined experiment\nUnknowables: need time / other people / luck\n\nNext checks (ordered):\n1. 10-minute lookup that could flip the decision\n2. Smallest reversible test\n3. Who already knows this?\n\nNext: do check #1 before expanding scope.`;
    },
  };
export default skill;
