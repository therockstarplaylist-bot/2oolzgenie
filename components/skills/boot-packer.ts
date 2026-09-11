import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "boot-packer", n: 10, name: "Boot Packer", shelf: "memory", wishCost: 1,
    blurb: "Compress a long dump into a boot prompt under a token budget.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste memory dump; optional first line: BUDGET=400",
    run: (input: string) => {let budget=400; let text=input;
  const m=input.match(/^BUDGET=(\d+)\n/i); if(m){budget=parseInt(m[1],10); text=input.slice(m[0].length);}
  const lines=text.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  const scored=lines.map(l=>({l,s:(/P0|priority|must|user|goal|never/i.test(l)?2:1)+Math.min(2,l.length/80)}))
    .sort((a,b)=>b.s-a.s);
  let out=[],chars=0; for(const {l} of scored){ if(chars+l.length+1>budget) break; out.push(l); chars+=l.length+1; }
  return `Boot pack (~${chars}/${budget} chars)\n\n`+out.join("\n")+`\n\nNext: paste into boot_prompt and verify one task still works.`;
    },
  };
export default skill;
