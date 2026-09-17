import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "assumption-scanner", n: 3, name: "Assumption Scanner", shelf: "meta", wishCost: 1,
    blurb: "List hidden premises and which ones break the conclusion.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a conclusion or argument.",
    run: (input: string) => {if(!input.trim()) return "Paste a conclusion or argument.";
  const sents=input.split(/[.?!\n]+/).map(s=>s.trim()).filter(s=>s.length>8);
  const flags=["must","always","never","everyone","obviously","clearly","will","should"];
  const hits=sents.filter(s=>flags.some(f=>s.toLowerCase().includes(f)));
  return `Assumption scan\nSentences: ${sents.length}\nHigh-load lines: ${hits.length||0}\n\nHidden premises to test:\n`+(hits.slice(0,8).map((h,i)=>`${i+1}. ${h}`).join("\n")||"1. (none flagged — still list what must be true for the conclusion)")+`\n\nNext: pick one premise and invent a counterexample.`;
    },
  };
export default skill;
