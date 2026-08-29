"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KlaroBot } from "./KlaroBot";
import { cn } from "../../lib/utils";

/* Fun one-liners cycled under the loader — one random start per mount,
   then a fresh line every few seconds until the screen is done. */
const LOADER_MESSAGES = [
  "Counting additives you never asked for…",
  "Teaching labels to tell the truth…",
  "Warming up the barcode detective…",
  "Separating sugar from marketing…",
  "Consulting the ingredient oracle…",
  "Bribing a juice box for its secrets…",
  "Measuring your MRP in honesty units…",
  "Filing today's sneaky preservatives…",
  "Rinsing the fine print for you…",
  "Asking the snacks to confess…",
  "Cross-checking claims with reality…",
  "Sharpening the nutrition magnifier…",
  "Translating chemist into human…",
  "Hunting down hidden sugars…",
  "Polishing your food journal…",
  "Whispering with the preservatives…",
  "Auditing every gram, twice…",
  "Unspiking the marketing buzzwords…",
  "Checking what 'natural' really means…",
  "Wake-up call for sleepy labels…",
  "Doing push-ups between packages…",
  "Rounding up runaway additives…",
  "Sniffing out artificial colors…",
  "Negotiating with the fine print…",
  "Weighing claims against facts…",
  "Spotting star ingredients for you…",
  "Sweeping the shelves for truth…",
  "Bootstrapping the crunch calculator…",
  "Decoding E-numbers into plain talk…",
  "Giving misleading labels a timeout…",
  "Stretching before the scan sprint…",
  "Counting sheep, then additives…",
  "Tuning the freshness radar…",
  "Unwrapping today's food gossip…",
  "Prepping your community feed…",
  "Ironing out the ingredient list…",
  "Fetching fresher facts than labels…",
  "Jogging through the nutrient grid…",
  "Bottling some honesty for you…",
  "Almost there — labels behaving now…",
];

interface AuthLoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({
  message = "Connecting to Klaro…",
  submessage,
  className,
}) => {
  // Deterministic starting index for SSR hydration consistency
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // Pick random index on client mount, then cycle every 2.6s
    setIdx(Math.floor(Math.random() * LOADER_MESSAGES.length));
    const timer = setInterval(() => setIdx((i) => (i + 1) % LOADER_MESSAGES.length), 2600);
    return () => clearInterval(timer);
  }, []);

  const rotating = LOADER_MESSAGES[idx];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center select-none min-h-[260px]",
        className
      )}
    >
      {/* Bot doing its little loading workout */}
      <div className="relative flex items-center justify-center">
        <KlaroBot state="authenticating" size="lg" showShadow={true} interactive={false} />
      </div>

      <div className="mt-5 space-y-1.5">
        <p className="text-sm font-semibold text-[rgb(18,18,18)] tracking-tight font-satoshi">
          {message}
        </p>

        {/* Rotating fun line — fresh every few seconds */}
        <div className="h-5 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-xs text-zinc-500 font-saans"
            >
              {rotating}
            </motion.p>
          </AnimatePresence>
        </div>

        {submessage && <p className="text-xs text-zinc-400 font-mono">{submessage}</p>}
      </div>
    </div>
  );
};
