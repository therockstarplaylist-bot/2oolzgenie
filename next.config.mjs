/** Keep this list in sync with the headers in vercel.json. */
const DOWNLOADS = [
  ["WorldLauncher-1.0.0.apk", "application/vnd.android.package-archive"],
  ["DeepDive-1.0.0.apk", "application/vnd.android.package-archive"],
  ["BigDrop-1.0.0.apk", "application/vnd.android.package-archive"],
  ["GameLab-1.0.0.apk", "application/vnd.android.package-archive"],
  ["PhoneBridge-1.0.0.apk", "application/vnd.android.package-archive"],
  ["PhoneBridge-Setup-1.0.0.exe", "application/octet-stream"],
  ["WinningResearchLab-3.0.3.apk", "application/vnd.android.package-archive"],
  ["AvatarMaker-2.3.1.apk", "application/vnd.android.package-archive"],
  ["DreamLake-1.0.7.apk", "application/vnd.android.package-archive"],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return DOWNLOADS.map(([file, type]) => ({
      source: `/downloads/${file}`,
      headers: [
        { key: "Content-Type", value: type },
        { key: "Content-Disposition", value: `attachment; filename=${file}` },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    }));
  },
};

export default nextConfig;
