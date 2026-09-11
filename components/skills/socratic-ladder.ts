import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "socratic-ladder", n: 23, name: "Socratic Ladder", shelf: "reasoning", wishCost: 1,
    blurb: "Ask deepening why/how questions in order.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste a fuzzy goal.",
    run: (input: string) => {if(!input.trim()) return "Paste a fuzzy goal.";
  const g=input.trim().slice(0,120);
  return `Socratic ladder\nGoal: ${g}\n1. What does done look like in one sentence?\n2. What would make this a bad idea?\n3. What is the smallest version?\n4. What dependency do you not control?\n5. What will you measure in 48h?\n\nNext: answer #1 and #3 in writing.`;
    },
  };
export default skill;
