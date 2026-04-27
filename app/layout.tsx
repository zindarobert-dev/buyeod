import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "BuyEOD — Businesses owned by EOD techs",
  description:
    "A directory of businesses owned and operated by Explosive Ordnance Disposal technicians. Find and support EOD-owned companies across the country.",
  metadataBase: new URL("https://buyeod.co"),
  openGraph: {
    title: "BuyEOD",
    description: "Businesses owned by EOD techs.",
    url: "https://buyeod.co",
    siteName: "BuyEOD",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
