import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "uelg-auditor", n: 49, name: "UELG Auditor", shelf: "product", wishCost: 1,
    blurb: "Check copy/flow against UELG seal language.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste UI copy or flow notes.",
    run: (input: string) => {if(!input.trim()) return "Paste UI copy.";
  const t=input.toLowerCase();
  const hits=["uelg","seal","wish","forge","lamp","tc"].filter(k=>t.includes(k));
  return `UELG auditor\nKeywords present: ${hits.join(", ")||"none"}\n\nChecks:\n[ ] Seal language consistent\n[ ] Wish ≠ casino TC confusion\n[ ] Free demos clearly labeled non-beneficial\n[ ] Dark mode contrast OK\n\nNext: fix the first failed check only.`;
    },
  };
export default skill;
