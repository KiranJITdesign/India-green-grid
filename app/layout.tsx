import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/components/RoleContext";
import { Navbar } from "@/components/Navbar";
import { ContextBanner } from "@/components/ContextBanner";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "India Green Grid — 2026 Renewable Energy Decision-Support Platform",
  description:
    "Role-based renewable energy transition platform for Citizens, DISCOMs, and Policymakers. Powered by official 2026 CEA, MNRE & CCEA data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
        <RoleProvider>
          <ContextBanner />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </RoleProvider>
      </body>
    </html>
  );
}
