import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "contradiction-finder", n: 12, name: "Contradiction Finder", shelf: "memory", wishCost: 1,
    blurb: "Find conflicting claims in a memory blob.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste notes or master.md text.",
    run: (input: string) => {if(!input.trim()) return "Paste notes.";
  const lines=input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  const pairs=[]; for(let i=0;i<lines.length;i++) for(let j=i+1;j<lines.length;j++){
    const a=lines[i].toLowerCase(), b=lines[j].toLowerCase();
    if((a.includes("not ")&&b.includes(a.replace(/not /g,"").slice(0,20))) || (a.includes("always")&&b.includes("never"))) pairs.push(`${i+1} vs ${j+1}`);
  }
  return `Contradiction finder\nLines: ${lines.length}\nSuspect pairs: ${pairs.slice(0,10).join("; ")||"none auto-flagged — scan negations manually"}\n\nNext: resolve or date-stamp which claim wins.`;
    },
  };
export default skill;
