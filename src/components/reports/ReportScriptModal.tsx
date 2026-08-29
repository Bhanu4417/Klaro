"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, ShieldCheck, X } from "lucide-react";
import { BarcodeGraphic } from "../scan/ScanFlow";
import { ImageLightbox } from "./ImageLightbox";
import type { AuditReport } from "@/lib/auditEngine";

export interface ScriptPost {
  id: string;
  title: string;
  commodity: string;
  brand: string;
  ruleCode: string;
  ruleLabel: string;
  severity: string;
  description: string;
  imageUrl?: string;
  status: string;
  timeAgo?: string;
  authorZone?: string;
  author?: { zone?: string };
  evidence: {
    labelRegion: string;
    ocrSnippet: string;
    flagReason: string;
    measuredValue?: string;
    requiredValue?: string;
  };
}

/** Full persisted audit dossier loaded with the post from Supabase (all issues + evidence photo) */
export interface ScriptRecord {
  report?: AuditReport;
  imageUrl?: string | null;
}

interface ReportScriptModalProps {
  post: ScriptPost | null;
  report?: AuditReport | null;
  onClose: () => void;
}

function hashString(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

interface DisplayIssue {
  ruleCode: string;
  title: string;
  description: string;
  measuredValue: string;
  requiredValue: string;
  locationOnPackage: string;
}

/** Builds the dossier view — from the full saved audit when available, otherwise reconstructed from the post */
function buildScriptData(post: ScriptPost, script?: ScriptRecord | null) {
  const full = script?.report;
  if (full) {
    return {
      dossierNumber: full.dossierNumber,
      evidenceHash: full.evidenceHash,
      barcode: full.barcode,
      productName: full.productName,
      commodity: full.commodity || post.commodity,
      timestamp: full.timestamp,
      zone: full.zone || post.authorZone || post.author?.zone || "Your Zone",
      confidenceScore: full.confidenceScore,
      issues: full.issues.map<DisplayIssue>((iss) => ({
        ruleCode: iss.ruleCode,
        title: iss.title,
        description: iss.description,
        measuredValue: iss.measuredValue,
        requiredValue: iss.requiredValue,
        locationOnPackage: iss.locationOnPackage,
      })),
    };
  }

  // Fallback: reconstruct a single-issue dossier from the persisted post
  const seed = hashString(post.id + post.title);
  const dossierNumber = `KLR-${(seed % 900000 + 100000).toString()}`;
  const evidenceHash = Array.from({ length: 8 }, (_, i) =>
    ((seed >>> (i * 4)) & 0xf).toString(16)
  ).join("").toUpperCase();

  const barcodeMatch = post.evidence.ocrSnippet.match(/Barcode\s+(\d+)/i);
  const rawBarcode = barcodeMatch?.[1] || "8901207025372";
  const barcode = rawBarcode.replace(/^(\d)(\d{6})(\d{6})$/, "$1 $2 $3");

  const productName = post.title.includes(" — ")
    ? post.title.split(" — ")[0]
    : post.title.replace(/ — .*$/, "") || post.title;

  const timestamp = `${new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase()} • ${post.timeAgo || "Recently"}`;

  return {
    dossierNumber,
    evidenceHash,
    barcode,
    productName,
    commodity: post.commodity,
    timestamp,
    zone: post.authorZone || post.author?.zone || "Your Zone",
    confidenceScore: undefined as number | undefined,
    issues: [
      {
        ruleCode: post.ruleCode,
        title: post.ruleLabel,
        description: post.evidence.flagReason || post.description,
        measuredValue: post.evidence.measuredValue || "Non-compliant",
        requiredValue: post.evidence.requiredValue || "Statutory Legal Requirement",
        locationOnPackage: post.evidence.labelRegion,
      } as DisplayIssue,
    ],
  };
}

export function ReportScriptModal({ post, report, onClose }: ReportScriptModalProps) {
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);
  const data = post ? buildScriptData(post, { report: report || undefined }) : null;
  const evidenceImage = post?.imageUrl;

  return (
    <AnimatePresence>
      {post && data && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center overflow-y-auto overscroll-contain p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0B0D]/65 backdrop-blur-md"
          />

          <div className="relative z-[90] w-full max-w-[500px] flex flex-col items-center gap-3 my-auto">
            {/* Modal chrome header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCFCFB]/90 backdrop-blur border border-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#346415]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-800">
                  Inspection Dossier • {post.status}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-[#FCFCFB]/90 backdrop-blur border border-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.18)] text-zinc-500 hover:text-zinc-900 active:scale-90 transition-all"
                title="Close dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Paper unfolding open animation — same script style as the scanner printout */}
            <motion.div
              initial={{ opacity: 0, rotateX: -78, y: 64, scale: 0.96 }}
              animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateX: -32, y: 36, scale: 0.97, transition: { duration: 0.2, ease: "easeIn" } }}
              transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.9 }}
              style={{
                transformPerspective: 1400,
                transformOrigin: "top center",
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 10px), 96% 100%, 92% calc(100% - 10px), 88% 100%, 84% calc(100% - 10px), 80% 100%, 76% calc(100% - 10px), 72% 100%, 68% calc(100% - 10px), 64% 100%, 60% calc(100% - 10px), 56% 100%, 52% calc(100% - 10px), 48% 100%, 44% calc(100% - 10px), 40% 100%, 36% calc(100% - 10px), 32% 100%, 28% calc(100% - 10px), 24% 100%, 20% calc(100% - 10px), 16% 100%, 12% calc(100% - 10px), 8% 100%, 4% calc(100% - 10px), 0 100%)",
              }}
              className="w-full bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_24px_60px_rgba(0,0,0,0.22)] relative overflow-hidden rounded-2xl max-h-[82vh] overflow-y-auto"
            >
              <div className="p-5 sm:p-6 font-mono text-left">
                {/* Dossier Header */}
                <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-300">
                  <span className="text-sm font-bold tracking-tight text-zinc-950 block font-satoshi">
                    KLARO LEGAL METROLOGY DOSSIER
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono font-semibold">
                    DOSSIER #{data.dossierNumber} • {post.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono">
                    {data.timestamp} • {data.zone}
                  </span>
                </div>

                {/* Product Details + Evidence Photo Attachment */}
                <div className="py-3 border-b border-dashed border-zinc-300 flex gap-3 items-center">
                  {evidenceImage ? (
                    <img src={evidenceImage} alt="proof" className="w-16 h-16 rounded-xl object-cover border border-zinc-200 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] shrink-0 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-zinc-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">{data.productName}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug font-mono">
                      {data.commodity} • Brand: {post.brand}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[9.5px] font-mono font-bold">
                        {data.issues.length} Violation{data.issues.length > 1 ? "s" : ""} Flagged
                      </span>
                      {typeof data.confidenceScore === "number" && (
                        <span className="text-[9.5px] font-mono text-zinc-500">
                          Confidence {data.confidenceScore}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Evidence Photo Attachment */}
                  {evidenceImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage(evidenceImage!);
                      }}
                      title="View evidence image"
                      className="shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl bg-[#ECEAEB] border-[1.5px] border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] hover:bg-[#E4E2E3] hover:border-[#94EC40] active:scale-95 transition-all cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4 text-[#346415] -rotate-45" />
                      <span className="text-[9.5px] font-mono font-bold text-zinc-700 uppercase tracking-wide">Image</span>
                    </button>
                  )}
                </div>

                {/* Statutory Non-Compliances Section — every flagged issue */}
                <div className="py-3 border-b border-dashed border-zinc-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 block">
                      STATUTORY NON-COMPLIANCES ({data.issues.length})
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      ACTIONABLE
                    </span>
                  </div>

                  {data.issues.map((issue, idx: number) => (
                    <div key={`${issue.ruleCode}-${idx}`} className="space-y-1.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-extrabold text-[#346415] bg-[#EAFBD9] px-1.5 py-0.5 rounded border border-[#B8F27D]">
                          {issue.ruleCode}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase truncate max-w-[180px]">
                          {issue.locationOnPackage}
                        </span>
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

                {/* Officer Note (becomes the post description) */}
                {post.description && (
                  <div className="py-3 border-b border-dashed border-zinc-300 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 block">
                      INSPECTOR NOTE
                    </span>
                    <p className="text-[10.5px] text-zinc-700 font-medium leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                )}

                {/* Statutory Rule Citation Box */}
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

                {/* Barcode & Verification Seal */}
                <div className="pt-3 space-y-2">
                  <BarcodeGraphic code={data.barcode} />
                  <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                    <span className="text-zinc-500 truncate max-w-[200px]">HASH: {data.evidenceHash}</span>
                    <span className="text-[#346415] font-bold flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" /> COURT-READY
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </AnimatePresence>
  );
}
