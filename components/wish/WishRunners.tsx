"use client";
import { useState, type ReactElement } from "react";
import { MemoryTool, DistillTool, JsonDiffTool, PromptsTool } from "./runnersVault";
import { SqliteTool, PdfTextTool, ExifTool } from "./runnersFiles";
import { SpectroTool, StegoTool, QrTool, ColorTool } from "./runnersMedia";
import {
  PemTool,
  HarTool,
  MdTool,
  TfidfTool,
  ClaimsTool,
  OpenApiTool,
  SwissTool,
  JwtLiteTool,
} from "./runnersNet";
import {
  ResumeTool,
  PackerTool,
  ClaimGateTool,
  FalsifierTool,
  PromptAbTool,
  RubricTool,
  WishIssueTool,
  SpecTool,
  DecisionTool,
} from "./runnersGrok";
import { StegoVerifyTool } from "./runnersWhoaStego";
import { WaveformTool, GlitchTool, PaliftTool } from "./runnersWhoaMedia";
import { JsonGateTool, JsonPatchTool } from "./runnersWhoaJson";

const TAB_RUNNERS: Record<string, () => ReactElement> = {
  memory: MemoryTool,
  distill: DistillTool,
  jsondiff: JsonDiffTool,
  prompts: PromptsTool,
  sqlite: SqliteTool,
  pdftext: PdfTextTool,
  exif: ExifTool,
  spectro: SpectroTool,
  stego: StegoTool,
  qr: QrTool,
  color: ColorTool,
  pem: PemTool,
  har: HarTool,
  md: MdTool,
  tfidf: TfidfTool,
  claims: ClaimsTool,
  openapi: OpenApiTool,
  swiss: SwissTool,
  "jwt-lite": JwtLiteTool,
  resume: ResumeTool,
  packer: PackerTool,
  claimgate: ClaimGateTool,
  falsifier: FalsifierTool,
  promptab: PromptAbTool,
  rubric: RubricTool,
  wishissue: WishIssueTool,
  spec: SpecTool,
  decision: DecisionTool,
  stegoverify: StegoVerifyTool,
  waveform: WaveformTool,
  glitch: GlitchTool,
  jsongate: JsonGateTool,
  jsonpatch: JsonPatchTool,
  palift: PaliftTool,
};

function DjinnShell({ tabs, title }: { tabs: string[]; title: string }) {
  const [tab, setTab] = useState(tabs[0] || "");
  const Comp = TAB_RUNNERS[tab];
  return (
    <div className="real-tool">
      <p className="seal">Secret of the Djinn · {title}</p>
      <div className="hilo-bets" style={{ marginBottom: 10, flexWrap: "wrap" }}>
        {tabs.map((id) => (
          <button
            key={id}
            type="button"
            className={"btn" + (tab === id ? "" : " ghost")}
            onClick={() => setTab(id)}
          >
            {id}
          </button>
        ))}
      </div>
      {Comp ? <Comp /> : <p className="card-blurb">Missing tab runner.</p>}
    </div>
  );
}

function OmniTool() {
  return <DjinnShell title="Omni Desk" tabs={["jsondiff", "jwt-lite", "pem", "swiss"]} />;
}
function MindForgeTool() {
  return (
    <DjinnShell
      title="Mind Forge"
      tabs={["memory", "distill", "claims", "claimgate", "falsifier", "resume"]}
    />
  );
}
function ArchiveTool() {
  return <DjinnShell title="Archive Alchemist" tabs={["pdftext", "exif", "sqlite"]} />;
}

export const WISH_RUNNERS: Record<string, () => ReactElement> = {
  ...TAB_RUNNERS,
  omni: OmniTool,
  mindforge: MindForgeTool,
  archive: ArchiveTool,
};
