import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "synthesis-loom", n: 26, name: "Synthesis Loom", shelf: "reasoning", wishCost: 1,
    blurb: "Merge N notes into one coherent brief.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste multiple notes separated by ---",
    run: (input: string) => {const parts=input.split(/\n---\n/).map(p=>p.trim()).filter(Boolean);
  if(parts.length<2) return "Separate notes with a line containing only ---";
  return `Synthesis (${parts.length} sources)\n\nUnified brief:\n- Shared facts\n- Tensions\n- Decision\n\nSource hashes: `+parts.map((p,i)=>`S${i+1}:${p.length}c`).join(" ")+`\n\nNext: write the decision in one sentence and cite sources.`;
    },
  };
export default skill;
