"use client";

import React from "react";
import { LayoutDashboard, CheckCircle2, AlertTriangle, ShieldAlert, ArrowUpRight, BarChart3, Filter } from "lucide-react";

interface InspectionRecord {
  id: string;
  commodity: string;
  category: string;
  brand: string;
  status: "compliant" | "non_compliant" | "warning";
  violations: string;
  officer: string;
  zone: string;
  date: string;
}

const RECENT_RECORDS: InspectionRecord[] = [
  {
    id: "INSP-9041",
    commodity: "Whole Wheat Atta 10kg",
    category: "Food Grains",
    brand: "Annapurna Mills",
    status: "compliant",
    violations: "0 Violations (Full LMPC Compliance)",
    officer: "Insp. R. Sharma (#LM-441)",
    zone: "Delhi Central",
    date: "Today, 14:22",
  },
  {
    id: "INSP-9040",
    commodity: "Fruit Juice Concentrate 200ml",
    category: "Beverages",
    brand: "Tropical Blendz",
    status: "non_compliant",
    violations: "Rule 6(1)(d) MRP Missing USP • Rule 6(1)(h) Care Omission",
    officer: "Insp. V. Kumar (#LM-319)",
    zone: "Mumbai North",
    date: "Today, 13:10",
  },
  {
    id: "INSP-9039",
    commodity: "Laundry Detergent Powder 2kg",
    category: "Household",
    brand: "CleanMax Care",
    status: "warning",
    violations: "Rule 7 Font Size 2.5mm (Minimum 4.0mm required)",
    officer: "Insp. P. Joshi (#LM-582)",
    zone: "Bengaluru South",
    date: "Today, 11:45",
  },
  {
    id: "INSP-9038",
    commodity: "Herbal Green Tea 100g",
    category: "Confectionery",
    brand: "Veda Organics",
    status: "compliant",
    violations: "0 Violations (Full LMPC Compliance)",
    officer: "Insp. S. Sen (#LM-104)",
    zone: "Kolkata East",
    date: "Yesterday",
  },
];

export const EnforcementDashboard: React.FC = () => {
  return (
    <section id="enforcement-dashboard" className="py-20 sm:py-28 bg-[#ECEAEB] border-y border-[#D5D2D4] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E4E5] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
            <LayoutDashboard className="w-3.5 h-3.5 text-[#417F14]" />
            <span>Jurisdiction Overview</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            Built for Legal Metrology officers & administrators.
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl mx-auto font-normal">
            Track district-wide compliance trends, view recent field inspections, and monitor non-compliant brands across retail markets.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="bg-[#0B0B0D] rounded-[28px] border border-zinc-800 p-6 sm:p-8 lg:p-10 shadow-2xl text-left text-white space-y-8">
          
          {/* Metric KPIs Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                  ENFORCEMENT SUMMARY • ALL JURISDICTIONS
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                  Packaged Commodities Audit Status
                </h3>
              </div>
              <span className="text-xs font-mono text-[#94EC40] bg-[#94EC40]/10 px-3 py-1 rounded-full border border-[#94EC40]/25">
                LIVE METRICS
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">TOTAL INSPECTIONS</span>
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1 block">1,284</span>
                <span className="text-[10px] text-zinc-500 mt-1 block">+142 this week</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">COMPLIANT PACKAGES</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#94EC40] font-mono mt-1 block">1,107</span>
                <span className="text-[10px] text-zinc-500 mt-1 block">86.2% compliance rate</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">VIOLATIONS FLAGGED</span>
                <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono mt-1 block">177</span>
                <span className="text-[10px] text-zinc-500 mt-1 block">Notice drafts prepared</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">HIGH PRIORITY NOTICES</span>
                <span className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono mt-1 block">24</span>
                <span className="text-[10px] text-zinc-500 mt-1 block">Repeat manufacturer offenses</span>
              </div>
            </div>
          </div>

          {/* Recent Inspection Records Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                RECENT FIELD INSPECTIONS
              </span>
              <span className="text-xs text-zinc-400 font-mono">Filtered by: Most Recent</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-3 font-semibold">INSP ID</th>
                    <th className="pb-3 font-semibold">COMMODITY</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold">EVALUATION NOTES</th>
                    <th className="pb-3 font-semibold">OFFICER / ZONE</th>
                    <th className="pb-3 font-semibold text-right">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {RECENT_RECORDS.map((rec) => (
                    <tr key={rec.id} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="py-3.5 font-bold text-[#94EC40]">{rec.id}</td>
                      <td className="py-3.5">
                        <div className="font-sans font-bold text-white text-xs">{rec.commodity}</div>
                        <div className="text-[10px] text-zinc-500">{rec.brand}</div>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === "compliant"
                              ? "bg-[#94EC40]/15 text-[#94EB41] border border-[#94EC40]/30"
                              : rec.status === "warning"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {rec.status === "compliant" ? "COMPLIANT" : rec.status === "warning" ? "WARNING" : "VIOLATION"}
                        </span>
                      </td>
                      <td className="py-3.5 text-zinc-400 text-[11px] max-w-xs truncate">
                        {rec.violations}
                      </td>
                      <td className="py-3.5 text-[11px]">
                        <div className="text-zinc-300">{rec.officer}</div>
                        <div className="text-zinc-500 text-[10px]">{rec.zone}</div>
                      </td>
                      <td className="py-3.5 text-right text-zinc-500">{rec.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
