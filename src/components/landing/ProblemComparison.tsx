"use client";

import React from "react";
import { AlertCircle, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Zap, Clock, FileSpreadsheet } from "lucide-react";

export const ProblemComparison: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#ECEAEB] border-y border-[#D5D2D4] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E4E5] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Enforcement Challenges & Transformation</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            Packaging compliance shouldn’t depend on manual inspection alone.
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Thousands of packaged commodities carry mandatory declarations that inspectors must verify for completeness, correctness, readability, and placement.
          </p>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Manual Inspection (The Bottleneck) */}
          <div className="lg:col-span-6 rounded-[24px] bg-white border border-[#D5D2D4] p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-700">
                  CURRENT MANUAL PROCESS
                </span>
                <span className="text-xs font-mono text-zinc-500 font-semibold">25–40 mins / inspection</span>
              </div>

              <h3 className="text-xl font-[700] text-zinc-900 tracking-tight">
                Slow, subjective, and prone to missed infractions
              </h3>

              <div className="space-y-3 pt-1">
                {[
                  {
                    title: "Manual Font Size Measurement",
                    desc: "Inspectors must physically gauge letter heights with calipers to verify Principal Display Panel (PDP) minimum millimeter thresholds.",
                  },
                  {
                    title: "Fragmented Rulebook Cross-Checks",
                    desc: "Cross-referencing multi-schedule exemptions, unit sale price formulas, and packing dates manually across LMPC amendments.",
                  },
                  {
                    title: "Paper Inspection Notes",
                    desc: "Handwritten memos and unstructured photos lack timestamped visual evidence coordinates, leading to legal contestation.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F6F6] border border-zinc-200">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">{item.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>High officer workload severely limits field audit capacity</span>
            </div>
          </div>

          {/* RIGHT: Klaro AI-Assisted Platform (The Solution) */}
          <div className="lg:col-span-6 rounded-[24px] bg-[#0B0B0D] border border-zinc-800 p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between text-left relative overflow-hidden">
            
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#94EC40]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#94EC40]">
                  KLARO LEGAL METROLOGY ENGINE
                </span>
                <span className="text-xs font-mono text-[#94EC40] font-bold">5 seconds / audit</span>
              </div>

              <h3 className="text-xl font-[700] text-white tracking-tight">
                Instant computer vision extraction with automated rule evaluation
              </h3>

              <div className="space-y-3 pt-1">
                {[
                  {
                    title: "Automated OCR & Region Localization",
                    desc: "Deep learning models isolate text bounding boxes, measuring declaration heights against surface area formulas instantly.",
                  },
                  {
                    title: "LMPC Rules 2011 Validation Engine",
                    desc: "Automated logic evaluates mandatory declarations: MRP, Net Qty, Manufacturer, Month/Year, and Consumer Care.",
                  },
                  {
                    title: "Court-Ready Digital Compliance Dossier",
                    desc: "Generates tamper-evident digital inspection summaries with cropped visual evidence and exact legal rule citations.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <CheckCircle2 className="w-4 h-4 text-[#94EC40] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 p-3 rounded-xl bg-[#94EC40]/10 border border-[#94EC40]/30 text-[#94EB41] text-xs font-bold font-mono flex items-center justify-between">
              <span>✓ 8x Increase in daily field inspection volume</span>
              <Zap className="w-4 h-4 text-[#94EC40]" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
