import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "eval-harness", n: 32, name: "Eval Harness", shelf: "evolution", wishCost: 1,
    blurb: "Build a mini eval set template (items + scoring).",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste domain + sample Qs.",
    run: (input: string) => {if(!input.trim()) return "Paste domain + sample questions.";
  return `Eval harness template\nDomain: ${input.trim().slice(0,80)}\n\n| id | question | answer_key | distractors | scoring |\n|----|----------|------------|-------------|---------|\n| 1 | | | | exact/rubric |\n\nMetrics: accuracy, Brier, ECE, AUC\nControls: fresh instance, no key in predictor chat\n\nNext: write 10 items before any model run.`;
    },
  };
export default skill;
