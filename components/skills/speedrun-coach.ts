import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "speedrun-coach", n: 37, name: "Speedrun Coach", shelf: "evolution", wishCost: 1,
    blurb: "Strip a workflow to critical path only.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste current workflow.",
    run: (input: string) => {if(!input.trim()) return "Paste workflow.";
  const steps=input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  return `Speedrun coach\nCritical path (keep):\n`+steps.slice(0,5).map((s,i)=>`${i+1}. ${s}`).join("\n")+`\nCut candidates: polish, optional reviews, duplicate checks\n\nNext: run critical path once with a timer.`;
    },
  };
export default skill;
