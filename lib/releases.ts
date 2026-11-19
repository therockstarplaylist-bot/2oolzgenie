import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

export type FileFacts = {
  bytes: number;
  sha256: string;
};

/** Byte size and SHA-256, read from the file on disk. */
export const fileFacts = cache(async (filename: string): Promise<FileFacts> => {
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    throw new Error("Unexpected download filename");
  }
  const full = path.join(process.cwd(), "public", "downloads", filename);
  const info = await stat(full);
  const sha256 = await new Promise<string>((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(full);
    stream.on("data", (chunk) => {
      hash.update(chunk);
    });
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
  return { bytes: info.size, sha256 };
});

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
