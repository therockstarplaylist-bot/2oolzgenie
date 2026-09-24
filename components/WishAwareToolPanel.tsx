"use client";
import { type ReactElement } from "react";
import { resolveFreeToolId } from "./constants";
import { RealToolPanel } from "./RealToolPanel";
import { WISH_RUNNERS } from "./wish/WishRunners";

/** Prefer paid wish runners; fall back to free RealToolPanel. */
export function WishAwareToolPanel({ toolId }: { toolId: string }): ReactElement {
  const id = resolveFreeToolId(toolId);
  const Wish = WISH_RUNNERS[id];
  if (Wish) return <Wish />;
  return <RealToolPanel toolId={toolId} />;
}
