import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import "./globals.css";
import "./auth.css";

export const metadata: Metadata = {
  title: "2oolz Genie",
  description:
    "Forge a tool. Three free wishes. Coins drip every hour. Pay with card via PayPal.",
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
