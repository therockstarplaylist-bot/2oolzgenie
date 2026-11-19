import type { Metadata } from "next";
import { ToolRow } from "@/components/store/cards";
import { allTools } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Free tools from Brandon: World Launcher, a 3D home screen, and PhoneBridge, which sends files to a Windows PC.",
};

export default function ToolsPage() {
  return (
    <>
      <div className="page-intro">
        <h1>Tools</h1>
        <p>A 3D home screen, and a way to send files from your phone to a Windows PC. Both are free.</p>
      </div>
      <ul className="tool-list">
        {allTools().map((app) => (
          <ToolRow key={app.slug} app={app} />
        ))}
      </ul>
    </>
  );
}
