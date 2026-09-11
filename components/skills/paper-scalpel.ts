import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "paper-scalpel", n: 40, name: "Paper Scalpel", shelf: "world", wishCost: 1,
    blurb: "Extract claims, methods, limits from a paper blurb.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste abstract or notes.",
    run: (input: string) => {if(!input.trim()) return "Paste abstract/notes.";
  return `Paper scalpel\n\nClaims:\nMethods:\nLimits / non-claims:\nReusable idea:\n\nSource text length: ${input.trim().length}\n\nNext: write one limit you almost ignored.`;
    },
  };
export default skill;
