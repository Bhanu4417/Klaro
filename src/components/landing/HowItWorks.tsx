"use client";

import React from "react";
import { Camera, ScanText, Scale, FileText, CheckCircle2 } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "CAPTURE",
      icon: Camera,
      heading: "Photograph or Upload Package",
      desc: "Officers photograph physical packaged goods or upload e-commerce listing screenshots directly from mobile or desktop.",
      badge: "Multi-Angle Input",
    },
    {
      num: "02",
      title: "EXTRACT",
      icon: ScanText,
      heading: "Optical Region Segmentation",
      desc: "Computer vision isolates key label panels, converting raw typography into structured key-value declarations with bounding box coordinates.",
      badge: "OCR & Text Detection",
    },
    {
      num: "03",
      title: "VALIDATE",
      icon: Scale,
      heading: "Legal Metrology Rule Engine",
      desc: "Automated engine cross-references extracted declarations against Legal Metrology Act 2009 and LMPC Rules 2011 requirements.",
      badge: "Rule Engine Audit",
    },
    {
      num: "04",
      title: "REPORT",
      icon: FileText,
      heading: "Generate Digital Evidence Dossier",
      desc: "Produces an official compliance report highlighting detected violations, missing declarations, and visual proof for administrative action.",
      badge: "Court-Ready PDF",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#E6E4E5] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEAEB] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
            <Scale className="w-3.5 h-3.5 text-[#417F14]" />
            <span>Standardized Inspection Pipeline</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            How the platform works.
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl mx-auto font-normal">
            A seamless four-stage computer vision and compliance workflow designed specifically for enforcement field officers.
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-[22px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6 hover:border-zinc-400 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#346415] bg-[#EAFBD9] border border-[#B8F27D] px-2.5 py-0.5 rounded-full">
                      STEP {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] flex items-center justify-center text-zinc-800 group-hover:bg-[#94EC40] group-hover:border-[#94EC40] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-950 tracking-tight">
                      {step.heading}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mt-1.5">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ECEAEB] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>{step.badge}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#417F14]" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
