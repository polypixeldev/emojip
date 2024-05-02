import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Head from "next/head";
import { Inter, Roboto_Serif, IBM_Plex_Mono, Chewy } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto_serif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-roboto-serif",
});
const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ibm-plex-mono",
});
const chewy = Chewy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chewy",
});

export const metadata: Metadata = {
  title: "EmojIP",
  description: "IPv4 addresses as emoji!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto_serif.variable} ${ibm_plex_mono.variable} ${chewy.variable}`}
      >
        <Script strategy="beforeInteractive" src="/wasm_exec.js" />
        {children}
      </body>
    </html>
  );
}
