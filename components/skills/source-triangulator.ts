import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "source-triangulator", n: 39, name: "Source Triangulator", shelf: "world", wishCost: 1,
    blurb: "Demand 3 independent corroborations template.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a claim to verify.",
    run: (input: string) => {if(!input.trim()) return "Paste a claim.";
  return `Source triangulation\nClaim: ${input.trim().slice(0,160)}\n\nSource A (primary):\nSource B (independent):\nSource C (adversarial / disagreeing):\nAgreement: full / partial / conflict\n\nNext: do not act on A alone.`;
    },
  };
export default skill;
