"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { KlaroBot } from "../auth/KlaroBot";

const Bar = ({ className }: { className?: string }) => (
  <div className={cn("h-3 rounded-full bg-[#ECEAEB] relative overflow-hidden", className)}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
  </div>
);

export const PostSkeleton: React.FC<{ count?: number; className?: string }> = ({ count = 3, className }) => (
  <>
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-[22px] border border-[#D5D2D4] bg-[#FCFCFB] px-4 py-3 shadow-[0_4px_18px_rgba(0,0,0,0.03)]"
      aria-label="Klaro is loading community posts"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#B8F27D] bg-[#EAFBD9] shadow-[0_4px_12px_rgba(148,235,65,0.2)]">
        <KlaroBot state="authenticating" size="sm" showShadow={false} interactive={false} />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-[900] tracking-tight text-zinc-900">Klaro is organizing the community feed…</p>
        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Syncing original posts and evidence</p>
      </div>
      <div className="ml-auto flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -3, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.14 }}
            className="h-1.5 w-1.5 rounded-full bg-[#65A52D]"
          />
        ))}
      </div>
    </motion.div>
    {Array.from({ length: count }).map((_, i) => (
      <motion.article
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12, duration: 0.35 }}
        className={cn(
          "rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 space-y-3",
          className
        )}
        aria-hidden
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#ECEAEB] overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <Bar className="w-24" />
          <Bar className="w-14" />
        </div>

        <Bar className="w-40 h-4" />
        <Bar className="w-4/5 h-4" />

        <Bar className="w-full" />
        <Bar className="w-11/12" />

        <div className="p-4 rounded-2xl bg-[#E4E2E3] space-y-2.5 border-[1.5px] border-[#D8D5D9]">
          <div className="flex items-center justify-between">
            <Bar className="w-32 !bg-[#D8D5D9]" />
            <Bar className="w-20 !bg-[#D8D5D9]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Bar className="w-full !bg-[#D8D5D9]" />
            <Bar className="w-full !bg-[#D8D5D9]" />
          </div>
          <Bar className="w-3/4 !bg-[#D8D5D9]" />
        </div>

        <div className="pt-1 flex items-center justify-between">
          <Bar className="w-24" />
          <div className="flex gap-2">
            <Bar className="w-16" />
            <Bar className="w-10" />
          </div>
        </div>
      </motion.article>
    ))}
  </>
);
