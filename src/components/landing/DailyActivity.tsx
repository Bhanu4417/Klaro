"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface ActivityItem {
  id: string;
  time: string;
  emoji: string;
  name: string;
  category: string;
  calories: string;
  score: number;
  status: "clean" | "warning" | "flagged";
  note: string;
}

const DAILY_ACTIVITIES: ActivityItem[] = [
  {
    id: "act_1",
    time: "08:30 AM",
    emoji: "🥗",
    name: "Cold-Pressed Green Power Smoothie",
    category: "Breakfast • Whole Foods",
    calories: "180 kcal",
    score: 98,
    status: "clean",
    note: "100% whole fruits & greens. Zero added preservatives.",
  },
  {
    id: "act_2",
    time: "01:15 PM",
    emoji: "🍜",
    name: "Artisan Buckwheat Soba Noodles",
    category: "Lunch • Grains",
    calories: "420 kcal",
    score: 92,
    status: "clean",
    note: "Pure buckwheat flour with sea salt. Clean label verified.",
  },
  {
    id: "act_3",
    time: "04:45 PM",
    emoji: "🥤",
    name: "Zero Sparkling Wild Berry Soda",
    category: "Snacks • Beverage",
    calories: "5 kcal",
    score: 68,
    status: "warning",
    note: "Contains Acesulfame Potassium & Sucralose artificial sweeteners.",
  },
  {
    id: "act_4",
    time: "08:00 PM",
    emoji: "🍎",
    name: "Organic Dried Mango Strips",
    category: "Dinner • Dried Fruit",
    calories: "120 kcal",
    score: 95,
    status: "clean",
    note: "Single ingredient (Organic Mango). No added sulfur dioxide.",
  },
];

export const DailyActivity: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#E6E4E5] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEAEB] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
            <BookOpen className="w-3.5 h-3.5 text-[#417F14]" />
            <span>Effortless Nutrition Journal</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            See your day, at a glance.
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Every scan is automatically organized into your daily timeline. No calorie counting burnout — just raw, honest food scripts.
          </p>
        </div>

        {/* The Food Journal Timeline Container */}
        <div className="max-w-3xl mx-auto bg-[#FCFCFB] rounded-[24px] border border-[#D5D2D4] shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden text-left">
          
          {/* Summary Metric Header */}
          <div className="p-6 bg-[#ECEAEB] border-b border-[#D5D2D4] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D5D2D4] flex items-center justify-center text-lg shadow-sm">
                🥑
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                  DAILY LOG SUMMARY
                </span>
                <h4 className="text-base font-bold text-zinc-950 font-sans">
                  Today’s Nutrition Exposure
                </h4>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-center px-3 py-1.5 rounded-xl bg-white border border-[#D5D2D4]">
                <span className="text-zinc-500 block text-[10px]">SCANS</span>
                <span className="font-bold text-zinc-900 text-sm">7</span>
              </div>
              <div className="text-center px-3 py-1.5 rounded-xl bg-white border border-[#D5D2D4]">
                <span className="text-zinc-500 block text-[10px]">CALORIES</span>
                <span className="font-bold text-zinc-900 text-sm">1,840</span>
              </div>
              <div className="text-center px-3 py-1.5 rounded-xl bg-[#EAFBD9] border border-[#B8F27D]">
                <span className="text-[#346415] block text-[10px]">CLEAN SCORE</span>
                <span className="font-bold text-[#346415] text-sm">91%</span>
              </div>
            </div>
          </div>

          {/* Timeline Feed Items */}
          <div className="divide-y divide-zinc-200/80 p-4 sm:p-6 space-y-2">
            {DAILY_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="pt-3 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#ECEAEB]/40 p-3 rounded-2xl transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#ECEAEB] border border-[#D5D2D4] flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {act.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-500 font-semibold">{act.time}</span>
                      <span className="text-[11px] text-zinc-400">•</span>
                      <span className="text-[11px] text-zinc-500">{act.category}</span>
                    </div>
                    <h5 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                      {act.name}
                    </h5>
                    <p className="text-xs text-zinc-600 mt-0.5 max-w-md">{act.note}</p>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0 pl-14 sm:pl-0">
                  <span className="text-xs font-bold text-zinc-800 font-mono">{act.calories}</span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      act.status === "clean"
                        ? "bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {act.score}% Clean
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
