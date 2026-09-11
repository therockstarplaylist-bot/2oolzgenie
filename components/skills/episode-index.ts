import type { SkillDef } from "../skillTypes";

const skill: SkillDef = {
    id: "episode-index", n: 11, name: "Episode Index", shelf: "memory", wishCost: 1,
    blurb: "Turn logs into dated episode bullets with tags.",
    how: ["Paste input in the box (see placeholder).", "Run to get a structured template filled from your text.", "Copy the Next action and do only that."],
    placeholder: "Paste chat/log text.",
    run: (input: string) => {if(!input.trim()) return "Paste logs.";
  const lines=input.split(/\n+/).map(l=>l.trim()).filter(l=>l.length>12);
  return `Episode index\n`+lines.slice(0,30).map((l,i)=>`- E${String(i+1).padStart(2,"0")}: ${l.slice(0,100)}`).join("\n")+`\n\nNext: tag P0 episodes into master.md.`;
    },
  };
export default skill;
