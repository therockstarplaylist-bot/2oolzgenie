import Link from "next/link";
import { downloadHref, type StoreApp, type StoreFile } from "@/lib/catalog";
import { formatBytes, type FileFacts } from "@/lib/releases";
import { DownloadMark, Glyph } from "./glyphs";

export function AppDetail({
  app,
  facts,
}: {
  app: StoreApp;
  facts: Record<string, FileFacts>;
}) {
  const hasArt = app.gallery.some((shot) => shot.art);
  return (
    <article className="detail">
      <p className="back">
        <Link href={app.category === "game" ? "/games" : "/tools"}>
          ← {app.category === "game" ? "Games" : "Tools"}
        </Link>
      </p>
      <header className="detail-head">
        {app.icon ? (
          <img className="detail-icon" src={app.icon.src} alt="" width={72} height={72} />
        ) : (
          <span className="detail-glyph" style={{ color: app.accent }} aria-hidden="true">
            <Glyph name={app.glyph} size={36} />
          </span>
        )}
        <div>
          <h1>{app.name}</h1>
          <p className="meta">
            Version {app.version}
            <span aria-hidden="true"> · </span>
            <span className="free">{app.price}</span>
          </p>
        </div>
      </header>
      <p className="lede">{app.description}</p>
      {app.notes?.map((note) => (
        <p key={note} className="lede">
          {note}
        </p>
      ))}
      <ul className="gallery">
        {app.gallery.map((shot) => (
          <li key={shot.src}>
            <figure className="shot">
              <img src={shot.src} alt={shot.alt} width={412} height={860} />
              <figcaption>{shot.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {hasArt ? (
        <p className="art-note">
          Artwork stands in for a screenshot. It is not a picture of the app running.
        </p>
      ) : null}
      <div id="download" className="downloads">
        {app.files.map((file) => (
          <FileBlock
            key={file.filename || file.button}
            app={app}
            file={file}
            facts={facts[file.filename || file.button]}
          />
        ))}
      </div>
      <p className="checksum-link">
        <a href="/downloads/SHA256SUMS.txt">All checksums (SHA256SUMS.txt)</a>
      </p>
      <p className="indie">{app.indie}</p>
    </article>
  );
}

function FileBlock({
  app,
  file,
  facts,
}: {
  app: StoreApp;
  file: StoreFile;
  facts: FileFacts;
}) {
  const platform = file.platform === "android" ? "Android" : "Windows";
  const fileKey = file.filename || file.button;
  return (
    <section className="file-block" aria-labelledby={`${fileKey}-title`}>
      <h2 id={`${fileKey}-title`}>
        {app.name} for {platform}
      </h2>
      <p className="meta">
        Version {app.version}
        <span aria-hidden="true"> · </span>
        {formatBytes(facts.bytes)}
        <span className="exact"> ({facts.bytes.toLocaleString("en-US")} bytes)</span>
      </p>
      <p className="sha-label">SHA-256</p>
      <code className="sha">{facts.sha256}</code>
      {file.comingSoon || !file.filename ? (
        <>
          <p>The install file is not on this page yet. The size and checksum below are for version {app.version}.</p>
          <button type="button" className="dl dl-block" disabled>
            Coming soon
          </button>
        </>
      ) : (
        <a className="dl dl-block" href={downloadHref(file)} download={file.filename}>
          <DownloadMark />
          {file.button}
        </a>
      )}
      {file.platform === "windows" ? (
        <p className="indie">This Windows setup is not from the Microsoft Store.</p>
      ) : null}
      <h3>{file.stepsTitle}</h3>
      <ol className="steps">
        {file.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
