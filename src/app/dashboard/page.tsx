"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserProfile } from "../../actions/profile";
import { UserProfile } from "../../types/auth";
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
  Home
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

interface FeedPost {
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
  status: "Under Review" | "Notice Drafted" | "Compounded";
}

const INITIAL_POSTS: FeedPost[] = [
  {
    id: "post-1",
    author: {
      name: "Insp. Aarav Sharma",
      badge: "Sr. Legal Metrology Officer",
      avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Aarav&backgroundColor=27272a",
      zone: "Delhi Central Zone",
    },
    timeAgo: "2 hours ago",
    title: "Brand XYZ 500g Malt Biscuits completely omitted Unit Sale Price (USP) on Principal Display Panel",
    commodity: "Packaged Malt Biscuits",
    brand: "Crunchy Bites Pvt. Ltd.",
    ruleCode: "Rule 6(1)(d)",
    ruleLabel: "Retail Price & USP Non-Compliance",
    severity: "high",
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
    status: "Notice Drafted",
    comments: [
      {
        id: "c-1",
        author: "Insp. Vikram Nair",
        authorRole: "Zonal Enforcement Head",
        avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Vikram&backgroundColor=27272a",
        timeAgo: "1 hour ago",
        text: "Same manufacturer had a repeat infraction in Maharashtra Zone 2 last month under Section 36 of the Legal Metrology Act.",
      },
      {
        id: "c-2",
        author: "Pooja K.",
        authorRole: "Legal Metrology Inspector",
        avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Pooja&backgroundColor=27272a",
        timeAgo: "35 mins ago",
        text: "Please attach the batch barcode number (890123...) so we can cross-verify whether the warehouse shipment carried the same label revision.",
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
    timeAgo: "4 hours ago",
    title: "Consumer Grievance Care details completely absent on 1kg Laundry Detergent packaging",
    commodity: "Household Cleaning Detergent 1kg",
    brand: "UltraPure Chemical Labs",
    ruleCode: "Rule 6(1)(h)",
    ruleLabel: "Consumer Care Contact Omission",
    severity: "high",
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
    status: "Under Review",
    comments: [
      {
        id: "c-3",
        author: "Insp. Rohit Joshi",
        authorRole: "Inspector",
        avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Rohan&backgroundColor=27272a",
        timeAgo: "2 hours ago",
        text: "Section 36 compound notice drafted. Awaiting deputy controller digital approval.",
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
    timeAgo: "6 hours ago",
    title: "Principal Display Panel letter height measured 2.2mm on 500g pack (Minimum 4.0mm required)",
    commodity: "Refined Sunflower Oil 500ml",
    brand: "Kisan Agro Foods",
    ruleCode: "Rule 7 & 8",
    ruleLabel: "Sub-standard Numeral/Letter Height",
    severity: "medium",
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
    status: "Compounded",
    comments: [
      {
        id: "c-4",
        author: "Insp. Ananya Dutta",
        authorRole: "Enforcement Officer",
        avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Ananya&backgroundColor=27272a",
        timeAgo: "4 hours ago",
        text: "The Klaro optical caliper check verified the pixel-to-millimeter ratio accurately. Good catch.",
      },
    ],
  },
];

const MY_SUBMITTED_REPORTS = [
  {
    id: "rep-1",
    title: "Amul Butter 500g — Missing USP & Exp Date",
    commodity: "Pasteurized Table Butter",
    brand: "Amul",
    date: "2d ago",
    status: "Notice Issued",
    statusColor: "bg-amber-100 text-amber-900 border-amber-300",
    ruleCode: "Rule 6(1)(d)",
    upvotes: 84,
    comments: 12,
  },
  {
    id: "rep-2",
    title: "Lays Wafer Chips — Illegible Net Qty Font Size",
    commodity: "Potato Chips Snack",
    brand: "Lays",
    date: "5d ago",
    status: "Compounded",
    statusColor: "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]",
    ruleCode: "Rule 7 & 8",
    upvotes: 142,
    comments: 29,
  },
  {
    id: "rep-3",
    title: "Dabur Honey 250g — Consumer Care Email Missing",
    commodity: "Pure Natural Honey",
    brand: "Dabur",
    date: "1w ago",
    status: "Under Review",
    statusColor: "bg-blue-100 text-blue-900 border-blue-300",
    ruleCode: "Rule 6(1)(h)",
    upvotes: 56,
    comments: 8,
  },
  {
    id: "rep-4",
    title: "Tata Salt Lite 1kg — Dual MRP Sticker Detected",
    commodity: "Iodized Table Salt",
    brand: "Tata",
    date: "2w ago",
    status: "Compounded",
    statusColor: "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]",
    ruleCode: "Rule 18(2)",
    upvotes: 219,
    comments: 44,
  },
];

// Custom SVG icons requested by user
const TrendingFlameCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.8561 22C26.0783 19 19.2338 7 10.9227 2C9.9453 5.5 8.47838 6.5 5.54497 10C1.66121 14.6339 3.5895 20 8.96719 22C8.1524 21 6.04958 18.9008 7.5 16C8 15 9 14 8.5 12C9.47778 12.5 11.5 13 12 15.5C12.8148 14.5 13.6604 12.4 12.8783 10C19 14.5 16.5 19 13.8561 22Z" />
  </svg>
);

const TrendingCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17L7 13C7.88256 12.1174 8.32385 11.6762 8.86543 11.6274C8.95496 11.6193 9.04504 11.6193 9.13457 11.6274C9.67615 11.6762 10.1174 12.1174 11 13C11.8826 13.8826 12.3238 14.3238 12.8654 14.3726C12.955 14.3807 13.045 14.3807 13.1346 14.3726C13.6762 14.3238 14.1174 13.8826 15 13L20 8" />
    <path d="M16 7.27657C16 7.27657 20.101 6.65426 20.7234 7.27661C21.3458 7.89896 20.7234 12 20.7234 12" />
  </svg>
);

const HomeNavIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10.5L12.8825 2.82207C12.6355 2.61407 12.3229 2.5 12 2.5C11.6771 2.5 11.3645 2.61407 11.1175 2.82207L2 10.5" />
    <path d="M20.5 9.5V16C20.5 18.3456 20.5 19.5184 19.8801 20.3263C19.7205 20.5343 19.5343 20.7205 19.3263 20.8801C18.5184 21.5 17.3456 21.5 15 21.5V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V21.5C6.65442 21.5 5.48164 21.5 4.67372 20.8801C4.46572 20.7205 4.27954 20.5343 4.11994 20.3263C3.5 19.5184 3.5 18.3456 3.5 16V9.5" />
  </svg>
);

const FeedNavIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 13.5V6.5H21.5V13.5C21.5 17.2712 21.5 19.1569 20.3284 20.3284C19.1569 21.5 17.2712 21.5 13.5 21.5H10.5C6.72876 21.5 4.84315 21.5 3.67157 20.3284C2.5 19.1569 2.5 17.2712 2.5 13.5Z" />
    <path d="M2.5 6.5L3.1 5.7C4.27771 4.12972 4.86656 3.34458 5.71115 2.92229C6.55573 2.5 7.53715 2.5 9.5 2.5H14.5C16.4628 2.5 17.4443 2.5 18.2889 2.92229C19.1334 3.34458 19.7223 4.12972 20.9 5.7L21.5 6.5" />
    <path d="M6 18H11M6 15H9" />
  </svg>
);

const ReportsNavIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.49994 10.5V13.5C5.49994 17.2712 5.49994 19.1569 6.67151 20.3284C7.84308 21.5 9.7287 21.5 13.4999 21.5C17.2712 21.5 19.1568 21.5 20.3284 20.3284C21.4999 19.1569 21.4999 17.2712 21.4999 13.5V10.5C21.4999 6.72876 21.4999 4.84315 20.3284 3.67157C19.1568 2.5 17.2712 2.5 13.4999 2.5C9.7287 2.5 7.84308 2.5 6.67151 3.67158C5.49994 4.84315 5.49994 6.72877 5.49994 10.5Z" />
    <path d="M5.5 10.5L4 10.5C3.17157 10.5 2.5 9.82843 2.5 9C2.5 8.17157 3.17157 7.5 4 7.5L7.5 7.5" />
    <path d="M5.5 17.5L4 17.5C3.17157 17.5 2.5 16.8284 2.5 16C2.5 15.1716 3.17157 14.5 4 14.5L7.5 14.5" />
    <path d="M11 10.5H15M11 6.5H17.5" />
  </svg>
);

const WaveHandIcon = ({ className = "w-7 h-7 text-[#72C81C]" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M14.1245 5.74923C14.3983 4.99948 15.2302 4.6129 15.9825 4.88579C16.7348 5.15868 17.1227 5.98769 16.8489 6.73744L16.1878 8.5475M14.1245 5.74923L14.7855 3.93917C15.0594 3.18942 14.6715 2.3604 13.9192 2.08752C13.1668 1.81463 12.335 2.20121 12.0612 2.95096L11.5656 4.30857M14.1245 5.74923L12.3066 10.7269M11.5656 4.30857C11.839 3.55897 11.4511 2.73032 10.699 2.4575C9.94664 2.18461 9.11479 2.57119 8.84097 3.32094L6.04389 10.9791L5.1097 8.97429C4.69981 8.09467 3.61484 7.7678 2.78416 8.27368C2.14856 8.66075 1.85475 9.42786 2.06986 10.1386L3.81898 15.4859C4.15364 16.509 4.04527 17.8595 3.67597 18.8707M11.5656 4.30857L9.91291 8.83372M12.3032 22L12.6881 20.946C12.8639 20.4648 13.2266 20.0763 13.677 19.8297C14.1978 19.5445 14.8694 19.1322 15.2097 18.7412C15.7963 18.0673 16.1555 17.0838 16.8739 15.1169L18.9122 9.53572C19.186 8.78596 18.7981 7.95695 18.0458 7.68406C17.2935 7.41118 16.4616 7.79775 16.1878 8.5475M14.7004 12.6201L16.1878 8.5475" strokeLinejoin="round" />
    <path d="M20.8307 13C21.377 14.6354 20.5574 16.4263 19 17" />
  </svg>
);

const AddPhotoCustomIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 16L7.46967 11.5303C7.80923 11.1908 8.26978 11 8.75 11C9.23022 11 9.69077 11.1908 10.0303 11.5303L14 15.5M15.5 17L14 15.5M21 16L18.5303 13.5303C18.1908 13.1908 17.7302 13 17.25 13C16.7698 13 16.3092 13.1908 15.9697 13.5303L14 15.5" />
    <path d="M12 2.5C7.77027 2.5 5.6554 2.5 4.25276 3.69797C4.05358 3.86808 3.86808 4.05358 3.69797 4.25276C2.5 5.6554 2.5 7.77027 2.5 12C2.5 16.2297 2.5 18.3446 3.69797 19.7472C3.86808 19.9464 4.05358 20.1319 4.25276 20.302C5.6554 21.5 7.77027 21.5 12 21.5C16.2297 21.5 18.3446 21.5 19.7472 20.302C19.9464 20.1319 20.1319 19.9464 20.302 19.7472C21.5 18.3446 21.5 16.2297 21.5 12" />
    <path d="M21.5 6H18M18 6H14.5M18 6V2.5M18 6V9.5" />
  </svg>
);

const ShareCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z" />
    <path d="M11.4999 12.5L14.9999 9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WatchdogHeartHandsIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8.39559 2.55196C9.8705 1.63811 11.1578 2.00638 11.9311 2.59299C12.2482 2.83351 12.4067 2.95378 12.5 2.95378C12.5933 2.95378 12.7518 2.83351 13.0689 2.59299C13.8422 2.00638 15.1295 1.63811 16.6044 2.55196C18.5401 3.75128 18.9781 7.7079 14.5133 11.046C13.6629 11.6818 13.2377 11.9996 12.5 11.9996C11.7623 11.9996 11.3371 11.6818 10.4867 11.046C6.02195 7.7079 6.45994 3.75128 8.39559 2.55196Z"></path>
    <path d="M4 14H6.39482C6.68897 14 6.97908 14.0663 7.24217 14.1936L9.28415 15.1816C9.54724 15.3089 9.83735 15.3751 10.1315 15.3751H11.1741C12.1825 15.3751 13 16.1662 13 17.142C13 17.1814 12.973 17.2161 12.9338 17.2269L10.3929 17.9295C9.93707 18.0555 9.449 18.0116 9.025 17.8064L6.84211 16.7503" strokeLinejoin="round"></path>
    <path d="M13 16.5L17.5928 15.0889C18.407 14.8352 19.2871 15.136 19.7971 15.8423C20.1659 16.3529 20.0157 17.0842 19.4785 17.3942L11.9629 21.7305C11.4849 22.0063 10.9209 22.0736 10.3952 21.9176L4 20.0199" strokeLinejoin="round"></path>
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

const ReportNavbarCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M19 11V10C19 6.22876 19 4.34315 17.8284 3.17157C16.6569 2 14.7712 2 11 2C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22" strokeLinejoin="round" />
    <path d="M21 22L19.2857 20.2857M19.8571 17.4286C19.8571 19.3221 18.3221 20.8571 16.4286 20.8571C14.535 20.8571 13 19.3221 13 17.4286C13 15.535 14.535 14 16.4286 14C18.3221 14 19.8571 15.535 19.8571 17.4286Z" />
    <path d="M7 7H15M7 11H11" strokeLinejoin="round" />
  </svg>
);

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

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
    const distanceY = (touchStartY !== null && touchEndY !== null) ? Math.abs(touchStartY - touchEndY) : 0;

    // Only switch tabs if the horizontal swipe is distinctly greater than vertical scroll
    if (Math.abs(distanceX) > distanceY && Math.abs(distanceX) > minSwipeDistance) {
      const currentIndex = TABS.indexOf(mobileTab);
      if (distanceX > 0 && currentIndex < TABS.length - 1) {
        // Swiped Left -> Next Tab
        setMobileTab(TABS[currentIndex + 1]);
      } else if (distanceX < 0 && currentIndex > 0) {
        // Swiped Right -> Previous Tab
        setMobileTab(TABS[currentIndex - 1]);
      }
    }
  };

  // Trending Carousel Scroll Vignette States
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  const handleTrendingScroll = () => {
    if (trendingScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trendingScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Feed States
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  // Quantum QR Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingPost, setSharingPost] = useState<{ title: string; url: string } | null>(null);

  // ---- SCAN FLOW STATE (chinn music 🎶) ----
  const [showScanFlow, setShowScanFlow] = useState(false);
  const [scanImageUrl, setScanImageUrl] = useState<string | null>(null);
  const [scanImageName, setScanImageName] = useState<string>("");
  const [showPickerChoice, setShowPickerChoice] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const openPickerChoice = () => setShowPickerChoice(true);
  const handleScanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setScanImageUrl(url);
    setScanImageName(file.name);
    setShowPickerChoice(false);
    setShowScanFlow(true);
    e.target.value = "";
  };
  const handleScanPost = ({ imageUrl, title }: { imageUrl: string; title: string }) => {
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      author: {
        name: profile?.displayName || user?.fullName || "You",
        badge: "Community Inspector",
        avatar: avatar || "https://api.dicebear.com/9.x/lorelei/svg?seed=You&backgroundColor=27272a",
        zone: "Your Zone",
      },
      timeAgo: "Just now",
      title,
      commodity: "Packaged Commodity (Scanned)",
      brand: "Detected via Klaro OCR",
      ruleCode: "Rule 6(1)(d)",
      ruleLabel: "Retail Price & USP Non-Compliance",
      severity: "high",
      description: "Auto-generated from your photo. Klaro detected a potential USP omission — review and submit as inspection dossier.",
      evidence: {
        labelRegion: "Auto-detected PDP • Confidence 98%",
        ocrSnippet: "MRP Rs 120.00 (PKD 07/2026)",
        flagReason: "Missing ₹ per g/kg specification and tax inclusion text.",
        requiredValue: "₹0.24 per g (Mandatory since 2022 Amendment)",
      },
      upvotes: 1,
      commentsCount: 0,
      userVote: null,
      status: "Under Review",
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setMobileTab("feed");
    // also reset scan
    setScanImageUrl(null);
  };
  const handleScanSave = () => {
    setScanImageUrl(null);
  };

  const handleOpenShare = (title: string, postId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://klaro.app";
    setSharingPost({
      title,
      url: `${origin}/dashboard?post=${postId}`,
    });
    setShareModalOpen(true);
  };

  // Feed Collapsible Sticky Search Bar State (Rock-solid hysteresis threshold)
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleWindowScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || document.documentElement.scrollTop;

          // Deterministic threshold hysteresis: Collapses once past 55px, expands when back near top (< 25px)
          if (currentY > 55) {
            setIsSearchCollapsed(true);
          } else if (currentY < 25) {
            setIsSearchCollapsed(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/");
      return;
    }

    async function loadProfile() {
      try {
        const supabaseProfile = await getUserProfile();
        if (supabaseProfile) {
          setProfile(supabaseProfile);
        } else if (user) {
          setProfile({
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            username: `@${user.username || user.firstName?.toLowerCase() || "officer"}`,
            displayName: user.fullName || user.firstName || "Officer",
            avatarUrl: user.imageUrl || "https://api.dicebear.com/9.x/lorelei/svg?seed=Officer&backgroundColor=27272a",
            dietaryPreferences: ["Field Inspector"],
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [isLoaded, isSignedIn, user, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
      setIsSigningOut(false);
    }
  };

  // Upvote / Downvote Toggle
  const handleVote = (postId: string, type: "up" | "down") => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        if (post.userVote === type) {
          return {
            ...post,
            userVote: null,
            upvotes: type === "up" ? post.upvotes - 1 : post.upvotes + 1,
          };
        }
        const delta = post.userVote === "up" ? -2 : post.userVote === "down" ? 2 : type === "up" ? 1 : -1;
        return {
          ...post,
          userVote: type,
          upvotes: post.upvotes + delta,
        };
      })
    );
  };

  // Toggle comments expand
  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: FeedComment = {
      id: `c-${Date.now()}`,
      author: profile?.displayName || user?.fullName || "You",
      authorRole: "Enforcement Officer",
      avatar: profile?.avatarUrl || user?.imageUrl || "https://api.dicebear.com/9.x/lorelei/svg?seed=You&backgroundColor=27272a",
      timeAgo: "Just now",
      text,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment],
        };
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  // Filtered Posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.ruleCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "High Severity") return post.severity === "high";
    if (activeFilter === "MRP (Rule 6d)") return post.ruleCode.includes("6(1)(d)");
    if (activeFilter === "Care (Rule 6h)") return post.ruleCode.includes("6(1)(h)");
    if (activeFilter === "Font Size (Rule 7)") return post.ruleCode.includes("7");
    return true;
  });

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#E6E4E5] flex flex-col items-center justify-center gap-3 select-none">
        <svg
          className="animate-spin h-8 w-8 text-[#18181B]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-zinc-600 text-sm font-medium">Loading inspection feed...</p>
      </div>
    );
  }

  const avatar = profile?.avatarUrl || user?.imageUrl || "https://api.dicebear.com/9.x/lorelei/svg?seed=Officer&backgroundColor=27272a";

  return (
    <div className="min-h-screen w-full bg-[#E6E4E5] text-[rgb(18,18,18)] antialiased font-sans flex flex-col selection:bg-[#94EC40] selection:text-[rgb(18,18,18)]">
      
      {/* 1. TOP DASHBOARD SUSPENDED NOTCH NAVBAR */}
      <header className="hidden md:block sticky top-0 z-40 w-full pointer-events-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative pointer-events-auto filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            {/* Left Squircle Edge Cap (Inverted Top + Rounded Bottom) */}
            <svg
              width="39"
              height="54"
              viewBox="0 0 39 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 -left-[38px] pointer-events-none z-10 overflow-visible"
            >
              <path
                d="M 0 0 A 24 24 0 0 1 24 24 L 24 40 A 14 14 0 0 0 38 54 H 39 V 0 Z"
                fill="#FCFCFB"
              />
              <path
                d="M 0 0 A 24 24 0 0 1 24 24 L 24 39.25 A 14 14 0 0 0 38 53.25 H 39"
                stroke="#D5D2D4"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>

            {/* Right Squircle Edge Cap (Inverted Top + Rounded Bottom) */}
            <svg
              width="39"
              height="54"
              viewBox="-1 0 39 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 -right-[38px] pointer-events-none z-10 overflow-visible"
            >
              <path
                d="M 0 54 A 14 14 0 0 0 14 40 L 14 24 A 24 24 0 0 1 38 0 H -1 V 54 Z"
                fill="#FCFCFB"
              />
              <path
                d="M -1 53.25 H 0 A 14 14 0 0 0 14 39.25 L 14 24 A 24 24 0 0 1 38 0"
                stroke="#D5D2D4"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>

            {/* Navbar Central Bar (Square Rectangle, corners handled by caps) */}
            <div className="h-[54px] bg-[#FCFCFB] border-b-[1.5px] border-[#D5D2D4] px-4 sm:px-6 flex items-center justify-between gap-4">
              
              {/* Klaro Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2">
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
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#ECEAEB] border-[1.5px] border-[#D5D2D4] shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)] text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 outline-none ring-0 ring-offset-0 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[#94EC40]/30 focus:border-[#94EC40] focus-visible:ring-2 focus-visible:ring-[#94EC40]/30 focus-visible:border-[#94EC40] focus:bg-white focus-visible:bg-white transition-colors font-medium"
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
                      
                      {/* Top Bar: Klaro Icon on Left + "klaro" text to the right */}
                      <div className="flex items-center justify-between shrink-0">
                        <Link href="/" className="flex items-center gap-2 focus:outline-none">
                          <Logo size="sm" showText={false} />
                          <span
                            className="text-2xl font-[800] text-[rgb(18,18,18)] tracking-[-0.03em]"
                            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
                          >
                            klaro
                          </span>
                        </Link>
                      </div>

                      {/* Bold 2-Line Headline with green hand icon in front of So */}
                      <div className="pt-0.5">
                        <h1
                          className="text-[30px] sm:text-[36px] font-[900] text-[rgb(18,18,18)] tracking-[-0.04em] leading-[1.08]"
                          style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                        >
                          <span className="flex items-center gap-2">
                            <WaveHandIcon className="w-7 h-7 text-[#94EB41] shrink-0" />
                            <span>So what You</span>
                          </span>
                          <span>reporting today</span>
                        </h1>
                      </div>

                      {/* Photo Upload Action Box */}
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
                            <span className="text-xs sm:text-sm font-[800] text-zinc-900 block">Upload or Capture Product Label</span>
                            <span className="text-[10.5px] text-zinc-500 font-medium block">Tap to upload packaged commodity photo for instant OCR audit</span>
                          </div>
                        </div>
                      </div>

                      {/* Trending Now Section with Flame Icon */}
                      <div className="space-y-2 pt-1 shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-zinc-900 bg-[#ECEAEB] p-1.5 rounded-xl border border-[#D5D2D4] flex items-center justify-center shadow-xs">
                              <TrendingFlameCustomIcon className="w-4 h-4 text-amber-600" />
                            </div>
                            <h2
                              className="text-[17px] font-[900] text-zinc-950 tracking-[-0.02em]"
                              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                            >
                              Trending now
                            </h2>
                          </div>
                          <span className="text-[10.5px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Swipe →</span>
                        </div>

                        {/* Relative Container with Dynamic Blurry Dark Gradient Masks at Outer Edges */}
                        <div className="relative -mx-2 px-2 overflow-hidden">
                          {/* Left Dark Blurry Vignette Fade */}
                          <div
                            className={cn(
                              "absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#E6E4E5] to-transparent pointer-events-none z-10 transition-opacity duration-300 backdrop-blur-[1px]",
                              canScrollLeft ? "opacity-100" : "opacity-0"
                            )}
                          />

                          {/* Right Dark Blurry Vignette Fade */}
                          <div
                            className={cn(
                              "absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#E6E4E5] to-transparent pointer-events-none z-10 transition-opacity duration-300 backdrop-blur-[1px]",
                              canScrollRight ? "opacity-100" : "opacity-0"
                            )}
                          />

                          {/* Horizontal Scroll / Swipe Container of Report Blocks */}
                          <div
                            ref={trendingScrollRef}
                            onScroll={handleTrendingScroll}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                            className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1 pt-0.5 px-2"
                          >
                            {posts.map((post) => (
                              <div
                                key={`trending-${post.id}`}
                                className="w-[265px] shrink-0 snap-start p-3.5 rounded-[20px] bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono space-y-2 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)] ring-1 ring-black/[0.04] text-left"
                              >
                                {/* Header with Commodity and Brand */}
                                <div className="flex items-center justify-between border-b border-[#D2CFD3] pb-1.5 text-[10px]">
                                  <span className="truncate pr-1 text-zinc-900 font-bold text-xs max-w-[135px]">{post.commodity}</span>
                                  <span className="text-[#346415] shrink-0 font-extrabold bg-[#EAFBD9] px-2 py-0.5 rounded-md border border-[#B8F27D] text-[9px] truncate max-w-[115px]">
                                    BRAND: {post.brand}
                                  </span>
                                </div>

                                {/* OCR Region */}
                                <div>
                                  <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">OCR REGION</span>
                                  <span className="text-zinc-900 font-bold block text-[10.5px] leading-tight mt-0.5">{post.evidence.labelRegion}</span>
                                </div>

                                {/* OCR Extracted String */}
                                <div>
                                  <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">OCR EXTRACTED STRING</span>
                                  <span className="text-[#92400E] font-extrabold block text-[11px] leading-tight mt-0.5">{post.evidence.ocrSnippet}</span>
                                </div>

                                {/* Flag & Req */}
                                <div className="pt-1.5 border-t border-[#D2CFD3] space-y-0.5 text-[10px] leading-tight">
                                  <span className="text-rose-700 font-bold block truncate">Flag: {post.evidence.flagReason}</span>
                                  {post.evidence.requiredValue && (
                                    <span className="text-zinc-700 font-medium block truncate">Req: {post.evidence.requiredValue}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: FEED (Community Violation Stream) */}
                  {mobileTab === "feed" && (
                    <div className="space-y-4 pt-1 text-left pb-28">
                      {/* Sticky Search & Filter Header Box */}
                      <div
                        className={cn(
                          "sticky top-1 z-30 rounded-2xl bg-[#FCFCFB]/95 backdrop-blur-md border border-[#D5D2D4] shadow-sm transition-all duration-300 ease-out text-left",
                          isSearchCollapsed ? "p-2 shadow-md" : "p-3.5"
                        )}
                      >
                        {/* Search Input Box */}
                        <div className="relative">
                          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search violations, brands..."
                            className={cn(
                              "w-full pl-9 pr-3 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] text-xs text-zinc-800 placeholder-zinc-400 outline-none ring-0 ring-offset-0 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[#94EC40]/30 focus:border-[#94EC40] focus-visible:ring-2 focus-visible:ring-[#94EC40]/30 focus-visible:border-[#94EC40] focus:bg-white focus-visible:bg-white transition-colors duration-200",
                              isSearchCollapsed ? "py-1.5" : "py-2"
                            )}
                          />
                        </div>

                        {/* Filter Pills - Clean and sleek */}
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-300 ease-out",
                            isSearchCollapsed
                              ? "max-h-0 opacity-0 pointer-events-none mt-0"
                              : "max-h-12 opacity-100 mt-2.5"
                          )}
                        >
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                            {["All", "High Severity", "MRP (Rule 6d)", "Care (Rule 6h)", "Font Size (Rule 7)"].map((filter) => (
                              <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                  "px-3 py-1 rounded-xl font-bold transition-all whitespace-nowrap text-[11px] active:scale-95",
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

                          {/* Evidence Box */}
                          <div className="p-4 rounded-[20px] bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono text-xs space-y-3 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)] ring-1 ring-black/[0.04]">
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

                          {/* Bottom Engagement */}
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

                            <button
                              type="button"
                              onClick={() => handleOpenShare(post.title, post.id)}
                              className="p-2 rounded-[14px] bg-[#ECEAEB] hover:bg-[#E0DEE0] active:scale-95 transition-all text-zinc-600 border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] flex items-center gap-1.5 font-bold text-xs"
                            >
                              <ShareCustomIcon className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: REPORTS (User's Submitted Violation Reports - Pinned Header, Dedicated Scroll Area) */}
                  {mobileTab === "reports" && (
                    <div className="flex flex-col h-[calc(100dvh-5.5rem)] max-h-[calc(100dvh-5.5rem)] space-y-3 pt-0.5 text-left overflow-hidden">
                      
                      {/* Pinned Reports Header Box (Stays in its place, never scrolls or covers cards) */}
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
                                My Submitted Reports
                              </h2>
                              <span className="text-[11px] text-zinc-500 font-medium">Violations you flagged to the Klaro community</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Summary Counter Bar */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Total Filed</span>
                            <span className="text-sm font-bold text-zinc-900 font-mono">4</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Notices Issued</span>
                            <span className="text-sm font-bold text-amber-700 font-mono">1</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Compounded</span>
                            <span className="text-sm font-bold text-[#346415] font-mono">2</span>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Reports List Only (Starts below header, scrolls smoothly with pb-36) */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 no-scrollbar pb-36">
                        {MY_SUBMITTED_REPORTS.map((rep) => (
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

                  {/* TAB 4: PROFILE (User Profile & Community Karma Stats) */}
                  {mobileTab === "profile" && (
                    <div className="space-y-4 pt-1 text-left pb-6">
                      
                      {/* User Profile Card */}
                      <div className="p-5 rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-300 shrink-0 shadow-sm flex items-center justify-center text-2xl bg-white">
                            {avatar?.startsWith("http") || avatar?.startsWith("data:") ? (
                              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <span>{avatar || "🥑"}</span>
                            )}
                          </div>
                          <div>
                            <h3
                              className="text-base font-[900] text-zinc-950 tracking-tight"
                              style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                            >
                              {profile?.displayName || user?.fullName || "Klaro Member"}
                            </h3>
                            <p className="text-xs text-zinc-500 font-mono">
                              {profile?.username || "@community_user"}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full mt-1.5 border border-red-200">
                              <WatchdogHeartHandsIcon className="w-3.5 h-3.5 text-red-600" />
                              Community Watchdog
                            </span>
                          </div>
                        </div>

                        {/* 4 Stats Grid: Karma, Reports, Upvoted, Downvoted */}
                        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#ECEAEB] text-center">
                          <div className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Karma</span>
                            <span className="text-base font-extrabold text-[#346415] font-mono">501</span>
                          </div>
                          <div className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Reports</span>
                            <span className="text-base font-extrabold text-zinc-900 font-mono">4</span>
                          </div>
                          <div className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Upvoted</span>
                            <span className="text-base font-extrabold text-zinc-900 font-mono">89</span>
                          </div>
                          <div className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Downvoted</span>
                            <span className="text-base font-extrabold text-rose-700 font-mono">6</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-[16px] bg-[#E4E2E3] border border-[#C8C5C9] text-xs space-y-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                          <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono tracking-wider block">HOW KARMA WORKS</span>
                          <p className="text-[11px] text-zinc-700 font-normal leading-relaxed">
                            You earn +1 Karma every time another citizen or officer upvotes a violation report you submitted.
                          </p>
                        </div>

                        {/* Sign Out Button */}
                        <button
                          type="button"
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className="w-full py-2.5 rounded-[16px] bg-[#ECEAEB] hover:bg-rose-50 hover:text-rose-700 border-[1.5px] border-[#D5D2D4] shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)] text-xs font-bold text-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ========================================================
                E. DESKTOP VIEW ONLY (Full 12-Column Layout)
               ======================================================== */}
            <div className="hidden sm:block space-y-4">
              
              {/* Desktop Create Scan / Filter Header Bar */}
              <div className="p-4 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-zinc-200 flex items-center justify-center text-sm bg-white">
                    {avatar?.startsWith("http") || avatar?.startsWith("data:") ? (
                      <img src={avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span>{avatar || "🥑"}</span>
                    )}
                  </div>
                  <div
                    onClick={openPickerChoice}
                    role="button"
                    className="flex-1 p-2 px-3.5 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] text-xs sm:text-sm text-zinc-500 flex items-center justify-between cursor-pointer hover:bg-[#E6E4E5] hover:border-[#B8F27D]/40 transition-colors"
                  >
                    <span className="truncate">Upload packaged commodity photo for OCR inspection...</span>
                    <InspectionCameraCustomIcon className="w-4 h-4 text-zinc-500 shrink-0 ml-2" />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs no-scrollbar">
                  {["All", "High Severity", "MRP (Rule 6d)", "Care (Rule 6h)", "Font Size (Rule 7)"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap active:scale-95",
                        activeFilter === filter
                          ? "bg-[#94EB41] text-[rgb(18,18,18)] border border-[#80D42F] shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)]"
                          : "bg-[#ECEAEB] text-zinc-600 hover:text-zinc-900 border border-[#D5D2D4]"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Posts Stream */}
              {filteredPosts.length === 0 ? (
                <div className="p-12 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] text-center space-y-2">
                  <p className="text-sm font-bold text-zinc-800">No violations match your search</p>
                  <p className="text-xs text-zinc-500">Try clearing filters or searching another keyword.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <article
                    key={`desktop-${post.id}`}
                    className="rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:border-zinc-400 flex flex-col"
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
                              post.status === "Notice Drafted"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : post.status === "Compounded"
                                ? "bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]"
                                : "bg-zinc-100 text-zinc-700 border border-zinc-300"
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

                        {/* Evidence Box */}
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

                        {/* Engagement Bar */}
                        <div className="pt-2 flex items-center justify-between border-t border-[#ECEAEB] text-xs text-zinc-600 font-medium">
                          <button
                            type="button"
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.commentsCount} Comments</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors text-zinc-600"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#346415]" />
                              <span>Notice PDF</span>
                            </button>

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

                        {/* Comments Collapsible */}
                        {expandedComments[post.id] && (
                          <div className="pt-3 border-t border-[#ECEAEB] space-y-3">
                            <div className="space-y-2">
                              {post.comments.map((comment) => (
                                <div key={comment.id} className="p-3 rounded-xl bg-[#ECEAEB]/80 text-xs space-y-1">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-1.5">
                                      <img src={comment.avatar} alt={comment.author} className="w-4 h-4 rounded-full bg-zinc-900" />
                                      <span className="font-bold text-zinc-900">{comment.author}</span>
                                      <span className="text-[10px] text-zinc-500">({comment.authorRole})</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-400">{comment.timeAgo}</span>
                                  </div>
                                  <p className="text-zinc-700 font-normal leading-relaxed pl-5">{comment.text}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={commentInputs[post.id] || ""}
                                onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(post.id); }}
                                placeholder="Add an officer note..."
                                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#D5D2D4] text-xs text-zinc-800 placeholder-zinc-400 outline-none ring-0 ring-offset-0 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[#94EC40]/30 focus:border-[#94EC40] focus-visible:ring-2 focus-visible:ring-[#94EC40]/30 focus-visible:border-[#94EC40] transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddComment(post.id)}
                                className="p-2 rounded-xl bg-[#0B0B0D] text-white hover:bg-zinc-800 transition-colors"
                              >
                                <Send className="w-3.5 h-3.5 text-[#94EC40]" />
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  </article>
                ))
              )}

            </div>

          </div>

          {/* RIGHT SIDEBAR: Fixed — does not move at all when scrolling feed */}
          <aside className="hidden lg:block lg:col-span-4 space-y-4 text-left sticky top-[72px] self-start max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar overscroll-contain scrollbar-none">
            
            {/* User Identity Card */}
            <div className="p-5 rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-300 shrink-0 shadow-sm flex items-center justify-center text-2xl bg-white">
                  {avatar?.startsWith("http") || avatar?.startsWith("data:") ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatar || "🥑"}</span>
                  )}
                </div>
                <div>
                  <h3
                    className="text-base font-[900] text-zinc-950 tracking-tight"
                    style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                  >
                    {profile?.displayName || user?.fullName || "Klaro Member"}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    {profile?.username || "@community_user"}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full mt-1 border border-red-200">
                    <WatchdogHeartHandsIcon className="w-3.5 h-3.5 text-red-600" />
                    Community Watchdog
                  </span>
                </div>
              </div>

              {/* 4 Stats Grid: Karma, Reports, Upvoted, Downvoted */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Karma</span>
                  <span className="text-sm font-bold text-[#346415] font-mono">501</span>
                </div>
                <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Reports</span>
                  <span className="text-sm font-bold text-zinc-900 font-mono">4</span>
                </div>
                <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Upvoted</span>
                  <span className="text-sm font-bold text-zinc-900 font-mono">89</span>
                </div>
                <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Downvoted</span>
                  <span className="text-sm font-bold text-rose-700 font-mono">6</span>
                </div>
              </div>

              <div className="p-3 rounded-[16px] bg-[#E4E2E3] border border-[#C8C5C9] text-xs space-y-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono tracking-wider block">HOW KARMA WORKS</span>
                <p className="text-[11px] text-zinc-700 font-normal leading-relaxed">
                  You earn +1 Karma every time another citizen or officer upvotes a violation report you submitted.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full py-2.5 rounded-[16px] bg-[#ECEAEB] hover:bg-rose-50 hover:text-rose-700 border-[1.5px] border-[#D5D2D4] shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)] text-xs font-bold text-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* My Recent Submitted Reports Preview */}
            <div className="p-5 rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-800" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900">
                  MY RECENT FILED REPORTS
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {MY_SUBMITTED_REPORTS.map((rep) => (
                  <div key={rep.id} className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] flex items-center justify-between">
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
              className="p-4 rounded-[22px] bg-[#E0DFDC] text-[rgb(18,18,18)] space-y-2 border-[1.5px] border-[#CBC7C4] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.85)]"
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
        {/* 1. Home Icon (Custom SVG) */}
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

        {/* 2. Feed Icon (Custom SVG, Right to Home) */}
        <button
          type="button"
          onClick={() => setMobileTab("feed")}
          className={cn(
            "relative p-2 rounded-full transition-all flex items-center justify-center active:scale-90",
            mobileTab === "feed" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"
          )}
          title="Feed"
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

        {/* 3. Center Green Plus Button — opens picker */}
        <button
          type="button"
          onClick={openPickerChoice}
          className="relative w-10 h-10 -my-2 rounded-full bg-[#94EB41] text-[rgb(18,18,18)] shadow-[0_4px_14px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center hover:bg-[#80D42F] active:scale-90 transition-all cursor-pointer border border-[#80D42F] shrink-0"
          title="New Scan — take or pick photo"
        >
          <Plus className="w-5 h-5 stroke-[2.8]" />
        </button>

        {/* 4. Reports Icon (Custom SVG) */}
        <button
          type="button"
          onClick={() => setMobileTab("reports")}
          className={cn(
            "relative p-2 rounded-full transition-all flex items-center justify-center active:scale-90",
            mobileTab === "reports" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"
          )}
          title="Reports"
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

        {/* 5. Profile Icon (Right to Reports) */}
        <button
          type="button"
          onClick={() => setMobileTab("profile")}
          className={cn(
            "relative p-1.5 rounded-full transition-all flex items-center justify-center active:scale-90",
            mobileTab === "profile" ? "text-zinc-950" : "opacity-80 hover:opacity-100"
          )}
          title="Profile"
        >
          {mobileTab === "profile" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-full bg-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] border border-black/5"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <div className="relative z-10 w-6 h-6 rounded-full overflow-hidden border border-zinc-300 flex items-center justify-center text-[13px] bg-white">
            {avatar?.startsWith("http") || avatar?.startsWith("data:") ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{avatar || "🥑"}</span>
            )}
          </div>
        </button>
      </nav>

      {/* ========================================================
          4. QUANTUM ARRIVING QR SHARE MODAL
         ======================================================== */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        postTitle={sharingPost?.title}
        shareUrl={sharingPost?.url}
      />

      {/* ========================================================
          5. SCAN FLOW — Hidden Inputs + Choice Modal + Thermal Printer
         ======================================================== */}
      <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleScanFile} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScanFile} />

      <AnimatePresence>
        {showPickerChoice && (
          <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowPickerChoice(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="relative w-full max-w-[340px] p-5 rounded-[26px] bg-[#FCFCFB] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.22),inset_0_1px_1px_rgba(255,255,255,0.95)] z-[76] space-y-4 mx-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#94EB41] text-[rgb(18,18,18)] flex items-center justify-center border border-[#80D42F] shadow-xs">
                    <InspectionCameraCustomIcon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4
                    className="text-sm font-[900] text-zinc-950 tracking-tight"
                    style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                  >
                    Add Product Photo
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPickerChoice(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-zinc-400 hover:text-zinc-900 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-[#EAFBD9] border border-[#B8F27D] hover:bg-[#dcf8c4] flex flex-col items-center gap-2 transition-all active:scale-95 shadow-sm text-center"
                >
                  <InspectionCameraCustomIcon className="w-6 h-6 text-[#346415]" />
                  <span className="text-xs font-bold text-zinc-900">Take photo</span>
                  <span className="text-[10px] font-medium text-zinc-500 font-mono">Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-white border border-[#D5D2D4] hover:bg-zinc-50 flex flex-col items-center gap-2 transition-all active:scale-95 shadow-sm text-center"
                >
                  <SparkleAddPhotoCustomIcon className="w-6 h-6 text-zinc-800" />
                  <span className="text-xs font-bold text-zinc-900">Choose photo</span>
                  <span className="text-[10px] font-medium text-zinc-500 font-mono">Gallery</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ScanFlow
        isOpen={showScanFlow}
        imageUrl={scanImageUrl}
        imageName={scanImageName}
        onClose={() => {
          setShowScanFlow(false);
          if (scanImageUrl) URL.revokeObjectURL(scanImageUrl);
        }}
        onPost={handleScanPost}
        onSave={handleScanSave}
      />

    </div>
  );
}
