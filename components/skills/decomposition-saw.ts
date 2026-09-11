import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "decomposition-saw", n: 25, name: "Decomposition Saw", shelf: "reasoning", wishCost: 1,
    blurb: "Split into modules with interfaces and owners.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a big task.",
    run: (input: string) => {if(!input.trim()) return "Paste a big task.";
  return `Decomposition\nTask: ${input.trim().slice(0,160)}\n\nModules:\n1. name — interface — owner\n2. ...\n3. ...\nIntegration order + first vertical slice\n\nNext: ship the vertical slice before polishing modules.`;
    },
  };
export default skill;
