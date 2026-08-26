"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Sparkles, Check, AlertTriangle, ShieldAlert, ArrowRight, Zap } from "lucide-react";

interface SampleProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  emoji: string;
  score: number;
  status: "clean" | "warning" | "caution";
  summary: string;
  calories: string;
  sugar: string;
  additivesCount: number;
  highlightedConcern: string;
  ingredientsSnippet: string;
}

const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: "oat_milk",
    name: "Pure Oat Milk — Barista",
    category: "Plant Dairy",
    brand: "Nordic Harvest",
    emoji: "🌾",
    score: 96,
    status: "clean",
    summary: "Clean 6-ingredient formulation with no added sugar, thickeners, or seed oils.",
    calories: "59 kcal",
    sugar: "1.2g (natural)",
    additivesCount: 0,
    highlightedConcern: "None. All clean whole ingredients.",
    ingredientsSnippet: "Water, Swedish Oats (10%), Rapeseed Oil, Sea Salt, Calcium Carbonate.",
  },
  {
    id: "choc_spread",
    name: "Hazelnut Cocoa Cream",
    category: "Spreads & Breakfast",
    brand: "ChocoSweet Co.",
    emoji: "🍫",
    score: 31,
    status: "caution",
    summary: "Contains 56% refined sugar and hydrogenated palm oil. Ultra-processed formulation.",
    calories: "546 kcal",
    sugar: "56.3g (very high)",
    additivesCount: 4,
    highlightedConcern: "E471 emulsifier & disguised free sugars.",
    ingredientsSnippet: "Sugar, Palm Oil, Hazelnuts (13%), Skimmed Milk Powder (8.7%), Soy Lecithin, Vanillin.",
  },
  {
    id: "energy_bar",
    name: "Salted Caramel Protein Bar",
    category: "Fitness & Snacks",
    brand: "MaxPower Labs",
    emoji: "⚡",
    score: 72,
    status: "warning",
    summary: "Good protein content (20g) but uses synthetic sucralose and maltitol sugar alcohols.",
    calories: "218 kcal",
    sugar: "1.8g (4g polyols)",
    additivesCount: 3,
    highlightedConcern: "Maltitol may cause digestive discomfort.",
    ingredientsSnippet: "Milk Protein Blend, Isomalto-oligosaccharides, Maltitol, Cocoa Butter, Sucralose.",
  },
];

export const ScanDemo: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<SampleProduct>(SAMPLE_PRODUCTS[0]);
  const [activeStep, setActiveStep] = useState<"scan" | "analyze" | "understand">("understand");

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#ECEAEB] border-y border-[#D5D2D4] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E4E5] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
            <Scan className="w-3.5 h-3.5 text-[#417F14]" />
            <span>Instant Optical Intelligence</span>
          </div>
          
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            From package to understanding.
          </h2>
          
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Scan any product barcode or ingredient panel to turn tiny, confusing fine print into actionable nutrition clarity.
          </p>
        </div>

        {/* 3-Step Interactive Pipeline Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Step Progression & Interactive Product Tabs */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5D2D4] shadow-sm space-y-4 text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                TRY SCANNING A REAL PRODUCT
              </span>

              {/* Product Selector Chips */}
              <div className="flex flex-col gap-2">
                {SAMPLE_PRODUCTS.map((prod) => {
                  const isSelected = activeProduct.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setActiveProduct(prod)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                        isSelected
                          ? "bg-[#E6E4E5] border-zinc-700 shadow-sm"
                          : "bg-[#F7F6F6] border-zinc-200 hover:bg-[#ECEAEB]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-lg shadow-sm">
                          {prod.emoji}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 leading-tight">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] text-zinc-500 font-medium">{prod.brand}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                            prod.status === "clean"
                              ? "bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]"
                              : prod.status === "caution"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {prod.score}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 Step Indicators */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "scan", num: "01", title: "Scan", desc: "Camera lock" },
                { id: "analyze", num: "02", title: "Analyze", desc: "OCR parsing" },
                { id: "understand", num: "03", title: "Understand", desc: "Clean report" },
              ].map((step) => (
                <div
                  key={step.id}
                  className="p-3 rounded-xl bg-white border border-[#D5D2D4] text-left shadow-sm"
                >
                  <span className="text-[10px] font-mono text-[#417F14] font-bold block">{step.num}</span>
                  <h5 className="text-xs font-bold text-zinc-900 mt-0.5">{step.title}</h5>
                  <span className="text-[10px] text-zinc-500">{step.desc}</span>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: Live Visual Interactive Scanning Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, scale: 0.98, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -6 }}
                transition={{ duration: 0.25 }}
                className="bg-[#0B0B0D] border border-zinc-800 rounded-[28px] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden text-left"
              >
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl">
                      {activeProduct.emoji}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {activeProduct.name}
                      </h3>
                      <span className="text-xs text-zinc-400">{activeProduct.category}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">HEALTH SCORE</span>
                    <span
                      className={`text-sm sm:text-base font-bold font-mono px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                        activeProduct.status === "clean"
                          ? "bg-[#94EC40]/15 text-[#94EB41] border border-[#94EC40]/30"
                          : activeProduct.status === "caution"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {activeProduct.score}/100
                    </span>
                  </div>
                </div>

                {/* Macro Nutrition Specs */}
                <div className="grid grid-cols-3 gap-3 my-5">
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">ENERGY</span>
                    <span className="text-sm font-bold text-white font-mono">{activeProduct.calories}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">SUGARS</span>
                    <span className="text-sm font-bold text-white font-mono">{activeProduct.sugar}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">ADDITIVES</span>
                    <span className="text-sm font-bold text-white font-mono">{activeProduct.additivesCount} Detected</span>
                  </div>
                </div>

                {/* Summary & Core Insight */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    {activeProduct.status === "clean" ? (
                      <Check className="w-4 h-4 text-[#94EB41]" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-xs font-bold text-zinc-200">Klaro Ingredient Breakdown</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
                    {activeProduct.summary}
                  </p>
                </div>

                {/* Ingredients OCR Snippet */}
                <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span className="truncate max-w-[280px] sm:max-w-md">
                    {activeProduct.ingredientsSnippet}
                  </span>
                  <span className="text-[#94EB41] font-semibold shrink-0 ml-2">Verified ✓</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
