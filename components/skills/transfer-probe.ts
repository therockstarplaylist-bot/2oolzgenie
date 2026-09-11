import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "transfer-probe", n: 38, name: "Transfer Probe", shelf: "evolution", wishCost: 1,
    blurb: "Test if a skill transfers to a new domain.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste skill + new domain.",
    run: (input: string) => {if(!input.trim()) return "Paste skill + new domain.";
  return `Transfer probe\nInput: ${input.trim().slice(0,160)}\n\nWhat transfers: ...\nWhat breaks: ...\nMinimal adapt: ...\nProbe task (30 min): ...\n\nNext: run the probe task before claiming transfer.`;
    },
  };
export default skill;
