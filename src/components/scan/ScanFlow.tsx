"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { ReceiptPrinter } from "./ReceiptPrinter";
import { KlaroBot } from "../auth/KlaroBot";
import { analyzePackagingImage, AuditReport, AuditIssue } from "@/lib/auditEngine";
import { cn } from "@/lib/utils";

interface ScanFlowProps {
  isOpen: boolean;
  imageUrl: string | null;
  imageName?: string;
  onClose: () => void;
  onPost?: (data: { imageUrl: string; title: string; report?: AuditReport; comment?: string }) => void;
  onSave?: (data: { imageUrl: string; report?: AuditReport }) => void;
}

export function BarcodeGraphic({ code = "8 901207 025372", className = "" }: { code?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="flex items-center justify-center gap-[1.5px] h-7 px-3 py-0.5 bg-white border border-zinc-200 rounded-md">
        <div className="w-[1.5px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[1.5px] h-6 bg-zinc-950" />
        
        <div className="w-[2.5px] h-5 bg-zinc-950" />
        <div className="w-[1px] h-5 bg-transparent" />
        <div className="w-[1.5px] h-5 bg-zinc-950" />
        <div className="w-[3px] h-5 bg-zinc-950" />
        <div className="w-[1px] h-5 bg-transparent" />
        <div className="w-[2px] h-5 bg-zinc-950" />
        <div className="w-[1px] h-5 bg-zinc-950" />
        <div className="w-[1.5px] h-5 bg-transparent" />
        <div className="w-[3px] h-5 bg-zinc-950" />
        <div className="w-[1px] h-5 bg-transparent" />
        <div className="w-[2px] h-5 bg-zinc-950" />

        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[1.5px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[1.5px] h-6 bg-zinc-950" />

        <div className="w-[2px] h-5 bg-zinc-950" />
        <div className="w-[1.5px] h-5 bg-transparent" />
        <div className="w-[3px] h-5 bg-zinc-950" />
        <div className="w-[1px] h-5 bg-zinc-950" />
        <div className="w-[2.5px] h-5 bg-zinc-950" />
        <div className="w-[1px] h-5 bg-transparent" />
        <div className="w-[3px] h-5 bg-zinc-950" />
        <div className="w-[1.5px] h-5 bg-zinc-950" />

        <div className="w-[1.5px] h-6 bg-zinc-950" />
        <div className="w-[1px] h-6 bg-transparent" />
        <div className="w-[1.5px] h-6 bg-zinc-950" />
      </div>
      <span className="text-[8.5px] text-zinc-500 tracking-[0.2em] font-mono font-medium">{code}</span>
    </div>
  );
}

const PostToFeedCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 21.5H9.99995C6.71247 21.5 5.06873 21.5 3.96238 20.592C3.75984 20.4258 3.57413 20.2401 3.40791 20.0376C2.49995 18.9312 2.49995 17.2875 2.49995 14C2.49995 10.7125 2.49995 9.06878 3.40791 7.96243C3.57413 7.75989 3.75984 7.57418 3.96238 7.40796C5.06873 6.5 6.71247 6.5 9.99995 6.5H14C17.2874 6.5 18.9312 6.5 20.0375 7.40796C20.2401 7.57418 20.4258 7.75989 20.592 7.96243C21.5 9.06878 21.5 10.7125 21.5 14C21.5 17.2875 21.5 18.9312 20.592 20.0376C20.4258 20.2401 20.2401 20.4258 20.0375 20.592C18.9312 21.5 17.2874 21.5 14 21.5Z" />
    <path d="M2.49995 14.5V10.5C2.49995 6.72876 2.49995 4.84315 3.67153 3.67157C4.8431 2.5 6.72872 2.5 10.5 2.5H13.5C17.2712 2.5 19.1568 2.5 20.3284 3.67157C21.5 4.84315 21.5 6.72876 21.5 10.5V14.5" />
    <path d="M15 13.5C15 13.5 12.7905 10.5 11.9999 10.5C11.2094 10.5 8.99995 13.5 8.99995 13.5M11.9999 11L12 17.5" />
  </svg>
);

const SaveReportCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 7H20" />
  </svg>
);

export function ScanFlow({ isOpen, imageUrl, imageName, onClose, onPost, onSave }: ScanFlowProps) {
  const [phase, setPhase] = useState<"steps" | "printing" | "complete" | "detached">("steps");
  const [printerStage, setPrinterStage] = useState<"processing" | "printing" | "complete">("processing");
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<boolean[]>([false, false, false]);
  const [machineGone, setMachineGone] = useState(false);

  const [showPostPrompt, setShowPostPrompt] = useState(false);
  const [postComment, setPostComment] = useState("");

  const report: AuditReport = useMemo(() => {
    return analyzePackagingImage(imageName, imageUrl);
  }, [imageName, imageUrl]);

  useEffect(() => {
    if (isOpen) {
      setPhase("steps");
      setPrinterStage("processing");
      setActiveStep(0);
      setDoneSteps([false, false, false]);
      setMachineGone(false);
      setShowPostPrompt(false);
      setPostComment("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setDoneSteps((p) => [true, p[1], p[2]]), 900));
    timers.push(setTimeout(() => setActiveStep(1), 1050));

    timers.push(setTimeout(() => setDoneSteps((p) => [p[0], true, p[2]]), 2100));
    timers.push(setTimeout(() => setActiveStep(2), 2250));

    timers.push(setTimeout(() => setDoneSteps((p) => [p[0], p[1], true]), 3100));
    timers.push(
      setTimeout(() => {
        setPhase("printing");
        setPrinterStage("printing");
      }, 3550)
    );
    timers.push(
      setTimeout(() => {
        setPrinterStage("complete");
        setPhase("complete");
        setTimeout(() => {
          setMachineGone(true);
          setPhase("detached");
        }, 650);
      }, 3550 + 2000)
    );
    return () => timers.forEach(clearTimeout);
  }, [isOpen]);

  const handlePost = () => {
    setShowPostPrompt(true);
  };

  const confirmPost = () => {
    if (onPost && imageUrl) {
      const topIssue = report.issues[0];
      const title = `${report.productName} — ${topIssue ? topIssue.title : "Legal Metrology Audit"}`;
      onPost({ imageUrl, title, report, comment: postComment.trim() || undefined });
    }
    setShowPostPrompt(false);
    onClose();
  };

  const handleSave = () => {
    if (onSave && imageUrl) onSave({ imageUrl, report });
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 bg-[#0B0B0D]/65 backdrop-blur-md" />

        <div className="relative z-[85] w-full max-w-[500px] flex flex-col items-center my-auto">
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
                  className="w-full bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_24px_60px_rgba(0,0,0,0.22)] relative overflow-hidden rounded-2xl max-h-[85vh] overflow-y-auto"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 10px), 96% 100%, 92% calc(100% - 10px), 88% 100%, 84% calc(100% - 10px), 80% 100%, 76% calc(100% - 10px), 72% 100%, 68% calc(100% - 10px), 64% 100%, 60% calc(100% - 10px), 56% 100%, 52% calc(100% - 10px), 48% 100%, 44% calc(100% - 10px), 40% 100%, 36% calc(100% - 10px), 32% 100%, 28% calc(100% - 10px), 24% 100%, 20% calc(100% - 10px), 16% 100%, 12% calc(100% - 10px), 8% 100%, 4% calc(100% - 10px), 0 100%)",
                  }}
                >
                  <DetachedPaperContent imageUrl={imageUrl} report={report} onPost={handlePost} onSave={handleSave} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="machine" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -24, scale: 0.96 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="w-full flex flex-col items-center">
                <ReceiptPrinter.Root stage={printerStage} feedMotion="stepped" className="w-full max-w-[500px]">
                  <ReceiptPrinter.Machine className="w-full">
                    <ReceiptPrinter.Screen className="p-3.5">
                      <AnimatePresence mode="wait">
                        {(phase === "steps" || phase === "printing") && (
                          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="space-y-3">
                            
                            <div className="flex gap-2.5 items-center justify-between pb-2.5 border-b border-[#D5D2D4]/60">
                              <div className="flex items-center gap-2.5 min-w-0">
                                {imageUrl ? (
                                  <img src={imageUrl} alt="scan" className="w-10 h-10 rounded-xl object-cover border border-[#D5D2D4] shrink-0" />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-[#D5D2D4] flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-zinc-500" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-[11.5px] font-bold text-zinc-900 truncate max-w-[180px] sm:max-w-[220px]">
                                    {report.productName}
                                  </p>
                                  <p className="text-[9.5px] text-zinc-500 font-mono">
                                    {report.brand} • Confidence {report.confidenceScore}%
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 scale-90">
                                <KlaroBot
                                  state={phase === "printing" ? "authenticating" : activeStep === 1 ? "scanning" : "typing"}
                                  size="sm"
                                  showShadow={false}
                                  interactive={false}
                                />
                              </div>
                            </div>

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
                                    { label: "Scanning", doneLabel: "Scanned" },
                                    { label: "Checking Rules", doneLabel: `${report.issues.length} Issues Found` },
                                    { label: "Generating", doneLabel: "Dossier Ready" },
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
                                  <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 p-2 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] space-y-1 text-left"
                                  >
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-800 font-mono">
                                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                      <span>{report.issues.length} NON-COMPLIANCES FLAGGED:</span>
                                    </div>
                                    <div className="space-y-0.5 pl-5 text-[9.5px] text-zinc-700 font-medium font-mono">
                                      {report.issues.slice(0, 2).map((iss, i) => (
                                        <p key={iss.id} className="truncate">• {iss.ruleCode}: {iss.title}</p>
                                      ))}
                                      {report.issues.length > 2 && (
                                        <p className="text-[9px] text-zinc-500">+ {report.issues.length - 2} more statutory issues</p>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {(phase === "complete" || printerStage === "printing") && (
                        <ReceiptPrinter.Status>{printerStage === "printing" ? "Printing legal metrology report…" : "Dossier ready — final cut"}</ReceiptPrinter.Status>
                      )}
                    </ReceiptPrinter.Screen>
                  </ReceiptPrinter.Machine>
                  <ReceiptPrinter.Output className="w-[calc(100%+0.75rem)]">
                    <ReceiptPrinter.Paper className="cursor-default">
                      <PaperContent imageUrl={imageUrl} report={report} />
                    </ReceiptPrinter.Paper>
                  </ReceiptPrinter.Output>
                </ReceiptPrinter.Root>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPostPrompt && (
            <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#0B0B0D]/45 backdrop-blur-sm"
                onClick={() => setShowPostPrompt(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="relative w-full max-w-[380px] p-5 rounded-[26px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_24px_60px_rgba(0,0,0,0.28),inset_0_1px_1px_rgba(255,255,255,0.95)] z-[96] space-y-3.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#94EB41] text-[rgb(18,18,18)] flex items-center justify-center border border-[#80D42F] shadow-xs">
                      <PostToFeedCustomIcon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <h4
                      className="text-sm font-[900] text-zinc-950 tracking-tight"
                      style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                    >
                      Add a note
                    </h4>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Optional
                  </span>
                </div>

                <p className="text-[11px] text-zinc-500 font-medium leading-snug">
                  Anything you type here becomes the description of your community post. Leave it blank to post the auto-generated summary.
                </p>

                <textarea
                  autoFocus
                  value={postComment}
                  onChange={(e) => setPostComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) confirmPost();
                  }}
                  rows={3}
                  placeholder="e.g. Shop refused to display MRP, found near Zone 4 market…"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#ECEAEB] border-[1.5px] border-[#D5D2D4] text-xs text-zinc-800 placeholder-zinc-400 outline-none ring-0 ring-offset-0 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[#94EC40]/30 focus:border-[#94EC40] focus-visible:border-[#94EC40] focus:bg-white transition-colors resize-none font-medium"
                />

                <div className="flex items-center gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={confirmPost}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#94EC40] text-[rgb(18,18,18)] font-bold text-xs shadow-[0_2px_8px_rgba(148,236,64,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center gap-1.5 hover:bg-[#80D42F] active:scale-95 transition-all border border-[#80D42F]"
                  >
                    <PostToFeedCustomIcon className="w-4 h-4 stroke-[1.8]" />
                    <span>Post to feed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPostPrompt(false)}
                    className="py-2.5 px-4 rounded-xl bg-[#ECEAEB] text-zinc-800 font-bold text-xs border border-[#D5D2D4] shadow-xs hover:bg-[#E2DFE1] active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

function PaperContent({ imageUrl, report }: { imageUrl: string | null; report: AuditReport }) {
  return (
    <>
      <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-300">
        <span className="text-sm font-bold tracking-tight text-zinc-950 block font-satoshi">
          KLARO LEGAL METROLOGY DOSSIER
        </span>
        <span className="text-[10px] text-zinc-500 font-mono font-semibold">
          DOSSIER #{report.dossierNumber} • VERIFIED
        </span>
        <span className="text-[10px] text-zinc-400 block font-mono">
          {report.timestamp} • {report.zone}
        </span>
      </div>

      {imageUrl && (
        <div className="py-3 border-b border-dashed border-zinc-300 flex gap-3 items-center">
          <img src={imageUrl} alt="proof" className="w-16 h-16 rounded-xl object-cover border border-zinc-200 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-900 truncate">{report.productName}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug font-mono">
              Brand: {report.brand} • Barcode: {report.barcode}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[9.5px] font-mono font-bold">
                {report.issues.length} Violations Flagged
              </span>
              <span className="text-[9.5px] font-mono text-zinc-500">
                Confidence {report.confidenceScore}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="py-3 border-b border-dashed border-zinc-300 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 block">
            STATUTORY NON-COMPLIANCES ({report.issues.length})
          </span>
          <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
            ACTIONABLE
          </span>
        </div>

        {report.issues.map((issue: AuditIssue, idx: number) => (
          <div key={issue.id} className="space-y-1.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold text-[#346415] bg-[#EAFBD9] px-1.5 py-0.5 rounded border border-[#B8F27D]">
                {issue.ruleCode}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">{issue.locationOnPackage}</span>
            </div>

            <h4 className="text-xs font-bold text-zinc-900 leading-snug">
              {idx + 1}. {issue.title}
            </h4>

            <p className="text-[10.5px] text-zinc-600 leading-relaxed font-sans">
              {issue.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-1.5 rounded-lg bg-white border border-rose-200">
                <span className="text-[8.5px] font-mono uppercase text-zinc-500 block">Measured</span>
                <span className="text-[11px] font-mono font-bold text-rose-700 truncate block">
                  {issue.measuredValue}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#F5FDF0] border border-[#B8F27D]">
                <span className="text-[8.5px] font-mono uppercase text-zinc-500 block">Required</span>
                <span className="text-[11px] font-mono font-bold text-[#346415] truncate block">
                  {issue.requiredValue}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="py-3 border-b border-dashed border-zinc-300 space-y-1.5">
        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 block">
          LEGAL METROLOGY ACT CITATIONS
        </span>
        <div className="p-3 rounded-2xl bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono space-y-1.5 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-[#D2CFD3] pb-1 text-[10.5px]">
            <span className="text-zinc-900 font-bold text-xs">LMPC Rules, 2011</span>
            <span className="text-rose-700 font-bold text-[9.5px]">SEC 36 PENAL APPLICABLE</span>
          </div>
          <p className="text-[10.5px] text-zinc-800 font-medium leading-relaxed">
            Non-declaration of mandatory retail sale price, USP, packer address, or origin is punishable under Section 36 of the Legal Metrology Act, 2009.
          </p>
        </div>
      </div>

      <div className="pt-3 space-y-2">
        <BarcodeGraphic code={report.barcode} />
        <div className="flex items-center justify-between text-[10px] font-mono pt-1">
          <span className="text-zinc-500 truncate max-w-[200px]">HASH: {report.evidenceHash}</span>
          <span className="text-[#346415] font-bold flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" /> COURT-READY
          </span>
        </div>
      </div>
    </>
  );
}

function DetachedPaperContent({
  imageUrl,
  report,
  onPost,
  onSave,
}: {
  imageUrl: string | null;
  report: AuditReport;
  onPost: () => void;
  onSave: () => void;
}) {
  return (
    <div className="p-5 sm:p-6 font-mono text-left">
      <PaperContent imageUrl={imageUrl} report={report} />
      
      <div className="pt-3.5 mt-3.5 border-t border-dashed border-zinc-300 space-y-2.5">
        <div className="flex items-center gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={onPost}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#94EC40] text-[rgb(18,18,18)] font-bold text-xs shadow-[0_2px_8px_rgba(148,236,64,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center gap-1.5 hover:bg-[#80D42F] active:scale-95 transition-all border border-[#80D42F]"
          >
            <PostToFeedCustomIcon className="w-4 h-4 stroke-[1.8]" />
            <span>Post to feed</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#ECEAEB] text-zinc-800 font-bold text-xs border border-[#D5D2D4] shadow-xs flex items-center justify-center gap-1.5 hover:bg-[#E2DFE1] active:scale-95 transition-all"
          >
            <SaveReportCustomIcon className="w-4 h-4 stroke-[1.8]" />
            <span>Save report</span>
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 font-medium text-center leading-snug font-mono">
          This dossier is hashed on-device and ready for legal submission to Metrology Enforcement Officers.
        </p>
      </div>
    </div>
  );
}
