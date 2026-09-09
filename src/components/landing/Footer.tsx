"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "../ui/Logo";
import { Shield } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#ECEAEB] border-t border-[#D5D2D4] py-12 sm:py-16 select-none text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#D5D2D4]">
          
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <span
                className="text-xl font-[800] text-[rgb(18,18,18)] tracking-[-0.03em]"
                style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
              >
                klaro
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#94EC40]" />
            </Link>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm">
              AI-assisted packaged commodity compliance checking for Legal Metrology enforcement. Formulated around the Legal Metrology Act, 2009 and LMPC Rules, 2011.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
              PLATFORM & AUDIT
            </span>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-zinc-700">
              <li>
                <a href="#how-it-works" className="hover:text-[rgb(18,18,18)] transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#compliance-analysis" className="hover:text-[rgb(18,18,18)] transition-colors">
                  Compliance Analysis
                </a>
              </li>
              <li>
                <a href="#evidence-engine" className="hover:text-[rgb(18,18,18)] transition-colors">
                  Evidence Engine
                </a>
              </li>
              <li>
                <a href="#enforcement-dashboard" className="hover:text-[rgb(18,18,18)] transition-colors">
                  Officer Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
              OFFICER ACCESS & LEGAL
            </span>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-zinc-700">
              <li>
                <Link href="/login" className="hover:text-[rgb(18,18,18)] transition-colors font-bold text-[#346415]">
                  Sign in to Inspector Portal →
                </Link>
              </li>
              <li>
                <a href="#report-dossier" className="hover:text-[rgb(18,18,18)] transition-colors">
                  Digital Inspection Dossier
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[rgb(18,18,18)] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <span className="text-zinc-500 text-[11px] font-mono">Developed for Smart India Hackathon (SIH 2026)</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <span>© {new Date().getFullYear()} Klaro Legal Metrology Intelligence.</span>
          <span className="font-mono text-[11px]">Enforcement Infrastructure for Packaged Commodities</span>
        </div>

      </div>
    </footer>
  );
};
