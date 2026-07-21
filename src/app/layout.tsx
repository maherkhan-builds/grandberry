import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "GlowPoint · Point. Glow. Create.",
  description: "Turn your fingertip into a cinematic light source, live and on-device.",
  openGraph: {
    title: "GlowPoint · Point. Glow. Create.",
    description: "Turn your fingertip into a cinematic light source, live and on-device.",
    images: ["/og.jpg"],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
