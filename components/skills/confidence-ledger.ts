import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "confidence-ledger", n: 1, name: "Confidence Ledger", shelf: "meta", wishCost: 1,
    blurb: "Log claim \u2192 confidence \u2192 outcome; track Brier-ish score.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste claims as: claim | conf 0-1 | outcome yes/no/unknown",
    run: (input: string) => {const lines = input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  if(!lines.length) return "Usage: one line per claim — claim | conf 0-1 | outcome yes/no/unknown";
  let n=0,brier=0,known=0; const rows=[];
  for(const line of lines){
    const p=line.split("|").map(s=>s.trim());
    const claim=p[0]||""; const conf=Math.min(1,Math.max(0,parseFloat(p[1]||"0.5")));
    const out=(p[2]||"unknown").toLowerCase();
    let o:number|null=null; if(out==="yes"||out==="true"||out==="1")o=1; else if(out==="no"||out==="false"||out==="0")o=0;
    n++; if(o!==null){known++; brier+= (conf-o)*(conf-o); rows.push(`${n}. ${claim} — conf ${conf.toFixed(2)} outcome ${o} err²=${((conf-o)*(conf-o)).toFixed(3)}`);}
    else rows.push(`${n}. ${claim} — conf ${conf.toFixed(2)} (no outcome yet)`);
  }
  const mean=known? (brier/known).toFixed(3):"n/a";
  return `Confidence ledger (${n} claims, ${known} scored)\nBrier (mean squared error): ${mean} (0=perfect)\n\n`+rows.join("\n")+`\n\nNext: log outcomes for unknowns, then re-run.`;
    },
  };
export default skill;
