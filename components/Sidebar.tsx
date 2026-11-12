"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Sun,
  Briefcase,
  Coins,
  FileText,
  Menu,
  X,
  Leaf,
  ExternalLink,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "RPO Tracker", href: "/rpo-tracker", icon: BarChart3 },
    { label: "Solar Calculator", href: "/solar-calculator", icon: Sun },
    { label: "Green Jobs", href: "/jobs", icon: Briefcase },
    { label: "Green Finance", href: "/green-finance", icon: Coins },
    { label: "Policy & Insights", href: "/audits", icon: FileText },
  ];

  const officialPortals = [
    { label: "National Power Portal", href: "https://npp.gov.in/landing-home" },
    { label: "Ministry of Power", href: "https://www.powermin.gov.in/" },
    { label: "PM Surya Ghar", href: "https://pmsuryaghar.gov.in/#/" },
    { label: "Skill Council (SCGJ)", href: "https://sscgj.in/?utm_source=chatgpt.com" },
    { label: "IREDA Web Portal", href: "https://ireda.in/IredaWebPortal/" },
  ];

  const content = (
    <div className="flex flex-col justify-between h-full py-6 px-4 bg-[#073326] text-white overflow-y-auto">
      {/* Brand Header & Links */}
      <div>
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-2 mb-6 group"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Leaf className="w-5 h-5 fill-emerald-400 text-emerald-400" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
              India
            </span>
            <span className="font-bold text-sm tracking-tight text-emerald-400 block leading-tight">
              Green Grid
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#55d985] text-[#073326] shadow-sm font-bold"
                    : "text-emerald-100/80 hover:text-white hover:bg-emerald-900/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#073326]" : "text-emerald-300"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Official Government Portals Section */}
        <div className="mt-6 pt-5 border-t border-emerald-900/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 px-2 block mb-2">
            Official Portals ↗
          </span>
          <div className="space-y-1">
            {officialPortals.map((portal) => (
              <a
                key={portal.label}
                href={portal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-emerald-100/70 hover:text-white hover:bg-emerald-900/40 transition-all group"
              >
                <span className="truncate pr-1">{portal.label}</span>
                <ExternalLink className="w-3 h-3 text-emerald-400/70 group-hover:text-emerald-300 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Wind Turbine & Solar Watermark Illustration at bottom */}
      <div className="relative pt-4 overflow-hidden select-none pointer-events-none opacity-30 mt-4">
        <svg
          viewBox="0 0 200 100"
          className="w-full h-auto text-emerald-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M -10 90 Q 50 70, 110 80 T 210 75 L 210 100 L -10 100 Z"
            fill="rgba(16, 185, 129, 0.15)"
            stroke="none"
          />
          <line x1="45" y1="80" x2="45" y2="25" stroke="currentColor" strokeWidth="2" />
          <circle cx="45" cy="25" r="2.5" fill="currentColor" />
          <line x1="45" y1="25" x2="30" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="45" y1="25" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="45" y1="25" x2="45" y2="42" stroke="currentColor" strokeWidth="1.5" />

          <line x1="20" y1="85" x2="20" y2="42" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="42" r="2" fill="currentColor" />
          <line x1="20" y1="42" x2="10" y2="30" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="42" x2="30" y2="32" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="42" x2="20" y2="54" stroke="currentColor" strokeWidth="1" />

          <polygon
            points="70,88 105,80 130,86 95,96"
            fill="rgba(16, 185, 129, 0.2)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <line x1="88" y1="83" x2="112" y2="90" stroke="currentColor" strokeWidth="1" />
          <line x1="82" y1="92" x2="117" y2="81" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#073326] text-white sticky top-0 z-50 shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          <span className="font-extrabold text-sm text-white">India Green Grid</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-100 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-64 h-full bg-[#073326] shadow-2xl relative">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {content}
          </div>
        </div>
      )}

      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 min-h-screen sticky top-0 shadow-lg">
        {content}
      </aside>
    </>
  );
}
