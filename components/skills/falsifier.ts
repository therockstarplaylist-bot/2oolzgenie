import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "falsifier", n: 4, name: "Falsifier", shelf: "meta", wishCost: 1,
    blurb: "Generate the strongest disconfirming evidence or counterexample.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a belief or hypothesis.",
    run: (input: string) => {if(!input.trim()) return "Paste a belief or hypothesis.";
  return `Falsifier\nHypothesis: ${input.trim().slice(0,200)}\n\nStrongest disconfirmers:\n1. Observation that would force you to abandon it\n2. Dataset or case that should fail if true\n3. Competing hypothesis that explains the same evidence cheaper\n\nNext: write the kill criterion in one sentence and schedule the check.`;
    },
};
export default skill;
