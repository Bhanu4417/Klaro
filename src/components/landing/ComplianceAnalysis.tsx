"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Scale, FileText, Check, Eye } from "lucide-react";

interface InspectionSample {
  id: string;
  name: string;
  category: string;
  weight: string;
  status: "non_compliant" | "compliant";
  score: number;
  violations: number;
  warnings: number;
  declarations: {
    label: string;
    value: string;
    rule: string;
    state: "pass" | "warn" | "fail";
    detail: string;
  }[];
}

const INSPECTION_SAMPLES: InspectionSample[] = [
  {
    id: "sample_1",
    name: "Crisp Malt Biscuits",
    category: "Food & Confectionery",
    weight: "500 g",
    status: "non_compliant",
    score: 68,
    violations: 2,
    warnings: 2,
    declarations: [
      {
        label: "Manufacturer / Packer Details",
        value: "ABC Foods Pvt. Ltd., Okhla-III, New Delhi - 110020",
        rule: "Rule 6(1)(a)",
        state: "pass",
        detail: "Complete registered address and corporate identity verified.",
      },
      {
        label: "Net Quantity & Standard Unit",
        value: "500 g (Gram metric unit)",
        rule: "Rule 6(1)(e)",
        state: "pass",
        detail: "Standard symbol (g) adhering to Second Schedule specifications.",
      },
      {
        label: "Maximum Retail Price (MRP)",
        value: "₹120.00",
        rule: "Rule 6(1)(d)",
        state: "warn",
        detail: "Missing mandatory 'Inclusive of all taxes' & Unit Sale Price (₹0.24/g).",
      },
      {
        label: "Month & Year of Packing",
        value: "07/2026",
        rule: "Rule 6(1)(f)",
        state: "pass",
        detail: "Two-digit month and four-digit year clearly marked.",
      },
      {
        label: "Consumer Care Contact",
        value: "Not Detected",
        rule: "Rule 6(1)(h)",
        state: "fail",
        detail: "Missing dedicated phone number, email ID, and postal address for grievance.",
      },
      {
        label: "Principal Display Panel (PDP) Height",
        value: "2.2 mm font size",
        rule: "Rule 7 & 8",
        state: "warn",
        detail: "Letter height 2.2mm is below 4.0mm minimum required for >200g up to 500g.",
      },
    ],
  },
  {
    id: "sample_2",
    name: "Pure Mustard Cooking Oil",
    category: "Edible Oils & Commodities",
    weight: "1 Litre (910 g)",
    status: "compliant",
    score: 98,
    violations: 0,
    warnings: 0,
    declarations: [
      {
        label: "Manufacturer & FSSAI License",
        value: "Kisan Agro Products, Jaipur, Rajasthan",
        rule: "Rule 6(1)(a)",
        state: "pass",
        detail: "Name, address, and packer identification fully declared.",
      },
      {
        label: "Net Quantity (Dual Unit)",
        value: "1 L / 910 g (Volume and Mass)",
        rule: "Rule 6(1)(e)",
        state: "pass",
        detail: "Correct dual declaration in volume and mass compliant with oil mandates.",
      },
      {
        label: "MRP with Unit Sale Price",
        value: "₹185.00 (Incl. of all taxes) • USP: ₹0.185/ml",
        rule: "Rule 6(1)(d)",
        state: "pass",
        detail: "Unit Sale Price and tax inclusion explicitly stated.",
      },
      {
        label: "Consumer Care Contact",
        value: "support@kisanagro.in | 1800-11-2233",
        rule: "Rule 6(1)(h)",
        state: "pass",
        detail: "Operational toll-free number and verified support email.",
      },
    ],
  },
];

export const ComplianceAnalysis: React.FC = () => {
  const [activeSample, setActiveSample] = useState<InspectionSample>(INSPECTION_SAMPLES[0]);

  return (
    <section id="compliance-analysis" className="py-20 sm:py-28 bg-[#ECEAEB] border-y border-[#D5D2D4] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E4E5] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
            <Scale className="w-3.5 h-3.5 text-[#417F14]" />
            <span>Automated Rule Audit Demonstration</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            Real-time Legal Metrology validation.
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl mx-auto font-normal">
            See how optical character recognition and the rule engine cross-examine mandatory declarations against LMPC specifications.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {INSPECTION_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => setActiveSample(sample)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSample.id === sample.id
                  ? "bg-[#0B0B0D] text-white shadow-md"
                  : "bg-white text-zinc-700 hover:bg-[#E6E4E5] border border-[#D5D2D4]"
              }`}
            >
              {sample.name} ({sample.status === "compliant" ? "✓ Fully Compliant" : "⚠ Non-Compliant Case"})
            </button>
          ))}
        </div>

        <div className="bg-[#FCFCFB] rounded-[28px] border border-[#D5D2D4] p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0B0B0D] rounded-2xl border border-zinc-800 p-5 text-white space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono">
                  <span className="text-zinc-400 font-bold">SOURCE CAPTURE</span>
                  <span className="text-[#94EC40]">CAMERA SCAN #842</span>
                </div>

                <div className="h-64 sm:h-72 bg-zinc-900 rounded-xl border border-zinc-700/80 p-4 flex flex-col justify-between relative overflow-hidden text-left font-mono">
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">{activeSample.category}</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">{activeSample.name}</h4>
                    <span className="text-xs text-zinc-400">Declared Net Qty: {activeSample.weight}</span>
                  </div>

                  <div className="space-y-1.5 text-[9px]">
                    <div className="p-1 rounded bg-[#94EC40]/10 border border-[#94EC40]/50 text-[#94EC40]">
                      [MFG]: ABC Foods Pvt. Ltd. (Detected)
                    </div>
                    <div className="p-1 rounded bg-amber-500/10 border border-amber-500/50 text-amber-300">
                      [MRP]: ₹120.00 (Flagged: No USP)
                    </div>
                    <div className="p-1 rounded bg-rose-500/10 border border-rose-500/50 text-rose-300">
                      [CARE]: Missing Consumer Contact
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-[9px] text-zinc-500">
                    <span>PDP Area: 120 cm²</span>
                    <span>Min Font Req: 4.0mm</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">COMPLIANCE STATUS</span>
                    <span
                      className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                        activeSample.status === "compliant"
                          ? "bg-[#94EC40]/20 text-[#94EB41] border border-[#94EC40]/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {activeSample.status === "compliant" ? "✓ 100% COMPLIANT" : "⚠ NON-COMPLIANT"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">SCORE</span>
                    <span className="text-lg font-bold text-white font-mono">{activeSample.score}%</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] text-xs text-zinc-600 font-medium">
                <span>Summary: {activeSample.violations} violations and {activeSample.warnings} warnings recorded for inspector verification.</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D2D4]">
                <h3 className="text-base font-bold text-zinc-900">
                  Mandatory Declarations Audit (LMPC Rule 6)
                </h3>
                <span className="text-xs font-mono text-zinc-500 font-semibold">
                  6 of 6 Rules Evaluated
                </span>
              </div>

              <div className="space-y-3">
                {activeSample.declarations.map((decl, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      decl.state === "pass"
                        ? "bg-white border-zinc-200"
                        : decl.state === "warn"
                        ? "bg-amber-50/70 border-amber-200"
                        : "bg-rose-50/70 border-rose-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900">{decl.label}</span>
                          <span className="text-[10px] font-mono text-zinc-500 bg-[#ECEAEB] px-2 py-0.2 rounded font-semibold">
                            {decl.rule}
                          </span>
                        </div>
                        <p className="text-xs font-mono font-bold text-zinc-800 mt-1">
                          {decl.value}
                        </p>
                        <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                          {decl.detail}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {decl.state === "pass" && (
                          <div className="w-6 h-6 rounded-full bg-[#EAFBD9] border border-[#B8F27D] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-[#346415]" />
                          </div>
                        )}
                        {decl.state === "warn" && (
                          <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          </div>
                        )}
                        {decl.state === "fail" && (
                          <div className="w-6 h-6 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center">
                            <XCircle className="w-3.5 h-3.5 text-rose-700" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
