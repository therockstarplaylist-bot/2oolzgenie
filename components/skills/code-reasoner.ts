import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "code-reasoner", n: 44, name: "Code Reasoner", shelf: "world", wishCost: 1,
    blurb: "Trace inputs\u2192outputs\u2192edge cases for a snippet.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste code or pseudo.",
    run: (input: string) => {if(!input.trim()) return "Paste code.";
  return `Code reasoner\nLOC~: ${input.trim().split(/\n/).length}\n\nInputs → transforms → outputs\nEdge cases:\n1. empty\n2. max/overflow\n3. invalid type\nFailure mode:\n\nNext: write one failing test before changing code.`;
    },
  };
export default skill;
