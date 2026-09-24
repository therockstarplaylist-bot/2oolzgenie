"use client";
import { useRef, useState, type ReactElement } from "react";
import { copyText, downloadBlob } from "./helpers";

export function SqliteTool(): ReactElement {
  const [sql, setSql] = useState("SELECT name FROM sqlite_master WHERE type='table';");
  const [rows, setRows] = useState<string[][]>([]);
  const [cols, setCols] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const dbRef = useRef<any>(null);

  async function loadDb(file: File) {
    setErr("");
    try {
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({
        locateFile: (f: string) => `https://sql.js.org/dist/${f}`,
      });
      const buf = new Uint8Array(await file.arrayBuffer());
      dbRef.current = new SQL.Database(buf);
      setErr("Loaded " + file.name);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  function run() {
    setErr("");
    if (!dbRef.current) {
      setErr("Upload a .db first.");
      return;
    }
    try {
      const res = dbRef.current.exec(sql);
      if (!res.length) {
        setCols([]);
        setRows([]);
        setErr("OK — empty result.");
        return;
      }
      setCols(res[0].columns);
      setRows(res[0].values.map((r: unknown[]) => r.map((c) => String(c))));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="real-tool">
      <label className="try-label">
        SQLite file
        <input
          type="file"
          accept=".db,.sqlite,.sqlite3"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void loadDb(f);
          }}
        />
      </label>
      <label className="try-label">
        SQL
        <textarea rows={3} value={sql} onChange={(e) => setSql(e.target.value)} />
      </label>
      <button className="btn" type="button" onClick={run}>
        Run
      </button>
      {err && <p className="msg">{err}</p>}
      {cols.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className="try-out" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c} style={{ textAlign: "left", padding: 4, borderBottom: "1px solid #444" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} style={{ padding: 4, borderBottom: "1px solid #333" }}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function PdfTextTool(): ReactElement {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  async function onFile(file: File) {
    setMsg("Extracting…");
    setText("");
    try {
      const pdfjs = await import("pdfjs-dist");
      // @ts-expect-error worker
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      const data = new Uint8Array(await file.arrayBuffer());
      const doc = await pdfjs.getDocument({ data }).promise;
      const parts: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        parts.push(
          content.items.map((it: any) => ("str" in it ? it.str : "")).join(" ")
        );
      }
      const out = parts.join("\n\n");
      setText(out || "(No text layer — scanned PDF needs OCR elsewhere.)");
      setMsg(doc.numPages + " pages.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }
  return (
    <div className="real-tool">
      <label className="try-label">
        PDF
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
      </label>
      <div className="tool-actions">
        <button className="btn ghost" type="button" disabled={!text} onClick={() => copyText(text)}>
          Copy
        </button>
      </div>
      {msg && <p className="msg">{msg}</p>}
      {text && <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>{text}</pre>}
    </div>
  );
}

export function ExifTool(): ReactElement {
  const [quality, setQuality] = useState(0.8);
  const [fmt, setFmt] = useState<"image/jpeg" | "image/webp">("image/jpeg");
  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function onFile(file: File) {
    setMsg("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) {
            setMsg("Encode failed.");
            return;
          }
          if (preview) URL.revokeObjectURL(preview);
          const out = URL.createObjectURL(blob);
          setPreview(out);
          setMsg(
            `Stripped EXIF via re-encode · ${(blob.size / 1024).toFixed(1)} KB · q=${quality}`
          );
        },
        fmt,
        quality
      );
    };
    img.onerror = () => setMsg("Could not read image.");
    img.src = url;
  }

  return (
    <div className="real-tool">
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
        Quality {quality.toFixed(2)}
        <input
          type="range"
          min={0.3}
          max={1}
          step={0.05}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />
      </label>
      <div className="tool-actions">
        <button
          className={"btn" + (fmt === "image/jpeg" ? "" : " ghost")}
          type="button"
          onClick={() => setFmt("image/jpeg")}
        >
          JPEG
        </button>
        <button
          className={"btn" + (fmt === "image/webp" ? "" : " ghost")}
          type="button"
          onClick={() => setFmt("image/webp")}
        >
          WebP
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={!preview}
          onClick={() => {
            if (!preview) return;
            const a = document.createElement("a");
            a.href = preview;
            a.download = fmt === "image/webp" ? "stripped.webp" : "stripped.jpg";
            a.click();
          }}
        >
          Download
        </button>
      </div>
      {msg && <p className="msg ok">{msg}</p>}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="preview" style={{ maxWidth: "100%", marginTop: 8 }} />
      )}
    </div>
  );
}
