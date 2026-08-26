"use client";

import React, { useState } from "react";
import { UserProfile } from "../../types/auth";
import {
  Scan,
  Sparkles,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Bookmark,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Logo } from "../ui/Logo";

interface AuthenticatedAppPreviewProps {
  user: UserProfile;
  onSignOut: () => void;
}

export const AuthenticatedAppPreview: React.FC<AuthenticatedAppPreviewProps> = ({
  user,
  onSignOut,
}) => {
  const [saved, setSaved] = useState(true);
  const [isScanningSim, setIsScanningSim] = useState(false);

  const simulateScan = () => {
    setIsScanningSim(true);
    setTimeout(() => {
      setIsScanningSim(false);
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 text-left animate-fade-in">
      {/* Top User Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-paper-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-paper-200 border border-paper-300 flex items-center justify-center text-2xl overflow-hidden shadow-tactile-sm shrink-0">
            {user.avatarUrl.startsWith("data:") || user.avatarUrl.startsWith("http") ? (
              <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{user.avatarUrl || "🥑"}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-semibold text-charcoal-900 leading-tight">
                {user.displayName || "Alex Morgan"}
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-botanical-500" />
            </div>
            <p className="text-xs font-mono text-charcoal-500">
              {user.username || "@alexcooks"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-900 hover:bg-paper-200 transition-colors"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Daily Scanning Summary / Stat Strip */}
      <div className="grid grid-cols-3 gap-2 bg-zinc-100/70 p-3 rounded-2xl border border-zinc-200/60 text-center">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Scans</span>
          <p className="text-lg font-semibold text-[rgb(18,18,18)] font-sans">4</p>
        </div>
        <div className="space-y-0.5 border-x border-zinc-200">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Clean Score</span>
          <p className="text-lg font-semibold text-[#417F14] font-sans">96%</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Additives</span>
          <p className="text-lg font-semibold text-[rgb(18,18,18)] font-sans">0</p>
        </div>
      </div>

      {/* Scanned Food Card */}
      <div className="relative bg-zinc-50/70 rounded-2xl border border-zinc-200/60 p-4 space-y-3.5 shadow-sm">
        {/* Receipt Top Tag */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Badge variant="botanical" size="sm">
              <Sparkles className="w-3 h-3 text-[#417F14]" />
              <span>AI Verified Clean</span>
            </Badge>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">SCAN #2026-08</span>
        </div>

        {/* Product Details */}
        <div>
          <h3 className="text-base font-semibold text-[rgb(18,18,18)] font-sans tracking-tight">
            Artisan Oat Milk — Barista Blend
          </h3>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Barcode: 7 394376 616035 • 1000ml
          </p>
        </div>

        {/* Ingredient Breakdown */}
        <div className="bg-white p-3 rounded-xl border border-zinc-200/70 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-zinc-400 border-b border-zinc-100 pb-1">
            <span>Ingredients Analysis</span>
            <span className="text-[#417F14] font-semibold">100% Plant Based</span>
          </div>
          <p className="text-zinc-700 text-[11px] leading-relaxed">
            Water, Swedish Oats (10%), Rapeseed Oil, Dipotassium Phosphate, Calcium Carbonate, Sea Salt.
          </p>
        </div>

        {/* Macros Mini Bar */}
        <div className="grid grid-cols-4 gap-1 text-center text-[11px] py-1 bg-white rounded-xl border border-zinc-200/70">
          <div>
            <span className="text-zinc-400 text-[9px] uppercase font-mono block">Calories</span>
            <span className="font-semibold text-[rgb(18,18,18)]">59 kcal</span>
          </div>
          <div>
            <span className="text-zinc-400 text-[9px] uppercase font-mono block">Fat</span>
            <span className="font-semibold text-[rgb(18,18,18)]">3.0g</span>
          </div>
          <div>
            <span className="text-zinc-400 text-[9px] uppercase font-mono block">Carbs</span>
            <span className="font-semibold text-[rgb(18,18,18)]">6.6g</span>
          </div>
          <div>
            <span className="text-zinc-400 text-[9px] uppercase font-mono block">Protein</span>
            <span className="font-semibold text-[rgb(18,18,18)]">1.1g</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-[rgb(18,18,18)] font-medium py-1 px-2 rounded-lg hover:bg-zinc-100"
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-[rgb(18,18,18)] text-[rgb(18,18,18)]" : ""}`} />
            <span>{saved ? "Saved in Journal" : "Save Script"}</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-[rgb(18,18,18)] font-medium py-1 px-2 rounded-lg hover:bg-zinc-100"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Post to Feed</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={simulateScan}
          isLoading={isScanningSim}
          leftIcon={<Scan className="w-5 h-5" />}
          className="font-[600]"
        >
          {isScanningSim ? "Scanning Barcode..." : "Scan Food Product"}
        </Button>

        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={onSignOut}
          leftIcon={<LogOut className="w-4 h-4" />}
          className="font-[600]"
        >
          Sign Out & Return to Auth
        </Button>
      </div>
    </div>
  );
};
