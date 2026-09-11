import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "bayesian-stub", n: 27, name: "Bayesian Stub", shelf: "reasoning", wishCost: 1,
    blurb: "Prior \u2192 likelihood sketch \u2192 posterior intuition.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste: prior claim; evidence lines.",
    run: (input: string) => {if(!input.trim()) return "Paste prior claim; then evidence lines.";
  const lines=input.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  return `Bayesian stub (qualitative)\nPrior: ${lines[0]||"?"}\nEvidence (${Math.max(0,lines.length-1)}):\n`+lines.slice(1).map((e,i)=>`${i+1}. ${e} → pushes posterior up/down?`).join("\n")+`\n\nPosterior intuition: still believe / weaken / abandon\n\nNext: name the single strongest evidence and seek its opposite.`;
    },
  };
export default skill;
