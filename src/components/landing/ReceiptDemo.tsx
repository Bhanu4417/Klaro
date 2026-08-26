"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Printer, Sparkles, Check, FileText, ArrowDown, Share2 } from "lucide-react";

export const ReceiptDemo: React.FC = () => {
  const [isPrinted, setIsPrinted] = useState(true);

  return (
    <section id="receipt-experience" className="py-20 sm:py-28 bg-[#E6E4E5] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Conceptual Narrative */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEAEB] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
              <FileText className="w-3.5 h-3.5 text-[#417F14]" />
              <span>Physical Tactile Metaphor</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
            >
              Your digital food script. Printed with clarity.
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-lg">
              Every scan produces a tactile, receipt-style food script. Clean, honest, and stripped of corporate marketing jargon — giving you the raw truth about what’s going inside your body.
            </p>

            {/* Key Receipt Highlights */}
            <div className="space-y-3 pt-2">
              {[
                "Instant macro-nutrient breakdown (Calories, Fats, Carbs, Protein)",
                "Automated additive classification & synthetic chemical flags",
                "Shareable receipt cards to post directly into community feeds",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#EAFBD9] border border-[#B8F27D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#346415]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsPrinted(!isPrinted)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ECEAEB] hover:bg-white border border-[#D5D2D4] text-xs font-semibold text-zinc-800 transition-all shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-zinc-600" />
                <span>Re-print Sample Receipt</span>
              </button>
            </div>
          </div>

          {/* RIGHT: The Physical Scanner Machine & Emerging Thermal Receipt */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[400px] flex flex-col items-center">
              
              {/* Sleek Scanner Dispenser Top Slit */}
              <div className="w-full h-12 rounded-t-[20px] bg-[#0B0B0D] border-x border-t border-zinc-800 shadow-xl flex items-center justify-between px-6 z-20 relative">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#94EC40] animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                    KLARO THERMAL ENGINE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#94EC40]">READY</span>

                {/* Laser Dispenser Slit */}
                <div className="absolute bottom-0 left-6 right-6 h-1 bg-zinc-950 rounded-full shadow-inner" />
              </div>

              {/* Emerging Animated Receipt Paper */}
              <motion.div
                key={isPrinted ? "printed" : "reset"}
                initial={{ y: -80, opacity: 0.7 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-[#FCFCFB] text-zinc-900 border-x border-b border-[#D5D2D4] shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-7 relative font-mono text-left z-10"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), 96% 100%, 92% calc(100% - 10px), 88% 100%, 84% calc(100% - 10px), 80% 100%, 76% calc(100% - 10px), 72% 100%, 68% calc(100% - 10px), 64% 100%, 60% calc(100% - 10px), 56% 100%, 52% calc(100% - 10px), 48% 100%, 44% calc(100% - 10px), 40% 100%, 36% calc(100% - 10px), 32% 100%, 28% calc(100% - 10px), 24% 100%, 20% calc(100% - 10px), 16% 100%, 12% calc(100% - 10px), 8% 100%, 4% calc(100% - 10px), 0 100%)",
                }}
              >
                {/* Receipt Header */}
                <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-300">
                  <span className="text-base font-bold tracking-tight text-zinc-950 font-sans block">KLARO FOOD SCRIPT</span>
                  <span className="text-[10px] text-zinc-500">SCAN ID #2026-08-9412</span>
                  <span className="text-[10px] text-zinc-400 block">AUG 25, 2026 • 21:40 IST</span>
                </div>

                {/* Product Meta */}
                <div className="py-3 border-b border-dashed border-zinc-300 space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-900 font-sans">
                    <span>Artisan Oat Milk (Barista)</span>
                    <span>1000ml</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Category: Plant Dairy</span>
                    <span>Grade: A+</span>
                  </div>
                </div>

                {/* Nutrition Breakdown Table */}
                <div className="py-3 border-b border-dashed border-zinc-300 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>CALORIES</span>
                    <span>59 kcal / 100ml</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 text-[11px]">
                    <span>Total Fat</span>
                    <span>3.0 g</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 text-[11px]">
                    <span>Carbohydrates</span>
                    <span>6.6 g</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 text-[11px]">
                    <span>Sugars (Naturally Occurring)</span>
                    <span>1.2 g</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 text-[11px]">
                    <span>Protein</span>
                    <span>1.1 g</span>
                  </div>
                </div>

                {/* Ingredients & Flags */}
                <div className="py-3 border-b border-dashed border-zinc-300 space-y-1.5 text-xs">
                  <span className="font-bold text-zinc-900 block">INGREDIENTS LIST</span>
                  <p className="text-[10px] leading-relaxed text-zinc-600 font-sans">
                    Water, Swedish Oats (10%), Rapeseed Oil, Dipotassium Phosphate, Calcium Carbonate, Sea Salt.
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-[#346415]">
                    <span>ADDITIVES IDENTIFIED</span>
                    <span>0 HARMFUL</span>
                  </div>
                </div>

                {/* Barcode & Clean Score Stamp */}
                <div className="pt-4 pb-6 text-center space-y-3">
                  <div className="inline-block px-3 py-1 rounded border-2 border-dashed border-[#417F14] text-[#346415] font-bold text-xs">
                    ★ 96% CLEAN SCORE VERIFIED ★
                  </div>

                  {/* Clean Authentic Barcode */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center justify-center gap-[1.5px] h-8 px-3 py-1 bg-white border border-zinc-200 rounded-md">
                      <div className="w-[1.5px] h-7 bg-zinc-950" />
                      <div className="w-[1px] h-7 bg-transparent" />
                      <div className="w-[1.5px] h-7 bg-zinc-950" />
                      <div className="w-[2.5px] h-6 bg-zinc-950" />
                      <div className="w-[1px] h-6 bg-transparent" />
                      <div className="w-[1.5px] h-6 bg-zinc-950" />
                      <div className="w-[3px] h-6 bg-zinc-950" />
                      <div className="w-[1px] h-6 bg-transparent" />
                      <div className="w-[2px] h-6 bg-zinc-950" />
                      <div className="w-[1px] h-6 bg-zinc-950" />
                      <div className="w-[1.5px] h-6 bg-transparent" />
                      <div className="w-[3px] h-6 bg-zinc-950" />
                      <div className="w-[1px] h-6 bg-transparent" />
                      <div className="w-[2px] h-6 bg-zinc-950" />
                      <div className="w-[1.5px] h-6 bg-zinc-950" />
                      <div className="w-[1px] h-7 bg-transparent" />
                      <div className="w-[1.5px] h-7 bg-zinc-950" />
                      <div className="w-[1px] h-7 bg-transparent" />
                      <div className="w-[1.5px] h-7 bg-zinc-950" />
                      <div className="w-[1px] h-7 bg-transparent" />
                      <div className="w-[2px] h-6 bg-zinc-950" />
                      <div className="w-[1.5px] h-6 bg-transparent" />
                      <div className="w-[3px] h-6 bg-zinc-950" />
                      <div className="w-[1px] h-6 bg-zinc-950" />
                      <div className="w-[1.5px] h-6 bg-transparent" />
                      <div className="w-[2.5px] h-6 bg-zinc-950" />
                      <div className="w-[1.5px] h-7 bg-zinc-950" />
                      <div className="w-[1px] h-7 bg-transparent" />
                      <div className="w-[1.5px] h-7 bg-zinc-950" />
                    </div>
                    <span className="text-[9px] text-zinc-500 tracking-[0.2em] font-mono font-medium">7 394376 616035</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
