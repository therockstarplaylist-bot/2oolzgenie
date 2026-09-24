"use client";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { copyText, downloadBlob } from "./helpers";

export function SpectroTool(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [msg, setMsg] = useState("");
  const [whisper, setWhisper] = useState("");

  async function onFile(file: File) {
    setMsg("Analyzing…");
    try {
      const ctx = new AudioContext();
      const buf = await ctx.decodeAudioData(await file.arrayBuffer());
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = (canvas.width = 640);
      const h = (canvas.height = 240);
      const g = canvas.getContext("2d");
      if (!g) return;
      const data = buf.getChannelData(0);
      const cols = w;
      const rows = h;
      const slice = Math.max(1, Math.floor(data.length / cols));
      const img = g.createImageData(w, h);
      for (let x = 0; x < cols; x++) {
        const start = x * slice;
        const bins = new Float32Array(rows);
        for (let i = 0; i < slice && start + i < data.length; i++) {
          const v = Math.abs(data[start + i]);
          const y = Math.min(rows - 1, Math.floor(v * rows * 4));
          bins[y] += v;
        }
        let max = 0.0001;
        for (let y = 0; y < rows; y++) max = Math.max(max, bins[y]);
        for (let y = 0; y < rows; y++) {
          const t = bins[y] / max;
          const idx = ((rows - 1 - y) * w + x) * 4;
          img.data[idx] = Math.floor(20 + t * 220);
          img.data[idx + 1] = Math.floor(t * 180);
          img.data[idx + 2] = Math.floor(40 + (1 - t) * 80);
          img.data[idx + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
      if (whisper.trim()) {
        g.font = "14px monospace";
        g.fillStyle = "rgba(255,230,150,0.85)";
        g.fillText(whisper.trim().slice(0, 48), 12, h - 14);
      }
      setMsg(`${file.name} · ${buf.duration.toFixed(1)}s · ${buf.sampleRate} Hz`);
      void ctx.close();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  function exportPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob("spectrogram-whisper.png", blob, "image/png");
    }, "image/png");
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">Offline Web Audio + canvas. Toy visualization — not a covert channel guarantee.</p>
      <label className="try-label">
        Audio
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
      </label>
      <label className="try-label">
        Whisper text (optional burn into export)
        <input className="email-field" value={whisper} onChange={(e) => setWhisper(e.target.value)} maxLength={48} />
      </label>
      <canvas ref={canvasRef} style={{ width: "100%", background: "#111", borderRadius: 8 }} />
      <div className="tool-actions">
        <button className="btn ghost" type="button" onClick={exportPng}>Download PNG</button>
      </div>
      {msg && <p className="msg">{msg}</p>}
    </div>
  );
}

function setLSB(v: number, bit: number) {
  return (v & 0xfe) | (bit & 1);
}
function getLSB(v: number) {
  return v & 1;
}

export function StegoTool(): ReactElement {
  const [msg, setMsg] = useState("");
  const [secret, setSecret] = useState("");
  const [revealed, setRevealed] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  function loadImage(file: File) {
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setMsg(file.name);
  }

  function hide() {
    if (!fileUrl) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const id = ctx.getImageData(0, 0, c.width, c.height);
      const bytes = new TextEncoder().encode(secret);
      const need = (bytes.length + 4) * 8;
      if (need > id.data.length / 4) {
        setMsg("Message too long for this image.");
        return;
      }
      const len = bytes.length;
      const payload = new Uint8Array(4 + bytes.length);
      payload[0] = (len >>> 24) & 255;
      payload[1] = (len >>> 16) & 255;
      payload[2] = (len >>> 8) & 255;
      payload[3] = len & 255;
      payload.set(bytes, 4);
      let bit = 0;
      for (let i = 0; i < payload.length; i++) {
        for (let b = 7; b >= 0; b--) {
          const px = bit * 4;
          const bitv = (payload[i] >> b) & 1;
          id.data[px] = setLSB(id.data[px], bitv);
          bit++;
        }
      }
      ctx.putImageData(id, 0, 0);
      c.toBlob((blob) => {
        if (blob) downloadBlob("stego.png", blob, "image/png");
        setMsg("Downloaded stego.png");
      }, "image/png");
    };
    img.src = fileUrl;
  }

  function reveal() {
    if (!fileUrl) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const id = ctx.getImageData(0, 0, c.width, c.height);
      const readByte = (startBit: number) => {
        let v = 0;
        for (let b = 0; b < 8; b++) {
          const px = (startBit + b) * 4;
          v = (v << 1) | getLSB(id.data[px]);
        }
        return v;
      };
      const len =
        (readByte(0) << 24) | (readByte(8) << 16) | (readByte(16) << 8) | readByte(24);
      if (len <= 0 || len > 100000) {
        setMsg("No valid payload.");
        return;
      }
      const out = new Uint8Array(len);
      for (let i = 0; i < len; i++) out[i] = readByte(32 + i * 8);
      setRevealed(new TextDecoder().decode(out));
      setMsg("Revealed.");
    };
    img.src = fileUrl;
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">Toy/demo LSB stego — not military grade. Anyone who looks can extract. Keep messages short.</p>
      <label className="try-label">
        PNG
        <input
          type="file"
          accept="image/png,image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadImage(f);
          }}
        />
      </label>
      <label className="try-label">
        Secret (short)
        <textarea rows={2} value={secret} onChange={(e) => setSecret(e.target.value)} />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={hide}>
          Hide → PNG
        </button>
        <button className="btn ghost" type="button" onClick={reveal}>
          Reveal
        </button>
      </div>
      {msg && <p className="msg">{msg}</p>}
      {revealed && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{revealed}</pre>}
    </div>
  );
}

export function QrTool(): ReactElement {
  const [text, setText] = useState("https://www.2oolzgenie.com");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [decoded, setDecoded] = useState("");
  const [msg, setMsg] = useState("");

  async function gen() {
    try {
      const QR = await import("qrcode");
      const url = await QR.toDataURL(text, { margin: 1, width: 280 });
      setDataUrl(url);
      setMsg("Generated.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  async function decodeFile(file: File) {
    try {
      const jsQR = (await import("jsqr")).default;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const id = ctx.getImageData(0, 0, c.width, c.height);
        const code = jsQR(id.data, c.width, c.height);
        URL.revokeObjectURL(url);
        if (code) {
          setDecoded(code.data);
          setMsg("Decoded.");
        } else setMsg("No QR found.");
      };
      img.src = url;
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="real-tool">
      <label className="try-label">
        Text
        <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={() => void gen()}>
          Generate
        </button>
        <label className="btn ghost" style={{ cursor: "pointer" }}>
          Decode image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void decodeFile(f);
            }}
          />
        </label>
        {decoded && (
          <button className="btn ghost" type="button" onClick={() => copyText(decoded)}>
            Copy decode
          </button>
        )}
      </div>
      {dataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="qr" style={{ marginTop: 8 }} />
      )}
      {decoded && <pre className="try-out">{decoded}</pre>}
      {msg && <p className="msg">{msg}</p>}
    </div>
  );
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function relLum({ r, g, b }: { r: number; g: number; b: number }) {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a: string, b: string) {
  const L1 = relLum(hexToRgb(a));
  const L2 = relLum(hexToRgb(b));
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}
function hslShift(hex: string, dh: number, ds: number, dl: number) {
  const { r, g, b } = hexToRgb(hex);
  const rr = r / 255,
    gg = g / 255,
    bb = b / 255;
  const max = Math.max(rr, gg, bb),
    min = Math.min(rr, gg, bb);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rr:
        h = (gg - bb) / d + (gg < bb ? 6 : 0);
        break;
      case gg:
        h = (bb - rr) / d + 2;
        break;
      default:
        h = (rr - gg) / d + 4;
    }
    h /= 6;
  }
  h = (h + dh / 360 + 1) % 1;
  s = Math.min(1, Math.max(0, s + ds));
  l = Math.min(1, Math.max(0, l + dl));
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const R = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const G = Math.round(hue2rgb(p, q, h) * 255);
  const B = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return "#" + [R, G, B].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function ColorTool(): ReactElement {
  const [seed, setSeed] = useState("#c9a227");
  const palette = [
    seed,
    hslShift(seed, 30, 0, 0),
    hslShift(seed, -30, 0, 0),
    hslShift(seed, 0, 0, 0.15),
    hslShift(seed, 0, 0, -0.2),
    hslShift(seed, 180, -0.1, 0),
  ];
  const surfaces = ["#0b0b0f", "#ffffff", "#1a1a22"];
  return (
    <div className="real-tool">
      <label className="try-label">
        Seed hex
        <input className="email-field" value={seed} onChange={(e) => setSeed(e.target.value)} />
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {palette.map((c) => (
          <div key={c} style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, background: c, borderRadius: 8 }} />
            <code style={{ fontSize: 11 }}>{c}</code>
          </div>
        ))}
      </div>
      <h2>Contrast vs surfaces</h2>
      <ul className="hint-list">
        {palette.map((c) =>
          surfaces.map((s) => {
            const ratio = contrast(c, s);
            const aa = ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA large" : "fail";
            return (
              <li key={c + s}>
                {c} on {s}: {ratio.toFixed(2)} · {aa}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
