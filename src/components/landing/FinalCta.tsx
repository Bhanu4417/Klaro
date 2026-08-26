"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Scale, FileCheck2 } from "lucide-react";
import { Button } from "../ui/Button";

export const FinalCta: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#E6E4E5] relative overflow-hidden select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-[32px] bg-[#0B0B0D] border border-zinc-800 p-8 sm:p-14 lg:p-16 text-center space-y-6 sm:space-y-8 shadow-[0_24px_70px_rgba(0,0,0,0.4)] relative overflow-hidden">
          
          {/* Subtle Ambient Dot Grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="finalLegalCtaMatrix" width="12" height="12" patternUnits="userSpaceOnUse">
                  <rect x="5" y="5" width="2" height="2" fill="#71717A" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#finalLegalCtaMatrix)" />
            </svg>
          </div>

          {/* Pill Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-xs font-semibold text-[#94EC40] shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#94EC40]" />
            <span className="font-mono text-[11px] uppercase tracking-wider">NEXT-GEN LEGAL METROLOGY ENFORCEMENT</span>
          </div>

          {/* Headline */}
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-[800] text-white tracking-[-0.035em] leading-[1.12]"
              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
            >
              Make every inspection count.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto font-normal">
              Capture. Validate. Document. Build a clearer, automated, and tamper-proof picture of packaged commodity compliance.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/login">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 text-[rgb(18,18,18)]" />}
                className="font-[700] text-[15px] bg-[#94EC40] text-[rgb(18,18,18)] hover:bg-[#83D634] shadow-[0_4px_24px_rgba(148,236,64,0.4)] tracking-tight px-8 py-4 rounded-2xl"
              >
                Start an inspection
              </Button>
            </Link>
            
            <a
              href="#compliance-analysis"
              className="px-6 py-3.5 rounded-2xl text-[14px] font-[600] text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 transition-all text-center"
            >
              Explore compliance rules
            </a>
          </div>

          {/* Trust markers */}
          <div className="relative z-10 pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
            <span>✓ Legal Metrology Act, 2009 Compliant</span>
            <span>✓ LMPC Rules 2011 Rule Engine</span>
            <span>✓ Instant Evidence Dossier Export</span>
          </div>

        </div>

      </div>
    </section>
  );
};
