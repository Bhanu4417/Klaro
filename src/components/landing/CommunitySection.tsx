"use client";

import React from "react";
import Link from "next/link";
import { IndiaMap } from "../community/IndiaMap";
import { Users, ArrowRight, Sparkles, MessageSquareHeart, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";

export const CommunitySection: React.FC = () => {
  return (
    <section id="community" className="py-20 sm:py-28 bg-[#ECEAEB] border-y border-[#D5D2D4] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E4E5] border border-[#D5D2D4] text-xs font-semibold text-zinc-800">
            <Users className="w-3.5 h-3.5 text-[#417F14]" />
            <span>Collective Food Intelligence</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] leading-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            Food stories, shared around you.
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Discover what real people are eating, uncovering, and learning from every scan across the country.
          </p>
        </div>

        {/* The Live Interactive India Map Experience */}
        <div className="w-full rounded-[28px] overflow-hidden bg-[#0B0B0D] border border-zinc-800 shadow-[0_24px_60px_rgba(0,0,0,0.35)] relative">
          <div className="w-full h-[520px] sm:h-[580px] lg:h-[640px] flex items-center justify-center relative">
            <IndiaMap />
          </div>
        </div>

        {/* 3 Step Community Ripple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 text-left">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D5D2D4] shadow-sm space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#417F14] uppercase block">STEP 01 • DISCOVER</span>
            <h4 className="text-base font-bold text-zinc-900">Uncover hidden ingredients</h4>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Scan packaged foods at the supermarket, kitchen pantry, or dining table to instantly reveal true sugar and additive counts.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D5D2D4] shadow-sm space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#417F14] uppercase block">STEP 02 • SHARE</span>
            <h4 className="text-base font-bold text-zinc-900">Post surprising insights</h4>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Publish your scan discoveries to the community map with your reaction notes, rating flags, and real-world nutrition advice.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D5D2D4] shadow-sm space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#417F14] uppercase block">STEP 03 • GROW</span>
            <h4 className="text-base font-bold text-zinc-900">Protect each other</h4>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              When thousands scan together, deceptive brands lose the ability to hide harmful chemicals behind slick packaging.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
