"use client";

import React, { useState } from "react";
import { DATA_CITATIONS, SourceCitation } from "@/data/energyData";
import { Info, ExternalLink, ShieldCheck } from "lucide-react";

interface SourceTooltipProps {
  citationId?: keyof typeof DATA_CITATIONS | string;
  customCitation?: SourceCitation;
  inlineText?: string;
  className?: string;
}

export function SourceTooltip({
  citationId,
  customCitation,
  inlineText,
  className = "",
}: SourceTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const citation: SourceCitation | undefined =
    customCitation ||
    (citationId && DATA_CITATIONS[citationId]
      ? DATA_CITATIONS[citationId]
      : undefined);

  if (!citation) {
    return (
      <span className={`inline-flex items-center text-xs text-slate-400 ${className}`}>
        {inlineText || "[Source: Official Baseline]"}
      </span>
    );
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 transition-colors"
        title="View official government source citation"
        aria-label={`Source citation: ${citation.title}`}
      >
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>{inlineText || citation.shortLabel}</span>
      </button>

      {isOpen && (
        <div
          role="tooltip"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 md:w-80 p-3 rounded-lg bg-slate-900/95 border border-emerald-500/30 text-slate-200 shadow-2xl backdrop-blur-md text-xs pointer-events-auto transition-all animate-in fade-in zoom-in-95"
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-semibold text-emerald-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              Verified Govt Source ({citation.year})
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Ref #{citation.id}
            </span>
          </div>
          <p className="font-medium text-slate-100 leading-snug mb-1">
            {citation.title}
          </p>
          <p className="text-[11px] text-slate-400 mb-1.5">
            Published by: <span className="text-slate-300 font-medium">{citation.publisher}</span>
          </p>
          <p className="text-[11px] text-slate-300/90 leading-relaxed">
            {citation.description}
          </p>
          {citation.url && (
            <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Official Portal:</span>
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center gap-1"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </span>
  );
}
