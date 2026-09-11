/** Skill Genie catalog — 50 wish-unlock tools */
export type { SkillDef, SkillShelf } from "./skillTypes";
export { SKILL_PACKS } from "./skillPacks";
import type { SkillDef, SkillShelf } from "./skillTypes";
import s0 from "./skills/confidence-ledger";
import s1 from "./skills/blind-critic";
import s2 from "./skills/assumption-scanner";
import s3 from "./skills/falsifier";
import s4 from "./skills/uncertainty-map";
import s5 from "./skills/calibration-drill";
import s6 from "./skills/decision-postmortem";
import s7 from "./skills/ego-check";
import s8 from "./skills/soul-diff";
import s9 from "./skills/boot-packer";
import s10 from "./skills/episode-index";
import s11 from "./skills/contradiction-finder";
import s12 from "./skills/priority-forge";
import s13 from "./skills/context-trim";
import s14 from "./skills/cross-chat-sync-wish";
import s15 from "./skills/rollback-seal";
import s16 from "./skills/tree-of-tries";
import s17 from "./skills/proof-sketch";
import s18 from "./skills/analogical-bridge";
import s19 from "./skills/constraint-solver-lite";
import s20 from "./skills/causal-graph";
import s21 from "./skills/adversarial-twin";
import s22 from "./skills/socratic-ladder";
import s23 from "./skills/abstraction-lift";
import s24 from "./skills/decomposition-saw";
import s25 from "./skills/synthesis-loom";
import s26 from "./skills/bayesian-stub";
import s27 from "./skills/timebox-oracle";
import s28 from "./skills/skill-distiller";
import s29 from "./skills/mistake-museum";
import s30 from "./skills/spaced-forge";
import s31 from "./skills/eval-harness";
import s32 from "./skills/mutation-lab";
import s33 from "./skills/regression-gate";
import s34 from "./skills/teacher-mode";
import s35 from "./skills/curriculum-builder";
import s36 from "./skills/speedrun-coach";
import s37 from "./skills/transfer-probe";
import s38 from "./skills/source-triangulator";
import s39 from "./skills/paper-scalpel";
import s40 from "./skills/dataset-sniff";
import s41 from "./skills/sim-sandbox";
import s42 from "./skills/market-radar";
import s43 from "./skills/code-reasoner";
import s44 from "./skills/spec-contracts";
import s45 from "./skills/incident-replay";
import s46 from "./skills/wish-accountant";
import s47 from "./skills/pack-architect";
import s48 from "./skills/uelg-auditor";
import s49 from "./skills/ascension-ladder";

export const SKILL_CATALOG: SkillDef[] = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49];

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
