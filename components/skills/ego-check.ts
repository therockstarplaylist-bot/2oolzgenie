import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "ego-check", n: 8, name: "Ego Check", shelf: "meta", wishCost: 1,
    blurb: "Detect overclaim, status seeking, and unfalsifiable flex.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste text that might be peacocking.",
    run: (input: string) => {if(!input.trim()) return "Paste text to scan for overclaim.";
  const bad=["revolutionary","unprecedented","guaranteed","AGI","perfect","crushing","dominate","obviously superior"];
  const hits=bad.filter(b=>input.toLowerCase().includes(b.toLowerCase()));
  return `Ego check\nFlex markers hit: ${hits.join(", ")||"none"}\nLength: ${input.trim().length}\n\nRewrite test: can you say the same with 30% fewer adjectives and one measurable claim?\nNext: replace one absolute with a number + date.`;
    },
  };
export default skill;
