import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "rollback-seal", n: 16, name: "Rollback Seal", shelf: "memory", wishCost: 1,
    blurb: "Snapshot label + restore checklist for memory state.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste current state summary to seal.",
    run: (input: string) => {const label=`seal-${Date.now().toString(36)}`;
  return `Rollback seal\nLabel: ${label}\nSnapshot notes:\n${input.trim().slice(0,500)||"(empty)"}\n\nRestore checklist:\n1. Archive current master.md\n2. Restore sealed copy\n3. Diff soul / priorities\n4. Smoke-test one task\n\nNext: copy this label into your archive filename.`;
    },
  };
export default skill;
