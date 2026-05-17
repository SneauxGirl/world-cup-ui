import type { Metadata, Viewport } from "next";
import { Alumni_Sans, Alumni_Sans_SC, Finlandica } from "next/font/google";
import "./globals.scss";
import { wcuiViewportThemeColor } from "@/lib/wcui-theme-meta";

const alumniSans = Alumni_Sans({
  variable: "--font-alumni-sans",
  subsets: ["latin"],
});

const alumniSansSc = Alumni_Sans_SC({
  variable: "--font-alumni-sans-sc",
  subsets: ["latin"],
  /* Not in Next’s font-metrics DB yet — avoids build/dev “Failed to find font override values”. */
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

const finlandica = Finlandica({
  variable: "--font-finlandica",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Cup UI",
  description: "Fantasy tournament command deck",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: wcuiViewportThemeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alumniSans.variable} ${alumniSansSc.variable} ${finlandica.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
