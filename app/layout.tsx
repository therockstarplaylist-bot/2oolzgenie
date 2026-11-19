import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./auth.css";

export const metadata: Metadata = {
  title: {
    default: "2oolzgenie App Store",
    template: "%s · 2oolzgenie App Store",
  },
  description:
    "Download Brandon's free Android apps and a Windows file tool. Indie apps, not from Google Play.",
};

export const viewport: Viewport = {
  themeColor: "#070914",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
