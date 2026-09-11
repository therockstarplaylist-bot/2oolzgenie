import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "cross-chat-sync-wish", n: 15, name: "Cross-Chat Sync Wish", shelf: "memory", wishCost: 1,
    blurb: "Checklist + export block for memory bridge ingest.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste what must sync across chats.",
    run: (input: string) => {return `Cross-chat sync export\n\n\`\`\`\n# sync-wish ${new Date().toISOString().slice(0,10)}\n${input.trim()||"(paste facts to sync)"}\n\`\`\`\n\nChecklist:\n1. Drop into memory bridge inbox\n2. Merge master.md\n3. Rebuild boot_prompt\n4. Verify on second device\n\nNext: run memory_bridge --once after export.`;
    },
  };
export default skill;
