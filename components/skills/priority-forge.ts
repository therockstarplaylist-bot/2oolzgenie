import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "priority-forge", n: 13, name: "Priority Forge", shelf: "memory", wishCost: 1,
    blurb: "Rank goals into P0/P1/P2 with kill criteria.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste goals, one per line.",
    run: (input: string) => {const goals=input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  if(!goals.length) return "One goal per line.";
  const p0=goals.slice(0,Math.max(1,Math.ceil(goals.length*0.25)));
  const p1=goals.slice(p0.length,p0.length+Math.ceil(goals.length*0.4));
  const p2=goals.slice(p0.length+p1.length);
  return `Priority forge\nP0:\n`+p0.map(g=>`- ${g} | kill if: ________`).join("\n")+`\nP1:\n`+p1.map(g=>`- ${g}`).join("\n")+`\nP2:\n`+p2.map(g=>`- ${g}`).join("\n")+`\n\nNext: fill kill criteria for every P0.`;
    },
  };
export default skill;
