"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { Leaf, Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!loading) {
      if (!user && !isLoginPage) {
        // Enforce mandatory sign-in: Redirect unauthenticated users to /login
        const redirectQuery = pathname && pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : "";
        router.replace(`/login${redirectQuery}`);
      } else if (user && isLoginPage) {
        // Already authenticated: redirect away from /login to dashboard
        router.replace("/");
      }
    }
  }, [user, loading, isLoginPage, pathname, router]);

  // Loading indicator matching India Green Grid theme
  if (loading) {
    return (
      <div className="min-h-screen bg-[#073326] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
          <Leaf className="w-8 h-8 fill-emerald-400 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold mb-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#55d985]" />
          <span>India Green Grid</span>
        </div>
        <p className="text-xs text-emerald-100/60 font-medium">
          Verifying security clearance & grid credentials...
        </p>
      </div>
    );
  }

  // Not authenticated and trying to access protected route: show transition screen
  if (!user && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#073326] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4">
          <Leaf className="w-8 h-8 fill-emerald-400 text-emerald-400" />
        </div>
        <p className="text-sm font-bold text-white mb-1">Sign-In Mandatory</p>
        <p className="text-xs text-emerald-200/70">
          Redirecting to authentication portal...
        </p>
      </div>
    );
  }

  // Standalone Login screen (no dashboard chrome)
  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-[#f3f6f4] flex flex-col justify-center">
        {children}
      </main>
    );
  }

  // Authenticated: show full dashboard layout with Sidebar & Header
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
