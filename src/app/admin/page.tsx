"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import {
  ShieldCheck,
  LogOut,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Building,
  KeyRound,
  FileCheck2,
  Download,
  Search,
  Check,
  X,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Scale
} from "lucide-react";
import { cn } from "../../lib/utils";

interface PendingNotice {
  id: string;
  commodity: string;
  brand: string;
  inspector: string;
  zone: string;
  ruleViolated: string;
  time: string;
  penaltySection: string;
  status: "Pending Approval" | "Approved" | "Rejected";
}

const INITIAL_NOTICES: PendingNotice[] = [
  {
    id: "NOTICE-2026-881",
    commodity: "Malt Confectionery 500g",
    brand: "Crunchy Bites Pvt. Ltd.",
    inspector: "Insp. Aarav Sharma (#LM-441)",
    zone: "Delhi Central Zone",
    ruleViolated: "Rule 6(1)(d) • Unit Sale Price (USP) Omission",
    time: "25 mins ago",
    penaltySection: "Section 36(1) - ₹25,000 Initial Fine",
    status: "Pending Approval",
  },
  {
    id: "NOTICE-2026-880",
    commodity: "Laundry Detergent 1kg",
    brand: "UltraPure Chemical Labs",
    inspector: "Insp. Pooja Kulkarni (#LM-319)",
    zone: "Mumbai North Sub-division",
    ruleViolated: "Rule 6(1)(h) • Consumer Care Contact Absent",
    time: "1 hour ago",
    penaltySection: "Section 36(2) - Compound Notice Drafted",
    status: "Pending Approval",
  },
  {
    id: "NOTICE-2026-879",
    commodity: "Cooking Oil 500ml",
    brand: "Kisan Agro Foods",
    inspector: "Officer Meera Patel (#LM-582)",
    zone: "Ahmedabad West Zone",
    ruleViolated: "Rule 7 • Numeral Font Height 2.2mm (< 4.0mm)",
    time: "3 hours ago",
    penaltySection: "Section 36(1) - Corrective Warning Drafted",
    status: "Approved",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState({
    email: "admin0529@gmail.com",
    displayName: "Chief Administrator",
    role: "Senior Controller of Legal Metrology",
    jurisdiction: "National Directorate of Legal Metrology • New Delhi",
    clearance: "Level 5 Executive Authority",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=AdminController&backgroundColor=27272a",
  });

  const [notices, setNotices] = useState<PendingNotice[]>(INITIAL_NOTICES);
  const [activeTab, setActiveTab] = useState<"notices" | "officers" | "system">("notices");

  // Verify Admin Session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("klaro_admin_auth");
      if (!storedAuth) {
        // If not logged in via admin credentials, still grant access for demonstration or allow pre-filled view
        localStorage.setItem(
          "klaro_admin_auth",
          JSON.stringify({
            email: "admin0529@gmail.com",
            displayName: "Chief Administrator",
            role: "Senior Controller of Legal Metrology",
            authenticatedAt: new Date().toISOString(),
          })
        );
      }
    }
  }, []);

  const handleAdminSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("klaro_admin_auth");
    }
    router.push("/login");
  };

  const handleApproveNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Approved" } : n))
    );
  };

  const handleRejectNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Rejected" } : n))
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#E6E4E5] text-[rgb(18,18,18)] antialiased font-sans selection:bg-[#94EC40] selection:text-[rgb(18,18,18)] flex flex-col">
      
      {/* 1. TOP ADMIN CONTROL NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#FCFCFB]/95 backdrop-blur-md border-b border-[#D5D2D4] px-4 sm:px-6 lg:px-8 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Mark & Authority Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size="sm" showText={false} />
              <span
                className="text-xl font-[800] text-[rgb(18,18,18)] tracking-[-0.03em]"
                style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
              >
                klaro
              </span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-[#0B0B0D] text-[#94EC40] border border-zinc-700">
              ADMIN CONTROLLER PANEL
            </span>
          </div>

          {/* Quick Links & Sign Out */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-700 bg-[#ECEAEB] hover:bg-white border border-[#D5D2D4] transition-all hidden sm:inline-flex items-center gap-1.5"
              >
                <span>Officer Feed</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </button>
            </Link>

            <button
              type="button"
              onClick={handleAdminSignOut}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Admin Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN ADMIN DASHBOARD BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* HERO: Logged in as Admin Profile Banner */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_12px_36px_rgba(0,0,0,0.04)] relative overflow-hidden text-left">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            
            {/* Left: Admin Photo & Profile Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              
              {/* Admin Avatar Frame */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-950 border-2 border-zinc-800 shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center">
                  <img
                    src={adminUser.avatar}
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#94EC40] border-2 border-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-zinc-950" />
                </div>
              </div>

              {/* Identity & Role Text */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]">
                    ✓ Logged in as Admin
                  </span>
                  <span className="text-xs font-mono text-zinc-500 font-semibold">
                    {adminUser.clearance}
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-3xl font-[800] text-zinc-950 tracking-tight"
                  style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
                >
                  {adminUser.displayName}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 font-mono">
                  <span className="font-bold text-zinc-900">{adminUser.email}</span>
                  <span>•</span>
                  <span>{adminUser.role}</span>
                  <span>•</span>
                  <span className="text-zinc-500">{adminUser.jurisdiction}</span>
                </div>
              </div>

            </div>

            {/* Right: Security & Authentication Pill */}
            <div className="p-4 rounded-2xl bg-[#ECEAEB] border border-[#D5D2D4] space-y-1 text-xs font-mono shrink-0 self-start md:self-auto">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">DIGITAL SESSION ID</span>
              <span className="text-zinc-900 font-bold block">#LM-ADMIN-0529-AUTH</span>
              <span className="text-[#346415] text-[11px] font-bold block">✓ Verified Security Token</span>
            </div>

          </div>

        </div>

        {/* 3. EXECUTIVE KPI METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          <div className="p-5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">TOTAL INSPECTIONS</span>
            <span className="text-2xl sm:text-3xl font-bold text-zinc-950 font-mono block">1,284</span>
            <span className="text-[11px] text-[#346415] font-medium block">Across 4 State Divisions</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">PENDING NOTICE APPROVALS</span>
            <span className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono block">
              {notices.filter((n) => n.status === "Pending Approval").length}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium block">Awaiting Digital Signature</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">FIELD INSPECTORS</span>
            <span className="text-2xl sm:text-3xl font-bold text-zinc-950 font-mono block">42</span>
            <span className="text-[11px] text-zinc-500 font-medium block">Active in Jurisdiction</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">COMPLIANCE RATE</span>
            <span className="text-2xl sm:text-3xl font-bold text-[#346415] font-mono block">86.2%</span>
            <span className="text-[11px] text-zinc-500 font-medium block">LMPC 2011 Verified</span>
          </div>

        </div>

        {/* 4. ADMIN TABS & MANAGEMENT SECTION */}
        <div className="p-6 rounded-[28px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_8px_24px_rgba(0,0,0,0.03)] space-y-6 text-left">
          
          {/* Tabs Header */}
          <div className="flex items-center justify-between border-b border-[#D5D2D4] pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("notices")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
                  activeTab === "notices"
                    ? "bg-[#0B0B0D] text-white shadow-sm"
                    : "bg-[#ECEAEB] text-zinc-600 hover:text-zinc-900 border border-[#D5D2D4]"
                )}
              >
                Violation Notice Queue ({notices.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("officers")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
                  activeTab === "officers"
                    ? "bg-[#0B0B0D] text-white shadow-sm"
                    : "bg-[#ECEAEB] text-zinc-600 hover:text-zinc-900 border border-[#D5D2D4]"
                )}
              >
                Officer Roster (42)
              </button>
            </div>

            <span className="text-xs font-mono text-zinc-500 font-semibold hidden sm:inline-block">
              Controller Authorization Mode
            </span>
          </div>

          {/* Tab 1: Violation Notice Queue */}
          {activeTab === "notices" && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#D5D2D4] text-zinc-500 pb-2">
                      <th className="pb-3 font-semibold">NOTICE ID</th>
                      <th className="pb-3 font-semibold">COMMODITY & BRAND</th>
                      <th className="pb-3 font-semibold">RULE INFRACTION</th>
                      <th className="pb-3 font-semibold">INSPECTOR & ZONE</th>
                      <th className="pb-3 font-semibold">PENALTY BASIS</th>
                      <th className="pb-3 font-semibold">STATUS</th>
                      <th className="pb-3 font-semibold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEAEB] text-zinc-700">
                    {notices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-[#ECEAEB]/50 transition-colors">
                        <td className="py-3.5 font-bold text-zinc-950">{notice.id}</td>
                        <td className="py-3.5">
                          <div className="font-sans font-bold text-zinc-900 text-xs">{notice.commodity}</div>
                          <div className="text-[10px] text-zinc-500">{notice.brand}</div>
                        </td>
                        <td className="py-3.5 font-semibold text-rose-700 max-w-xs">{notice.ruleViolated}</td>
                        <td className="py-3.5 text-[11px]">
                          <div className="text-zinc-900 font-semibold">{notice.inspector}</div>
                          <div className="text-zinc-500 text-[10px]">{notice.zone}</div>
                        </td>
                        <td className="py-3.5 text-zinc-600 text-[11px]">{notice.penaltySection}</td>
                        <td className="py-3.5">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono inline-block",
                              notice.status === "Pending Approval"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : notice.status === "Approved"
                                ? "bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]"
                                : "bg-rose-100 text-rose-900 border border-rose-300"
                            )}
                          >
                            {notice.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {notice.status === "Pending Approval" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleApproveNotice(notice.id)}
                                className="px-2.5 py-1 rounded-lg bg-[#0B0B0D] text-white hover:bg-zinc-800 text-[11px] font-bold transition-colors flex items-center gap-1"
                                title="Authorize and digitally sign notice"
                              >
                                <Check className="w-3 h-3 text-[#94EC40]" />
                                <span>Sign</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectNotice(notice.id)}
                                className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                                title="Reject notice"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-zinc-400 font-mono">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Officer Roster */}
          {activeTab === "officers" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Insp. Aarav Sharma", zone: "Delhi Central", id: "#LM-441", active: "3 Scans Today", status: "Active" },
                { name: "Insp. Pooja Kulkarni", zone: "Mumbai North", id: "#LM-319", active: "5 Scans Today", status: "Active" },
                { name: "Officer Meera Patel", zone: "Ahmedabad West", id: "#LM-582", active: "2 Scans Today", status: "Active" },
              ].map((officer, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#ECEAEB] border border-[#D5D2D4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950 font-sans">{officer.name}</span>
                    <span className="text-[10px] font-mono text-[#346415] bg-[#EAFBD9] px-2 py-0.5 rounded-full font-bold">
                      {officer.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-600">{officer.zone} • {officer.id}</p>
                  <p className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-300">{officer.active}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
