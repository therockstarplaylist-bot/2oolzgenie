import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "calibration-drill", n: 6, name: "Calibration Drill", shelf: "meta", wishCost: 1,
    blurb: "Force numeric confidence + scoring template for quizzes.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste Q and your answer with conf like: Q? A | 0.7",
    run: (input: string) => {const lines=input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  if(!lines.length) return "Format: question? answer | 0.0-1.0";
  return `Calibration drill\nItems: ${lines.length}\n\n`+lines.map((l,i)=>{
    const m=l.match(/\|\s*([0-9]*\.?[0-9]+)\s*$/); const c=m?parseFloat(m[1]):null;
    return `${i+1}. ${l.replace(/\|\s*[0-9.]+\s*$/,"").trim()} → conf ${c??"?"}${(c!==null && (c<0.5||c>0.95))?" ⚠ extreme":""}`;
  }).join("\n")+`\n\nScore later with Confidence Ledger.\nNext: avoid 0.99 unless you would bet the farm.`;
    },
  };
export default skill;
