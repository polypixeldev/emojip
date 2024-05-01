import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "EmojIP",
//   description: "IPv4 addresses as emoji!",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script strategy="beforeInteractive" src="/wasm_exec.js" />
        {children}
      </body>
      
    </html>
  );
}
