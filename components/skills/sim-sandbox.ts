import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "sim-sandbox", n: 42, name: "Sim Sandbox", shelf: "world", wishCost: 1,
    blurb: "Define a toy simulation + metrics before coding.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste system to simulate.",
    run: (input: string) => {if(!input.trim()) return "Paste system to simulate.";
  return `Sim sandbox design\nSystem: ${input.trim().slice(0,160)}\nState vars:\nActions:\nMetrics:\nStopping rule:\n\nNext: implement the toy version before realism.`;
    },
  };
export default skill;
