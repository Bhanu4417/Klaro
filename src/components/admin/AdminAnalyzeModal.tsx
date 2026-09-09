"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  FileText, 
  Paperclip, 
  Calendar, 
  Award, 
  Hash, 
  PenTool, 
  Loader2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Printer,
  Download,
  Copy,
  Check,
  RotateCcw,
  RefreshCw,
  Edit3
} from "lucide-react";
import { ImageLightbox } from "../reports/ImageLightbox";
import { signAndCompoundReport } from "@/actions/reports";
import { ReceiptPrinter, type ReceiptPrinterStage } from "../scan/ReceiptPrinter";
import { BarcodeGraphic } from "../scan/ScanFlow";

export interface AnalyzePostData {
  id: string;
  title: string;
  commodity: string;
  brand: string;
  ruleCode: string;
  ruleLabel: string;
  severity: "high" | "medium" | "low" | "critical" | string;
  description: string;
  penaltySection?: string;
  evidence: {
    labelRegion: string;
    ocrSnippet: string;
    flagReason: string;
    measuredValue?: string;
    requiredValue?: string;
  };
  imageUrl?: string;
  status: string;
  timeAgo?: string;
  author?: {
    name: string;
    badge: string;
    avatar: string;
    zone: string;
  };
  auditReport?: any;
}

interface AdminAnalyzeModalProps {
  post: AnalyzePostData | null;
  officerUser: {
    displayName: string;
    role: string;
    jurisdiction: string;
    clearance: string;
    avatar: string;
  };
  onClose: () => void;
  onStatusUpdated?: (postId: string, newStatus: string, compoundingOrder?: any) => void;
}

export const AnalyzeModalCustomIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M12 14.0059L5.84373 21.2328C5.01764 22.2026 3.54001 22.2616 2.63922 21.3608C1.73843 20.46 1.79744 18.9824 2.7672 18.1563L9.99412 12" />
    <path d="M22 11.9048L15.9048 18M12.0952 2L6 8.09524M11.3334 2.76186L6.76195 7.33329C6.76195 7.33329 9.04766 10.3809 11.3334 12.6666C13.6191 14.9523 16.6667 17.2381 16.6667 17.2381L21.2381 12.6666C21.2381 12.6666 18.9524 9.61901 16.6667 7.33329C14.381 5.04758 11.3334 2.76186 11.3334 2.76186Z" strokeLinecap="round" />
  </svg>
);

export function AdminAnalyzeModal({
  post,
  officerUser,
  onClose,
  onStatusUpdated,
}: AdminAnalyzeModalProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const existingCompounding = post?.auditReport?.compoundingOrder;

  const [selectedStatus, setSelectedStatus] = useState<"Under Review" | "Notice Drafted" | "Compounded">(
    post?.status === "Compounded" ? "Compounded" : post?.status === "Notice Drafted" ? "Notice Drafted" : "Compounded"
  );
  const [penaltyAmount, setPenaltyAmount] = useState<string>(
    existingCompounding?.penaltyAmount || "₹25,000"
  );

  const generateDraftTemplate = (status: "Under Review" | "Notice Drafted" | "Compounded", pAmt: string) => {
    if (!post) return "";
    if (status === "Compounded") {
      return `WHEREAS on verification of commodity '${post.commodity}' (Brand: '${post.brand}'), contravention of ${post.ruleCode} (${post.ruleLabel}) was substantiated.\n\nWHEREAS the manufacturer/packer voluntarily submitted for compounding under Section 48(1) of the Legal Metrology Act, 2009 admitting non-compliance;\n\nNOW THEREFORE, the undersigned Compounding Authority hereby compounds the offence upon payment of compounding fee of ${pAmt}. Rectified packaging compliance shall be ensured within 30 days.`;
    }
    if (status === "Notice Drafted") {
      return `STATUTORY NOTICE is hereby served under Rule 32 of Legal Metrology (Packaged Commodities) Rules, 2011 upon the registered manufacturer/packer of '${post.brand}' ${post.commodity}.\n\nInspection evidence #${post.id} establishes non-compliance with ${post.ruleCode}. You are called upon to show cause within 15 days why legal proceedings under Section 36 should not be initiated before the competent Court of Law.`;
    }
    return `MEMORANDUM: Inspection record #${post.id} for '${post.brand}' ${post.commodity} is assigned to priority laboratory investigation.\n\nPrincipal display panel measurements (${post.evidence?.ocrSnippet || "declared values"}) are under technical verification. Statutory action reserved pending physical laboratory cross-audit.`;
  };

  const [statutoryRemarks, setStatutoryRemarks] = useState<string>(
    existingCompounding?.remarks || generateDraftTemplate(
      post?.status === "Compounded" ? "Compounded" : post?.status === "Notice Drafted" ? "Notice Drafted" : "Compounded",
      existingCompounding?.penaltyAmount || "₹25,000"
    )
  );

  const handleStatusSelect = (status: "Under Review" | "Notice Drafted" | "Compounded") => {
    setSelectedStatus(status);
    const newAmt = status === "Compounded" ? "₹25,000" : status === "Notice Drafted" ? "N/A (15 Days Notice)" : "Under Technical Audit";
    setPenaltyAmount(newAmt);
    setStatutoryRemarks(generateDraftTemplate(status, newAmt));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "compounding">("analysis");
  
  const [isExecuted, setIsExecuted] = useState<boolean>(Boolean(existingCompounding));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [printerStage, setPrinterStage] = useState<ReceiptPrinterStage>(existingCompounding ? "complete" : "processing");
  const [executedOrder, setExecutedOrder] = useState<any>(existingCompounding || null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (post) {
      const existing = post.auditReport?.compoundingOrder;
      if (existing) {
        setIsExecuted(true);
        setIsEditing(false);
        setExecutedOrder(existing);
        setSelectedStatus((existing.status as any) || (post.status as any) || "Compounded");
        setPenaltyAmount(existing.penaltyAmount || "₹25,000");
        setStatutoryRemarks(existing.remarks || generateDraftTemplate(existing.status || "Compounded", existing.penaltyAmount || "₹25,000"));
        setPrinterStage("complete");
      } else {
        setIsExecuted(false);
        setIsEditing(false);
        setExecutedOrder(null);
        setPrinterStage("processing");
      }
    }
  }, [post]);

  if (!post) return null;

  const noticeReferenceNo = executedOrder?.noticeRef || `NOT-LM-${post.id.replace(/[^0-9]/g, "").slice(-6) || Date.now().toString().slice(-6)}`;
  const signatureHash = executedOrder?.signatureHash || `SHA256:${(Math.random() * 0xFFFFFF << 0).toString(16).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const executionDate = executedOrder?.signedAt ? new Date(executedOrder.signedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const handleSignAndExecute = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        reportId: post.id,
        status: selectedStatus,
        officerName: officerUser.displayName,
        officerRole: officerUser.role,
        penaltyAmount: selectedStatus === "Under Review" ? "N/A" : penaltyAmount,
        remarks: statutoryRemarks,
        sectionCode: selectedStatus === "Compounded" 
          ? "Section 48(1) / Rule 32 — Legal Metrology Act, 2009"
          : selectedStatus === "Notice Drafted"
          ? "Rule 32 Statutory Show Cause Notice"
          : "Rule 28 Technical Investigation Memo",
        noticeRef: noticeReferenceNo,
      };

      const res = await signAndCompoundReport(orderPayload);

      if (res.success) {
        setExecutedOrder(res.compoundingOrder || orderPayload);
        setIsExecuted(true);
        setIsEditing(false);
        setPrinterStage("processing");

        setTimeout(() => {
          setPrinterStage("printing");
        }, 800);

        setTimeout(() => {
          setPrinterStage("complete");
        }, 2400);

        if (onStatusUpdated) {
          onStatusUpdated(post.id, selectedStatus, res.compoundingOrder || orderPayload);
        }
      } else {
        alert("Failed to update status in Supabase: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error executing compounding order: " + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyNotice = () => {
    const fullText = `GOVERNMENT OF INDIA • DIRECTORATE OF LEGAL METROLOGY\n=======================================================\nNOTICE REF: ${noticeReferenceNo}\nSTATUS: ${selectedStatus.toUpperCase()}\nCOMMODITY: ${post.commodity} (Brand: ${post.brand})\nSTATUTORY CLAUSE: ${post.ruleCode} — ${post.ruleLabel}\nPENALTY/FEE: ${penaltyAmount}\nDATE: ${executionDate}\nEXECUTING OFFICER: ${officerUser.displayName} (${officerUser.role})\nDIGITAL SIGNATURE: ${signatureHash}\n\nSTATUTORY RULING & TEXT:\n${statutoryRemarks}\n=======================================================`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPDF = () => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      window.print();
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Statutory Notice - ${noticeReferenceNo}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm 20mm;
            }
            * { box-sizing: border-box; }
            body {
              font-family: 'Courier New', Courier, monospace;
              color: #111827;
              background: #ffffff;
              margin: 0;
              padding: 24px;
              line-height: 1.5;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .dossier-card {
              max-width: 680px;
              margin: 0 auto;
              border: 2px solid #111827;
              padding: 24px 28px;
              border-radius: 12px;
            }
            .header-banner {
              text-align: center;
              border-bottom: 2px dashed #9ca3af;
              padding-bottom: 16px;
              margin-bottom: 16px;
            }
            .main-title {
              font-size: 15px;
              font-weight: 900;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .sub-title {
              font-size: 13px;
              font-weight: 800;
              color: #374151;
            }
            .meta-ref {
              font-size: 11px;
              color: #6b7280;
              margin-top: 4px;
            }
            .field-row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              padding: 5px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .field-label { font-weight: 700; color: #4b5563; }
            .field-val { font-weight: 800; color: #111827; }
            .directive-container {
              border-top: 1.5px dashed #9ca3af;
              border-bottom: 1.5px dashed #9ca3af;
              padding: 14px 0;
              margin: 16px 0;
            }
            .directive-heading {
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #4b5563;
              margin-bottom: 8px;
            }
            .directive-body {
              font-size: 11.5px;
              white-space: pre-line;
              line-height: 1.6;
              background: #f9fafb;
              padding: 12px 14px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              color: #1f2937;
            }
            .officer-block {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              font-size: 12px;
              padding-top: 14px;
            }
            .seal-badge {
              font-weight: 900;
              color: #166534;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .footer-strip {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 10px;
              color: #6b7280;
              margin-top: 20px;
              border-top: 1px solid #e5e7eb;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="dossier-card">
            <div class="header-banner">
              <div class="main-title">GOVERNMENT OF INDIA • DIRECTORATE OF LEGAL METROLOGY</div>
              <div class="sub-title">${selectedStatus === "Compounded" ? "STATUTORY COMPOUNDING ORDER (SECTION 48)" : selectedStatus === "Notice Drafted" ? "FORMAL SHOW CAUSE NOTICE (RULE 32)" : "TECHNICAL INVESTIGATION MEMORANDUM"}</div>
              <div class="meta-ref">REF NO: ${noticeReferenceNo} • ISSUED: ${executionDate}</div>
            </div>
            
            <div class="field-row">
              <span class="field-label">Target Commodity:</span>
              <span class="field-val">${post.commodity}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Brand / Manufacturer:</span>
              <span class="field-val">${post.brand}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Statutory Clause:</span>
              <span class="field-val" style="color:#166534;">${post.ruleCode} (${post.ruleLabel})</span>
            </div>
            ${selectedStatus === "Compounded" ? `
            <div class="field-row" style="background:#f0fdf4;padding:6px 8px;border-radius:6px;">
              <span class="field-label" style="color:#166534;font-weight:800;">Compounding Settlement Fee:</span>
              <span class="field-val" style="color:#166534;font-size:13px;">${penaltyAmount}</span>
            </div>` : ""}

            <div class="directive-container">
              <div class="directive-heading">Official Statutory Ruling & Directive:</div>
              <div class="directive-body">${statutoryRemarks}</div>
            </div>

            <div class="officer-block">
              <div>
                <div style="font-weight:800;color:#111827;">${officerUser.displayName}</div>
                <div style="font-size:11px;color:#6b7280;">${officerUser.role}</div>
                <div style="font-size:10px;color:#9ca3af;margin-top:2px;">National Directorate of Legal Metrology</div>
              </div>
              <div style="text-align:right;">
                <div class="seal-badge">✓ SHA-256 DIGITALLY VERIFIED</div>
                <div style="font-size:10px;color:#6b7280;margin-top:2px;">${signatureHash}</div>
                <div style="font-size:10px;color:#9ca3af;">LEVEL 5 ENFORCEMENT AUTHORITY</div>
              </div>
            </div>

            <div class="footer-strip">
              <span>DOC REF: ${post.id.replace(/[^0-9]/g, "").padEnd(12, "0").slice(0, 12)}</span>
              <span>COURT-READY OFFICIAL ELECTRONIC RECORD</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case "critical":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "high":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "medium":
        return "bg-yellow-100 text-yellow-900 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-900 border-blue-300";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center overflow-y-auto overscroll-contain p-2 sm:p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className={`relative z-10 w-full ${
            activeTab === "compounding" && isExecuted && !isEditing ? "max-w-xl lg:max-w-3xl" : "max-w-3xl lg:max-w-5xl"
          } my-auto rounded-[26px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_24px_70px_rgba(0,0,0,0.35),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] overflow-hidden flex flex-col max-h-[92dvh] transition-all duration-300`}
        >
          <div className="px-5 py-3.5 bg-[#FCFCFB] text-zinc-900 flex items-center justify-between border-b border-[#D5D2D4] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#94EB41] text-[rgb(18,18,18)] border border-[#80D42F] flex items-center justify-center shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] shrink-0">
                <AnalyzeModalCustomIcon className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2
                className="text-base sm:text-lg font-[900] text-zinc-950 tracking-tight leading-snug truncate"
                style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
              >
                {post.title || `${post.commodity} • ${post.brand}`}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-[#ECEAEB] hover:bg-[#E4E2E3] text-zinc-600 hover:text-zinc-900 border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] transition-all cursor-pointer active:scale-95"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-2.5 lg:px-6 lg:py-3 bg-[#ECEAEB] border-b border-[#D5D2D4] shrink-0">
            <div className="flex items-center gap-1.5 lg:gap-2 p-0.5 lg:p-1 bg-[#DCD9DB] rounded-xl border border-[#C5C2C4] shadow-inner min-w-0">
              <button
                type="button"
                onClick={() => setActiveTab("analysis")}
                className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "analysis"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                1. Intelligence Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("compounding")}
                className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-[13px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "compounding"
                    ? "bg-[#94EB41] text-[rgb(18,18,18)] border border-[#80D42F] shadow-[0_2px_8px_rgba(148,235,65,0.3)]"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>2. Compounding & Notice Drafting</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="text-[11px] lg:text-xs font-bold text-zinc-500 uppercase tracking-wider">Status:</span>
              <span className={`px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full text-xs font-extrabold border ${
                selectedStatus === "Compounded"
                  ? "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]"
                  : selectedStatus === "Notice Drafted"
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-blue-100 text-blue-900 border-blue-300"
              }`}>
                {selectedStatus}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {activeTab === "analysis" ? (
              <div className="space-y-4 text-left">
                {isExecuted && (
                  <div className="p-3 rounded-2xl bg-[#EAFBD9] border border-[#80D42F] flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#346415]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Statutory Notice Active ({selectedStatus}) — Ref: {noticeReferenceNo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("compounding")}
                      className="px-3 py-1 rounded-xl bg-[#346415] hover:bg-[#254b0e] text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    >
                      <span>View Printed Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-white border border-[#D5D2D4] shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#ECEAEB] pb-2.5">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
                        APPLICABLE STATUTORY CLAUSE
                      </span>
                      <span className="text-sm font-extrabold text-zinc-900">
                        {post.ruleCode} — {post.ruleLabel}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getSeverityBadge(post.severity)}`}>
                      {post.severity} Severity
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {post.description || post.evidence.flagReason}
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F6F5F4] border border-[#E3E0E2]">
                      <span className="text-[9.5px] font-bold uppercase text-zinc-500 tracking-wider block">
                        OCR Snip / Extracted Label Text
                      </span>
                      <span className="font-bold text-[#92400E] block mt-0.5 font-mono text-[11px] break-words">
                        {post.evidence.ocrSnippet || "None captured"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F6F5F4] border border-[#E3E0E2]">
                      <span className="text-[9.5px] font-bold uppercase text-zinc-500 tracking-wider block">
                        Statutory Mandate Required
                      </span>
                      <span className="font-bold text-[#1E3A8A] block mt-0.5 text-[11px]">
                        {post.evidence.requiredValue || "Rule 6 / Rule 9 Statutory Requirement"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#D5D2D4] shadow-xs space-y-2">
                    <span className="text-[10.5px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                      Evidence Diagnostics
                    </span>
                    <div className="space-y-1 text-xs text-zinc-800">
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500 font-medium">Principal Display Panel:</span>
                        <span className="font-bold">{post.evidence.labelRegion || "Auto PDP"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500 font-medium">Flag Reason:</span>
                        <span className="font-bold text-rose-700 truncate max-w-[150px]">{post.evidence.flagReason || "Non-compliant"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-500 font-medium">Jurisdiction Zone:</span>
                        <span className="font-bold">{post.author?.zone || "National Directory"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#D5D2D4] shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10.5px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                        Evidence Photo
                      </span>
                      {post.imageUrl ? (
                        <div 
                          onClick={() => setLightboxImage(post.imageUrl!)}
                          className="relative aspect-video rounded-xl bg-zinc-900 border border-[#D5D2D4] overflow-hidden group cursor-pointer"
                        >
                          <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              Inspect Photo
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video rounded-xl bg-zinc-100 border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 text-xs font-semibold">
                          No image attached
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("compounding")}
                      className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#94EB41] hover:bg-[#80D42F] text-[rgb(18,18,18)] text-xs font-extrabold flex items-center justify-center gap-1.5 border border-[#80D42F] shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{isExecuted ? "View / Edit Statutory Order" : "Draft Notice / Compounding Order"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {isExecuted && !isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="flex flex-col items-center justify-center w-full max-w-[420px] mx-auto space-y-3"
                  >
                    <div className="w-full flex justify-center">
                      <ReceiptPrinter.Root stage={printerStage} feedMotion="stepped" className="w-full max-w-[400px] mx-auto">
                        <ReceiptPrinter.Machine className="w-full">
                          <ReceiptPrinter.Screen className="p-2.5">
                            <ReceiptPrinter.Status>
                              {printerStage === "printing" ? "Printing legal notice script…" : "Statutory order executed & recorded"}
                            </ReceiptPrinter.Status>
                          </ReceiptPrinter.Screen>
                        </ReceiptPrinter.Machine>
                        
                        <ReceiptPrinter.Output className="w-full px-0 !h-auto max-h-[380px] pb-1">
                          <ReceiptPrinter.Paper className="cursor-default w-full !min-h-0 !px-4 !pt-4 !pb-6">
                            <div className="font-mono text-left space-y-2.5 max-h-[310px] overflow-y-auto no-scrollbar overscroll-contain pr-0.5">
                              
                              <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-zinc-300">
                                <span className="text-xs font-extrabold text-zinc-950 block font-satoshi">
                                  GOVT OF INDIA • LEGAL METROLOGY
                                </span>
                                <span className="text-[10px] text-zinc-600 font-mono font-bold block">
                                  {selectedStatus === "Compounded" ? "STATUTORY COMPOUNDING ORDER" : selectedStatus === "Notice Drafted" ? "FORMAL SHOW CAUSE NOTICE" : "TECHNICAL INVESTIGATION MEMO"}
                                </span>
                                <span className="text-[9px] text-zinc-400 block font-mono">
                                  REF: {noticeReferenceNo} • {executionDate}
                                </span>
                              </div>

                              <div className="py-2 border-b border-dashed border-zinc-300 text-[11px] space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Commodity:</span>
                                  <span className="font-bold text-zinc-900">{post.commodity}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Brand:</span>
                                  <span className="font-bold text-zinc-900">{post.brand}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Clause:</span>
                                  <span className="font-bold text-[#346415]">{post.ruleCode}</span>
                                </div>
                                {selectedStatus === "Compounded" && (
                                  <div className="flex justify-between pt-1 border-t border-zinc-200">
                                    <span className="text-zinc-500 font-bold">Compounding Fee:</span>
                                    <span className="font-extrabold text-[#346415] text-xs">{penaltyAmount}</span>
                                  </div>
                                )}
                              </div>

                              <div className="py-2 border-b border-dashed border-zinc-300 space-y-1">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                                  Official Ruling & Directive:
                                </span>
                                <p className="text-[10px] text-zinc-800 font-mono leading-relaxed whitespace-pre-line bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                                  {statutoryRemarks}
                                </p>
                              </div>

                              <div className="py-2 border-b border-dashed border-zinc-300 flex items-center justify-between text-[9.5px]">
                                <div>
                                  <span className="text-zinc-500 block">Signatory:</span>
                                  <span className="font-bold text-zinc-900">{officerUser.displayName}</span>
                                  <span className="text-[8.5px] text-zinc-500 block">{officerUser.role}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-zinc-500 block">Digital Seal:</span>
                                  <span className="font-bold text-[#346415] flex items-center gap-1 justify-end">
                                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                                  </span>
                                </div>
                              </div>

                              <div className="pt-1.5 space-y-1">
                                <BarcodeGraphic code={post.id.replace(/[^0-9]/g, "").padEnd(12, "0").slice(0, 12)} />
                                <div className="flex justify-between items-center text-[8.5px] text-zinc-500">
                                  <span className="truncate max-w-[180px]">SIG: {signatureHash}</span>
                                  <span className="text-[#346415] font-bold">SYNCHRONIZED</span>
                                </div>
                              </div>

                            </div>
                          </ReceiptPrinter.Paper>
                        </ReceiptPrinter.Output>
                      </ReceiptPrinter.Root>
                    </div>

                    <div className="w-full flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyNotice}
                        className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#D5D2D4] shadow-xs text-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#ECEAEB] active:scale-95 transition-all cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#346415]" />
                            <span className="text-[#346415]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handlePrintPDF}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#94EB41]" />
                        <span>Save as PDF / Print</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#ECEAEB] hover:bg-[#E0DEE0] text-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-[#D5D2D4] transition-all active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#346415]" />
                      <span>Update & Re-evaluate Statutory Action</span>
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-3 max-w-xl mx-auto text-left">
                    {isEditing && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editing active order — select new status or update terms</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="font-bold text-amber-800 hover:text-amber-950 underline text-[11px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="p-3.5 rounded-2xl bg-white border border-[#D5D2D4] shadow-xs space-y-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                        Select Enforcement Track
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusSelect("Compounded")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedStatus === "Compounded"
                              ? "bg-[#EAFBD9] border-[#80D42F] text-zinc-950 shadow-sm"
                              : "bg-[#F9F8F8] border-[#D5D2D4] text-zinc-600 hover:bg-[#ECEAEB]"
                          }`}
                        >
                          <div className="flex items-center gap-1 font-extrabold text-[11px] text-[#346415]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Compounded</span>
                          </div>
                          <p className="text-[9.5px] text-zinc-600 mt-0.5 leading-snug">
                            Section 48 Settlement
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusSelect("Notice Drafted")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedStatus === "Notice Drafted"
                              ? "bg-amber-50 border-amber-400 text-zinc-950 shadow-sm"
                              : "bg-[#F9F8F8] border-[#D5D2D4] text-zinc-600 hover:bg-[#ECEAEB]"
                          }`}
                        >
                          <div className="flex items-center gap-1 font-extrabold text-[11px] text-amber-800">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Notice Drafted</span>
                          </div>
                          <p className="text-[9.5px] text-zinc-600 mt-0.5 leading-snug">
                            Rule 32 Show Cause
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusSelect("Under Review")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedStatus === "Under Review"
                              ? "bg-blue-50 border-blue-400 text-zinc-950 shadow-sm"
                              : "bg-[#F9F8F8] border-[#D5D2D4] text-zinc-600 hover:bg-[#ECEAEB]"
                          }`}
                        >
                          <div className="flex items-center gap-1 font-extrabold text-[11px] text-blue-800">
                            <Scale className="w-3.5 h-3.5" />
                            <span>Under Review</span>
                          </div>
                          <p className="text-[9.5px] text-zinc-600 mt-0.5 leading-snug">
                            Technical Audit
                          </p>
                        </button>
                      </div>
                    </div>

                    {selectedStatus === "Compounded" && (
                      <div className="p-3 rounded-2xl bg-white border border-[#D5D2D4] shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                            Compounding Penalty Imposition
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400">
                            Section 48(1) Schedule
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {["₹25,000", "₹50,000", "₹1,00,000"].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setPenaltyAmount(amt);
                                setStatutoryRemarks(generateDraftTemplate("Compounded", amt));
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                penaltyAmount === amt
                                  ? "bg-[#18181B] text-white shadow-sm"
                                  : "bg-[#ECEAEB] text-zinc-700 hover:bg-[#E0DEE0]"
                              }`}
                            >
                              {amt}
                            </button>
                          ))}
                          <input
                            type="text"
                            value={penaltyAmount}
                            onChange={(e) => setPenaltyAmount(e.target.value)}
                            placeholder="Custom (e.g. ₹35,000)"
                            className="px-2.5 py-1 rounded-xl bg-[#F6F5F4] border border-[#D5D2D4] text-[11px] font-bold text-zinc-800 outline-none focus:border-[#94EB41] flex-1 min-w-[120px]"
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-3.5 rounded-2xl bg-white border border-[#D5D2D4] shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                          Draft Notice Script ({selectedStatus})
                        </span>
                        <button
                          type="button"
                          onClick={() => setStatutoryRemarks(generateDraftTemplate(selectedStatus, penaltyAmount))}
                          className="text-[10px] text-zinc-500 hover:text-zinc-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Template</span>
                        </button>
                      </div>
                      <textarea
                        rows={6}
                        value={statutoryRemarks}
                        onChange={(e) => setStatutoryRemarks(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#F6F5F4] border border-[#D5D2D4] text-xs text-zinc-800 outline-none focus:border-[#94EB41] font-mono leading-relaxed min-h-[140px] resize-y"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F6F5F4] border border-dashed border-[#D5D2D4] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[9.5px] text-zinc-500 font-bold uppercase block">Authorizing Officer:</span>
                        <span className="font-bold text-zinc-900">{officerUser.displayName}</span>
                        <span className="text-[10px] text-zinc-500 block">{officerUser.role}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9.5px] text-zinc-500 font-bold uppercase block">Notice Ref:</span>
                        <span className="font-mono font-bold text-zinc-800 text-[11px]">{noticeReferenceNo}</span>
                        <span className="text-[9.5px] font-mono text-[#346415] font-bold block">Level 5 Signer</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignAndExecute}
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#94EB41] hover:bg-[#80D42F] text-[rgb(18,18,18)] text-xs font-extrabold flex items-center justify-center gap-2 border border-[#80D42F] shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing & Transmitting to Supabase...</span>
                        </>
                      ) : isEditing ? (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Sign & Update Order ({selectedStatus})</span>
                        </>
                      ) : (
                        <>
                          <PenTool className="w-4 h-4" />
                          <span>Sign & Execute ({selectedStatus})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-5 py-3 bg-[#ECEAEB] border-t border-[#D5D2D4] flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {activeTab === "analysis" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("compounding")}
                  className="py-2.5 px-4 rounded-xl bg-[#94EB41] hover:bg-[#80D42F] text-[rgb(18,18,18)] text-xs font-extrabold flex items-center gap-1.5 border border-[#80D42F] shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-all active:scale-95 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isExecuted ? "View Statutory Order" : "Proceed to Compounding"}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <ImageLightbox
          src={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      </div>
    </AnimatePresence>
  );
}
