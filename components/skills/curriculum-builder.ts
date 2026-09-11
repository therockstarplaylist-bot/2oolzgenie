import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "curriculum-builder", n: 36, name: "Curriculum Builder", shelf: "evolution", wishCost: 1,
    blurb: "Order topics from foundations to edge.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste learning goals.",
    run: (input: string) => {if(!input.trim()) return "Paste learning goals.";
  const g=input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  return `Curriculum\n`+(g.length?g:["(goal)"]).map((x,i)=>`${i+1}. ${x} — prereq: — exercise:`).join("\n")+`\n\nOrder: foundations → applied → edge cases → teach-back\n\nNext: schedule module 1 exercise only.`;
    },
  };
export default skill;
