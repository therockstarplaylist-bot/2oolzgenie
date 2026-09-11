import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "dataset-sniff", n: 41, name: "Dataset Sniff", shelf: "world", wishCost: 1,
    blurb: "Smell-test a dataset description for leakage/bias.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste dataset description.",
    run: (input: string) => {if(!input.trim()) return "Paste dataset description.";
  return `Dataset sniff\n${input.trim().slice(0,120)}\n\nChecks:\n[ ] Train/test leakage paths\n[ ] Label noise / proxy labels\n[ ] Population shift\n[ ] Missingness pattern\n[ ] License / PII\n\nNext: name the most likely leakage path.`;
    },
  };
export default skill;
