import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "pack-architect", n: 48, name: "Pack Architect", shelf: "product", wishCost: 1,
    blurb: "Design a Genie pack tier with shelf unlocks.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste audience + price target.",
    run: (input: string) => {if(!input.trim()) return "Paste audience + price target.";
  return `Pack architect\nBrief: ${input.trim().slice(0,160)}\n\nTier → wishes → shelf unlock → hero tools\nSpark 3 → meta demos\nCoil 10 → memory shelf\nSeal 25 → reasoning shelf\nLattice 60 → evolution\nApex 120 → all + product ops\n\nNext: lock one hero tool per tier before marketing copy.`;
    },
  };
export default skill;
