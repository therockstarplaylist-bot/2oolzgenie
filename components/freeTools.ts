/** Free Tools — client-side utilities with real run() behavior (no TC). */
export type { FreeToolField, FreeTool, FreeToolCat } from "./freeToolsA";
export { FREE_TOOL_CATS, freeCatLabel } from "./freeToolsA";
import { FREE_TOOLS_A } from "./freeToolsA";
import { FREE_TOOLS_B } from "./freeToolsB";
import type { FreeTool } from "./freeToolsA";

export const FREE_TOOLS: FreeTool[] = [...FREE_TOOLS_A, ...FREE_TOOLS_B];

export function runFreeTool(
  tool: FreeTool,
  inputs: Record<string, string>
): string | Promise<string> {
  try {
    return tool.run(inputs);
  } catch (e) {
    return "Tool error: " + (e instanceof Error ? e.message : String(e));
  }
}
