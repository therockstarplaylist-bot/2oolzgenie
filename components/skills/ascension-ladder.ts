import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "ascension-ladder", n: 50, name: "Ascension Ladder", shelf: "product", wishCost: 1,
    blurb: "Map Free\u2192Wish\u2192Shelf\u2192Mastery progression.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste current product state.",
    run: (input: string) => {return `Ascension ladder\nState notes: ${input.trim().slice(0,200)||"(none)"}\n\nFree Tools (demos) → Skill wishes → Unlock tools → Shelf mastery → Pack upsell\nMetrics: unlocks / wish, repeat unlock rate, time-to-first-unlock\n\nNext: instrument first-unlock event in analytics.`;
    },
  };
export default skill;
