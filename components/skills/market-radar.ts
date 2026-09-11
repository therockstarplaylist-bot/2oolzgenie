import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "market-radar", n: 43, name: "Market Radar", shelf: "world", wishCost: 1,
    blurb: "Competitor / pricing / wedge scan template.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste product niche.",
    run: (input: string) => {if(!input.trim()) return "Paste product niche.";
  return `Market radar\nNiche: ${input.trim().slice(0,120)}\n\nCompetitors (3):\nPricing anchors:\nWedge (why you win a slice):\nRisk: copycats / distribution\n\nNext: talk to one real user this week.`;
    },
  };
export default skill;
