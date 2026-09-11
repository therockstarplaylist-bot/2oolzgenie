import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "adversarial-twin", n: 22, name: "Adversarial Twin", shelf: "reasoning", wishCost: 1,
    blurb: "Argue the opposite case at full strength.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste your thesis.",
    run: (input: string) => {if(!input.trim()) return "Paste your thesis.";
  return `Adversarial twin\nThesis: ${input.trim().slice(0,160)}\n\nOpposite case:\n- Strongest evidence against\n- Incentives that make you wrong\n- What would convince a smart critic\n\nNext: steelman one objection into the main draft.`;
    },
  };
export default skill;
