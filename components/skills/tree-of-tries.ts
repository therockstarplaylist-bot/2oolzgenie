import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "tree-of-tries", n: 17, name: "Tree of Tries", shelf: "reasoning", wishCost: 1,
    blurb: "Branch 3 approaches with kill switches.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a hard problem.",
    run: (input: string) => {if(!input.trim()) return "Paste a hard problem.";
  return `Tree of tries\nProblem: ${input.trim().slice(0,160)}\n\nBranch A — fastest path\n  Kill if: no progress in 25 min\nBranch B — most robust\n  Kill if: needs unavailable data\nBranch C — creative / weird\n  Kill if: cannot explain in 2 sentences\n\nNext: start A; pre-write kill switches before coding.`;
    },
  };
export default skill;
