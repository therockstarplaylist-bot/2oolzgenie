import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "constraint-solver-lite", n: 20, name: "Constraint Solver Lite", shelf: "reasoning", wishCost: 1,
    blurb: "Extract hard/soft constraints and conflicts.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste requirements.",
    run: (input: string) => {if(!input.trim()) return "Paste requirements.";
  const lines=input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  const hard=lines.filter(l=>/must|require|need|shall/i.test(l));
  const soft=lines.filter(l=>!hard.includes(l));
  return `Constraints\nHard (${hard.length}):\n`+hard.map(l=>`- ${l}`).join("\n")+`\nSoft (${soft.length}):\n`+soft.map(l=>`- ${l}`).join("\n")+`\nConflicts: look for pairs that cannot both be true.\n\nNext: mark one soft constraint you will sacrifice first.`;
    },
  };
export default skill;
