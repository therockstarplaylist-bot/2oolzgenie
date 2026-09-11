import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "timebox-oracle", n: 28, name: "Timebox Oracle", shelf: "reasoning", wishCost: 1,
    blurb: "Estimate effort bands and first 25-min cut.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a task.",
    run: (input: string) => {if(!input.trim()) return "Paste a task.";
  const words=input.trim().split(/\s+/).length;
  const band = words>80?"2–6h":words>30?"45–120m":"15–45m";
  return `Timebox oracle\nTask: ${input.trim().slice(0,160)}\nEffort band: ${band}\nFirst 25 min: define done + blacklist risk\nStop rule: if stuck, switch branch\n\nNext: set a 25-min timer and produce an artifact.`;
    },
  };
export default skill;
