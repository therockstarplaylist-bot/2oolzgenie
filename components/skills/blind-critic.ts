import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "blind-critic", n: 2, name: "Blind Critic", shelf: "meta", wishCost: 1,
    blurb: "Attack your own draft without seeing your preferred answer.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a draft answer or plan to critique.",
    run: (input: string) => {if(!input.trim()) return "Paste a draft. Critic ignores your preferred answer.";
  const t=input.trim();
  const risks=["Unsupported claim?","Missing counterexample?","Ambiguous terms?","Single point of failure?","Would a skeptic buy this?"];
  return `Blind critic\nDraft length: ${t.length} chars\n\nAttacks:\n`+risks.map((r,i)=>`${i+1}. ${r} — scan: ${t.slice(0,80)}...`).join("\n")+`\n\nHardest cut: rewrite the weakest paragraph first.\nNext: delete one sentence you cannot defend.`;
    },
  };
export default skill;
