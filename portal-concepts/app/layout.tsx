import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hikinex-portal-concepts.marianacruzuluaga.chatgpt.site"),
  title: "H!KINEX Employee Portal Concepts",
  description: "Compare seven interactive H!KINEX Employee Portal design directions across Employee, Manager and Admin roles.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "H!KINEX Employee Portal Concepts",
    description: "Seven directions. One clearer hub. Explore the interactive Employee, Manager and Admin prototypes.",
    images: [{ url: "/og.jpg", width: 1536, height: 1024, alt: "H!KINEX Employee Portal Concepts comparison" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "H!KINEX Employee Portal Concepts",
    description: "Seven directions. One clearer hub.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
