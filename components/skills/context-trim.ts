import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "context-trim", n: 14, name: "Context Trim", shelf: "memory", wishCost: 1,
    blurb: "Keep only task-relevant lines from a dump.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "First line TASK=... then dump.",
    run: (input: string) => {const m=input.match(/^TASK=(.+)\n/i); const task=m?m[1].trim():"general"; const body=m?input.slice(m[0].length):input;
  const words=new Set(task.toLowerCase().split(/\W+/).filter(w=>w.length>3));
  const keep=body.split(/\n+/).filter(l=>[...words].some(w=>l.toLowerCase().includes(w))||/TODO|P0|must/i.test(l));
  return `Context trim\nTask: ${task}\nKept ${keep.length} lines\n\n`+keep.slice(0,40).join("\n")+`\n\nNext: drop anything not cited in the next action.`;
    },
  };
export default skill;
