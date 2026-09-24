import { INVITE_TC } from "./inviteLoop";
export { INVITE_TC };

export function copyTextSafe(text: string) {
  try {
    void navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
