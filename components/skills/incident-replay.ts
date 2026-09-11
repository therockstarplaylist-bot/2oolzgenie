import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "incident-replay", n: 46, name: "Incident Replay", shelf: "product", wishCost: 1,
    blurb: "Timeline + blast radius + fix/verify for a bug.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste incident notes.",
    run: (input: string) => {if(!input.trim()) return "Paste incident notes.";
  return `Incident replay\n${input.trim().slice(0,120)}\n\nTimeline:\nBlast radius:\nRoot cause (hypothesis):\nFix:\nVerify:\n\nNext: add a regression-gate item from this incident.`;
    },
  };
export default skill;
