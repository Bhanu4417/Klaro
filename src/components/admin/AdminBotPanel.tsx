"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, ShieldCheck, CornerDownRight } from "lucide-react";
import { KlaroBot } from "../auth/KlaroBot";
import { cn } from "../../lib/utils";

export const BotUserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="10" cy="7" r="4" />
    <path d="M10 14C5 14 2 16.5 2 19C2 20.1046 2.89543 21 4 21H16C17.1046 21 18 20.1046 18 19C18 16.5 15 14 10 14Z" />
    <path d="M20.0141 14.4757H20.0016M18 9C18 7.89543 18.8954 7 20 7C21.1046 7 22 7.89543 22 9C22 9.75709 21.5793 10.4159 20.959 10.7555C20.4745 11.0207 20 11.4477 20 12M20.0266 14.4757C20.0266 14.4896 20.0154 14.5007 20.0016 14.5007C19.9878 14.5007 19.9766 14.4896 19.9766 14.4757C19.9766 14.4619 19.9878 14.4507 20.0016 14.4507C20.0154 14.4507 20.0266 14.4619 20.0266 14.4757Z" />
  </svg>
);

export const QuestionCircleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.5 9.5C9.5 8.11929 10.6193 7 12 7C13.3807 7 14.5 8.11929 14.5 9.5C14.5 10.3569 14.0689 11.1131 13.4117 11.5636C12.7283 12.0319 12 12.6716 12 13.5" />
    <path d="M12.125 16.75H12M12.25 16.75C12.25 16.8881 12.1381 17 12 17C11.8619 17 11.75 16.8881 11.75 16.75C11.75 16.6119 11.8619 16.5 12 16.5C12.1381 16.5 12.25 16.6119 12.25 16.75Z" />
  </svg>
);
export const StaticBotAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = "",
}) => (
  <div
    className={cn("relative shrink-0 flex items-center justify-center select-none overflow-hidden", className)}
    style={{
      width: size,
      height: size,
      borderRadius: "26%",
      background: "linear-gradient(135deg, #A2F348 0%, #85E82D 50%, #5BB517 100%)",
      border: "1px solid rgba(113,113,122,0.35)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(20,60,0,0.22)",
    }}
  >
    <div
      className="absolute inset-x-0 top-0 h-[45%] pointer-events-none"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.35), transparent)" }}
    />

    <div className="relative z-10 flex items-center justify-center" style={{ gap: size * 0.12, marginTop: -size * 0.04 }}>
      <div
        className="relative rounded-full bg-white flex items-center justify-center shadow-sm"
        style={{
          width: size * 0.28,
          height: size * 0.38,
          border: "0.5px solid rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="rounded-full bg-zinc-950"
          style={{ width: size * 0.14, height: size * 0.18 }}
        />
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.05,
            height: size * 0.05,
            top: "20%",
            right: "20%",
          }}
        />
      </div>

      <div
        className="relative rounded-full bg-white flex items-center justify-center shadow-sm"
        style={{
          width: size * 0.28,
          height: size * 0.38,
          border: "0.5px solid rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="rounded-full bg-zinc-950"
          style={{ width: size * 0.14, height: size * 0.18 }}
        />
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.05,
            height: size * 0.05,
            top: "20%",
            right: "20%",
          }}
        />
      </div>
    </div>

    <div
      className="absolute z-10 rounded-full border-b-[1.5px] border-zinc-900"
      style={{
        width: size * 0.28,
        height: size * 0.12,
        bottom: "16%",
      }}
    />
  </div>
);

interface Msg {
  id: number;
  role: "user" | "ai";
  text: string;
  context?: string;
  pending?: boolean;
}

export interface BotSeed {
  question?: string;
  context?: string;
  nonce: number;
}

const PREMADE_QUESTIONS = [
  "Which rule covers missing MRP declarations?",
  "Is Rule 6(1)(d) about the manufacturer's address?",
  "What font size does Rule 7 require on labels?",
  "How do I verify an OCR-based report is genuine?",
  "What is the penalty for a false MRP print?",
  "When is a notice compoundable under the Act?",
];

const THINKING_DELAY_MS = 9000;

const THINKING_STEPS = [
  "Analyzing query & extracting statutory intent…",
  "Scanning Legal Metrology (Packaged Commodities) Rules, 2011…",
  "Cross-referencing Rule 6(1) declarations & mandatory formats…",
  "Evaluating Schedule II numeral height & contrast thresholds…",
  "Auditing case precedence & Section 48 compounding guidelines…",
  "Compiling verified statutory ruling & legal advice…",
];

const KNOWLEDGE_BASE: Record<string, string> = {
  "Which rule covers missing MRP declarations?": `⚖️ Statutory Ruling: Rule 6(1)(e) — Legal Metrology (Packaged Commodities) Rules, 2011

• Mandatory Declaration: Every pre-packaged commodity must clearly declare the Retail Sale Price in the standard format:
  "Maximum Retail Price ₹ xx.xx (inclusive of all taxes)" or "MRP ₹ xx.xx incl. of all taxes".
• Non-Compliance: Missing, smudged, altered, or overwritten MRP declarations constitute a non-compoundable statutory violation under Section 36(1) of the Act.
• Statutory Penalties (Section 36(1)):
  - 1st Offence: Fine up to ₹25,000
  - 2nd Offence: Fine up to ₹50,000
  - Subsequent: Fine up to ₹1,00,000 or imprisonment up to 1 year, or both.`,

  "Is Rule 6(1)(d) about the manufacturer's address?": `🔍 Statutory Clarification:
• Rule 6(1)(d): Mandates the declaration of NET QUANTITY (in standard units of weight, measure, or number) on the Principal Display Panel.
• Rule 6(1)(a): Mandates the Name and Complete Address of the Manufacturer, Packer, or Importer.

Key Rule 6(1)(a) Compliance Standard:
The address must include complete premises details (Premises name/number, Street/Road, Town/City, PIN Code, and State). Providing only a generic city name without postal address is a statutory violation.`,

  "What font size does Rule 7 require on labels?": `📏 Rule 7 & Schedule II — Numeral & Letter Height Standards:

• Net Quantity ≤ 50g / 50ml:
  - Normal Print: Minimum 1.0 mm
  - Blown / Moulded: Minimum 1.5 mm

• Net Quantity 50g–200g / 50ml–200ml:
  - Normal Print: Minimum 2.0 mm
  - Blown / Moulded: Minimum 3.0 mm

• Net Quantity 200g–1kg / 200ml–1L:
  - Normal Print: Minimum 4.0 mm
  - Blown / Moulded: Minimum 6.0 mm

• Net Quantity > 1kg / > 1L:
  - Normal Print: Minimum 6.0 mm
  - Blown / Moulded: Minimum 9.0 mm

Contrast Requirement: Rule 7(1) mandates high color contrast against the package backdrop so the numeral is readable without optical magnification.`,

  "How do I verify an OCR-based report is genuine?": `🛡️ OCR Verification Protocol for Enforcement Officers:

1. Principal Display Panel (PDP) Coordinates: Confirm the OCR bounding box matches the physical package zone (e.g. front face bottom-left).
2. Numeral Height & Aspect Ratio: Validate that extracted digit heights meet the Schedule II minimum threshold against package area.
3. Dual-Sticker / Alteration Detection: Check for over-stickering, scratched MRP digits, or blurred expiration stamps.
4. Manufacturer Identity Match: Cross-reference the extracted manufacturer name with the national Legal Metrology registration registry.
5. Unit Sale Price (USP): Confirm mandatory Unit Sale Price declaration for commodities under Rule 6(11).`,

  "What is the penalty for a false MRP print?": `🚨 Legal Metrology Act, 2009 — Section 36 Penalties:

• False / Dual MRP Declarations (Section 36(1)):
  - 1st Offence: Fine up to ₹25,000
  - 2nd Offence: Fine up to ₹50,000
  - Subsequent: Fine up to ₹1,00,000 or imprisonment up to 1 year, or both.

• Selling Above Declared MRP (Section 36(2)):
  - Selling at price higher than MRP is strictly prohibited and subject to immediate compounding or court proceedings.

• Dual MRP Prohibition: Having multiple MRPs on identical packages in different regions is prohibited under Rule 18(2A).`,

  "When is a notice compoundable under the Act?": `📋 Section 48 — Compounding of Offences:

• Compoundable Offences:
  Any first offence under Section 27 to 39 (including packaging non-compliance under Section 36) may be compounded by the Director, Controller, or Legal Metrology Officer.

• Compounding Fee:
  A compounding sum determined by the authorized officer, not exceeding the maximum statutory fine for that offence.

• Non-Compoundable Restrictions:
  Second or subsequent offences committed within a period of 3 years from the date of the first compounding cannot be compounded and must proceed to judicial prosecution.`,
};

function getLegalMetrologyAnswer(query: string, context?: string): string {
  const cleanQ = query.trim();
  if (KNOWLEDGE_BASE[cleanQ]) return KNOWLEDGE_BASE[cleanQ];

  const lower = (cleanQ + " " + (context || "")).toLowerCase();

  if (lower.includes("genuine") || lower.includes("ocr") || lower.includes("verify") || lower.includes("scan")) {
    return `🛡️ OCR & Report Verification Protocol:
1. PDP Zone Coordinates: Confirm detected text region corresponds to physical packaging faces.
2. Numeral & Character Ratio: Validate numeral heights against Schedule II minimum standards.
3. Anti-Tamper Check: Inspect for dual-stickering, scratched digits, or altered expiry/MRP stamps.
4. Statutory Status: If confirmed non-compliant, initiate formal compounding procedure under Section 48.`;
  }

  if (lower.includes("exact rule") || lower.includes("which rule") || lower.includes("rule code") || lower.includes("which exact rule")) {
    return `📜 Statutory Rule Reference Matrix:
• Rule 6(1)(a): Name & Complete Postal Address of Manufacturer/Packer/Importer.
• Rule 6(1)(b): Country of Origin for imported goods.
• Rule 6(1)(d): Net Quantity in standard SI units (g, kg, ml, l).
• Rule 6(1)(e): Month & Year of Manufacture / Packing.
• Rule 6(1)(e): MRP inclusive of all taxes.
• Rule 6(11): Unit Sale Price (USP) per g/ml/piece.
• Rule 7: Minimum numeral and letter height requirements under Schedule II.`;
  }

  if (lower.includes("escalation") || lower.includes("notice") || lower.includes("action") || lower.includes("procedure")) {
    return `📋 Officer Statutory Enforcement Escalation Protocol:
1. Issue Form I Notice: Serve statutory inspection notice under Section 36(1) with 7-day cure window.
2. Seizure & Verification: If uncorrected, seize representative batches under Section 15.
3. Compounding Proceeding: Offer first-time compounding under Section 48 upon compounding fee payment.
4. Judicial Prosecution: For repeat violations (within 3 years), lodge complaint before Judicial Magistrate under Section 36(1).`;
  }

  if (lower.includes("mrp") || lower.includes("price") || lower.includes("rate") || lower.includes("cost") || lower.includes("usp")) {
    return `⚖️ Legal Metrology MRP Compliance Ruling:
• Rule 6(1)(e): Maximum Retail Price must be declared in Indian Rupees as "MRP ₹ xx.xx (inclusive of all taxes)".
• Rule 6(11): Unit Sale Price (USP) in ₹ per gram/ml/kg/litre is mandatory for all pre-packaged goods.
• Dual MRP: Prohibited under Rule 18(2A) — identical goods cannot have different MRPs in different regions.
• Penalties: Section 36(1) prescribes fines up to ₹25,000 for 1st offence, ₹50,000 for 2nd offence, and ₹1,00,000/imprisonment for subsequent violations.`;
  }

  if (lower.includes("font") || lower.includes("height") || lower.includes("numeral") || lower.includes("size") || lower.includes("dimension") || lower.includes("mm")) {
    return `📏 Rule 7 & Schedule II Numeral Height Guidelines:
• ≤ 50g/ml: Minimum 1.0 mm (Blown: 1.5 mm)
• 50g–200g/ml: Minimum 2.0 mm (Blown: 3.0 mm)
• 200g–1kg/l: Minimum 4.0 mm (Blown: 6.0 mm)
• > 1kg/l: Minimum 6.0 mm (Blown: 9.0 mm)
Contrast Requirement: Rule 7(1) mandates high color contrast against background without optical magnification.`;
  }

  if (lower.includes("mfg") || lower.includes("date") || lower.includes("pkd") || lower.includes("expiry") || lower.includes("month") || lower.includes("year") || lower.includes("best before")) {
    return `📅 Rule 6(1)(e) Manufacturing & Expiry Mandates:
• Month & Year: Must be printed clearly as "MFG 08/2026", "PKD 08/2026", or "Month & Year of Manufacture: August 2026".
• Best Before / Expiry: Mandatory for perishable items and cosmetics in terms of months/days from manufacture.
• Omission Penalty: Missing date constitutes packaging non-compliance punishable under Section 36(1).`;
  }

  if (lower.includes("address") || lower.includes("manufacturer") || lower.includes("packer") || lower.includes("importer") || lower.includes("origin")) {
    return `🏭 Rule 6(1)(a) & 6(1)(b) Manufacturer Declaration:
• Complete postal address of manufacturer, packer, or importer is mandatory.
• Country of Origin must be explicitly declared on imported packages (Rule 6(1)(b)).
• Consumer Care details (Name, Address, Telephone, Email) must be declared under Rule 6(1)(n). Providing only a city name violates the Act.`;
  }

  if (lower.includes("penalty") || lower.includes("fine") || lower.includes("punishment") || lower.includes("jail") || lower.includes("section 36")) {
    return `🚨 Statutory Penalties under Legal Metrology Act, 2009:
• Section 36(1) (Package Violation): ₹25,000 (1st offence), ₹50,000 (2nd offence), ₹1,00,000 or 1 year imprisonment (subsequent).
• Section 36(2) (Overcharging MRP): Mandatory penal action under the Act & Consumer Protection Act 2019.
• Section 48: First offences may be compounded by payment of the compounded fee.`;
  }

  if (lower.includes("compound") || lower.includes("settle") || lower.includes("section 48")) {
    return `📋 Compounding Protocol (Section 48):
• Authorized Officers: Director of Legal Metrology or State Controller.
• Scope: First offences under Section 27 to 39 are compoundable.
• Limitation: Second and subsequent offences within 3 years cannot be compounded and require criminal court proceedings.`;
  }

  if (lower.includes("net qty") || lower.includes("quantity") || lower.includes("weight") || lower.includes("volume")) {
    return `⚖️ Rule 6(1)(d) & Rule 12 Net Quantity Mandate:
• Net quantity must be in standard SI units (g, kg, ml, l) with correct symbols.
• Non-standard units (e.g. "gm", "gms", "kilos") violate Rule 13.
• Letter/numeral height must adhere to Schedule II standards.`;
  }

  if (context) {
    return `📋 Legal Metrology Verification Dossier:
• Reference Context: "${context.slice(0, 100)}${context.length > 100 ? "…" : ""}"
• Statutory Assessment: Evaluated under Legal Metrology (Packaged Commodities) Rules, 2011.
• Actionable Directive: Officer may issue a statutory notice under Section 36(1). First offences remain compoundable under Section 48.`;
  }

  return `⚖️ Legal Metrology Statutory Guidance:
• Applicable Framework: Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011.
• Key Declarations (Rule 6): Name & Address, Net Qty, Month/Year of Manufacture, MRP (incl. all taxes), Consumer Care, and Unit Sale Price.
• Enforcement Authority: Section 36 & Section 48 empower authorized officers to issue inspection notices and compounding orders.`;
}

export const AdminBotPanel: React.FC<{
  open: boolean;
  onClose: () => void;
  seed?: BotSeed | null;
  onSeedConsumed?: () => void;
  adminEmail?: string;
}> = ({ open, onClose, seed, onSeedConsumed, adminEmail = "admin0529@gmail.com" }) => {
  const storageKey = `klaro_chat_history_${adminEmail}`;
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(`klaro_chat_history_${adminEmail}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((m: any) => m && m.text && !m.pending)
            .map((m: any, idx: number) => ({ ...m, id: idx + 1 }));
        }
      }
    } catch (e) {
      console.warn("Could not load chat history from localStorage", e);
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [thinkingStepIndex, setThinkingStepIndex] = useState(0);
  const [botEyesDown, setBotEyesDown] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(() => PREMADE_QUESTIONS.slice(0, 6));
  const idRef = useRef(messages.length + 1);
  const listRef = useRef<HTMLDivElement>(null);
  const seedRef = useRef<BotSeed | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        const toSave = messages.filter((m) => !m.pending && m.text);
        if (toSave.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(toSave));
        }
      } catch (e) {
        console.warn("Could not save chat history to localStorage", e);
      }
    }
  }, [messages, storageKey]);

  useEffect(() => {
    if (!open) return;
    const shuffled = [...PREMADE_QUESTIONS].sort(() => Math.random() - 0.5);
    setSuggestedQuestions(shuffled.slice(0, 6));
  }, [open]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 60);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, thinking, thinkingStepIndex]);

  const handleClearHistory = () => {
    setMessages([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn("Could not clear chat history", e);
    }
  };

  const ask = async (question: string, context?: string) => {
    if (!question.trim()) return;
    const userId = idRef.current++;
    const aiId = idRef.current++;
    setMessages((m) => [
      ...m,
      { id: userId, role: "user", text: question, context },
      { id: aiId, role: "ai", text: "", pending: true } as any,
    ]);
    setThinking(true);
    setThinkingStepIndex(0);
    scrollToBottom();

    const stepDuration = Math.floor(THINKING_DELAY_MS / THINKING_STEPS.length);
    const stepInterval = setInterval(() => {
      setThinkingStepIndex((cur) => (cur + 1) % THINKING_STEPS.length);
    }, stepDuration);

    const answer = getLegalMetrologyAnswer(question, context);
    await new Promise((r) => setTimeout(r, THINKING_DELAY_MS));

    clearInterval(stepInterval);
    setMessages((m) =>
      m.map((msg) => (msg.id === aiId ? { ...msg, text: answer, pending: false } : msg))
    );
    setThinking(false);
    scrollToBottom();
  };

  useEffect(() => {
    if (open && seed && seed.nonce !== seedRef.current?.nonce) {
      seedRef.current = seed;
      if (seed.question) {
        ask(seed.question, seed.context);
      }
      onSeedConsumed?.();
    }
  }, [open, seed?.nonce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    ask(q);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#FCFCFB]">
      <div className="shrink-0 h-[54px] px-4 sm:px-6 border-b border-[#ECEAEB] flex items-center justify-between bg-gradient-to-r from-[#FCFCFB] via-[#F7FFF0] to-[#FCFCFB]">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setBotEyesDown((prev) => !prev)}
            className="w-9 h-9 rounded-2xl bg-[#EAFBD9] border border-[#B8F27D] flex items-center justify-center shadow-[0_4px_12px_rgba(148,235,65,0.22)] cursor-pointer active:scale-95 transition-transform"
            title="Click Klaro to toggle looking down"
          >
            <KlaroBot
              state={thinking ? "scanning" : botEyesDown ? "typing" : "idle"}
              size="sm"
              showShadow={false}
              interactive={!botEyesDown}
            />
          </button>
          <div>
            <p className="text-sm font-[900] text-zinc-950 flex items-center gap-1.5 tracking-tight">
              KlaroReport
              <ShieldCheck className="w-3.5 h-3.5 text-[#346415]" />
            </p>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              {thinking ? "Analyzing Legal Metrology Rules (9s)…" : botEyesDown ? "Klaro is reading messages…" : "Your legal metrology copilot"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="px-2 py-1 rounded-lg text-[10.5px] font-mono font-bold text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-[#ECEAEB] active:scale-90 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#F8F8F6]/70">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="flex items-center justify-center">
              <BotUserIcon className="w-12 h-12 text-zinc-900 drop-shadow-sm" />
            </div>
            <div>
              <p className="text-sm font-[900] text-zinc-950 font-satoshi">Klaro Legal Metrology Assistant</p>
              <p className="mt-1 text-xs text-zinc-500 max-w-xs leading-relaxed">
                Query statutory rules, verify OCR label infractions, check compounding penalties, or select a quick question below.
              </p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "user" ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 text-xs font-semibold bg-[#94EB41] text-[rgb(18,18,18)] border border-[#80D42F] shadow-sm leading-relaxed">
                  {m.context && (
                    <span className="flex items-start gap-1 text-[10px] text-zinc-800 border-l-2 border-zinc-900/40 pl-2 mb-1.5 italic line-clamp-2">
                      <CornerDownRight className="w-3 h-3 shrink-0 mt-0.5" />
                      “{m.context.slice(0, 90)}{m.context.length > 90 ? "…" : ""}”
                    </span>
                  )}
                  <span className="whitespace-pre-wrap">{m.text}</span>
                </div>
              ) : "pending" in m && (m as any).pending ? (
                <div className="flex items-start gap-2.5 max-w-[88%]">
                  <div className="shrink-0 pt-0.5">
                    <StaticBotAvatar size={28} />
                  </div>
                  <div className="relative bg-white border border-[#ECEAEB] rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm text-xs space-y-2 w-full max-w-[320px]">
                    <div className="absolute top-3 -left-[6px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-white z-10" />
                    <div className="absolute top-3 -left-[7.5px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-[#ECEAEB]" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#346415] font-mono font-bold text-[10px] uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3 text-[#346415]" />
                        <span>Legal Metrology Engine</span>
                      </div>
                      <span className="text-[9.5px] font-mono font-bold text-zinc-400">9s Analysis</span>
                    </div>

                    <p className="text-zinc-700 font-semibold text-[11.5px] leading-snug">
                      {THINKING_STEPS[thinkingStepIndex]}
                    </p>

                    <div className="w-full h-1 rounded-full bg-[#ECEAEB] overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 9, ease: "linear" }}
                        className="h-full bg-[#80D42F] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 max-w-[88%]">
                  <div className="shrink-0 pt-0.5">
                    <StaticBotAvatar size={28} />
                  </div>
                  <div className="relative rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-[#ECEAEB] text-zinc-800 text-xs shadow-sm leading-relaxed space-y-1.5">
                    <div className="absolute top-3 -left-[6px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-white z-10" />
                    <div className="absolute top-3 -left-[7.5px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-[#ECEAEB]" />

                    <div className="flex items-center gap-1.5 pb-1 border-b border-[#ECEAEB] text-[10px] font-mono font-bold text-[#346415] uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#346415]" />
                      <span>Statutory Verified Ruling</span>
                    </div>
                    <div className="whitespace-pre-wrap font-sans text-zinc-900 leading-relaxed font-medium">
                      {m.text}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="shrink-0 px-3 pt-2 pb-1 bg-[#FCFCFB] border-t border-[#ECEAEB]">
        <div className="flex items-center gap-1.5 mb-1.5 px-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
          <QuestionCircleIcon className="w-3.5 h-3.5 text-zinc-500" />
          <span>Quick Questions</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => ask(q)}
              className="shrink-0 px-2.5 py-1.5 rounded-xl bg-[#ECEAEB] hover:bg-[#EAFBD9] border border-[#D5D2D4] hover:border-[#94EC40] text-[10.5px] font-semibold text-zinc-700 hover:text-[#346415] transition-all active:scale-[0.98] whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-3 py-2.5 border-t border-[#ECEAEB] bg-[#FCFCFB]">
        <div className="relative flex items-center gap-2 rounded-2xl bg-[#ECEAEB] border border-[#D5D2D4] p-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus-within:bg-white focus-within:border-[#94EC40] focus-within:ring-2 focus-within:ring-[#94EC40]/20 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ask about rules, verify a report…"
            aria-label="Ask KlaroReport"
            autoFocus
            className="flex-1 min-w-0 px-3 py-2 bg-transparent text-xs text-zinc-800 placeholder-zinc-400 outline-none font-medium"
          />
          <button
            type="button"
            onClick={submit}
            disabled={thinking}
            title="Ask Officer Assist"
            className="p-2.5 rounded-xl bg-[#94EC40] text-[rgb(18,18,18)] border border-[#80D42F] shadow-[0_3px_10px_rgba(148,235,65,0.3)] hover:bg-[#85DF32] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5 stroke-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
