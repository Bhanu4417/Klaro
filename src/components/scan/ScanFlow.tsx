"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, Share2, Bookmark } from "lucide-react";
import { ReceiptPrinter } from "./ReceiptPrinter";
import { cn } from "@/lib/utils";

interface ScanFlowProps {
  isOpen: boolean;
  imageUrl: string | null;
  imageName?: string;
  onClose: () => void;
  onPost?: (data: { imageUrl: string; title: string }) => void;
  onSave?: (data: { imageUrl: string }) => void;
}

const ISSUE_TEXT = "Rule 6(1)(d) • Missing ₹ per g/kg USP and tax inclusion — Lower Right PDP";

// High-fidelity, authentic EAN/Code-128 retail barcode renderer
function BarcodeGraphic({ code = "KLR-2026-08-9412 • 8 901234 567890", className = "" }: { code?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <div className="flex items-center justify-center gap-[1.5px] h-8 px-3 py-1 bg-white border border-zinc-200 rounded-md">
        {/* Guard Left */}
        <div className="w-[1.5px] h-7 bg-zinc-950" />
        <div className="w-[1px] h-7 bg-transparent" />
        <div className="w-[1.5px] h-7 bg-zinc-950" />
        
        {/* Data Pattern */}
        <div className="w-[2.5px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[1.5px] h-6 bg-zinc-950" />
        <div className="w-[3px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[2px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-zinc-950" />
        <div className="w-[1.5px] h-6 bg-transparent" />
        <div className="w-[3px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[2px] h-6 bg-zinc-950" />
        <div className="w-[1.5px] h-6 bg-zinc-950" />

        {/* Center Guard */}
        <div className="w-[1px] h-7 bg-transparent" />
        <div className="w-[1.5px] h-7 bg-zinc-950" />
        <div className="w-[1px] h-7 bg-transparent" />
        <div className="w-[1.5px] h-7 bg-zinc-950" />
        <div className="w-[1px] h-7 bg-transparent" />

        {/* Data Pattern Right */}
        <div className="w-[2px] h-6 bg-zinc-950" />
        <div className="w-[1.5px] h-6 bg-transparent" />
        <div className="w-[3px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-zinc-950" />
        <div className="w-[1.5px] h-6 bg-transparent" />
        <div className="w-[2.5px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[3px] h-6 bg-zinc-950" />
        <div className="w-[1.5px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[2px] h-6 bg-zinc-950" />

        {/* Guard Right */}
        <div className="w-[1.5px] h-7 bg-zinc-950" />
        <div className="w-[1px] h-7 bg-transparent" />
        <div className="w-[1.5px] h-7 bg-zinc-950" />
      </div>
      <span className="text-[9px] text-zinc-500 tracking-[0.2em] font-mono font-medium">{code}</span>
    </div>
  );
}

export function ScanFlow({ isOpen, imageUrl, imageName, onClose, onPost, onSave }: ScanFlowProps) {
  const [phase, setPhase] = useState<"steps" | "printing" | "complete" | "detached">("steps");
  const [printerStage, setPrinterStage] = useState<"processing" | "printing" | "complete">("processing");
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<boolean[]>([false, false, false]);
  const [machineGone, setMachineGone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase("steps");
      setPrinterStage("processing");
      setActiveStep(0);
      setDoneSteps([false, false, false]);
      setMachineGone(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setDoneSteps((p) => [true, p[1], p[2]]), 900));
    timers.push(setTimeout(() => setActiveStep(1), 1050));
    timers.push(setTimeout(() => setDoneSteps((p) => [p[0], true, p[2]]), 1950));
    timers.push(setTimeout(() => setActiveStep(2), 2100));
    timers.push(setTimeout(() => setDoneSteps((p) => [p[0], p[1], true]), 3000));
    timers.push(
      setTimeout(() => {
        setPhase("printing");
        setPrinterStage("printing");
      }, 3450)
    );
    timers.push(
      setTimeout(() => {
        setPrinterStage("complete");
        setPhase("complete");
        // Automatically fade away the printer and expand script to full screen smoothly
        setTimeout(() => {
          setMachineGone(true);
          setPhase("detached");
        }, 650);
      }, 3450 + 1850)
    );
    return () => timers.forEach(clearTimeout);
  }, [isOpen]);

  const handlePost = () => {
    if (onPost && imageUrl) onPost({ imageUrl, title: "Brand XYZ 500g Malt Biscuits — USP Omission on PDP" });
    onClose();
  };

  const handleSave = () => {
    if (onSave && imageUrl) onSave({ imageUrl });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto overscroll-contain p-3 sm:p-6"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 bg-[#0B0B0D]/60 backdrop-blur-md" />

        <div className="relative z-[85] w-full max-w-[480px] flex flex-col items-center my-auto">
          <AnimatePresence mode="wait">
            {machineGone ? (
              <motion.div
                key="detached-paper"
                initial={{ opacity: 0, y: 22, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ y: 12 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="w-full bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_24px_60px_rgba(0,0,0,0.22)] relative overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 10px), 96% 100%, 92% calc(100% - 10px), 88% 100%, 84% calc(100% - 10px), 80% 100%, 76% calc(100% - 10px), 72% 100%, 68% calc(100% - 10px), 64% 100%, 60% calc(100% - 10px), 56% 100%, 52% calc(100% - 10px), 48% 100%, 44% calc(100% - 10px), 40% 100%, 36% calc(100% - 10px), 32% 100%, 28% calc(100% - 10px), 24% 100%, 20% calc(100% - 10px), 16% 100%, 12% calc(100% - 10px), 8% 100%, 4% calc(100% - 10px), 0 100%)",
                  }}
                >
                  <DetachedPaperContent imageUrl={imageUrl} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="flex gap-3 w-full">
                  <button
                    onClick={handlePost}
                    className="flex-1 py-3 rounded-2xl bg-[#94EC40] text-[rgb(18,18,18)] font-bold text-[13px] shadow-[0_8px_20px_rgba(148,236,64,0.35)] flex items-center justify-center gap-2 hover:bg-[#80D42F] transition-colors border border-[#80D42F]"
                  >
                    <Share2 className="w-4 h-4" />
                    Post to feed
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-2xl bg-white text-zinc-800 font-bold text-[13px] border border-[#D5D2D4] shadow-sm flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                    Save report
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="machine" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -24, scale: 0.96 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="w-full flex flex-col items-center">
                <ReceiptPrinter.Root stage={printerStage} feedMotion="stepped" className="w-full max-w-[480px]">
                  <ReceiptPrinter.Machine className="w-full">
                    <ReceiptPrinter.Screen className="p-3">
                      <AnimatePresence mode="wait">
                        {(phase === "steps" || phase === "printing") && (
                          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="space-y-2.5">
                            {imageUrl && (
                              <div className="flex gap-2.5 items-center pb-2.5 border-b border-[#D5D2D4]/60">
                                <img src={imageUrl} alt="scan" className="w-10 h-10 rounded-xl object-cover border border-[#D5D2D4]" />
                                <div className="min-w-0">
                                  <p className="text-[11px] font-bold text-zinc-900 truncate max-w-[180px]">{imageName || "product-label.jpg"}</p>
                                  <p className="text-[9px] text-zinc-500 font-mono">12.4 MP • Auto OCR</p>
                                </div>
                              </div>
                            )}

                            {/* Horizontal single line with green flowing line */}
                            <div className="relative pt-1 pb-1">
                              <div className="absolute top-[15px] left-[14px] right-[14px] h-[2px] bg-[#D5D2D4] rounded-full" />
                              <motion.div
                                className="absolute top-[15px] left-[14px] h-[2px] bg-[#94EC40] rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                  width: doneSteps[2] ? "calc(100% - 28px)" : activeStep >= 1 ? "calc(50% - 14px)" : "0px",
                                }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                              />
                              <div className="relative flex justify-between items-start gap-1">
                                {(
                                  [
                                    { label: "Scanning", doneLabel: "Image scanned" },
                                    { label: "Looking for issues", doneLabel: "Issue found", grey: false as const },
                                    { label: "Designing", doneLabel: "Report ready" },
                                  ] as const
                                ).map((step, idx) => {
                                  const isDone = doneSteps[idx];
                                  const isActive = activeStep === idx && !isDone;
                                  return (
                                    <div key={idx} className="flex flex-col items-center flex-1 min-w-0">
                                      <div className="relative">
                                        <AnimatePresence mode="wait" initial={false}>
                                          {isDone ? (
                                            <motion.span
                                              key="tick"
                                              initial={{ scale: 0.5, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ type: "spring", stiffness: 420, damping: 16 }}
                                              className="w-7 h-7 rounded-full bg-[#94EC40] border-2 border-white shadow-sm flex items-center justify-center"
                                            >
                                              <CheckCircle2 className="w-3.5 h-3.5 text-[#121212]" strokeWidth={2.6} />
                                            </motion.span>
                                          ) : isActive ? (
                                            <motion.span
                                              key="spin"
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              exit={{ opacity: 0 }}
                                              className="w-7 h-7 rounded-full bg-white border-2 border-[#B8F27D] flex items-center justify-center shadow-sm"
                                            >
                                              <Loader2 className="w-3.5 h-3.5 text-[#60B01A] animate-spin" />
                                            </motion.span>
                                          ) : (
                                            <span className="w-7 h-7 rounded-full bg-white border-2 border-[#D5D2D4] block shadow-sm" />
                                          )}
                                        </AnimatePresence>
                                      </div>
                                      <p
                                        className={cn(
                                          "text-[10px] leading-none mt-1.5 font-bold text-center whitespace-nowrap",
                                          isDone ? "text-zinc-900" : isActive ? "text-zinc-700" : "text-zinc-400"
                                        )}
                                      >
                                        {isDone ? (step as any).doneLabel : step.label}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>

                              <AnimatePresence>
                                {doneSteps[1] && (
                                  <motion.p
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[9.5px] text-zinc-600 font-medium leading-tight mt-2.5 text-center bg-[#ECEAEB] border border-[#D5D2D4] rounded-lg px-2.5 py-1.5"
                                  >
                                    {ISSUE_TEXT}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {(phase === "complete" || printerStage === "printing") && (
                        <ReceiptPrinter.Status>{printerStage === "printing" ? "Printing your report…" : "Report ready — finalizing"}</ReceiptPrinter.Status>
                      )}
                    </ReceiptPrinter.Screen>
                  </ReceiptPrinter.Machine>
                  <ReceiptPrinter.Output className="w-[calc(100%+0.75rem)]">
                    <ReceiptPrinter.Paper className="cursor-default">
                      <PaperContent imageUrl={imageUrl} />
                    </ReceiptPrinter.Paper>
                  </ReceiptPrinter.Output>
                </ReceiptPrinter.Root>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function PaperContent({ imageUrl }: { imageUrl: string | null }) {
  return (
    <>
      <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-300">
        <span className="text-sm font-bold tracking-tight text-zinc-950 block" style={{ fontFamily: "satoshi, sans-serif" }}>
          KLARO INSPECTION DOSSIER
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">DOSSIER #KLR-2026-08-9412 • VERIFIED</span>
        <span className="text-[10px] text-zinc-400 block">AUG 26, 2026 • 14:32 IST • Delhi Central Zone</span>
      </div>
      {imageUrl && (
        <div className="py-3 border-b border-dashed border-zinc-300 flex gap-3">
          <img src={imageUrl} alt="proof" className="w-16 h-16 rounded-xl object-cover border border-zinc-200" />
          <div className="flex-1">
            <p className="text-xs font-bold text-zinc-900">Packaged Biscuits 500g — PDP Scan</p>
            <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">Lower Right PDP • 180×45px • Confidence 98.4%</p>
            <span className="inline-flex mt-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold">
              Rule 6(1)(d) Flagged
            </span>
          </div>
        </div>
      )}
      <div className="py-3 border-b border-dashed border-zinc-300 space-y-2">
        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 block">VIOLATION DETECTED</span>
        <h3 className="text-sm font-bold text-zinc-900 leading-snug">Unit Sale Price (USP) completely omitted</h3>
        <p className="text-[11px] text-zinc-600 leading-relaxed">
          Package declares <span className="font-mono font-bold text-amber-700">MRP Rs 120.00 (PKD 07/2026)</span> but omits mandatory USP
          <span className="font-bold"> ₹0.24 per g</span> and tax inclusion statement.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Measured</span>
            <span className="text-xs font-mono font-bold text-rose-700">No USP Found</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F5FDF0] border border-[#B8F27D]">
            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Required</span>
            <span className="text-xs font-mono font-bold text-[#346415]">₹0.24 / g</span>
          </div>
        </div>
      </div>

      {/* Redesigned Rule Citation Box matching Trending Now aesthetic */}
      <div className="py-3 border-b border-dashed border-zinc-300 space-y-1.5">
        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 block">RULE CITATION</span>
        <div className="p-3.5 rounded-2xl bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono space-y-2 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-black/[0.04]">
          <div className="flex items-center justify-between border-b border-[#D2CFD3] pb-1.5 text-[10.5px]">
            <span className="text-zinc-900 font-bold text-xs">LMPC Rules, 2011</span>
            <span className="text-[#346415] shrink-0 font-extrabold bg-[#EAFBD9] px-2 py-0.5 rounded-md border border-[#B8F27D] text-[9.5px]">
              RULE 6(1)(d)
            </span>
          </div>
          <p className="text-[11px] text-zinc-800 font-medium leading-relaxed">
            Every package shall declare retail sale price & per-unit price; omission = punishable under Sec 36, Legal Metrology Act.
          </p>
        </div>
      </div>

      <div className="pt-3 flex items-center justify-between text-[10px] font-mono">
        <span className="text-zinc-500">EVIDENCE HASH: 7f3a9c…e12b</span>
        <span className="text-[#346415] font-bold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> COURT-READY
        </span>
      </div>
    </>
  );
}

function DetachedPaperContent({ imageUrl }: { imageUrl: string | null }) {
  return (
    <div className="p-6 sm:p-7 font-mono text-left">
      <PaperContent imageUrl={imageUrl} />
      <div className="pt-4 mt-4 border-t border-dashed border-zinc-300 text-center space-y-3">
        <div className="inline-block px-3 py-1 rounded border-2 border-dashed border-[#417F14] text-[#346415] font-bold text-xs bg-[#F5FDF0]">★ 98% OCR CONFIDENCE • AUDITABLE EVIDENCE ★</div>
        
        {/* Authentic Crisp Barcode */}
        <BarcodeGraphic code="KLR-2026-08-9412 • 8 901234 567890" />

        {/* Updated Legal Privacy Line */}
        <p className="text-[10px] text-zinc-600 font-medium leading-relaxed max-w-[340px] mx-auto">
          This script is saved automatically and would be given to officer if needed
        </p>
      </div>
    </div>
  );
}
