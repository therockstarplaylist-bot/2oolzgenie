import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "regression-gate", n: 34, name: "Regression Gate", shelf: "evolution", wishCost: 1,
    blurb: "Checklist before shipping a behavior change.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste the change.",
    run: (input: string) => {if(!input.trim()) return "Paste the change.";
  return `Regression gate\nChange: ${input.trim().slice(0,160)}\n\n[ ] Behavior covered by eval item\n[ ] Old path still works\n[ ] No secret/PII leaked\n[ ] Rollback known\n[ ] Owner named\n\nNext: do not ship until all boxes checked or explicitly waived.`;
    },
  };
export default skill;
