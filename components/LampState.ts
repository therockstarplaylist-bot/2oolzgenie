/** Economy-extended lamp state — wraps constants with Friday/invite fields. */
import {
  defaultState as baseDefault,
  normalize as baseNormalize,
  load as baseLoad,
  save as baseSave,
  type State as BaseState,
} from "./constants";

export type State = BaseState & {
  fridayClaimWeek?: string;
  inviteCode?: string;
  referredBy?: string;
  inviteClaimed?: boolean;
  freeForge?: number;
};

export function defaultState(): State {
  return { ...baseDefault(), freeForge: 0 };
}

export function normalize(raw: Partial<State> | null): State {
  const S = baseNormalize(raw as Partial<BaseState> | null) as State;
  if (S.freeForge == null || S.freeForge < 0) S.freeForge = 0;
  if (S.inviteClaimed == null) S.inviteClaimed = false;
  return S;
}

export function load(): State | null {
  return baseLoad() as State | null;
}

export function save(s: State) {
  baseSave(s);
}
