"use client";
import { useRef, useState, type ReactElement } from "react";
import { ShareCard } from "../ShareCard";
import { downloadBlob } from "./helpers";

export function StegoVerifyTool(): ReactElement {
  const [secret, setSecret] = useState("hello from the lamp");
  const [msg, setMsg] = useState("");
  const [verified, setVerified] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);

  function onFile(f: File) {
    fileRef.current = f;
    setMsg(f.name);
    setVerified(null);
  }

  async function roundtrip() {
    const f = fileRef.current;
    if (!f) {
      setMsg("Pick a PNG first.");
      return;
    }
    try {
      const bmp = await createImageBitmap(f);
      const c = document.createElement("canvas");
      c.width = bmp.width;
      c.height = bmp.height;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(bmp, 0, 0);
      const id = ctx.getImageData(0, 0, c.width, c.height);
      const bytes = new TextEncoder().encode(secret);
      const need = (bytes.length + 4) * 8;
      if (need > id.data.length / 4) {
        setMsg("Message too long for this image.");
        return;
      }
      const payload = new Uint8Array(4 + bytes.length);
      payload[0] = (bytes.length >>> 24) & 255;
      payload[1] = (bytes.length >>> 16) & 255;
      payload[2] = (bytes.length >>> 8) & 255;
      payload[3] = bytes.length & 255;
      payload.set(bytes, 4);
      let bit = 0;
      for (let i = 0; i < payload.length; i++) {
        for (let b = 7; b >= 0; b--) {
          const px = bit * 4;
          id.data[px] = (id.data[px] & 0xfe) | ((payload[i] >> b) & 1);
          bit++;
        }
      }
      ctx.putImageData(id, 0, 0);
      const id2 = ctx.getImageData(0, 0, c.width, c.height);
      const readByte = (startBit: number) => {
        let v = 0;
        for (let b = 0; b < 8; b++) {
          v = (v << 1) | (id2.data[(startBit + b) * 4] & 1);
        }
        return v;
      };
      const len =
        (readByte(0) << 24) | (readByte(8) << 16) | (readByte(16) << 8) | readByte(24);
      const out = new Uint8Array(len);
      for (let i = 0; i < len; i++) out[i] = readByte(32 + i * 8);
      const revealed = new TextDecoder().decode(out);
      const ok = revealed === secret;
      setVerified(ok ? "MATCH · roundtrip ok" : "MISMATCH · " + revealed);
      setMsg(ok ? "Hide + extract verified." : "Roundtrip failed.");
      const url = c.toDataURL("image/png");
      setPreview(url);
      c.toBlob((blob) => {
        if (blob) downloadBlob("stego-roundtrip.png", blob, "image/png");
      }, "image/png");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">
        Companion to Stego Drop: hide UTF-8, extract immediately, verify byte-match. Demo LSB — not covert.
      </p>
      <label className="try-label">
        Cover PNG
        <input
          type="file"
          accept="image/png,image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
      </label>
      <label className="try-label">
        Secret
        <textarea rows={2} value={secret} onChange={(e) => setSecret(e.target.value)} />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={() => void roundtrip()}>
          Hide → Reveal → Verify
        </button>
      </div>
      {msg && <p className="msg">{msg}</p>}
      {verified && <pre className="try-out">{verified}</pre>}
      {verified?.startsWith("MATCH") && (
        <ShareCard
          toolName="Stego Roundtrip"
          headline="LSB roundtrip matched."
          detail="Hid a note in a PNG and extracted the same bytes — demo-grade stego on 2oolz Genie."
          previewUrl={preview}
        />
      )}
    </div>
  );
}
