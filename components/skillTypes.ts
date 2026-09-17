export type SkillShelf = "meta" | "memory" | "reasoning" | "evolution" | "world" | "product";
export type SkillDef = { id: string; n: number; name: string; shelf: SkillShelf; wishCost: number; blurb: string; how: string[]; placeholder: string; run: (input: string) => string };
