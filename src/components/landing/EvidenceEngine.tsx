"use client";

import React from "react";
import { Eye, ShieldCheck, Crosshair, FileCheck2, Search, Check, AlertTriangle } from "lucide-react";

export const EvidenceEngine: React.FC = () => {
  const evidencePoints = [
    {
      id: "ev_1",
      tag: "VIOLATION #1 • RULE 6(1)(d)",
      title: "Unit Sale Price (USP) Omission",
      ocrDetected: "MRP ₹120.00 (Mfd: 07/2026)",
      location: "Bottom Right PDP • Bounding Box (x: 420, y: 710, w: 180, h: 45)",
      legalBasis: "LMPC Amendment 2021 mandates Unit Sale Price (₹ per g / ₹ per ml) for all pre-packaged commodities.",
      severity: "High",
    },
    {
      id: "ev_2",
      tag: "VIOLATION #2 • RULE 6(1)(h)",
      title: "Consumer Care Contact Absence",
      ocrDetected: "[EMPTY REGION - 0 CONTACT DATA]",
      location: "Back Panel • Bounding Box (x: 50, y: 620, w: 320, h: 90)",
      legalBasis: "Mandatory declaration of email address, phone number, and name of grievance officer missing from label.",
      severity: "High",
    },
    {
      id: "ev_3",
      tag: "WARNING #1 • RULE 7 & 8",
      title: "Principal Display Panel Numeral Height",
      ocrDetected: "Net Qty '500g' Measured Height: 2.2mm",
      location: "Front PDP • Bounding Box (x: 210, y: 380, w: 120, h: 30)",
      legalBasis: "For package area > 100 cm² up to 500 cm², minimum numeral height must not be less than 4.0 mm.",
      severity: "Medium",
    },
  ];

  return (
    <section id="evidence-engine" className="py-20 sm:py-28 bg-[#E6E4E5] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEAEB] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
            <Crosshair className="w-3.5 h-3.5 text-[#417F14]" />
            <span>Auditable Visual Proof</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            Every infraction backed by visual evidence.
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Klaro is not a black-box AI. Every detected violation links directly to cropped pixel coordinates, extracted OCR strings, and the exact section of the Legal Metrology Act.
          </p>
        </div>

        {/* 3 Evidence Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {evidencePoints.map((ev) => (
            <div
              key={ev.id}
              className="p-6 rounded-[24px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_8px_24px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between hover:border-zinc-400 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                    {ev.tag}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 font-bold uppercase">
                    SEVERITY: {ev.severity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-950 tracking-tight">
                  {ev.title}
                </h3>

                {/* Cropped OCR Snippet Box */}
                <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-zinc-800 pb-1">
                    <span>EXTRACTED OCR PAYLOAD</span>
                    <span className="text-[#94EC40]">CONFIDENCE 99.2%</span>
                  </div>
                  <p className="text-[#94EC40] font-bold text-[11px] pt-1">{ev.ocrDetected}</p>
                  <p className="text-[10px] text-zinc-400">{ev.location}</p>
                </div>

                {/* Legal Metrology Law Citation */}
                <div className="p-3 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase block">
                    LEGAL BASIS & CITATION
                  </span>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    {ev.legalBasis}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#ECEAEB] flex items-center justify-between text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#346415]" />
                  <span>Logged in digital dossier</span>
                </span>
                <span className="font-mono text-[10px]">Tamper-Proof ✓</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
