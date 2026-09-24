"use client";
import { useRef, useState } from "react";
import { downloadBlob, copyText } from "./wish/helpers";
import { ensureInviteCode, inviteUrl } from "./inviteLoop";

type Props = {
  toolName: string;
  headline: string;
  detail?: string;
  /** Optional preview image (data URL or blob URL) drawn into the card. */
  previewUrl?: string | null;
};

/** Canvas share card — download PNG or copy invite link. */
export function ShareCard({ toolName, headline, detail, previewUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function paint(): Promise<HTMLCanvasElement | null> {
    const c = canvasRef.current || document.createElement("canvas");
    c.width = 1200;
    c.height = 630;
    const g = c.getContext("2d");
    if (!g) return null;
    // background
    g.fillStyle = "#0a0b0d";
    g.fillRect(0, 0, 1200, 630);
    const grad = g.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, "#1a1628");
    grad.addColorStop(1, "#12141a");
    g.fillStyle = grad;
    g.fillRect(24, 24, 1152, 582);
    g.strokeStyle = "#c9a227";
    g.lineWidth = 3;
    g.strokeRect(24, 24, 1152, 582);

    g.fillStyle = "#c9a227";
    g.font = "600 28px ui-monospace, Menlo, monospace";
    g.fillText("2OOLZ GENIE", 56, 80);
    g.fillStyle = "#9a958c";
    g.font = "18px ui-monospace, Menlo, monospace";
    g.fillText(toolName.toUpperCase(), 56, 112);

    g.fillStyle = "#ece8e1";
    g.font = "400 48px Georgia, serif";
    wrapText(g, headline.slice(0, 120), 56, 180, 700, 56);

    if (detail) {
      g.fillStyle = "#9a958c";
      g.font = "22px system-ui, sans-serif";
      wrapText(g, detail.slice(0, 180), 56, 320, 700, 30);
    }

    if (previewUrl) {
      try {
        const img = await loadImg(previewUrl);
        const box = { x: 800, y: 120, w: 340, h: 340 };
        g.save();
        g.beginPath();
        roundRect(g, box.x, box.y, box.w, box.h, 16);
        g.clip();
        const scale = Math.max(box.w / img.width, box.h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        g.drawImage(img, box.x + (box.w - dw) / 2, box.y + (box.h - dh) / 2, dw, dh);
        g.restore();
        g.strokeStyle = "#2a2d33";
        g.lineWidth = 2;
        roundRect(g, box.x, box.y, box.w, box.h, 16);
        g.stroke();
      } catch {}
    }

    const code = ensureInviteCode();
    const link = inviteUrl(code);
    g.fillStyle = "#6ea0d4";
    g.font = "20px ui-monospace, Menlo, monospace";
    g.fillText(link.replace(/^https?:\/\//, "").slice(0, 54), 56, 560);
    g.fillStyle = "#6e6a64";
    g.font = "16px ui-monospace, Menlo, monospace";
    g.fillText("Invite perk: +40 TC + 1 free forge · once per lamp", 56, 590);

    if (canvasRef.current !== c && canvasRef.current) {
      const dest = canvasRef.current;
      dest.width = c.width;
      dest.height = c.height;
      dest.getContext("2d")?.drawImage(c, 0, 0);
      return dest;
    }
    return c;
  }

  async function download() {
    setBusy(true);
    setMsg("Painting…");
    try {
      const c = await paint();
      if (!c) throw new Error("No canvas");
      await new Promise<void>((resolve, reject) => {
        c.toBlob((blob) => {
          if (!blob) return reject(new Error("blob failed"));
          downloadBlob("2oolz-share.png", blob, "image/png");
          resolve();
        }, "image/png");
      });
      setMsg("Downloaded 2oolz-share.png");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function shareNative() {
    setBusy(true);
    try {
      const c = await paint();
      if (!c) throw new Error("No canvas");
      const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
      const code = ensureInviteCode();
      const link = inviteUrl(code);
      if (blob && typeof navigator !== "undefined" && navigator.share && navigator.canShare) {
        const file = new File([blob], "2oolz-share.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "2oolz Genie · " + toolName,
            text: headline + "\n" + link,
            files: [file],
          });
          setMsg("Shared.");
          return;
        }
      }
      copyText(link);
      setMsg("Invite link copied · " + link);
    } catch (e) {
      if ((e as Error)?.name === "AbortError") setMsg("Share cancelled.");
      else setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function copyInvite() {
    const link = inviteUrl(ensureInviteCode());
    copyText(link);
    setMsg("Invite link copied · " + link);
  }

  return (
    <div className="share-card-box">
      <p className="seal">Share card</p>
      <p className="card-blurb">
        Paint a brag card with your result + invite link. Friends who redeem get +40 TC and one free forge — once.
      </p>
      <canvas ref={canvasRef} className="share-canvas-hidden" width={1200} height={630} aria-hidden />
      <div className="tool-actions">
        <button className="btn" type="button" disabled={busy} onClick={() => void download()}>
          Download share PNG
        </button>
        <button className="btn ghost" type="button" disabled={busy} onClick={() => void shareNative()}>
          Share…
        </button>
        <button className="btn ghost" type="button" onClick={copyInvite}>
          Copy invite link
        </button>
      </div>
      {msg && <p className="msg">{msg}</p>}
    </div>
  );
}

function wrapText(
  g: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number
) {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, yy);
      line = w;
      yy += lineH;
    } else line = test;
  }
  if (line) g.fillText(line, x, yy);
}

function roundRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
