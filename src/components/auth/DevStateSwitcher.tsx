"use client";

import React, { useState } from "react";
import { AuthView } from "../../types/auth";
import { Sliders, Check, AlertTriangle, Loader2, Smartphone, Monitor, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";

interface DevStateSwitcherProps {
  currentView: AuthView;
  onSelectView: (view: AuthView) => void;
  isLoading: boolean;
  onToggleLoading: () => void;
  hasError: boolean;
  onToggleError: () => void;
  isFramed: boolean;
  onToggleFramed: () => void;
}

export const DevStateSwitcher: React.FC<DevStateSwitcherProps> = ({
  currentView,
  onSelectView,
  isLoading,
  onToggleLoading,
  hasError,
  onToggleError,
  isFramed,
  onToggleFramed,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const views: { id: AuthView; label: string }[] = [
    { id: "welcome", label: "Entry Screen" },
    { id: "signin", label: "Sign In" },
    { id: "signup", label: "Sign Up" },
    { id: "forgot_password", label: "Forgot Password" },
    { id: "reset_sent", label: "Reset Sent" },
    { id: "onboarding", label: "Onboarding" },
    { id: "authenticated_preview", label: "Feed Preview" },
  ];

  return (
    <aside aria-label="UX State Explorer Toolbar" className="fixed bottom-4 right-4 z-50 select-none">
      <div className="bg-charcoal-950/95 text-paper-50 backdrop-blur-md rounded-2xl border border-charcoal-800/80 shadow-tactile-lg overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-3 px-3.5 py-2.5 w-full text-xs font-mono tracking-tight text-paper-200 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#94EC40]" />
            <span className="font-sans font-semibold text-xs">UX State Explorer</span>
            <span className="text-[10px] bg-zinc-800 text-[#94EC40] px-1.5 py-0.5 rounded-md font-mono">
              {currentView}
            </span>
          </div>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {isOpen && (
          <div className="p-3.5 pt-1 border-t border-zinc-800/60 space-y-3 max-w-xs text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1.5">
                Authentication Views
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {views.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      onSelectView(v.id);
                    }}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-left text-[11px] font-sans transition-all flex items-center justify-between",
                      currentView === v.id
                        ? "bg-[#94EC40] text-[rgb(18,18,18)] font-semibold shadow-sm"
                        : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    )}
                  >
                    <span>{v.label}</span>
                    {currentView === v.id && <Check className="w-3 h-3 text-[rgb(18,18,18)]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-charcoal-800/80 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-charcoal-400 block">
                Simulations & Frame
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={onToggleLoading}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-sans flex items-center gap-1.5 border transition-all",
                    isLoading
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : "bg-charcoal-900 text-charcoal-400 border-charcoal-800 hover:text-white"
                  )}
                >
                  <Loader2 className={cn("w-3 h-3", isLoading && "animate-spin")} />
                  <span>Loading: {isLoading ? "ON" : "OFF"}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleError}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-sans flex items-center gap-1.5 border transition-all",
                    hasError
                      ? "bg-red-500/20 text-red-300 border-red-500/50"
                      : "bg-charcoal-900 text-charcoal-400 border-charcoal-800 hover:text-white"
                  )}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Error: {hasError ? "ON" : "OFF"}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleFramed}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-sans flex items-center gap-1.5 border transition-all",
                    isFramed
                      ? "bg-botanical-500/20 text-botanical-300 border-botanical-500/50"
                      : "bg-charcoal-900 text-charcoal-400 border-charcoal-800 hover:text-white"
                  )}
                >
                  {isFramed ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  <span>{isFramed ? "Phone Frame" : "Fluid Layout"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
