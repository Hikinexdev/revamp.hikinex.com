import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hikinex-commons.marianacruzuluaga.chatgpt.site"),
  title: "H!KINEX Commons - Employee Hub Concept",
  description: "A community-first H!KINEX Employee Hub concept connecting people, company updates and work tools.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "H!KINEX Commons", description: "Your people, company and work in one welcoming employee homebase." },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
