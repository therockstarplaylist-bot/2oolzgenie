import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "soul-diff", n: 9, name: "Soul Diff", shelf: "memory", wishCost: 1,
    blurb: "Diff two identity/priority dumps into keep/change/conflict.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste OLD then --- then NEW.",
    run: (input: string) => {const parts=input.split(/\n---\n/);
  if(parts.length<2) return "Paste OLD then a line with only --- then NEW.";
  const a=new Set(parts[0].split(/\n+/).map(s=>s.trim()).filter(Boolean));
  const b=new Set(parts[1].split(/\n+/).map(s=>s.trim()).filter(Boolean));
  const keep=[...a].filter(x=>b.has(x));
  const dropped=[...a].filter(x=>!b.has(x));
  const added=[...b].filter(x=>!a.has(x));
  return `Soul diff\nKeep (${keep.length}):\n`+keep.slice(0,20).map(x=>`- ${x}`).join("\n")+`\n\nDropped (${dropped.length}):\n`+dropped.slice(0,20).map(x=>`- ${x}`).join("\n")+`\n\nAdded (${added.length}):\n`+added.slice(0,20).map(x=>`- ${x}`).join("\n")+`\n\nNext: resolve conflicts before boot-packing.`;
    },
  };
export default skill;
