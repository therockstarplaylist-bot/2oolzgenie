import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "decision-postmortem", n: 7, name: "Decision Postmortem", shelf: "meta", wishCost: 1,
    blurb: "What you knew, chose, missed, and what rule to keep.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a past decision and outcome.",
    run: (input: string) => {if(!input.trim()) return "Paste decision + outcome.";
  return `Decision postmortem\n\n1. Decision: ${input.trim().slice(0,120)}\n2. What you knew then vs know now\n3. Process error vs bad luck\n4. Rule to keep (one sentence)\n5. Rule to kill\n\nNext: write the keep-rule into memory / soul.`;
    },
  };
export default skill;
