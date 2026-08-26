"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthView } from "../../types/auth";
import { AuthHeader } from "./AuthHeader";
import { TactileCard } from "../ui/TactileCard";
import { ArrowLeft } from "lucide-react";
import { IndiaMap } from "../community/IndiaMap";
import { cn } from "../../lib/utils";

interface AuthShellProps {
  view: AuthView;
  onBack?: () => void;
  showBack?: boolean;
  children: React.ReactNode;
  isFramed?: boolean;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  view,
  onBack,
  showBack = false,
  children,
  isFramed = false,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#E6E4E5] flex flex-col lg:flex-row overflow-x-hidden font-sans">
      {/* LEFT COLUMN: Existing Auth Experience (#E6E4E5 warm platinum background) */}
      <section
        aria-label="Authentication Form"
        className="w-full lg:w-1/2 xl:w-[46%] min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 relative z-10 bg-[#E6E4E5]"
      >
        <div
          className={cn(
            "w-full max-w-[430px] transition-all duration-300 relative",
            isFramed &&
              "p-3 rounded-[30px] bg-charcoal-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-charcoal-800"
          )}
        >
          {/* Frame camera notch if phone frame enabled */}
          {isFramed && (
            <div className="w-24 h-4 bg-charcoal-950 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-charcoal-800" />
            </div>
          )}

          <div className={cn("w-full space-y-4", isFramed && "bg-[#E6E4E5] rounded-[24px] p-2 sm:p-3")}>
            {/* Top Bar for Navigation */}
            {showBack && onBack && (
              <header className="flex items-center min-h-[24px] px-1 -mb-1">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 transition-colors p-1 rounded-xl hover:bg-[#DCD9DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </header>
            )}

            {/* Header with Title & Subtitle */}
            <AuthHeader view={view} />

            {/* Tactile Authentication Card (#E6E4E5 box) */}
            <TactileCard showReceiptBorder={view === "authenticated_preview"}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </TactileCard>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: Dedicated India Map with Matrix Background */}
      <section
        aria-label="Community Discovery Experience"
        className="hidden lg:flex lg:w-1/2 xl:w-[54%] min-h-screen p-3 lg:p-4 bg-[#E6E4E5] relative items-stretch select-none"
      >
        <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#0B0B0D] border border-zinc-800 shadow-[0_16px_40px_rgba(0,0,0,0.22)] flex items-center justify-center">
          <IndiaMap />
        </div>
      </section>
    </div>
  );
};
