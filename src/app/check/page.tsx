"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { KlaroBot, BotState } from "../../components/auth/KlaroBot";
import logoImage from "../../assets/logo.png";
import {
  Sparkles,
  Eye,
  Scan,
  Smile,
  EyeOff,
  Keyboard,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function CheckDesignPage() {
  const [botState, setBotState] = useState<BotState>("idle");
  const [botSize, setBotSize] = useState<"sm" | "md" | "lg" | "xl" | "hero">("lg");
  const [glowColor, setGlowColor] = useState<string>("#94EC40");
  const [showShadow, setShowShadow] = useState<boolean>(true);
  const [interactiveTracking, setInteractiveTracking] = useState<boolean>(true);

  const [mockEmail, setMockEmail] = useState("");
  const [mockPassword, setMockPassword] = useState("");
  const [mockIsSubmitting, setMockIsSubmitting] = useState(false);
  const [mockSubmitted, setMockSubmitted] = useState(false);

  const statesList: { id: BotState; label: string; icon: any; desc: string }[] = [
    {
      id: "idle",
      label: "Idle / Natural",
      icon: Eye,
      desc: "Floating levitation, natural blinking, 3D mouse pupil tracking.",
    },
    {
      id: "typing",
      label: "Typing Reading",
      icon: Keyboard,
      desc: "Pupils read continuously left-to-right across the text line with downward focus.",
    },
    {
      id: "scanning",
      label: "Thinking / Query",
      icon: Scan,
      desc: "Floating neon ? badge appears above top-right with a curious head tilt.",
    },
    {
      id: "peek",
      label: "Password Peek",
      icon: EyeOff,
      desc: "Shy closed-eye micro expression when typing secret password.",
    },
    {
      id: "authenticating",
      label: "Rolling Circles",
      icon: RefreshCw,
      desc: "Spinning concentric neon rings inside the high-gloss visor screen.",
    },
    {
      id: "happy",
      label: "Success / Happy",
      icon: Smile,
      desc: "Celebratory bouncing hover with curved ^ ^ happy arc eyes.",
    },
    {
      id: "error",
      label: "Denied / Alert",
      icon: AlertTriangle,
      desc: "Warning pulse with rapid lateral head-shake denial animation.",
    },
  ];

  const colorPalettes = [
    { label: "Klaro Bio-Green", color: "#94EC40" },
    { label: "Cyber Lime", color: "#A3E635" },
    { label: "Emerald Clean", color: "#10B981" },
    { label: "Electric Cyan", color: "#06B6D4" },
    { label: "Solar Amber", color: "#F59E0B" },
    { label: "Ultra Violet", color: "#A855F7" },
  ];

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMockIsSubmitting(true);
    setBotState("authenticating");

    setTimeout(() => {
      setMockIsSubmitting(false);
      setMockSubmitted(true);
      setBotState("happy");

      setTimeout(() => {
        setMockSubmitted(false);
        setBotState("idle");
      }, 3500);
    }, 1800);
  };

  return (
    <div className="min-h-screen w-full bg-[#08080A] text-zinc-100 font-sans selection:bg-[#94EC40] selection:text-black">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#0B0B0E]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/80 flex items-center justify-center shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94EC40] shadow-[0_0_8px_#94EC40]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white font-satoshi">
                Klaro Bot Design Laboratory
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#94EC40]/15 text-[#94EC40] border border-[#94EC40]/30">
                /check
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Compact 1:1 Squircle Mascot (Shape of logo.png)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            <span>View Live Login</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#94EC40]" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#94EC40] hover:bg-[#85DF32] text-black text-xs font-bold transition-all shadow-[0_0_16px_rgba(148,236,64,0.3)]"
          >
            <span>Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-7 flex flex-col justify-between rounded-[32px] bg-[#0E0E12] border border-zinc-800/90 p-6 sm:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[110px] pointer-events-none opacity-20 transition-all duration-700"
              style={{ backgroundColor: glowColor }}
            />

            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(${glowColor} 1px, transparent 1px), linear-gradient(90deg, ${glowColor} 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: glowColor }} />
                <span>STATE: {botState.toUpperCase()}</span>
              </div>

              <span className="text-xs text-zinc-500 font-mono">
                {interactiveTracking ? "✦ Move cursor to steer eyes" : "✦ Static view"}
              </span>
            </div>

            <div className="relative z-10 my-8 sm:my-14 flex flex-col items-center justify-center min-h-[220px]">
              <KlaroBot
                state={botState}
                size={botSize}
                glowColor={glowColor}
                showShadow={showShadow}
                interactive={interactiveTracking}
                onClick={() => {
                  const states: BotState[] = ["idle", "scanning", "authenticating", "happy", "peek", "typing", "error"];
                  const nextIdx = (states.indexOf(botState) + 1) % states.length;
                  setBotState(states[nextIdx]);
                }}
              />

              <div className="mt-6 text-center">
                <p className="text-sm font-semibold text-zinc-300 font-satoshi">
                  {statesList.find((s) => s.id === botState)?.label}
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto font-mono mt-0.5">
                  {statesList.find((s) => s.id === botState)?.desc}
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 pt-4 border-t border-zinc-800/80">
              {statesList.map((st) => {
                const IconComponent = st.icon;
                const isActive = botState === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setBotState(st.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2.5 rounded-xl border text-[11px] font-semibold transition-all gap-1.5",
                      isActive
                        ? "bg-[#94EC40]/15 border-[#94EC40] text-[#94EC40] shadow-[0_0_12px_rgba(148,236,64,0.2)]"
                        : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    )}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[70px]">{st.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between rounded-[32px] bg-[#E6E4E5] text-zinc-900 p-6 sm:p-8 border border-zinc-300 shadow-[0_20px_50px_rgba(0,0,0,0.25)] relative">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-zinc-300/80 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 tracking-tight font-satoshi flex items-center gap-2">
                    <span>Live Auth Card Preview</span>
                    <Sparkles className="w-4 h-4 text-lime-600" />
                  </h2>
                  <p className="text-xs text-zinc-600 font-saans">
                    Watch the squircle bot react in real-time to your form actions
                  </p>
                </div>

                <div className="p-1 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <KlaroBot state={botState} size="sm" showShadow={false} glowColor={glowColor} />
                </div>
              </div>

              <form onSubmit={handleMockSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Triggers "typing"</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      value={mockEmail}
                      onChange={(e) => {
                        setMockEmail(e.target.value);
                        if (botState !== "typing" && botState !== "peek") setBotState("typing");
                      }}
                      onFocus={() => setBotState("typing")}
                      onBlur={() => setBotState("idle")}
                      placeholder="inspector@klaro.app"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#94EC40] focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
                    <span>Secret Key / Password</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Triggers "peek"</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="password"
                      value={mockPassword}
                      onChange={(e) => {
                        setMockPassword(e.target.value);
                        if (botState !== "peek") setBotState("peek");
                      }}
                      onFocus={() => setBotState("peek")}
                      onBlur={() => setBotState("idle")}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#94EC40] focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={mockIsSubmitting}
                    className="w-full py-3 rounded-xl bg-[#121215] hover:bg-black text-[#94EC40] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                  >
                    {mockIsSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#94EC40]" />
                        <span>Authenticating Session...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-[#94EC40]" />
                        <span>Sign In (Test Live Flow)</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setBotState("scanning")}
                      className="py-2 px-3 rounded-xl bg-zinc-200 hover:bg-zinc-300 border border-zinc-300/80 text-xs font-semibold text-zinc-800 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-zinc-900 text-[#94EC40] font-mono text-[9px] font-bold flex items-center justify-center">?</span>
                      <span>Test Thinking (?)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBotState("error")}
                      className="py-2 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Test Denied</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <AnimatePresence>
              {mockSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 rounded-xl bg-[#D4F7B0] border border-[#94EC40] flex items-center gap-2.5 text-xs font-bold text-zinc-900 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Authenticated! Bot switched to happy celebrative state.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-[32px] bg-[#0E0E12] border border-zinc-800/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
            <Sliders className="w-4 h-4 text-[#94EC40]" />
            <h3 className="text-base font-bold text-white font-satoshi">
              Bot Customization & Tuning Studio
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                Display Size
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(["sm", "md", "lg", "xl", "hero"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setBotSize(sz)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all",
                      botSize === sz
                        ? "bg-[#94EC40] text-black border-[#94EC40] shadow-[0_0_12px_rgba(148,236,64,0.3)]"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    )}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                Glow Accent
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {colorPalettes.map((p) => (
                  <button
                    key={p.color}
                    onClick={() => setGlowColor(p.color)}
                    title={p.label}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all relative",
                      glowColor === p.color ? "scale-125 border-white" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: p.color,
                      boxShadow: glowColor === p.color ? `0 0 10px ${p.color}` : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                Features & Physics
              </label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interactiveTracking}
                    onChange={(e) => setInteractiveTracking(e.target.checked)}
                    className="rounded border-zinc-700 text-[#94EC40] focus:ring-0 bg-zinc-900"
                  />
                  <span>Spring Mouse Pupil Tracking</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showShadow}
                    onChange={(e) => setShowShadow(e.target.checked)}
                    className="rounded border-zinc-700 text-[#94EC40] focus:ring-0 bg-zinc-900"
                  />
                  <span>Ambient Levitation Shadow</span>
                </label>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                Component Usage
              </label>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-400 space-y-1">
                <p className="text-[#94EC40]">&lt;KlaroBot</p>
                <p className="pl-3">state="{botState}"</p>
                <p className="pl-3">size="{botSize}"</p>
                <p className="pl-3">glowColor="{glowColor}"</p>
                <p className="text-[#94EC40]">/&gt;</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-[#0E0E12] border border-zinc-800/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="text-base font-bold text-white font-satoshi flex items-center gap-2">
              <span>All Emotional Visor States Preview</span>
              <span className="text-xs font-mono font-normal text-zinc-500">
                (Simultaneous Live Render)
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {statesList.map((st) => (
              <div
                key={st.id}
                onClick={() => setBotState(st.id)}
                className={cn(
                  "p-4 rounded-2xl bg-zinc-950/60 border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer",
                  botState === st.id
                    ? "border-[#94EC40] shadow-[0_0_16px_rgba(148,236,64,0.15)] bg-zinc-900/60"
                    : "border-zinc-800/80 hover:border-zinc-700"
                )}
              >
                <KlaroBot state={st.id} size="sm" glowColor={glowColor} showShadow={true} interactive={false} />
                <div className="text-center">
                  <p className="text-xs font-bold text-zinc-200 font-satoshi">{st.label.split(" ")[0]}</p>
                  <p className="text-[10px] text-zinc-500 font-mono capitalize">{st.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
