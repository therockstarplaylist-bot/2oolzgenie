/** Skill Genie catalog — 50 wish-unlock tools */
export type { SkillDef, SkillShelf } from "./skillTypes";
export { SKILL_PACKS } from "./skillPacks";
import type { SkillDef, SkillShelf } from "./skillTypes";
import { SKILLS_A } from "./skillCatalogA";
import { SKILLS_B } from "./skillCatalogB";

export const SKILL_CATALOG: SkillDef[] = [...SKILLS_A, ...SKILLS_B];

export function runSkill(id: string, input: string): string {
  const s = SKILL_CATALOG.find((x) => x.id === id);
  if (!s) return "Unknown skill.";
  try {
    return s.run(input);
  } catch (e) {
    return "Skill error: " + (e instanceof Error ? e.message : String(e));
  }
}

export function shelfLabel(s: SkillShelf): string {
  const m: Record<SkillShelf, string> = {
    meta: "Metacognition",
    memory: "Memory",
    reasoning: "Reasoning",
    evolution: "Evolution",
    world: "World",
    product: "Genie Ops",
  };
  return m[s];
}
