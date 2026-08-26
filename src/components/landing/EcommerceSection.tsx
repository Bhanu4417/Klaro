"use client";

import React from "react";
import { Globe, Link as LinkIcon, CheckCircle2, Shield, ArrowRight, ShoppingBag } from "lucide-react";

export const EcommerceSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#ECEAEB] border-y border-[#D5D2D4] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Context & E-Commerce Mandate */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E4E5] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
              <Globe className="w-3.5 h-3.5 text-[#417F14]" />
              <span>Digital Marketplace Surveillance</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[42px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
            >
              Auditing digital marketplaces under Rule 6(10).
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              Pre-packaged goods sold on e-commerce platforms must display mandatory declarations on the digital product page before consumer purchase. Klaro crawls, parses, and audits product listings automatically.
            </p>

            <div className="space-y-3">
              {[
                "Instant URL scraping of e-commerce marketplace product listings",
                "Automated detection of Country of Origin, Expiry, and Unit Sale Price",
                "Flagging deceptive digital images where mandatory panels are obscured",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#EAFBD9] border border-[#B8F27D] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#346415]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Visual URL & Marketplace Analysis Widget */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-lg bg-[#0B0B0D] rounded-[24px] border border-zinc-800 p-6 sm:p-7 text-white shadow-xl text-left font-mono space-y-4">
              
              {/* URL Input Simulation Bar */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center gap-2.5 text-xs">
                <LinkIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="text-zinc-300 truncate font-sans text-[11px] sm:text-xs">
                  https://marketplace.in/dp/B09X12345/organic-honey-500g
                </span>
                <span className="shrink-0 text-[10px] bg-[#94EC40] text-zinc-950 font-bold px-2 py-0.5 rounded font-mono">
                  PARSED
                </span>
              </div>

              {/* Extracted Digital Declaration Audit */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-bold">DIGITAL LISTING COMPLIANCE</span>
                  <span className="text-[#94EC40] font-bold">✓ 100% COMPLIANT</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Country of Origin:</span>
                    <span className="text-white font-bold">India (Declared on PDP)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Unit Sale Price (USP):</span>
                    <span className="text-white font-bold">₹0.64 / g (Explicitly Stated)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Manufacturer Name:</span>
                    <span className="text-white font-bold">Himalayan Organic Bee Farms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Best Before / Expiry:</span>
                    <span className="text-white font-bold">18 Months from Packing</span>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="text-[10px] text-zinc-400 font-sans flex items-center justify-between pt-1">
                <span>Rule 6(10) E-Commerce Mandate Verified</span>
                <span className="text-[#94EC40] font-mono">Audit ID #ECOM-1082</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
