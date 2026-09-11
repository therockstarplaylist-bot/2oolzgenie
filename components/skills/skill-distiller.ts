import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "skill-distiller", n: 29, name: "Skill Distiller", shelf: "evolution", wishCost: 1,
    blurb: "Turn a successful session into a reusable skill recipe.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste what worked.",
    run: (input: string) => {if(!input.trim()) return "Paste what worked.";
  return `Skill distill\nSource session notes length: ${input.trim().length}\n\nSKILL.md draft:\n---\nname: (short)\ndescription: Use when ...\n---\n1. Trigger\n2. Steps\n3. Done when\n\nNext: save only if you would reuse within 2 weeks.`;
    },
  };
export default skill;
