"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, FileCheck, Scale } from "lucide-react";
import { Button } from "../ui/Button";
import { HomeScanTrigger } from "./HomeScanTrigger";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36 overflow-hidden select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1
              className="text-4xl sm:text-6xl lg:text-[68px] xl:text-[74px] font-[800] leading-[1.06] text-[rgb(18,18,18)] tracking-[-0.035em]"
              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
            >
              Inspect smarter. Enforce faster.
            </h1>
            <p
              className="text-xl sm:text-2xl lg:text-[25px] font-[600] text-zinc-700 leading-snug tracking-tight max-w-3xl mx-auto"
              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif' }}
            >
              AI-powered packaged commodity compliance checking for Legal Metrology enforcement.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Automatically analyze packaged commodity photographs, extract mandatory declarations under the Legal Metrology (Packaged Commodities) Rules, 2011, identify violations, and generate digital inspection dossiers in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 text-[rgb(18,18,18)]" />}
                className="w-full sm:w-auto font-[700] text-[15px] bg-[#94EC40] text-[rgb(18,18,18)] hover:bg-[#83D634] shadow-[0_4px_20px_rgba(148,236,64,0.35)] tracking-tight px-8 py-4 rounded-2xl"
              >
                Start an inspection
              </Button>
            </Link>
            
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-[14px] font-[600] text-zinc-700 bg-[#ECEAEB] hover:bg-white border border-[#D5D2D4] transition-all text-center"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="pt-1"
          >
            <HomeScanTrigger />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-6 border-t border-[#D5D2D4] flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-[13px] text-zinc-500 font-medium"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#417F14]" />
              <span>Legal Metrology Act, 2009</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#417F14]" />
              <span>LMPC Rule 6 Compliance Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#417F14]" />
              <span>Court-Admissible Evidence</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
