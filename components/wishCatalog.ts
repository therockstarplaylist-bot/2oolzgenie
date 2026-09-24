/** Paid Market wishes, Djinn secrets, and self-install packs — all ≥500 TC. */

export type WishTool = {
  id: string;
  n: string;
  cost: number;
  tier: "rare" | "djinn";
  blurb: string;
  how: string[];
  body: string;
  hint: string;
  tags: string[];
  /** For djinn shells: tab tool ids composed inside one surface. */
  tabs?: string[];
};

export const WISH_TOOLS: WishTool[] = [
  {
    id: "memory",
    n: "Lamp Memory Vault",
    cost: 800,
    tier: "rare",
    blurb: "AES-GCM notes behind a passphrase — export ciphertext JSON.",
    how: [
      "Set a passphrase (stays in memory only)",
      "Add notes; search the unlocked list",
      "Export / import encrypted vault JSON",
    ],
    body: "Client-side vault. PBKDF2 + AES-GCM via WebCrypto. Ciphertext never leaves this device unless you export it.",
    hint: "Lock private notes behind a passphrase and export only ciphertext.",
    tags: ["vault", "encrypt", "notes", "aes", "memory", "private"],
  },
  {
    id: "distill",
    n: "Thread Distiller",
    cost: 500,
    tier: "rare",
    blurb: "Paste a chat → Decisions / Open questions / Actions.",
    how: ["Paste the thread", "Tap Distill", "Copy the three buckets"],
    body: "Heuristic extractor — bullets, TODO, we should, and question marks. No external AI.",
    hint: "Pull decisions, open questions, and actions out of a messy chat paste.",
    tags: ["chat", "thread", "decisions", "actions", "todo", "meeting"],
  },
  {
    id: "sqlite",
    n: "SQLite Desk",
    cost: 900,
    tier: "rare",
    blurb: "Upload a .db, run SELECT / PRAGMA, read the table.",
    how: ["Upload a SQLite file", "Write a SELECT or PRAGMA", "Read the result grid"],
    body: "sql.js in the browser. Read-only desk for local databases — nothing uploads to a server.",
    hint: "Open a local SQLite file and query it without a server.",
    tags: ["sqlite", "sql", "database", "query", "db"],
  },
  {
    id: "pdftext",
    n: "PDF Text Extract",
    cost: 600,
    tier: "rare",
    blurb: "Pull text out of an uploaded PDF — copy ready.",
    how: ["Choose a PDF", "Wait for extract", "Copy the text"],
    body: "pdf.js client extract. Text-layer only — scanned pages without OCR stay empty.",
    hint: "Yank the text layer out of a PDF and copy it.",
    tags: ["pdf", "text", "extract", "document"],
  },
  {
    id: "exif",
    n: "Image Compress & EXIF Strip",
    cost: 500,
    tier: "rare",
    blurb: "Re-encode JPEG/WebP with a quality slider — EXIF gone.",
    how: ["Pick an image", "Set quality and format", "Download the re-encode"],
    body: "Canvas redraw strips metadata by re-encoding. Client-side only.",
    hint: "Shrink a photo and scrub EXIF by re-encoding on-device.",
    tags: ["image", "compress", "exif", "jpeg", "webp", "privacy"],
  },
  {
    id: "jsondiff",
    n: "Deep JSON Diff",
    cost: 500,
    tier: "rare",
    blurb: "Paste A/B — path-level added / removed / changed.",
    how: ["Paste left JSON and right JSON", "Tap Diff", "Read path deltas"],
    body: "Recursive object/array walk with dotted paths. No network.",
    hint: "See every path that changed between two JSON blobs.",
    tags: ["json", "diff", "api", "payload", "compare"],
  },
  {
    id: "prompts",
    n: "Prompt Library",
    cost: 700,
    tier: "rare",
    blurb: "Named system/user prompts with version history and diff.",
    how: ["Save a named prompt", "Edit to create a new version", "Diff any two versions"],
    body: "LocalStorage library for prompt drafts — storage and versioning only. No jailbreak copy.",
    hint: "Version your system/user prompts and diff two revisions on this device.",
    tags: ["prompt", "library", "version", "system", "user"],
  },
  {
    id: "spectro",
    n: "Spectrogram Whisper",
    cost: 700,
    tier: "rare",
    blurb: "Audio → spectrogram canvas; optional burn short text into export.",
    how: ["Upload audio", "Analyze", "Optional: burn whisper text → download PNG"],
    body: "Web Audio + canvas offline desk. Toy visualization — not a covert channel guarantee.",
    hint: "Turn audio into a spectrogram and optionally burn a short whisper into the PNG.",
    tags: ["audio", "spectrogram", "fft", "sound", "whisper"],
  },
  {
    id: "stego",
    n: "Stego Drop",
    cost: 650,
    tier: "rare",
    blurb: "Hide UTF-8 in PNG LSB + extract. File in, download out.",
    how: ["Upload a PNG", "Hide UTF-8 or Reveal", "Download the stego PNG"],
    body: "Toy/demo LSB stego — not military grade. Capacity limited; assume visible to anyone who looks. Offline only.",
    hint: "Drop a short UTF-8 secret into a PNG and extract it later — demo-grade only.",
    tags: ["stego", "png", "hide", "lsb", "secret", "drop"],
  },
  {
    id: "qr",
    n: "QR Forge",
    cost: 500,
    tier: "rare",
    blurb: "Generate a QR from text, or decode one from an image.",
    how: ["Type text → Generate, or upload image → Decode", "Download / copy the result"],
    body: "Client QR generate + jsQR decode. No tracking pixels.",
    hint: "Mint a QR from text or read one back from a screenshot.",
    tags: ["qr", "barcode", "encode", "decode"],
  },
  {
    id: "color",
    n: "Color Alchemy",
    cost: 500,
    tier: "rare",
    blurb: "Palette from a seed hex + WCAG contrast pairs.",
    how: ["Enter a seed hex", "Read the palette", "Check contrast against surfaces"],
    body: "HSL shifts + relative-luminance contrast. Design desk without Figma.",
    hint: "Grow a palette from one hex and check contrast ratios.",
    tags: ["color", "palette", "contrast", "wcag", "design"],
  },
  {
    id: "pem",
    n: "PEM / Cert Decoder",
    cost: 550,
    tier: "rare",
    blurb: "Paste PEM — see type, DER length, and printable fields.",
    how: ["Paste a PEM block", "Tap Decode", "Read headers and parsed bits"],
    body: "Splits BEGIN/END blocks, base64→bytes, light ASN.1 walk for common cert OIDs when present.",
    hint: "Peek inside a PEM certificate or key without OpenSSL.",
    tags: ["pem", "cert", "tls", "x509", "key"],
  },
  {
    id: "har",
    n: "HAR → curl / fetch",
    cost: 650,
    tier: "rare",
    blurb: "Drop a HAR entry → copyable curl and fetch().",
    how: ["Paste HAR JSON or one entry", "Pick a request", "Copy curl or fetch"],
    body: "Parses Chrome/Firefox HAR. Rebuilds method, URL, headers, body.",
    hint: "Turn a captured network entry into curl or fetch you can replay.",
    tags: ["har", "curl", "fetch", "http", "debug", "replay"],
  },
  {
    id: "md",
    n: "Markdown Stage",
    cost: 500,
    tier: "rare",
    blurb: "Live Markdown preview + export HTML.",
    how: ["Write Markdown", "Preview live", "Copy or download HTML"],
    body: "Small client Markdown→HTML (headings, lists, code, links, emphasis). No remote render.",
    hint: "Stage Markdown, preview it, and export clean HTML.",
    tags: ["markdown", "html", "preview", "export", "docs"],
  },
  {
    id: "tfidf",
    n: "TF–IDF Doc Memory",
    cost: 900,
    tier: "rare",
    blurb: "Index pasted docs; ask with TF–IDF retrieval.",
    how: ["Paste documents (--- split)", "Index", "Ask a query and read ranked snippets"],
    body: "Local bag-of-words TF–IDF. Not an LLM — honest keyword memory.",
    hint: "Index a pile of notes and retrieve the most relevant snippets.",
    tags: ["tfidf", "search", "docs", "retrieval", "index"],
  },
  {
    id: "claims",
    n: "Claim Ledger",
    cost: 750,
    tier: "rare",
    blurb: "Track claim / evidence / confidence rows on-device.",
    how: ["Add a claim", "Attach evidence + confidence", "Filter and export JSON"],
    body: "Structured skepticism desk. Persists in localStorage.",
    hint: "Keep claims, evidence, and confidence scores in one ledger.",
    tags: ["claim", "evidence", "confidence", "research", "ledger"],
  },
  {
    id: "openapi",
    n: "OpenAPI Flattener",
    cost: 600,
    tier: "rare",
    blurb: "Paste OpenAPI JSON → flat method + path + summary table.",
    how: ["Paste OpenAPI 3 JSON", "Tap Flatten", "Copy the endpoint list"],
    body: "Walks paths.*.{get,post,…}. Ignores YAML (JSON only this wave).",
    hint: "Flatten an OpenAPI spec into a scannable endpoint checklist.",
    tags: ["openapi", "api", "swagger", "endpoints"],
  },
  {
    id: "resume",
    n: "Session Resume Card",
    cost: 650,
    tier: "rare",
    blurb: "End-of-chat notes → bootable handoff markdown for the next Grok session.",
    how: ["Paste closing notes / status", "Tap Build card", "Copy the handoff markdown"],
    body: "Structures goal, constraints, open decisions, files/paths, and next 3 actions. Offline heuristics — mark unverified claims yourself.",
    hint: "Turn messy end-of-chat notes into a bootable next-session handoff.",
    tags: ["resume", "handoff", "session", "grok", "context"],
  },
  {
    id: "packer",
    n: "Context Packer",
    cost: 700,
    tier: "rare",
    blurb: "Long paste → compressed system-prompt block + rough token estimate.",
    how: ["Paste the long context", "Tap Pack", "Copy the compressed block; review drops"],
    body: "Dedupes lines, keeps headings/bullets/code fences, estimates tokens as chars/4. Lists what was dropped. Not an LLM.",
    hint: "Crush a long paste into a system-prompt block and see what got cut.",
    tags: ["context", "pack", "tokens", "system", "prompt", "compress"],
  },
  {
    id: "claimgate",
    n: "Claim Gate",
    cost: 550,
    tier: "rare",
    blurb: "Rewrite prose with [verified]/[unverified] tags + evidence list.",
    how: ["Paste prose", "Tap Gate", "Copy tagged rewrite; chase the evidence list"],
    body: "Heuristic claim splitter. Default tag is [unverified] unless the sentence cites a URL, RFC, commit SHA, or explicit 'verified'. Honest skepticism desk.",
    hint: "Tag every factual claim as verified or unverified and list what needs evidence.",
    tags: ["claim", "verified", "unverified", "evidence", "skepticism"],
  },
  {
    id: "falsifier",
    n: "Falsifier Desk",
    cost: 600,
    tier: "rare",
    blurb: "Claim/hypothesis → 5 concrete falsifiers + settling evidence.",
    how: ["Paste a claim", "Tap Falsify", "Copy the five tests"],
    body: "Metacog-style falsifiers: measurement, counterexample, time-box, independent check, kill criterion. Marks outputs as proposed tests, not proof.",
    hint: "Generate five ways this claim could be proven wrong — and what settles it.",
    tags: ["falsify", "hypothesis", "metacog", "test", "evidence"],
  },
  {
    id: "promptab",
    n: "Prompt A/B Ledger",
    cost: 650,
    tier: "rare",
    blurb: "Two prompts + same task → scored comparison sheet + winner.",
    how: ["Paste prompt A, prompt B, and the task", "Tap Compare", "Read scores and winner reason"],
    body: "Scores clarity, constraints, testability 1–5 with simple heuristics. Winner pick is advisory — not model quality.",
    hint: "Score two prompts against the same task and pick a winner with reasons.",
    tags: ["prompt", "ab", "compare", "eval", "ledger"],
  },
  {
    id: "rubric",
    n: "Eval Rubric Runner",
    cost: 700,
    tier: "rare",
    blurb: "Expected vs actual → accuracy / completeness / constraints / actionability.",
    how: ["Paste expected and actual", "Tap Score", "Read rubric + pass/fail"],
    body: "Fixed four-axis rubric with keyword/overlap heuristics. Pass threshold configurable. Unverified automated scores — use as a desk, not gospel.",
    hint: "Score an actual output against expected with a fixed four-axis rubric.",
    tags: ["eval", "rubric", "accuracy", "qa", "pass"],
  },
  {
    id: "wishissue",
    n: "Wish → Issue Pack",
    cost: 750,
    tier: "rare",
    blurb: "Wish text → GitHub issue title/body, labels, PR description block.",
    how: ["Paste the wish", "Tap Pack", "Copy issue + PR blocks into GitHub"],
    body: "Structures problem, acceptance sketch, and suggested labels. You still verify facts before filing.",
    hint: "Turn a product wish into a paste-ready GitHub issue and PR description.",
    tags: ["github", "issue", "pr", "wish", "ship"],
  },
  {
    id: "spec",
    n: "Spec Contract",
    cost: 800,
    tier: "rare",
    blurb: "Wish → Given/When/Then acceptance checks + out-of-scope.",
    how: ["Paste the wish", "Tap Contract", "Copy the falsifiable checks"],
    body: "Builds acceptance scenarios and explicit out-of-scope bullets from wish text. Treat as draft contract until verified.",
    hint: "Forge falsifiable Given/When/Then checks and out-of-scope from a wish.",
    tags: ["spec", "acceptance", "gherkin", "contract", "scope"],
  },
  {
    id: "decision",
    n: "Decision Log",
    cost: 500,
    tier: "rare",
    blurb: "Decision + context → assumptions, alternatives, reversal triggers.",
    how: ["Paste decision and context", "Tap Log", "Copy the decision record"],
    body: "Structured decision stub with revisit date. Assumptions default [unverified] until you annotate.",
    hint: "Log a decision with assumptions, alternatives, and when you'd reverse it.",
    tags: ["decision", "log", "assumptions", "reversal", "adr"],
  },
];

export const DJINN_TOOLS: WishTool[] = [
  {
    id: "omni",
    n: "Omni Desk",
    cost: 2500,
    tier: "djinn",
    blurb: "One shell: deep JSON diff, JWT peek, PEM decode, Base64/hex swiss.",
    how: ["Unlock the desk", "Switch tabs", "Run each swiss tool in place"],
    body: "Secret of the Djinn. Multi-tool surface for payload forensics — unheard-of price, many desks in one.",
    hint: "Open the omnibus forensics shell when one tool is not enough.",
    tags: ["djinn", "omni", "json", "jwt", "pem", "base64"],
    tabs: ["jsondiff", "jwt-lite", "pem", "swiss"],
  },
  {
    id: "mindforge",
    n: "Mind Forge",
    cost: 2000,
    tier: "djinn",
    blurb: "Memory Vault + Thread Distiller + Claim Ledger in one forge.",
    how: ["Unlock Mind Forge", "Tab between vault, distill, claims", "Keep work local"],
    body: "Secret of the Djinn. Think, lock, and ledger without leaving the lamp.",
    hint: "Forge thoughts: encrypt notes, distill threads, ledger claims.",
    tags: ["djinn", "mind", "vault", "distill", "claims"],
    tabs: ["memory", "distill", "claims", "claimgate", "falsifier", "resume"],
  },
  {
    id: "archive",
    n: "Archive Alchemist",
    cost: 2200,
    tier: "djinn",
    blurb: "PDF text + image EXIF strip + SQLite query — one archive desk.",
    how: ["Unlock Archive Alchemist", "Pick a tab", "Work files entirely on-device"],
    body: "Secret of the Djinn. Turn raw files into a private working archive.",
    hint: "Alchemize PDFs, images, and SQLite into a private archive desk.",
    tags: ["djinn", "archive", "pdf", "exif", "sqlite"],
    tabs: ["pdftext", "exif", "sqlite"],
  },
];

export type WishPack = {
  id: string;
  n: string;
  cost: number;
  process: string;
  toolIds: string[];
};

export const WISH_PACKS: WishPack[] = [
  {
    id: "ops-nerve",
    n: "Ops Nerve",
    cost: 1800,
    process:
      "From messy ops dump to clean ship checklist — distill the thread, diff the payloads, replay the HAR.",
    toolIds: ["distill", "jsondiff", "har"],
  },
  {
    id: "private-archive",
    n: "Private Archive",
    cost: 2400,
    process:
      "Lock files and notes into a private working archive — vault, PDF text, SQLite, EXIF scrub.",
    toolIds: ["memory", "pdftext", "sqlite", "exif"],
  },
];

export function getWishTool(id: string | undefined) {
  if (!id) return undefined;
  return (
    WISH_TOOLS.find((x) => x.id === id) ||
    DJINN_TOOLS.find((x) => x.id === id)
  );
}

export function getWishPack(id: string | undefined) {
  if (!id) return undefined;
  return WISH_PACKS.find((p) => p.id === id);
}

/** Runnable meta: free shelf or paid wish/djinn. */
export function getRunnableMeta(id: string | undefined) {
  if (!id) return undefined;
  const wish = getWishTool(id);
  if (wish) {
    return {
      id: wish.id,
      n: wish.n,
      rarity: wish.tier === "djinn" ? ("rare" as const) : ("rare" as const),
      blurb: wish.blurb,
      how: wish.how,
      body: wish.body,
      hint: wish.hint,
      tags: wish.tags,
      cost: wish.cost,
      paid: true as const,
      tier: wish.tier,
    };
  }
  return undefined;
}

export const ALL_PAID_RUNNER_IDS = [
  ...WISH_TOOLS.map((t) => t.id),
  ...DJINN_TOOLS.map((t) => t.id),
  "jwt-lite",
  "swiss",
] as const;
