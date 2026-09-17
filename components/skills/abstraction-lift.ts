import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "abstraction-lift", n: 24, name: "Abstraction Lift", shelf: "reasoning", wishCost: 1,
    blurb: "Raise one level of abstraction then re-ground.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a concrete mess.",
    run: (input: string) => {if(!input.trim()) return "Paste a concrete mess.";
  return `Abstraction lift\nConcrete: ${input.trim().slice(0,160)}\n\nOne level up (pattern): ...\nRe-ground (instance to try): ...\nAnti-pattern to avoid: ...\n\nNext: act only on the re-grounded instance.`;
    },
  };
export default skill;
