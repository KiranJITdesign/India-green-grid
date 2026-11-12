import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/components/RoleContext";
import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";

export const metadata: Metadata = {
  title: "India Green Grid — Renewable Energy Decision-Support Platform",
  description:
    "Empowering citizens, DISCOMs and policymakers for a cleaner, renewable and sustainable India. Powered by official 2026 CEA, MNRE & CCEA data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f3f6f4] text-slate-900 min-h-screen font-sans selection:bg-emerald-500 selection:text-white">
        <RoleProvider>
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Sidebar matching reference image */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <TopHeader />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                {children}
              </main>
            </div>
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
