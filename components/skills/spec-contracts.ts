import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "spec-contracts", n: 45, name: "Spec Contracts", shelf: "product", wishCost: 1,
    blurb: "Turn a wish into acceptance tests.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a feature wish.",
    run: (input: string) => {if(!input.trim()) return "Paste a feature wish.";
  return `Spec contracts\nWish: ${input.trim().slice(0,160)}\n\nAcceptance tests:\nGiven ... when ... then ...\nGiven ... when ... then ...\nNon-goals:\n\nNext: implement only what the tests require.`;
    },
  };
export default skill;
