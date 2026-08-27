import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hikinex-navigator.marianacruzuluaga.chatgpt.site"),
  title: "H!KINEX Navigator - Employee Hub Concept",
  description: "A work-first H!KINEX Employee Hub concept with role-aware tools, company news and community features.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "H!KINEX Navigator", description: "A clearer path through work, company news and community.", images: [{ url: "/og.jpg", width: 1536, height: 1024, alt: "H!KINEX Navigator employee portal concept" }] },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
