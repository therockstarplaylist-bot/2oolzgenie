import type { GlyphName } from "@/lib/catalog";

type GlyphProps = {
  name: GlyphName;
  size?: number;
  title?: string;
};

export function Glyph({ name, size = 28 }: GlyphProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    "aria-hidden": true as const,
  };
  if (name === "island") {
    return (
      <svg {...common}>
        <path
          d="M8 30c6-2 8-8 16-8s10 6 16 8c-4 6-10 8-16 8s-12-2-16-8z"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path d="M24 22c2-8 6-12 6-16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M18 28h4M26 26h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "dive") {
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2.4" />
        <path d="M24 8v6M24 34v6M8 24h6M34 24h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 30c4 3 12 3 16-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "drop") {
    return (
      <svg {...common}>
        <path d="M14 16c6-6 14-6 20 0-4 3-6 4-10 4s-6-1-10-4z" stroke="currentColor" strokeWidth="2.4" />
        <path d="M18 18l6 10M30 18l-6 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="24" cy="32" r="3" fill="currentColor" />
      </svg>
    );
  }
  if (name === "lab") {
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2.4" />
        <path d="M24 8v6M24 34v6M10 18l5 3M33 27l5 3M10 30l5-3M33 21l5-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="8" y="12" width="12" height="22" rx="2.5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="26" y="16" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <path d="M30 28v4h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 20h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function LampMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M34 6c1 7 7 8 7 14"
        fill="none"
        stroke="#d7fbff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M42 30c8-1 14-7 16-13"
        fill="none"
        stroke="#3ee7ff"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M56 16h7" stroke="#3ee7ff" strokeWidth="3.4" strokeLinecap="round" />
      <path
        d="M16 42c2-11 9-16 18-16h6c8 0 14 5 13 11 9 1 14-4 12-11"
        fill="#3ee7ff"
      />
      <path
        d="M18 40c0 8 6 14 16 14h6c8 0 14-5 14-12 0-2-8-4-16-3H26c-6 0-8 1-8 1z"
        fill="#3ee7ff"
      />
      <path d="M24 30h18" stroke="#ff4ad2" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M18 36c-8 2-9 12-2 15"
        fill="none"
        stroke="#7af6ff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M24 54h18M28 54v5h10v-5"
        fill="none"
        stroke="#d7fbff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DownloadMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
