import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "teacher-mode", n: 35, name: "Teacher Mode", shelf: "evolution", wishCost: 1,
    blurb: "Explain X at three levels + one quiz.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste the topic.",
    run: (input: string) => {if(!input.trim()) return "Paste the topic.";
  const t=input.trim().slice(0,80);
  return `Teacher mode: ${t}\nELI5: ...\nPractitioner: ...\nExpert edge: ...\nQuiz (1 Q): ...\n\nNext: answer the quiz cold, then check.`;
    },
  };
export default skill;
