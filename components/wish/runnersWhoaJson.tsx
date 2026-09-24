"use client";
import { useState, type ReactElement } from "react";
import { copyText, deepJsonDiff } from "./helpers";

export function JsonGateTool(): ReactElement {
  const [data, setData] = useState('{\n  "name": "lamp",\n  "tc": 500\n}');
  const [schema, setSchema] = useState(
    '{\n  "type": "object",\n  "required": ["name", "tc"],\n  "properties": {\n    "name": { "type": "string" },\n    "tc": { "type": "number", "minimum": 0 }\n  }\n}'
  );
  const [out, setOut] = useState("");

  function validate() {
    try {
      const d = JSON.parse(data);
      const s = JSON.parse(schema);
      const errors: string[] = [];
      walk(d, s, "$", errors);
      setOut(errors.length ? errors.join("\n") : "OK · schema satisfied");
    } catch (e) {
      setOut(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">
        Subset JSON Schema: type, required, properties, minimum/maximum, minLength/maxLength, enum. Offline.
      </p>
      <label className="try-label">
        JSON
        <textarea rows={6} value={data} onChange={(e) => setData(e.target.value)} />
      </label>
      <label className="try-label">
        Schema
        <textarea rows={8} value={schema} onChange={(e) => setSchema(e.target.value)} />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={validate}>
          Validate
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            copyText(out);
          }}
        >
          Copy result
        </button>
      </div>
      {out && <pre className="try-out">{out}</pre>}
    </div>
  );
}

function walk(data: unknown, schema: Record<string, unknown>, path: string, errors: string[]) {
  if (!schema || typeof schema !== "object") return;
  const type = schema.type as string | undefined;
  if (type) {
    const ok =
      (type === "object" && data !== null && typeof data === "object" && !Array.isArray(data)) ||
      (type === "array" && Array.isArray(data)) ||
      (type === "string" && typeof data === "string") ||
      (type === "number" && typeof data === "number" && !Number.isNaN(data)) ||
      (type === "integer" && typeof data === "number" && Number.isInteger(data)) ||
      (type === "boolean" && typeof data === "boolean") ||
      (type === "null" && data === null);
    if (!ok) {
      errors.push(`${path}: expected ${type}, got ${Array.isArray(data) ? "array" : data === null ? "null" : typeof data}`);
      return;
    }
  }
  if (Array.isArray(schema.enum) && !schema.enum.includes(data as never)) {
    errors.push(`${path}: value not in enum`);
  }
  if (typeof data === "number") {
    if (typeof schema.minimum === "number" && data < schema.minimum)
      errors.push(`${path}: ${data} < minimum ${schema.minimum}`);
    if (typeof schema.maximum === "number" && data > schema.maximum)
      errors.push(`${path}: ${data} > maximum ${schema.maximum}`);
  }
  if (typeof data === "string") {
    if (typeof schema.minLength === "number" && data.length < schema.minLength)
      errors.push(`${path}: length < minLength`);
    if (typeof schema.maxLength === "number" && data.length > schema.maxLength)
      errors.push(`${path}: length > maxLength`);
  }
  if (type === "object" && data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    const req = (schema.required as string[]) || [];
    for (const k of req) {
      if (!(k in obj)) errors.push(`${path}.${k}: required`);
    }
    const props = (schema.properties as Record<string, Record<string, unknown>>) || {};
    for (const k of Object.keys(props)) {
      if (k in obj) walk(obj[k], props[k], `${path}.${k}`, errors);
    }
  }
  if (type === "array" && Array.isArray(data) && schema.items && typeof schema.items === "object") {
    data.forEach((item, i) => walk(item, schema.items as Record<string, unknown>, `${path}[${i}]`, errors));
  }
}

/** JSON Patch Desk — RFC6902-style ops from deep diff. */

export function JsonPatchTool(): ReactElement {
  const [a, setA] = useState('{\n  "a": 1,\n  "b": { "c": true }\n}');
  const [b, setB] = useState('{\n  "a": 2,\n  "b": { "c": false },\n  "d": "new"\n}');
  const [out, setOut] = useState("");

  function run() {
    try {
      const left = JSON.parse(a);
      const right = JSON.parse(b);
      const diffs = deepJsonDiff(left, right);
      const ops = diffs.map((d) => {
        const path = "/" + d.path.replace(/^\$?\.?/, "").replace(/\./g, "/").replace(/\[(\d+)\]/g, "/$1");
        if (d.kind === "added") return { op: "add", path, value: d.b };
        if (d.kind === "removed") return { op: "remove", path };
        return { op: "replace", path, value: d.b };
      });
      setOut(JSON.stringify(ops, null, 2));
    } catch (e) {
      setOut(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="real-tool">
      <p className="card-blurb">
        Build an RFC6902-style patch from A → B. Additive heuristic from deep diff — review before applying elsewhere.
      </p>
      <label className="try-label">
        JSON A
        <textarea rows={5} value={a} onChange={(e) => setA(e.target.value)} />
      </label>
      <label className="try-label">
        JSON B
        <textarea rows={5} value={b} onChange={(e) => setB(e.target.value)} />
      </label>
      <div className="tool-actions">
        <button className="btn" type="button" onClick={run}>
          Build patch
        </button>
        <button className="btn ghost" type="button" onClick={() => copyText(out)}>
          Copy patch
        </button>
      </div>
      {out && <pre className="try-out">{out}</pre>}
    </div>
  );
}
