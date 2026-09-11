import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "spaced-forge", n: 31, name: "Spaced Forge", shelf: "evolution", wishCost: 1,
    blurb: "Schedule revisit intervals for skills/facts.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste items to remember, one per line.",
    run: (input: string) => {const items=input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  if(!items.length) return "One item per line.";
  const iv=[1,3,7,21,60];
  return `Spaced forge\n`+items.map((it,i)=>`${i+1}. ${it}\n   reviews (days): ${iv.join(", ")}`).join("\n")+`\n\nNext: calendar the day-1 review.`;
    },
  };
export default skill;
