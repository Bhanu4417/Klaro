"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { Menu, X, ArrowRight, User as UserIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export const Navbar: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Process", href: "#how-it-works" },
    { label: "Rules", href: "#compliance-analysis" },
    { label: "Evidence", href: "#evidence-engine" },
    { label: "Dossier", href: "#report-dossier" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 select-none flex justify-center pointer-events-none">
      
      {/* DESKTOP NAVBAR: Seamless CSS-interpolated MacBook Notch (Zero text-blur, Zero background flash) */}
      <div className="hidden lg:flex w-full justify-center pointer-events-auto">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300 ease-out will-change-transform",
            isScrolled
              ? "max-w-xl w-auto bg-[#FCFCFB]/98 backdrop-blur-md border-x border-b border-[#D5D2D4] rounded-b-[22px] px-4 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] gap-5"
              : "w-full max-w-7xl px-8 py-5 bg-transparent border-0 shadow-none gap-4"
          )}
        >
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2 group focus:outline-none shrink-0">
            <Logo size="sm" showText={false} />
            <span
              className={cn(
                "text-xl font-[800] text-[rgb(18,18,18)] tracking-[-0.03em] whitespace-nowrap transition-all duration-200",
                isScrolled ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[120px] opacity-100 mr-1"
              )}
              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
            >
              klaro
            </span>
          </Link>

          {/* Nav Links */}
          <nav
            className={cn(
              "flex items-center gap-1 transition-all duration-300",
              isScrolled
                ? "bg-transparent p-0 border-0 shadow-none"
                : "bg-[#ECEAEB]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D5D2D4] shadow-sm"
            )}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1 text-xs font-[600] text-zinc-600 hover:text-[rgb(18,18,18)] hover:bg-[#E6E4E5]/80 rounded-full transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isLoaded && isSignedIn ? (
              <Link href="/dashboard">
                <div
                  className={cn(
                    "flex items-center gap-2 p-1 pr-3 rounded-full transition-all border",
                    isScrolled
                      ? "bg-white border-[#D5D2D4] text-zinc-800 hover:border-zinc-400 shadow-sm"
                      : "bg-[#ECEAEB] border-[#D5D2D4] text-zinc-800 hover:border-zinc-400 shadow-sm"
                  )}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center text-xs">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-3 h-3 text-zinc-300" />
                    )}
                  </div>
                  <span className="text-[11.5px] font-[700]">Dashboard</span>
                </div>
              </Link>
            ) : (
              <>
                {/* Sign In text (Hidden in notch mode) */}
                <Link
                  href="/login"
                  className={cn(
                    "text-[13px] font-[600] text-zinc-700 hover:text-[rgb(18,18,18)] transition-all duration-200 whitespace-nowrap",
                    isScrolled ? "max-w-0 opacity-0 overflow-hidden px-0" : "max-w-[80px] opacity-100 px-2.5 py-1.5"
                  )}
                >
                  Sign in
                </Link>

                {/* Open Platform Action Button */}
                <Link href="/login">
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3 h-3 text-[rgb(18,18,18)]" />}
                    className={cn(
                      "bg-[#94EC40] text-[rgb(18,18,18)] hover:bg-[#83D634] font-[700] tracking-tight transition-all duration-200",
                      isScrolled
                        ? "text-[11.5px] py-1.5 px-3 rounded-xl shadow-sm"
                        : "text-[13px] py-2 px-4 rounded-xl shadow-sm"
                    )}
                  >
                    Open platform
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR (< lg screens) */}
      <div className="lg:hidden w-full px-4 py-3 pointer-events-auto flex items-center justify-between bg-[#E6E4E5]/90 backdrop-blur-md border-b border-[#D5D2D4]">
        <Link href="/" className="flex items-center gap-1.5 group focus:outline-none">
          <Logo size="sm" showText={false} />
          <span
            className="text-lg font-[800] text-[rgb(18,18,18)] tracking-tight"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            klaro
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isLoaded && isSignedIn ? (
            <Link href="/dashboard">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-zinc-300" />
                )}
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-lg bg-[#94EC40] text-[rgb(18,18,18)]">
                Inspect
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-[#ECEAEB] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 bg-[#ECEAEB] border-b border-[#D5D2D4] px-4 pt-3 pb-6 space-y-3 shadow-xl pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-bold text-zinc-700 hover:text-[rgb(18,18,18)] hover:bg-[#E6E4E5] rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#D5D2D4] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-bold text-zinc-800 rounded-xl bg-white border border-[#D5D2D4]"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-bold text-[rgb(18,18,18)] rounded-xl bg-[#94EC40] shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Start an inspection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
