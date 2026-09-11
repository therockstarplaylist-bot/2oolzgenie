import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "wish-accountant", n: 47, name: "Wish Accountant", shelf: "product", wishCost: 1,
    blurb: "Model pack ROI: wishes vs unlocks vs shelf.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste: pack size and tool list or leave blank for defaults.",
    run: (input: string) => {const packs=[{n:"Spark",w:3,p:5},{n:"Coil",w:10,p:12},{n:"Seal",w:25,p:29},{n:"Lattice",w:60,p:69},{n:"Apex",w:120,p:129}];
  const table=packs.map(x=>`${x.n}: ${x.w} wishes @ $${x.p} → $${(x.p/x.w).toFixed(2)}/wish`).join("\n");
  return `Wish accountant\n1 wish = 1 tool unlock\n50 tools → need 50 wishes (Seal+Coil+Spark = 38; +Coil = 48; +Spark = 51)\n\n${table}\n\nNotes: ${input.trim().slice(0,200)||"defaults"}\n\nNext: buy the pack that lands you on a shelf milestone, not max vanity.`;
    },
  };
export default skill;
