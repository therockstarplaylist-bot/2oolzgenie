import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "mistake-museum", n: 30, name: "Mistake Museum", shelf: "evolution", wishCost: 1,
    blurb: "Catalog failure modes + prevention rules.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a failure story.",
    run: (input: string) => {if(!input.trim()) return "Paste a failure.";
  return `Mistake museum entry\nIncident: ${input.trim().slice(0,160)}\nFailure mode name: ...\nPrevention rule: ...\nDetection signal: ...\n\nNext: add the prevention rule to regression-gate.`;
    },
  };
export default skill;
