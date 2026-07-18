import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grandberry · Love, close at hand",
  description: "A gentle place for families to feel connected, every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
