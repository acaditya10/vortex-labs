import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VORTEX — Independent Digital Product Studio",
  description:
    "Vortex is an independent digital product studio creating premium websites, e-commerce experiences and custom software for ambitious businesses worldwide.",
  keywords: [
    "Vortex",
    "digital product studio",
    "web design",
    "web development",
    "e-commerce",
    "AI automation",
    "India",
  ],
  openGraph: {
    title: "VORTEX — Independent Digital Product Studio",
    description:
      "Premium websites, e-commerce experiences and custom software for ambitious businesses worldwide.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
