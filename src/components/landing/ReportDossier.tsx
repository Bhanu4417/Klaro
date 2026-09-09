"use client";

import React from "react";
import { FileText, Download, ShieldCheck, Check, Printer, QrCode } from "lucide-react";

export const ReportDossier: React.FC = () => {
  return (
    <section id="report-dossier" className="py-20 sm:py-28 bg-[#E6E4E5] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEAEB] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
              <FileText className="w-3.5 h-3.5 text-[#417F14]" />
              <span>Standardized Legal Output</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
            >
              From inspection to evidence-ready report.
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              Eliminate manual paperwork. Every inspection automatically compiles into an official Legal Metrology compliance dossier complete with visual evidence, OCR payloads, and statutory violation citations.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Instant PDF report generation with verifiable QR authentication",
                "Timestamped GPS geo-coordinates and high-resolution photo evidence",
                "Formatted legal notice drafts pre-populated with statutory rule sections",
                "Cryptographic digital hash to prevent post-inspection tampering",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#EAFBD9] border border-[#B8F27D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#346415]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#D5D2D4] text-xs font-bold text-zinc-800 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#346415]" />
                <span>Court Admissible Standard</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-xl bg-white rounded-[24px] border border-[#D5D2D4] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] space-y-6 text-left font-mono">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-zinc-900 gap-3">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">
                    GOVERNMENT OF INDIA • LEGAL METROLOGY ENFORCEMENT
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 font-sans tracking-tight">
                    COMMODITY INSPECTION REPORT #2026-8842
                  </h3>
                </div>
                <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  ⚠ NOTICE REQUIRED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F7F6F6] p-3.5 rounded-xl border border-zinc-200">
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">COMMODITY</span>
                  <span className="font-bold text-zinc-900 font-sans">Crisp Biscuits 500g</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">INSPECTED DATE</span>
                  <span className="font-bold text-zinc-900">26/08/2026</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">INSPECTOR ID</span>
                  <span className="font-bold text-zinc-900">#LM-OFFICER-441</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">LOCATION (GPS)</span>
                  <span className="font-bold text-zinc-900">28.6139° N, 77.2090° E</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase text-zinc-500 font-bold block">
                  STATUTORY VIOLATION SUMMARY (LMPC RULES 2011)
                </span>
                
                <div className="space-y-1.5">
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                    <span className="font-bold block">1. Rule 6(1)(d) Non-Compliance</span>
                    <span className="text-[11px] text-rose-800">Unit Sale Price not declared. Retail price declaration incomplete.</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                    <span className="font-bold block">2. Rule 6(1)(h) Non-Compliance</span>
                    <span className="text-[11px] text-rose-800">Consumer grievance contact details absent from packaging label.</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                    <span className="font-bold block">3. Rule 7 Font Size Discrepancy</span>
                    <span className="text-[11px] text-amber-800">Principal Display Panel numeral height measured at 2.2mm (Minimum 4.0mm required).</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-zinc-300 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">DIGITAL SIGNATURE HASH</span>
                  <span className="text-[10px] font-bold text-zinc-700 block truncate max-w-[200px] sm:max-w-xs">
                    SHA-256: 9f8e4b7c1a2d6e3f5a0b9c8d...
                  </span>
                  <span className="text-[10px] text-[#346415] font-bold">✓ Certified Inspection Dossier</span>
                </div>

                <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center text-white shrink-0 p-1.5 shadow-inner">
                  <QrCode className="w-full h-full text-white" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
