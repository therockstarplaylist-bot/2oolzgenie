"use client";
import { useRef, useState, type ReactElement } from "react";
import { ShareCard } from "../ShareCard";
import { copyText, downloadBlob } from "./helpers";

export function WaveformTool(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [msg, setMsg] = useState("");
  const [stamp, setStamp] = useState("2oolz · waveform");
  const [preview, setPreview] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  async function onFile(file: File) {
    setMsg("Rendering…");
    setReady(false);
    try {
      const actx = new AudioContext();
      const buf = await actx.decodeAudioData(await file.arrayBuffer());
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = (canvas.width = 960);
      const h = (canvas.height = 280);
      const g = canvas.getContext("2d");
      if (!g) return;
      g.fillStyle = "#0a0b0d";
      g.fillRect(0, 0, w, h);
      const data = buf.getChannelData(0);
      const mid = h / 2;
      g.strokeStyle = "#c9a227";
      g.lineWidth = 1.5;
      g.beginPath();
      const step = Math.max(1, Math.floor(data.length / w));
      for (let x = 0; x < w; x++) {
        let min = 1;
        let max = -1;
        const start = x * step;
        for (let i = 0; i < step && start + i < data.length; i++) {
          const v = data[start + i];
          if (v < min) min = v;
          if (v > max) max = v;
        }
        const y1 = mid + min * mid * 0.9;
        const y2 = mid + max * mid * 0.9;
        g.moveTo(x, y1);
        g.lineTo(x, y2);
      }
      g.stroke();
      if (stamp.trim()) {
        g.font = "16px ui-monospace, Menlo, monospace";
        g.fillStyle = "rgba(236,232,225,0.85)";
        g.fillText(stamp.trim().slice(0, 64), 16, h - 16);
      }
      setPreview(canvas.toDataURL("image/png"));
      setMsg(`${file.name} · ${buf.duration.toFixed(1)}s · ${buf.sampleRate} Hz`);
      setReady(true);
      void actx.close();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob("waveform-stamp.png", blob, "image/png");
    }, "image/png");
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">Offline waveform painter. Stamp a short line, download PNG, share the card.</p>
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
        Stamp text
        <input className="email-field" value={stamp} onChange={(e) => setStamp(e.target.value)} maxLength={64} />
      </label>
      <canvas ref={canvasRef} style={{ width: "100%", background: "#111", borderRadius: 8 }} />
      <div className="tool-actions">
        <button className="btn ghost" type="button" onClick={download} disabled={!ready}>
          Download PNG
        </button>
      </div>
      {msg && <p className="msg">{msg}</p>}
      {ready && (
        <ShareCard
          toolName="Waveform Stamp"
          headline="Painted a waveform from real audio."
          detail={msg}
          previewUrl={preview}
        />
      )}
    </div>
  );
}

/** Channel Glitch — RGB shift whoa. */

export function GlitchTool(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [msg, setMsg] = useState("");
  const [shift, setShift] = useState(12);
  const [preview, setPreview] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const srcRef = useRef<ImageData | null>(null);

  async function onFile(file: File) {
    try {
      const bmp = await createImageBitmap(file);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const max = 640;
      const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
      canvas.width = Math.max(1, Math.floor(bmp.width * scale));
      canvas.height = Math.max(1, Math.floor(bmp.height * scale));
      const g = canvas.getContext("2d");
      if (!g) return;
      g.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      srcRef.current = g.getImageData(0, 0, canvas.width, canvas.height);
      apply(shift);
      setMsg(`${file.name} · ${canvas.width}×${canvas.height}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  function apply(s: number) {
    const canvas = canvasRef.current;
    const src = srcRef.current;
    if (!canvas || !src) return;
    const g = canvas.getContext("2d");
    if (!g) return;
    const w = canvas.width;
    const h = canvas.height;
    const out = g.createImageData(w, h);
    const d = src.data;
    const o = out.data;
    const sx = Math.max(0, Math.floor(s));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const rx = Math.min(w - 1, x + sx);
        const bx = Math.max(0, x - sx);
        const ri = (y * w + rx) * 4;
        const bi = (y * w + bx) * 4;
        o[i] = d[ri];
        o[i + 1] = d[i + 1];
        o[i + 2] = d[bi + 2];
        o[i + 3] = 255;
      }
    }
    g.putImageData(out, 0, 0);
    setPreview(canvas.toDataURL("image/png"));
    setReady(true);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob("channel-glitch.png", blob, "image/png");
    }, "image/png");
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">RGB channel shift on-device. Slider the offset, download the glitch, share it.</p>
      <label className="try-label">
        Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
      </label>
      <label className="try-label">
        Channel shift · {shift}px
        <input
          type="range"
          min={0}
          max={48}
          value={shift}
          onChange={(e) => {
            const v = Number(e.target.value);
            setShift(v);
            apply(v);
          }}
        />
      </label>
      <canvas ref={canvasRef} style={{ width: "100%", background: "#111", borderRadius: 8 }} />
      <div className="tool-actions">
        <button className="btn ghost" type="button" onClick={download} disabled={!ready}>
          Download PNG
        </button>
      </div>
      {msg && <p className="msg">{msg}</p>}
      {ready && (
        <ShareCard
          toolName="Channel Glitch"
          headline={`RGB shift · ${shift}px`}
          detail="Glitched a photo with a channel offset — shareable whoa from the Genie Market."
          previewUrl={preview}
        />
      )}
    </div>
  );
}

/** Palette Lift — dominant colors. */

export function PaliftTool(): ReactElement {
  const [msg, setMsg] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  async function onFile(file: File) {
    try {
      const bmp = await createImageBitmap(file);
      const c = document.createElement("canvas");
      const size = 64;
      c.width = size;
      c.height = size;
      const g = c.getContext("2d");
      if (!g) return;
      g.drawImage(bmp, 0, 0, size, size);
      const id = g.getImageData(0, 0, size, size).data;
      const buckets = new Map<string, number>();
      for (let i = 0; i < id.length; i += 4) {
        const r = id[i] >> 4;
        const g2 = id[i + 1] >> 4;
        const b = id[i + 2] >> 4;
        const key = `${r},${g2},${b}`;
        buckets.set(key, (buckets.get(key) || 0) + 1);
      }
      const ranked = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
      const hexes = ranked.map(([k]) => {
        const [r, g2, b] = k.split(",").map((n) => Number(n) * 17);
        return (
          "#" +
          [r, g2, b]
            .map((n) => Math.min(255, n).toString(16).padStart(2, "0"))
            .join("")
        );
      });
      setColors(hexes);
      setMsg(`${file.name} · ${hexes.length} colors`);
      const sw = document.createElement("canvas");
      sw.width = 600;
      sw.height = 120;
      const sg = sw.getContext("2d");
      if (sg) {
        const w = 600 / Math.max(1, hexes.length);
        hexes.forEach((h, i) => {
          sg.fillStyle = h;
          sg.fillRect(i * w, 0, w, 120);
        });
        setPreview(sw.toDataURL("image/png"));
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">Quantize an image to a short hex palette — on-device, no upload.</p>
      <label className="try-label">
        Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
      </label>
      {colors.length > 0 && (
        <div className="palette-row">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              className="palette-swatch"
              style={{ background: c }}
              title={c}
              onClick={() => {
                copyText(c);
                setMsg("Copied " + c);
              }}
            >
              <span>{c}</span>
            </button>
          ))}
        </div>
      )}
      {msg && <p className="msg">{msg}</p>}
      {colors.length > 0 && (
        <ShareCard
          toolName="Palette Lift"
          headline={colors.join(" · ")}
          detail="Lifted a dominant palette from an image on 2oolz Genie."
          previewUrl={preview}
        />
      )}
    </div>
  );
}
