"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { ShareModal } from "../../components/ShareModal";
import { ScanFlow } from "../../components/scan/ScanFlow";
import {
  LogOut,
  User,
  ShieldCheck,
  Search,
  Plus,
  MessageSquare,
  Share2,
  ArrowBigUp,
  ArrowBigDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  Filter,
  Flame,
  Clock,
  ShieldAlert,
  Send,
  MoreHorizontal,
  Bookmark,
  Scale,
  Camera,
  ImageIcon,
  Layers,
  ChevronDown,
  Building2,
  ExternalLink,
  Home,
  Check,
  Award,
  Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";

interface FeedComment {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  timeAgo: string;
  text: string;
}

interface OfficerPost {
  id: string;
  author: {
    name: string;
    badge: string;
    avatar: string;
    zone: string;
  };
  timeAgo: string;
  title: string;
  commodity: string;
  brand: string;
  ruleCode: string;
  ruleLabel: string;
  severity: "high" | "medium" | "low";
  description: string;
  penaltySection: string;
  evidence: {
    labelRegion: string;
    ocrSnippet: string;
    flagReason: string;
    measuredValue?: string;
    requiredValue?: string;
  };
  upvotes: number;
  commentsCount: number;
  userVote?: "up" | "down" | null;
  comments: FeedComment[];
  status: "Pending Approval" | "Notice Drafted" | "Compounded" | "Approved" | "Rejected";
}

const INITIAL_OFFICER_POSTS: OfficerPost[] = [
  {
    id: "post-1",
    author: {
      name: "Insp. Aarav Sharma",
      badge: "Sr. Legal Metrology Officer",
      avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Aarav&backgroundColor=27272a",
      zone: "Delhi Central Zone",
    },
    timeAgo: "25 mins ago",
    title: "Brand XYZ 500g Malt Biscuits completely omitted Unit Sale Price (USP) on Principal Display Panel",
    commodity: "Packaged Malt Biscuits",
    brand: "Crunchy Bites Pvt. Ltd.",
    ruleCode: "Rule 6(1)(d)",
    ruleLabel: "Retail Price & USP Non-Compliance",
    severity: "high",
    penaltySection: "Section 36(1) • ₹25,000 Initial Penalty",
    description:
      "Field inspection in Connaught Place retail outlet. Package declares MRP ₹120.00 but omits mandatory Unit Sale Price (₹0.24/g) and does not state 'Inclusive of all taxes'. Second Schedule violation.",
    evidence: {
      labelRegion: "Lower Right PDP • Coordinates (x: 420, y: 710, w: 180, h: 45)",
      ocrSnippet: "MRP Rs 120.00 (PKD 07/2026)",
      flagReason: "Missing ₹ per g/kg specification and tax inclusion text.",
      measuredValue: "No USP Found",
      requiredValue: "₹0.24 per g (Mandatory since 2022 Amendment)",
    },
    upvotes: 48,
    commentsCount: 6,
    userVote: null,
    status: "Pending Approval",
    comments: [
      {
        id: "c-1",
        author: "Insp. Vikram Nair",
        authorRole: "Zonal Enforcement Head",
        avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Vikram&backgroundColor=27272a",
        timeAgo: "1 hour ago",
        text: "Same manufacturer had a repeat infraction in Maharashtra Zone 2 last month under Section 36 of the Legal Metrology Act.",
      },
    ],
  },
  {
    id: "post-2",
    author: {
      name: "Insp. Pooja Kulkarni",
      badge: "District Metrology Inspector",
      avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Pooja&backgroundColor=27272a",
      zone: "Mumbai Sub-division IV",
    },
    timeAgo: "1 hour ago",
    title: "Consumer Grievance Care details completely absent on 1kg Laundry Detergent packaging",
    commodity: "Household Cleaning Detergent 1kg",
    brand: "UltraPure Chemical Labs",
    ruleCode: "Rule 6(1)(h)",
    ruleLabel: "Consumer Care Contact Omission",
    severity: "high",
    penaltySection: "Section 36(2) • Compound Notice Drafted",
    description:
      "Surveillance inspection at Andheri supermarket. The product label lacks any phone number, email ID, or grievance officer designation required for customer complaints.",
    evidence: {
      labelRegion: "Rear Information Panel • Bounding Box (x: 80, y: 540, w: 310, h: 80)",
      ocrSnippet: "[OCR FOUND 0 CONTACT RECORDS]",
      flagReason: "Mandatory telephone number and email address absent.",
      measuredValue: "0 Contact Entries",
      requiredValue: "Valid Tel No. + Email + Postal Address",
    },
    upvotes: 35,
    commentsCount: 3,
    userVote: null,
    status: "Pending Approval",
    comments: [
      {
        id: "c-3",
        author: "Insp. Rohit Joshi",
        authorRole: "Inspector",
        avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Rohan&backgroundColor=27272a",
        timeAgo: "2 hours ago",
        text: "Section 36 compound notice drafted. Awaiting senior controller digital approval.",
      },
    ],
  },
  {
    id: "post-3",
    author: {
      name: "Officer Meera Patel",
      badge: "Field Surveillance Officer",
      avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Meera&backgroundColor=27272a",
      zone: "Ahmedabad West Zone",
    },
    timeAgo: "3 hours ago",
    title: "Principal Display Panel letter height measured 2.2mm on 500g pack (Minimum 4.0mm required)",
    commodity: "Refined Sunflower Oil 500ml",
    brand: "Kisan Agro Foods",
    ruleCode: "Rule 7 & 8",
    ruleLabel: "Sub-standard Numeral/Letter Height",
    severity: "medium",
    penaltySection: "Section 36(1) • Statutory Warning Issued",
    description:
      "Optical character segmentation measured net volume numeral height at 2.2mm. Table under Rule 7 mandates letter height of at least 4.0mm for package area between 200cm² to 500cm².",
    evidence: {
      labelRegion: "Front Center PDP • Area 240 cm²",
      ocrSnippet: "Net Vol: 500 ml",
      flagReason: "Measured font height is 45% below statutory minimum.",
      measuredValue: "2.2 mm font height",
      requiredValue: "≥ 4.0 mm font height",
    },
    upvotes: 27,
    commentsCount: 2,
    userVote: null,
    status: "Approved",
    comments: [],
  },
  {
    id: "post-4",
    author: {
      name: "Insp. Suresh Rawat",
      badge: "Standards & Verification Officer",
      avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Suresh&backgroundColor=27272a",
      zone: "Bengaluru South Metro",
    },
    timeAgo: "7 hours ago",
    title: "Dual MRP sticker pasting detected over original printed retail price on Imported Confectionery",
    commodity: "Imported Hazelnut Spread 350g",
    brand: "ChocoDelight Global Imports",
    ruleCode: "Rule 18(2)",
    ruleLabel: "Dual Pricing & Over-stickering Violation",
    severity: "high",
    penaltySection: "Section 36(2) • Compounding Penalty Paid",
    description:
      "Physical sticker of ₹399 pasted over factory printed MRP of ₹290. Section 18(2) strictly forbids affixing higher individual stickers over packaged goods.",
    evidence: {
      labelRegion: "Lid Barcode Overlay • Bounding Box (x: 120, y: 40, w: 160, h: 60)",
      ocrSnippet: "Sticker MRP ₹399.00 vs Base ₹290.00",
      flagReason: "Alteration of price declared by manufacturer/importer.",
      measuredValue: "+₹109.00 Overcharge",
      requiredValue: "Original Base Declaration Only",
    },
    upvotes: 62,
    commentsCount: 9,
    userVote: null,
    status: "Compounded",
    comments: [],
  },
];

const MY_OFFICER_REPORTS = [
  { id: "rep-1", title: "Amul Butter 500g — Missing USP Declaration", ruleCode: "Rule 6(1)(d)", status: "Approved", date: "Today", upvotes: 24, statusColor: "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]", commodity: "Butter 500g", brand: "Amul GCMMF" },
  { id: "rep-2", title: "Lays Wafer Chips — Illegible Net Qty Font", ruleCode: "Rule 7 & 8", status: "Compounded", date: "Yesterday", upvotes: 18, statusColor: "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]", commodity: "Potato Chips 90g", brand: "PepsiCo India" },
  { id: "rep-3", title: "Dabur Honey 250g — Consumer Care Email Absent", ruleCode: "Rule 6(1)(h)", status: "Pending Approval", date: "24 Aug", upvotes: 31, statusColor: "bg-amber-100 text-amber-900 border-amber-300", commodity: "Honey 250g", brand: "Dabur India" },
  { id: "rep-4", title: "Tata Salt Lite 1kg — Dual MRP Sticker", ruleCode: "Rule 18(2)", status: "Compounded", date: "22 Aug", upvotes: 45, statusColor: "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]", commodity: "Iodised Salt 1kg", brand: "Tata Consumer" },
];

const TRENDING_INSPECTION_TOPICS = [
  { id: "tr-1", title: "USP Omission on 500g+ Packs", stat: "34 New Files", trend: "+24%", active: true },
  { id: "tr-2", title: "Consumer Care Omissions", stat: "19 Pending", trend: "+12%", active: false },
  { id: "tr-3", title: "Font Height < 4.0mm", stat: "12 In Review", trend: "+8%", active: false },
  { id: "tr-4", title: "Dual MRP Stickering", stat: "8 Notices", trend: "+45%", active: false },
];

// Custom SVGs
const HomeNavIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.2393 4.21402L18.7291 7.76569C20.1065 8.65683 20.7952 9.1024 21.2335 9.77124C21.6717 10.4401 21.8016 11.246 22.0614 12.8578L22.2579 14.0768C22.6963 16.7963 22.9155 18.1561 22.1993 19.1418C21.9056 19.546 21.5232 19.8807 21.0779 20.1232C20.0401 20.6874 18.6608 20.4687 15.9022 20.0313C14.7733 19.8523 14.2089 19.7628 13.6874 19.4975C13.2268 19.2632 12.8227 18.9195 12.5087 18.4947C12.1534 18.014 11.979 17.4691 11.6303 16.3792L11.5833 16.2323C11.2346 15.1425 11.0602 14.5976 10.7049 14.1169C10.3909 13.6921 9.98684 13.3484 9.5262 13.1141C9.00473 12.8488 8.44031 12.7593 7.31147 12.5803L5.30906 12.2628C3.12513 11.9165 2.03316 11.7433 1.40866 10.9995C0.784157 10.2556 0.898495 9.15579 1.12717 6.95608C1.35035 4.8091 1.46194 3.73561 2.11585 3.02321C2.76976 2.31081 3.82914 2.11867 5.9479 1.73441L7.26601 1.49539C9.28186 1.1298 10.2898 0.947005 11.1648 1.34127C11.9387 1.69002 12.569 2.29828 12.9649 3.07844C13.4124 3.96025 13.2393 4.21402 13.2393 4.21402Z" />
    <path d="M2 14.5C2 14.5 4.5 15 7 15C9.5 15 12 14.5 12 14.5" />
    <path d="M17 19.5V17.5" />
  </svg>
);

const FeedNavIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.5 14.25V11.25C19.5 7.10786 16.1421 3.75 12 3.75C7.85786 3.75 4.5 7.10786 4.5 11.25V14.25C4.5 16.3207 4.5 17.356 4.97817 18.1068C5.45634 18.8576 6.32624 19.1838 8.06604 19.8362L8.76182 20.0971C10.8711 20.8881 11.9257 21.2836 12.9806 20.9702C14.0355 20.6568 14.8115 19.7126 16.3636 17.8243L16.8924 17.1812C18.1691 15.6282 18.8075 14.8517 19.1537 13.9258C19.5 13 19.5 11.979 19.5 9.93695" />
    <path d="M9 11.25H15M9 7.5H15M9 15H12" />
  </svg>
);

const ReportsNavIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 11V10C19 6.22876 19 4.34315 17.8284 3.17157C16.6569 2 14.7712 2 11 2C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22" />
    <path d="M21 22L19.2857 20.2857M19.8571 17.4286C19.8571 19.3221 18.3221 20.8571 16.4286 20.8571C14.535 20.8571 13 19.3221 13 17.4286C13 15.535 14.535 14 16.4286 14C18.3221 14 19.8571 15.535 19.8571 17.4286Z" />
    <path d="M7 7H15M7 11H11" />
  </svg>
);

const ProfileNavIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" />
    <path d="M20.5899 22C20.5899 18.134 16.7419 15 11.9999 15C7.25791 15 3.40991 18.134 3.40991 22" />
  </svg>
);

const InspectionCameraCustomIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 7.49945V15.4994C22 18.3279 22 19.7421 21.1213 20.6208C20.2426 21.4994 18.8284 21.4994 16 21.4994H8C5.17157 21.4994 3.75736 21.4994 2.87868 20.6208C2 19.7421 2 18.3279 2 15.4994V12.9994C2 10.171 2 8.7568 2.87868 7.87812C3.75736 6.99944 5.17157 6.99944 8 6.99944H8.39922C9.02578 6.99944 9.33906 6.99944 9.62612 6.91124C9.81759 6.85241 9.99914 6.76516 10.1647 6.65239C10.4129 6.48333 10.6086 6.2387 11 5.74944C11.3914 5.26018 11.5871 5.01555 11.8353 4.84648C12.0009 4.73372 12.1824 4.64646 12.3739 4.58763C12.5504 4.53339 12.7369 4.5086 13 4.50056" />
    <path d="M16 5.00056H21M18.5 7.50056V2.50056" />
    <path d="M5 10.0006H7" />
    <path d="M18.5309 14.0006C18.5309 16.2097 16.74 18.0006 14.5309 18.0006C12.3217 18.0006 10.5309 16.2097 10.5309 14.0006C10.5309 11.7914 12.3217 10.0006 14.5309 10.0006C16.74 10.0006 18.5309 11.7914 18.5309 14.0006Z" />
  </svg>
);

const SparkleAddPhotoCustomIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 15.502L7.46967 11.5323C7.80923 11.1927 8.26978 11.002 8.75 11.002C9.23022 11.002 9.69077 11.1927 10.0303 11.5323L12.5858 14.0877C13.2525 14.7544 13.5858 15.0877 14 15.0877C14.4142 15.0877 14.7475 14.7544 15.4142 14.0877L15.9697 13.5323C16.3092 13.1927 16.7698 13.002 17.25 13.002C17.7302 13.002 18.1908 13.1927 18.5303 13.5323L20.5 15.502" />
    <path d="M21 10.5V12C21 16.2426 21 18.364 19.682 19.682C18.364 21 16.2426 21 12 21C7.75736 21 5.63604 21 4.31802 19.682C3 18.364 3 16.2426 3 12C3 7.75736 3 5.63604 4.31802 4.31802C5.63604 3 7.75736 3 12 3H13.5" />
    <path d="M19.5 2.9375V4.5M19.5 4.5V6.0625M19.5 4.5H18.25M19.5 4.5H20.75M22 4.5L20.9156 4.13852C20.4179 3.97263 20.0274 3.58211 19.8615 3.08443L19.5 2L19.1385 3.08443C18.9726 3.58211 18.5821 3.97263 18.0844 4.13852L17 4.5L18.0844 4.86148C18.5821 5.02737 18.9726 5.41789 19.1385 5.91557L19.5 7L19.8615 5.91557C20.0274 5.41789 20.4179 5.02737 20.9156 4.86148L22 4.5Z" />
  </svg>
);

const AddPhotoCustomIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 16L7.46967 11.5303C7.80923 11.1908 8.26978 11 8.75 11C9.23022 11 9.69077 11.1908 10.0303 11.5303L14 15.5M15.5 17L14 15.5M21 16L18.5303 13.5303C18.1908 13.1908 17.7302 13 17.25 13C16.7698 13 16.3092 13.1908 15.9697 13.5303L14 15.5" />
    <path d="M12 2.5C7.77027 2.5 5.6554 2.5 4.25276 3.69797C4.05358 3.86808 3.86808 4.05358 3.69797 4.25276C2.5 5.6554 2.5 7.77027 2.5 12C2.5 16.2297 2.5 18.3446 3.69797 19.7472C3.86808 19.9464 4.05358 20.1319 4.25276 20.302C5.6554 21.5 7.77027 21.5 12 21.5C16.2297 21.5 18.3446 21.5 19.7472 20.302C19.9464 20.1319 20.1319 19.9464 20.302 19.7472C21.5 18.3446 21.5 16.2297 21.5 12" />
    <path d="M21.5 6H18M18 6H14.5M18 6V2.5M18 6V9.5" />
  </svg>
);

const TrendingFlameCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.8561 22C26.0783 19 19.2338 7 10.9227 2C9.9453 5.5 8.47838 6.5 5.54497 10C1.66121 14.6339 3.5895 20 8.96719 22C8.1524 21 6.04958 18.9008 7.5 16C8 15 9 14 8.5 12C9.47778 12.5 11.5 13 12 15.5C12.8148 14.5 13.6604 12.4 12.8783 10C19 14.5 16.5 19 13.8561 22Z" />
  </svg>
);

const ReportNavbarCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M19 11V10C19 6.22876 19 4.34315 17.8284 3.17157C16.6569 2 14.7712 2 11 2C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22" strokeLinejoin="round" />
    <path d="M21 22L19.2857 20.2857M19.8571 17.4286C19.8571 19.3221 18.3221 20.8571 16.4286 20.8571C14.535 20.8571 13 19.3221 13 17.4286C13 15.535 14.535 14 16.4286 14C18.3221 14 19.8571 15.535 19.8571 17.4286Z" />
    <path d="M7 7H15M7 11H11" strokeLinejoin="round" />
  </svg>
);

const ShareCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 10.5L21 3" />
    <path d="M16 3H21V8" />
    <path d="M21 14V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H10" />
  </svg>
);

export default function AdminDashboardPage() {
  const router = useRouter();

  // Admin Officer User state
  const [adminUser, setAdminUser] = useState({
    email: "admin0529@gmail.com",
    displayName: "Chief Administrator",
    role: "Senior Controller of Legal Metrology",
    jurisdiction: "National Directorate of Legal Metrology • New Delhi",
    clearance: "Level 5 Executive Authority",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=AdminController&backgroundColor=27272a",
  });

  const [posts, setPosts] = useState<OfficerPost[]>(INITIAL_OFFICER_POSTS);
  const [activeFilter, setActiveFilter] = useState<string>("All Infractions");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Mobile navigation tab state: home | feed | reports | profile
  const TABS: Array<"home" | "feed" | "reports" | "profile"> = ["home", "feed", "reports", "profile"];
  const [mobileTab, setMobileTab] = useState<"home" | "feed" | "reports" | "profile">("home");

  // Mobile Touch Swipe Gestures (Left / Right)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY !== null && touchEndY !== null ? Math.abs(touchStartY - touchEndY) : 0;

    if (Math.abs(distanceX) > distanceY && Math.abs(distanceX) > minSwipeDistance) {
      const currentIndex = TABS.indexOf(mobileTab);
      if (distanceX > 0 && currentIndex < TABS.length - 1) {
        setMobileTab(TABS[currentIndex + 1]);
      } else if (distanceX < 0 && currentIndex > 0) {
        setMobileTab(TABS[currentIndex - 1]);
      }
    }
  };

  // Scan & Photo Flow
  const [scanImageUrl, setScanImageUrl] = useState<string | null>(null);
  const [isPickerChoiceOpen, setIsPickerChoiceOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sharing Modal
  const [sharingPost, setSharingPost] = useState<{
    isOpen: boolean;
    title: string;
    postId: string;
    url: string;
  }>({
    isOpen: false,
    title: "",
    postId: "",
    url: "",
  });

  // Verify Admin Session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("klaro_admin_auth");
      if (!storedAuth) {
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
    setPosts((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Approved" } : n))
    );
  };

  const handleRejectNotice = (id: string) => {
    setPosts((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Rejected" } : n))
    );
  };

  const handleVote = (postId: string, direction: "up" | "down") => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (p.userVote === direction) {
          return {
            ...p,
            upvotes: direction === "up" ? p.upvotes - 1 : p.upvotes + 1,
            userVote: null,
          };
        }
        let delta = 0;
        if (p.userVote === null) {
          delta = direction === "up" ? 1 : -1;
        } else {
          delta = direction === "up" ? 2 : -2;
        }
        return {
          ...p,
          upvotes: p.upvotes + delta,
          userVote: direction,
        };
      })
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: FeedComment = {
      id: `c-${Date.now()}`,
      author: adminUser.displayName,
      authorRole: adminUser.role,
      avatar: adminUser.avatar,
      timeAgo: "Just now",
      text,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const openPickerChoice = () => setIsPickerChoiceOpen(true);
  const closePickerChoice = () => setIsPickerChoiceOpen(false);

  const handleChooseCamera = () => {
    closePickerChoice();
    cameraInputRef.current?.click();
  };

  const handleChooseGallery = () => {
    closePickerChoice();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setScanImageUrl(base64);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleScanPost = ({ imageUrl, title }: { imageUrl: string; title: string }) => {
    const newPost: OfficerPost = {
      id: `post-${Date.now()}`,
      author: {
        name: adminUser.displayName,
        badge: "Chief Metrology Controller",
        avatar: adminUser.avatar,
        zone: "National Directorate",
      },
      timeAgo: "Just now",
      title,
      commodity: "Packaged Commodity (Scanned)",
      brand: "Detected via Klaro OCR",
      ruleCode: "Rule 6(1)(d)",
      ruleLabel: "Retail Price & USP Non-Compliance",
      severity: "high",
      penaltySection: "Section 36(1) • Statutory Notice",
      description: "Auto-generated from digital inspection scan. Section 36 penalty notice issued for verification.",
      evidence: {
        labelRegion: "Auto-detected PDP • Confidence 98%",
        ocrSnippet: "MRP Rs 120.00 (PKD 07/2026)",
        flagReason: "Missing ₹ per g/kg specification and tax inclusion text.",
        requiredValue: "₹0.24 per g (Mandatory since 2022 Amendment)",
      },
      upvotes: 1,
      commentsCount: 0,
      userVote: null,
      status: "Pending Approval",
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setMobileTab("feed");
    setScanImageUrl(null);
  };

  const handleScanSave = () => {
    setScanImageUrl(null);
  };

  const handleOpenShare = (title: string, postId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://klaro.app";
    setSharingPost({
      isOpen: true,
      title,
      postId,
      url: `${origin}/dashboard#${postId}`,
    });
  };

  const handleCloseShare = () => {
    setSharingPost((prev) => ({ ...prev, isOpen: false }));
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.ruleCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All Infractions") return true;
    if (activeFilter === "Pending Signature") return post.status === "Pending Approval";
    if (activeFilter === "Approved") return post.status === "Approved";
    if (activeFilter === "Compounded") return post.status === "Compounded";
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-[#E6E4E5] text-[rgb(18,18,18)] antialiased font-sans flex flex-col selection:bg-[#94EC40] selection:text-[rgb(18,18,18)]">
      
      {/* 1. TOP DASHBOARD NAVBAR (Exact match to User dashboard) */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#FCFCFB]/95 backdrop-blur-md border-b border-[#D5D2D4] px-4 sm:px-6 lg:px-8 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Klaro Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/admin" className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <span
                className="text-xl font-[800] text-[rgb(18,18,18)] tracking-[-0.03em]"
                style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
              >
                klaro
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search violations, brands, rules (e.g. MRP, Rule 6)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 transition-all font-medium"
            />
          </div>

          {/* Report CTA Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openPickerChoice}
              className="px-3.5 py-1.5 rounded-xl bg-[#94EB41] hover:bg-[#80D42F] text-[rgb(18,18,18)] font-bold text-xs shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-[#80D42F] flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <ReportNavbarCustomIcon className="w-4 h-4 stroke-[1.8]" />
              <span>Report</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN REDDIT-STYLE FEED CONTENT */}
      <main
        className={cn(
          "flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8",
          mobileTab === "home" || mobileTab === "reports"
            ? "py-2 pb-2 sm:py-6 sm:pb-6 overflow-hidden sm:overflow-visible"
            : "py-3 pb-28 sm:py-6 sm:pb-6"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* LEFT COLUMN: Community Feed & Mobile Views */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4 bg-transparent pt-0 sm:pt-0">
            
            {/* ========================================================
                MOBILE TAB VIEWS WITH SMOOTH SWIPE GESTURES & ANIMATIONS
               ======================================================== */}
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="sm:hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileTab}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* TAB 1: HOME */}
                  {mobileTab === "home" && (
                    <div className="flex flex-col justify-between h-[calc(100dvh-5.5rem)] max-h-[calc(100dvh-5.5rem)] gap-2.5 pt-0.5 pb-16 px-1 text-left overflow-hidden">
                      
                      {/* Top Bar: Klaro Icon on Left + "klaro" text */}
                      <div className="flex items-center justify-between shrink-0">
                        <Link href="/admin" className="flex items-center gap-2 focus:outline-none">
                          <Logo size="sm" showText={false} />
                          <span
                            className="text-2xl font-[800] text-[rgb(18,18,18)] tracking-[-0.03em]"
                            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
                          >
                            klaro
                          </span>
                        </Link>
                      </div>

                      {/* Middle: Clear & Bold Officer Heading Statement */}
                      <div className="shrink-0 space-y-1.5 py-1">
                        <h1
                          className="text-[28px] sm:text-3xl font-[900] text-zinc-950 tracking-[-0.03em] leading-[1.1]"
                          style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                        >
                          Enforce package compliance.
                        </h1>
                        <p
                          className="text-[13px] text-zinc-600 font-medium leading-relaxed max-w-[320px]"
                          style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif' }}
                        >
                          Legal Metrology controller dashboard with OCR verification and statutory notice approvals.
                        </p>
                      </div>

                      {/* Bottom Section: Clickable Search Pill + Compact Camera Scan Box */}
                      <div className="shrink-0 space-y-2.5">
                        <button
                          type="button"
                          onClick={() => setMobileTab("feed")}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-[20px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] text-left active:scale-[0.99] transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <Search className="w-4 h-4 text-zinc-500" />
                            <span className="text-xs font-semibold text-zinc-500">Search violations, brands, rules...</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-zinc-400 bg-[#ECEAEB] px-2 py-0.5 rounded-md border border-[#D5D2D4]">FEED</span>
                        </button>

                        <div
                          onClick={openPickerChoice}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && openPickerChoice()}
                          className="p-2.5 sm:p-3 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm transition-all cursor-pointer text-center active:scale-[0.99] shrink-0 hover:border-zinc-400"
                        >
                          <div className="border-2 border-dashed border-zinc-300/80 rounded-xl p-3.5 sm:p-4 flex flex-col items-center justify-center gap-2 bg-[#ECEAEB]/30 hover:bg-[#ECEAEB]/50 transition-all">
                            <div className="w-10 h-10 rounded-full bg-[#94EB41] shadow-[0_4px_14px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center text-[rgb(18,18,18)] border border-[#80D42F]">
                              <AddPhotoCustomIcon className="w-5 h-5 stroke-[1.8]" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xs sm:text-sm font-[800] text-zinc-900 block">Instant Camera OCR Scan</span>
                              <span className="text-[10.5px] text-zinc-500 font-medium block">Auto-detect MRP, USP & Packaging Rules</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: FEED (Community Violation Stream) */}
                  {mobileTab === "feed" && (
                    <div className="space-y-4 pt-1 text-left pb-28">
                      {/* Sticky Search & Filter Header Box */}
                      <div className="sticky top-0 z-20 space-y-2.5 pb-2 pt-1 bg-[#E6E4E5]/90 backdrop-blur-md">
                        <div className="relative">
                          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search violations, brands, rules (e.g. MRP, Rule 6)..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FCFCFB] border border-[#D5D2D4] text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 shadow-xs transition-all font-medium"
                          />
                        </div>

                        {/* Filter Chips Bar */}
                        <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
                          <div className="flex items-center gap-1.5 w-max">
                            {["All Infractions", "Pending Signature", "Approved", "Compounded"].map((filter) => (
                              <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                  "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95",
                                  activeFilter === filter
                                    ? "bg-[#94EB41] text-[rgb(18,18,18)] border border-[#80D42F] shadow-xs"
                                    : "bg-[#ECEAEB] text-zinc-600 hover:text-zinc-900 border border-[#D5D2D4]"
                                )}
                              >
                                {filter}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Posts Stream */}
                      {filteredPosts.map((post) => (
                        <article
                          key={`feed-${post.id}`}
                          className="rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] overflow-hidden p-4 space-y-3 text-left"
                        >
                          {/* Meta Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-200"
                              />
                              <span className="text-zinc-800 font-bold text-xs">{post.author.zone}</span>
                            </div>
                            <span className="text-zinc-500 text-[11px] font-medium">{post.timeAgo}</span>
                          </div>

                          {/* Rule & Title */}
                          <div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-block mb-1">
                              {post.ruleCode} • {post.ruleLabel}
                            </span>
                            <h2 className="text-[15px] font-bold text-zinc-950 tracking-tight leading-snug">
                              {post.title}
                            </h2>
                          </div>

                          {/* Evidence Box (Exact matching design) */}
                          <div className="p-4 rounded-[20px] bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono text-xs space-y-3 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)] ring-1 ring-black/[0.04]">
                            <div className="flex items-center justify-between border-b border-[#D5D2D6] pb-2.5">
                              <span className="text-[13px] font-mono font-medium text-zinc-900 truncate pr-2">
                                {post.commodity}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-lg bg-[#EAFBD9] text-[#346415] text-[11px] font-mono font-bold border border-[#B8F27D] shrink-0">
                                BRAND: {post.brand}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-[11px] border-b border-[#D5D2D6] pb-3">
                              <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                                  OCR REGION
                                </span>
                                <span className="text-xs font-mono font-bold text-zinc-950 block leading-snug">
                                  {post.evidence.labelRegion}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                                  OCR EXTRACTED STRING
                                </span>
                                <span className="text-xs font-mono font-bold text-[#A8500D] block leading-snug">
                                  {post.evidence.ocrSnippet}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-[11px] pt-0.5">
                              <div>
                                <span className="text-xs font-mono font-medium text-rose-700 leading-snug block">
                                  Flag: {post.evidence.flagReason}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs font-mono font-medium text-zinc-700 leading-snug block">
                                  {post.evidence.requiredValue ? `Req: ${post.evidence.requiredValue}` : ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Engagement & Action */}
                          <div className="pt-2 flex items-center justify-between border-t border-[#ECEAEB]">
                            <div className="flex items-center gap-1.5 bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] rounded-[14px] px-2 py-1">
                              <button
                                type="button"
                                onClick={() => handleVote(post.id, "up")}
                                className={cn("p-1 rounded-lg transition-colors hover:bg-white", post.userVote === "up" ? "text-[#346415]" : "text-zinc-500")}
                              >
                                <ArrowBigUp className="w-5 h-5 fill-current" />
                              </button>
                              <span className="text-xs font-bold font-mono text-zinc-800 px-1">{post.upvotes}</span>
                              <button
                                type="button"
                                onClick={() => handleVote(post.id, "down")}
                                className={cn("p-1 rounded-lg transition-colors hover:bg-white", post.userVote === "down" ? "text-rose-600" : "text-zinc-500")}
                              >
                                <ArrowBigDown className="w-5 h-5 fill-current" />
                              </button>
                            </div>

                            {post.status === "Pending Approval" ? (
                              <button
                                type="button"
                                onClick={() => handleApproveNotice(post.id)}
                                className="px-3 py-1.5 rounded-[14px] bg-[#0B0B0D] text-white hover:bg-zinc-800 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5 text-[#94EC40]" />
                                <span>Sign Notice</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenShare(post.title, post.id)}
                                className="p-2 rounded-[14px] bg-[#ECEAEB] hover:bg-[#E0DEE0] active:scale-95 transition-all text-zinc-600 border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] flex items-center gap-1.5 font-bold text-xs"
                              >
                                <ShareCustomIcon className="w-4 h-4" />
                                <span>Share</span>
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: REPORTS (Officer Submitted Reports - Pinned Header, Dedicated Scroll) */}
                  {mobileTab === "reports" && (
                    <div className="flex flex-col h-[calc(100dvh-5.5rem)] max-h-[calc(100dvh-5.5rem)] space-y-3 pt-0.5 text-left overflow-hidden">
                      
                      {/* Pinned Reports Header Box */}
                      <div className="shrink-0 p-4 rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-zinc-900 bg-[#ECEAEB] p-2 rounded-[14px] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] flex items-center justify-center">
                              <ReportsNavIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h2
                                className="text-base font-[900] text-zinc-950 tracking-tight"
                                style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                              >
                                Statutory Notices Filed
                              </h2>
                              <span className="text-[11px] text-zinc-500 font-medium">Official Legal Metrology infraction filings</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Summary Counter Bar */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Total Filed</span>
                            <span className="text-sm font-bold text-zinc-900 font-mono">1,284</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">In Review</span>
                            <span className="text-sm font-bold text-amber-700 font-mono">2</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Compounded</span>
                            <span className="text-sm font-bold text-[#346415] font-mono">86.2%</span>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Reports List Only */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 no-scrollbar pb-36">
                        {MY_OFFICER_REPORTS.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-4 rounded-[20px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                {rep.ruleCode}
                              </span>
                              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border", rep.statusColor)}>
                                {rep.status}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-zinc-900 leading-snug">{rep.title}</h3>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                Commodity: <span className="font-semibold text-zinc-700">{rep.commodity}</span> • Brand: <span className="font-semibold text-zinc-700">{rep.brand}</span>
                              </p>
                            </div>

                            <div className="pt-2 border-t border-[#ECEAEB] flex items-center justify-between text-xs text-zinc-500">
                              <span className="flex items-center gap-1 font-mono font-bold text-[#346415]">
                                <ArrowBigUp className="w-4 h-4 fill-current" />
                                {rep.upvotes} karma
                              </span>
                              <span className="text-[10.5px] text-zinc-400 font-medium">{rep.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* TAB 4: PROFILE (Officer Profile & Clearance Info) */}
                  {mobileTab === "profile" && (
                    <div className="space-y-4 pt-1 text-left pb-6">
                      
                      {/* Officer Identity Card */}
                      <div className="p-5 rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-800 shrink-0 shadow-sm flex items-center justify-center bg-zinc-950">
                            <img src={adminUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3
                              className="text-base font-[900] text-zinc-950 tracking-tight"
                              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                            >
                              {adminUser.displayName}
                            </h3>
                            <p className="text-xs text-zinc-500 font-mono">
                              {adminUser.email}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#346415] bg-[#EAFBD9] px-2.5 py-0.5 rounded-full mt-1 border border-[#B8F27D]">
                              <ShieldCheck className="w-3 h-3" />
                              Senior Enforcement Authority
                            </span>
                          </div>
                        </div>

                        {/* 4 Stats Grid */}
                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Total Files</span>
                            <span className="text-sm font-bold text-[#346415] font-mono">1,284</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Pending</span>
                            <span className="text-sm font-bold text-amber-700 font-mono">2</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Officers</span>
                            <span className="text-sm font-bold text-zinc-900 font-mono">42</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Rate</span>
                            <span className="text-sm font-bold text-[#346415] font-mono">86.2%</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-[16px] bg-[#E4E2E3] border border-[#C8C5C9] text-xs space-y-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                          <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono tracking-wider block">STATUTORY AUTHORITY</span>
                          <p className="text-[11px] text-zinc-700 font-normal leading-relaxed">
                            {adminUser.jurisdiction} — authorized under Section 36 of Legal Metrology Act, 2009.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleAdminSignOut}
                          className="w-full py-2.5 rounded-[16px] bg-[#ECEAEB] hover:bg-rose-50 hover:text-rose-700 border-[1.5px] border-[#D5D2D4] shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)] text-xs font-bold text-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Admin Logout</span>
                        </button>
                      </div>

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ========================================================
                DESKTOP COMMUNITY FEED (Hidden on Mobile)
               ======================================================== */}
            <div className="hidden sm:block space-y-4">
              
              {/* Filter Tabs Bar */}
              <div className="p-3 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {["All Infractions", "Pending Signature", "Approved", "Compounded"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95",
                        activeFilter === filter
                          ? "bg-[#94EB41] text-[rgb(18,18,18)] border border-[#80D42F] shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)]"
                          : "bg-[#ECEAEB] text-zinc-600 hover:text-zinc-900 border border-[#D5D2D4]"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <Filter className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{filteredPosts.length} Infractions</span>
                </div>
              </div>

              {/* Trending Inspection Topics Pill Strip */}
              <div className="p-3.5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                    <TrendingFlameCustomIcon className="w-4 h-4 text-amber-600" />
                    <span>Trending Infractions</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">Real-time surveillance</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {TRENDING_INSPECTION_TOPICS.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-2.5 rounded-xl bg-[#ECEAEB] hover:bg-white border border-[#D5D2D4] transition-all cursor-pointer text-left space-y-1 group"
                    >
                      <span className="text-[11px] font-bold text-zinc-800 line-clamp-1 group-hover:text-zinc-950">
                        {topic.title}
                      </span>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-500">{topic.stat}</span>
                        <span className="text-[#346415] font-bold">{topic.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed Items Stream */}
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                >
                  <div className="p-5 flex items-start gap-4">
                    
                    {/* Left Vote Column */}
                    <div className="flex flex-col items-center gap-1 bg-[#ECEAEB] p-1.5 rounded-xl shrink-0">
                      <button
                        type="button"
                        onClick={() => handleVote(post.id, "up")}
                        className={cn(
                          "p-1 rounded-lg transition-colors hover:bg-white",
                          post.userVote === "up" ? "text-[#346415] bg-[#EAFBD9]" : "text-zinc-500"
                        )}
                        title="Upvote violation severity"
                      >
                        <ArrowBigUp className="w-5 h-5 fill-current" />
                      </button>
                      <span className="text-xs font-bold font-mono text-zinc-800">
                        {post.upvotes}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleVote(post.id, "down")}
                        className={cn(
                          "p-1 rounded-lg transition-colors hover:bg-white",
                          post.userVote === "down" ? "text-rose-600 bg-rose-100" : "text-zinc-500"
                        )}
                        title="Downvote"
                      >
                        <ArrowBigDown className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    {/* Main Post Body */}
                    <div className="flex-1 w-full space-y-2.5 text-left">
                      
                      {/* Meta Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-5 h-5 rounded-full bg-zinc-900"
                          />
                          <span className="font-bold text-zinc-900">{post.author.name}</span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-zinc-500 text-[11px]">{post.author.zone}</span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-zinc-400 text-[11px]">{post.timeAgo}</span>
                        </div>

                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase",
                            post.status === "Pending Approval"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : post.status === "Approved"
                              ? "bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]"
                              : post.status === "Compounded"
                              ? "bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]"
                              : "bg-rose-100 text-rose-900 border border-rose-300"
                          )}
                        >
                          {post.status}
                        </span>
                      </div>

                      {/* Title */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            {post.ruleCode} • {post.ruleLabel}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-zinc-950 tracking-tight leading-snug">
                          {post.title}
                        </h2>
                      </div>

                      {/* Description */}
                      <p className="text-[13px] text-zinc-600 leading-relaxed font-normal">
                        {post.description}
                      </p>

                      {/* Evidence Box (Exact matching design) */}
                      <div className="p-4 rounded-2xl bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono text-xs space-y-3 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-black/[0.04]">
                        {/* Top Row: Commodity & Brand Pill */}
                        <div className="flex items-center justify-between border-b border-[#D5D2D6] pb-2.5">
                          <span className="text-[13px] font-mono font-medium text-zinc-900 truncate pr-2">
                            {post.commodity}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#EAFBD9] text-[#346415] text-[11px] font-mono font-bold border border-[#B8F27D] shrink-0">
                            BRAND: {post.brand}
                          </span>
                        </div>

                        {/* Middle Row: OCR Region & OCR Extracted String */}
                        <div className="grid grid-cols-2 gap-4 text-[11px] border-b border-[#D5D2D6] pb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                              OCR REGION
                            </span>
                            <span className="text-xs font-mono font-bold text-zinc-950 block leading-snug">
                              {post.evidence.labelRegion}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                              OCR EXTRACTED STRING
                            </span>
                            <span className="text-xs font-mono font-bold text-[#A8500D] block leading-snug">
                              {post.evidence.ocrSnippet}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row: Flag Reason & Required Value */}
                        <div className="grid grid-cols-2 gap-4 text-[11px] pt-0.5">
                          <div>
                            <span className="text-xs font-mono font-medium text-rose-700 leading-snug block">
                              Flag: {post.evidence.flagReason}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-mono font-medium text-zinc-700 leading-snug block">
                              {post.evidence.requiredValue ? `Req: ${post.evidence.requiredValue}` : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Engagement & Action Bar */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#ECEAEB] text-xs text-zinc-600 font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.commentsCount} Comments</span>
                          </button>

                          <button
                            type="button"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors text-zinc-600"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#346415]" />
                            <span>Notice PDF</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {post.status === "Pending Approval" && (
                            <button
                              type="button"
                              onClick={() => handleApproveNotice(post.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#0B0B0D] text-white hover:bg-zinc-800 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5 text-[#94EC40]" />
                              <span>Authorize & Sign</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenShare(post.title, post.id)}
                            className="p-1.5 rounded-xl hover:bg-[#ECEAEB] active:scale-95 transition-all text-zinc-500 hover:text-zinc-900"
                            title="Share"
                          >
                            <ShareCustomIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </article>
              ))}

            </div>

          </div>

          {/* RIGHT SIDEBAR: Officer Profile & Authority Stats (Desktop Sticky Sidebar) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-4 text-left sticky top-[4.5rem] self-start transition-none">
            
            {/* Officer Identity Card */}
            <div className="p-5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-800 shrink-0 shadow-sm flex items-center justify-center text-2xl bg-zinc-950">
                  <img src={adminUser.avatar} alt="Officer Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3
                    className="text-base font-[900] text-zinc-950 tracking-tight"
                    style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                  >
                    {adminUser.displayName}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    {adminUser.email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#346415] bg-[#EAFBD9] px-2.5 py-0.5 rounded-full mt-1 border border-[#B8F27D]">
                    <ShieldCheck className="w-3 h-3" />
                    Senior Enforcement Authority
                  </span>
                </div>
              </div>

              {/* 4 Stats Grid: Inspections, Pending, Officers, Rate */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                <div className="p-2 rounded-xl bg-[#ECEAEB]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Total Files</span>
                  <span className="text-sm font-bold text-[#346415] font-mono">1,284</span>
                </div>
                <div className="p-2 rounded-xl bg-[#ECEAEB]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Pending</span>
                  <span className="text-sm font-bold text-amber-700 font-mono">2</span>
                </div>
                <div className="p-2 rounded-xl bg-[#ECEAEB]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Officers</span>
                  <span className="text-sm font-bold text-zinc-900 font-mono">42</span>
                </div>
                <div className="p-2 rounded-xl bg-[#ECEAEB]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Rate</span>
                  <span className="text-sm font-bold text-[#346415] font-mono">86.2%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#E4E2E3] border border-[#C8C5C9] text-xs space-y-1">
                <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono tracking-wider block">STATUTORY AUTHORITY</span>
                <p className="text-[11px] text-zinc-700 font-normal leading-relaxed">
                  {adminUser.jurisdiction} — authorized under Section 36 of Legal Metrology Act, 2009.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAdminSignOut}
                className="w-full py-2.5 rounded-xl bg-[#ECEAEB] hover:bg-rose-50 hover:text-rose-700 border border-[#D5D2D4] text-xs font-bold text-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Admin Logout</span>
              </button>
            </div>

            {/* My Recent Submitted Reports Preview */}
            <div className="p-5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-800" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900">
                  RECENT ENFORCEMENT NOTICES
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {MY_OFFICER_REPORTS.map((rep) => (
                  <div key={rep.id} className="p-2.5 rounded-xl bg-[#ECEAEB] flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] font-bold text-zinc-900 block font-mono">{rep.ruleCode}</span>
                      <span className="text-[11px] text-zinc-600 truncate max-w-[170px] block">{rep.title}</span>
                    </div>
                    <span className={cn("text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border", rep.statusColor)}>
                      {rep.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Metrology Act Reference (Distinct Light-Tinted Slate/Grey Card in Satoshi Font with Green Underline) */}
            <div
              className="p-4 rounded-2xl bg-[#E0DFDC] text-[rgb(18,18,18)] space-y-2 border-[1.5px] border-[#CBC7C4] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)]"
              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif' }}
            >
              <div className="pb-1">
                <span
                  className="font-[900] text-zinc-950 tracking-tight text-xs uppercase inline-block pb-0.5 border-b-2 border-[#80D42F]"
                  style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                >
                  Legal Metrology Act, 2009
                </span>
              </div>
              <p
                className="text-[12px] text-zinc-700 font-medium leading-relaxed"
                style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif' }}
              >
                Inspection evidence logged through Klaro generates digital certificates compliant with the Indian Evidence Act for statutory penalty proceedings.
              </p>
            </div>

          </aside>

        </div>
      </main>

      {/* ========================================================
          3. PLASTIC LIQUID GLASS 5-ITEM FLOATING NAVBAR (Mobile)
         ======================================================== */}
      <nav
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 sm:hidden flex items-center justify-between w-[285px] px-3.5 py-2 rounded-full bg-[#FCFCFB]/75 backdrop-blur-2xl border border-white/80"
        style={{
          boxShadow: "0 14px 40px -4px rgba(0, 0, 0, 0.16), 0 2px 8px 0 rgba(0, 0, 0, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
        aria-label="Mobile Navigation"
      >
        {/* 1. Home Icon */}
        <button
          type="button"
          onClick={() => setMobileTab("home")}
          className={cn(
            "relative p-2 rounded-full transition-all flex items-center justify-center active:scale-90",
            mobileTab === "home" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"
          )}
          title="Home"
        >
          {mobileTab === "home" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-full bg-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] border border-black/5"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10">
            <HomeNavIcon className="w-5 h-5" />
          </span>
        </button>

        {/* 2. Feed Icon */}
        <button
          type="button"
          onClick={() => setMobileTab("feed")}
          className={cn(
            "relative p-2 rounded-full transition-all flex items-center justify-center active:scale-90",
            mobileTab === "feed" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"
          )}
          title="Violations Feed"
        >
          {mobileTab === "feed" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-full bg-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] border border-black/5"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10">
            <FeedNavIcon className="w-5 h-5" />
          </span>
        </button>

        {/* 3. Center Camera Scan Button */}
        <button
          type="button"
          onClick={openPickerChoice}
          className="relative p-2.5 rounded-full bg-[#94EB41] hover:bg-[#80D42F] text-[rgb(18,18,18)] flex items-center justify-center active:scale-90 transition-all border border-[#80D42F]"
          style={{
            boxShadow: "0 4px 14px 0 rgba(148, 235, 65, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)",
          }}
          title="Capture & Scan Product"
        >
          <InspectionCameraCustomIcon className="w-5 h-5 text-[rgb(18,18,18)]" />
        </button>

        {/* 4. Reports Icon */}
        <button
          type="button"
          onClick={() => setMobileTab("reports")}
          className={cn(
            "relative p-2 rounded-full transition-all flex items-center justify-center active:scale-90",
            mobileTab === "reports" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"
          )}
          title="My Reports"
        >
          {mobileTab === "reports" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-full bg-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] border border-black/5"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10">
            <ReportsNavIcon className="w-5 h-5" />
          </span>
        </button>

        {/* 5. Profile Icon */}
        <button
          type="button"
          onClick={() => setMobileTab("profile")}
          className={cn(
            "relative p-2 rounded-full transition-all flex items-center justify-center active:scale-90",
            mobileTab === "profile" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"
          )}
          title="My Profile"
        >
          {mobileTab === "profile" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-full bg-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] border border-black/5"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10">
            <ProfileNavIcon className="w-5 h-5" />
          </span>
        </button>
      </nav>

      {/* Choice Modal: Camera vs Gallery */}
      <AnimatePresence>
        {isPickerChoiceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePickerChoice}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-sm rounded-[24px] bg-[#FCFCFB] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-[#D5D2D4] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-base font-[900] text-zinc-950 tracking-tight"
                  style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                >
                  Add Product Photo
                </span>
                <button
                  type="button"
                  onClick={closePickerChoice}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Take Photo */}
                <button
                  type="button"
                  onClick={handleChooseCamera}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#ECEAEB] hover:bg-[#E4E2E3] active:scale-95 transition-all text-center border border-[#D5D2D4]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-zinc-900 border border-zinc-200">
                    <InspectionCameraCustomIcon className="w-5 h-5 text-zinc-900" />
                  </div>
                  <span className="text-xs font-bold text-zinc-900">Take Photo</span>
                </button>

                {/* Choose from Library */}
                <button
                  type="button"
                  onClick={handleChooseGallery}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#ECEAEB] hover:bg-[#E4E2E3] active:scale-95 transition-all text-center border border-[#D5D2D4]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-zinc-900 border border-zinc-200">
                    <SparkleAddPhotoCustomIcon className="w-5 h-5 text-zinc-900" />
                  </div>
                  <span className="text-xs font-bold text-zinc-900">Choose from Library</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs for Camera and Gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* OCR ScanFlow Receipt Printer Modal */}
      {scanImageUrl && (
        <ScanFlow
          isOpen={Boolean(scanImageUrl)}
          imageUrl={scanImageUrl}
          onClose={() => setScanImageUrl(null)}
          onPost={handleScanPost}
          onSave={handleScanSave}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={sharingPost.isOpen}
        onClose={handleCloseShare}
        postTitle={sharingPost.title}
        shareUrl={sharingPost.url}
      />

    </div>
  );
}
