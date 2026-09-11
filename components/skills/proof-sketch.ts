import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "proof-sketch", n: 18, name: "Proof Sketch", shelf: "reasoning", wishCost: 1,
    blurb: "Outline premises \u2192 lemmas \u2192 conclusion gaps.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a claim to justify.",
    run: (input: string) => {if(!input.trim()) return "Paste a claim.";
  return `Proof sketch\nClaim: ${input.trim().slice(0,160)}\n\nPremises:\n1. ...\n2. ...\nLemmas:\nL1. ...\nGaps (must close):\nG1. ...\n\nNext: close the largest gap or weaken the claim.`;
    },
  };
export default skill;
