"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { ShareModal } from "../../components/ShareModal";
import { ImageLightbox } from "../../components/reports/ImageLightbox";
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
  Paperclip,
  Layers,
  ChevronDown,
  Building2,
  ExternalLink,
  Home,
  Award,
  Sparkles,
  Map as MapIcon,
  Rows3
} from "lucide-react";
import { cn, timeAgo } from "../../lib/utils";
import { safeGet, safeRemove, safeSet } from "../../lib/storage";
import { Avatar } from "../../components/ui/Avatar";
import { getLiveReports, seedDemoReports, voteReport, addReportComment, createInspectionReport, updateReportStatus, DBReport } from "../../actions/reports";
import { CommentsDialog } from "../../components/community/CommentsDialog";
import { PostSkeleton } from "../../components/feed/PostSkeleton";
import { AdminPostMap } from "../../components/admin/AdminPostMap";
import { AdminBotPanel, type BotSeed, QuestionCircleIcon } from "../../components/admin/AdminBotPanel";
import { KlaroBot } from "../../components/auth/KlaroBot";
import { ReportScriptModal, type ScriptPost } from "../../components/reports/ReportScriptModal";
import { AdminAnalyzeModal } from "../../components/admin/AdminAnalyzeModal";

interface FeedComment {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  timeAgo: string;
  text: string;
  replyTo?: { id: string; author: string };
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
  severity: "high" | "medium" | "low" | "critical";
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
  downvotes: number;
  imageUrl?: string;
  auditReport?: any;
  commentsCount: number;
  userVote?: "up" | "down" | null;
  comments: FeedComment[];
  status: "Pending Approval" | "Compounded" | "Approved" | "Rejected" | "Notice Drafted" | "Under Review" | string;
}



const statusColorOf = (status: string) =>
  status === "Approved" || status === "Compounded"
    ? "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]"
    : status === "Pending Approval" || status === "Under Review"
    ? "bg-amber-100 text-amber-900 border-amber-300"
    : "bg-rose-100 text-rose-900 border-rose-300";

const TRENDING_INSPECTION_TOPICS = [
  { id: "tr-1", title: "USP Omission on 500g+ Packs", stat: "34 New Files", trend: "+24%", active: true },
  { id: "tr-2", title: "Consumer Care Omissions", stat: "19 Pending", trend: "+12%", active: false },
  { id: "tr-3", title: "Font Height < 4.0mm", stat: "12 In Review", trend: "+8%", active: false },
  { id: "tr-4", title: "Dual MRP Stickering", stat: "8 Flagged", trend: "+45%", active: false },
];

const HomeNavIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z" />
    <path d="M15 21.5V16.5C15 15.0858 15 14.3787 14.5607 13.9393C14.1213 13.5 13.4142 13.5 12 13.5C10.5858 13.5 9.87868 13.5 9.43934 13.9393C9 14.3787 9 15.0858 9 16.5V21.5" />
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

const WaveHandIcon = ({ className = "w-7 h-7 text-[#72C81C]" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M14.1245 5.74923C14.3983 4.99948 15.2302 4.6129 15.9825 4.88579C16.7348 5.15868 17.1227 5.98769 16.8489 6.73744L16.1878 8.5475M14.1245 5.74923L14.7855 3.93917C15.0594 3.18942 14.6715 2.3604 13.9192 2.08752C13.1668 1.81463 12.335 2.20121 12.0612 2.95096L11.5656 4.30857M14.1245 5.74923L12.3066 10.7269M11.5656 4.30857C11.839 3.55897 11.4511 2.73032 10.699 2.4575C9.94664 2.18461 9.11479 2.57119 8.84097 3.32094L6.04389 10.9791L5.1097 8.97429C4.69981 8.09467 3.61484 7.7678 2.78416 8.27368C2.14856 8.66075 1.85475 9.42786 2.06986 10.1386L3.81898 15.4859C4.15364 16.509 4.04527 17.8595 3.67597 18.8707M11.5656 4.30857L9.91291 8.83372M12.3032 22L12.6881 20.946C12.8639 20.4648 13.2266 20.0763 13.677 19.8297C14.1978 19.5445 14.8694 19.1322 15.2097 18.7412C15.7963 18.0673 16.1555 17.0838 16.8739 15.1169L18.9122 9.53572C19.186 8.78596 18.7981 7.95695 18.0458 7.68406C17.2935 7.41118 16.4616 7.79775 16.1878 8.5475M14.7004 12.6201L16.1878 8.5475" strokeLinejoin="round" />
    <path d="M20.8307 13C21.377 14.6354 20.5574 16.4263 19 17" />
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

const ReportDossierCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M19 10.5V10C19 6.22876 19 4.34315 17.8284 3.17157C16.6569 2 14.7712 2 11 2C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V16C3 17.8638 3 18.7956 3.30448 19.5307C3.71046 20.5108 4.48915 21.2895 5.46927 21.6955C6.20435 22 7.13623 22 9 22" strokeLinejoin="round" />
    <path d="M15.2825 19.0044C15.2235 18.1157 15.118 17.1658 14.6817 16.0917C14.3095 15.1756 14.4132 13.0205 16.5 13.0205C18.5868 13.0205 18.6664 15.1756 18.2942 16.0917C17.8578 17.1658 17.7765 18.1157 17.7175 19.0044M21 22H12V20.7543C12 20.3078 12.2664 19.9154 12.6528 19.7928L14.9076 19.077C15.0684 19.0259 15.2348 19 15.4021 19H17.5979C17.7652 19 17.9316 19.0259 18.0924 19.077L20.3472 19.7928C20.7336 19.9154 21 20.3078 21 20.7543V22Z" strokeLinejoin="round" />
  </svg>
);

const ViewNavbarMapCustomIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 10V9.21749C22 7.27787 22 6.30807 21.4142 5.7055C20.8284 5.10294 19.8856 5.10294 18 5.10294H15.9214C15.004 5.10294 14.9964 5.10116 14.1715 4.68834L10.8399 3.02114C9.44884 2.32504 8.75332 1.97699 8.01238 2.00118C7.27143 2.02537 6.59877 2.41808 5.25345 3.20351L4.02558 3.92037C3.03739 4.49729 2.54329 4.78576 2.27164 5.26564C2 5.74553 2 6.32993 2 7.49873V15.7157C2 17.2514 2 18.0193 2.34226 18.4467C2.57001 18.731 2.88916 18.9222 3.242 18.9856C3.77226 19.0808 4.42148 18.7018 5.71987 17.9437C6.60156 17.429 7.45011 16.8944 8.50487 17.0394C9.38869 17.1608 10.21 17.7185 11 18.1138" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2L8 17" strokeLinejoin="round" />
    <path d="M15 5V9.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.3083 21.6835C18.0915 21.8865 17.8017 22 17.5001 22C17.1985 22 16.9087 21.8865 16.6919 21.6835C14.7063 19.813 12.0455 17.7235 13.3431 14.6898C14.0447 13.0496 15.7289 12 17.5001 12C19.2713 12 20.9555 13.0496 21.6571 14.6898C22.9531 17.7196 20.2988 19.8194 18.3083 21.6835Z" />
    <path d="M17.625 16.5H17.5M17.75 16.5C17.75 16.6381 17.6381 16.75 17.5 16.75C17.3619 16.75 17.25 16.6381 17.25 16.5C17.25 16.3619 17.3619 16.25 17.5 16.25C17.6381 16.25 17.75 16.3619 17.75 16.5Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AnalyzePostCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.4737 15.5215C18.4795 15.4928 18.5205 15.4928 18.5263 15.5215C18.8302 17.0081 19.9919 18.1698 21.4785 18.4737C21.5072 18.4795 21.5072 18.5205 21.4785 18.5263C19.9919 18.8302 18.8302 19.9919 18.5263 21.4785C18.5205 21.5072 18.4795 21.5072 18.4737 21.4785C18.1698 19.9919 17.0081 18.8302 15.5215 18.5263C15.4928 18.5205 15.4928 18.4795 15.5215 18.4737C17.0081 18.1698 18.1698 17.0081 18.4737 15.5215Z" />
    <path d="M3 7.5H20" />
    <path d="M12.5 20.5H10.5C6.72876 20.5 4.84315 20.5 3.67157 19.3284C2.5 18.1569 2.5 16.2712 2.5 12.5V10.5C2.5 6.72876 2.5 4.84315 3.67157 3.67157C4.84315 2.5 6.72876 2.5 10.5 2.5H12.5C16.2712 2.5 18.1569 2.5 19.3284 3.67157C20.5 4.84315 20.5 6.72876 20.5 10.5V12.5" />
  </svg>
);

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

  const [posts, setPosts] = useState<OfficerPost[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adminEmail = "admin0529@gmail.com";

  const [commentsModalPostId, setCommentsModalPostId] = useState<string | null>(null);
  const commentsModalPost = posts.find((p) => p.id === commentsModalPostId) || null;
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});

  const getFlagIssues = (post: OfficerPost): Array<{ ruleCode: string; title: string; requiredValue?: string }> => {
    const issues = post.auditReport?.issues?.length
      ? post.auditReport.issues.map((iss: any) => ({
          ruleCode: iss.ruleCode,
          title: iss.title,
          requiredValue: iss.requiredValue,
        }))
      : [
          {
            ruleCode: post.ruleCode,
            title: post.ruleLabel,
            requiredValue: post.evidence?.requiredValue,
          },
        ];
    return issues.filter((iss: any) => iss.title && iss.title.trim());
  };
  const [activeFilter, setActiveFilter] = useState<string>("All Infractions");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [scriptPost, setScriptPost] = useState<OfficerPost | null>(null);
  const [analyzePost, setAnalyzePost] = useState<OfficerPost | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleStatusUpdated = (postId: string, newStatus: string, compoundingOrder?: any) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: (newStatus === "Compounded" ? "Compounded" : newStatus === "Notice Drafted" ? "Notice Drafted" : "Under Review") as any,
              auditReport: {
                ...(p.auditReport || {}),
                compoundingOrder: compoundingOrder || p.auditReport?.compoundingOrder,
              },
            }
          : p
      )
    );
    if (analyzePost && analyzePost.id === postId) {
      setAnalyzePost((prev) =>
        prev
          ? {
              ...prev,
              status: (newStatus === "Compounded" ? "Compounded" : newStatus === "Notice Drafted" ? "Notice Drafted" : "Under Review") as any,
              auditReport: {
                ...(prev.auditReport || {}),
                compoundingOrder: compoundingOrder || prev.auditReport?.compoundingOrder,
              },
            }
          : null
      );
    }
  };

  const TABS: Array<"home" | "feed" | "reports" | "profile"> = ["home", "feed", "reports", "profile"];
  const [mobileTab, setMobileTab] = useState<"home" | "feed" | "reports" | "profile">("home");

  const [feedView, setFeedView] = useState<"feed" | "map">("feed");

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

  const [scanImageUrl, setScanImageUrl] = useState<string | null>(null);
  const [isPickerChoiceOpen, setIsPickerChoiceOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleTrendingScroll = () => {
    if (trendingScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trendingScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

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

  const [botOpen, setBotOpen] = useState(false);
  const [botSeed, setBotSeed] = useState<BotSeed | null>(null);
  const openBot = (question?: string, context?: string) => {
    setBotSeed({ question, context, nonce: Date.now() });
    setBotOpen(true);
  };

  const [chatHeight, setChatHeight] = useState(520);
  useEffect(() => {
    const update = () =>
      setChatHeight(Math.round(Math.min(560, Math.max(380, window.innerHeight * 0.62))));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [selectionMenu, setSelectionMenu] = useState<{ x: number; y: number; text: string } | null>(null);
  const handleFeedContextMenu = (e: React.MouseEvent) => {
    const sel = window.getSelection()?.toString().trim();
    if (!sel || sel.length < 5) return;
    e.preventDefault();
    const menuWidth = 350;
    const menuHeight = 320;
    setSelectionMenu({
      x: Math.max(12, Math.min(e.clientX, window.innerWidth - menuWidth - 20)),
      y: Math.max(70, Math.min(e.clientY, window.innerHeight - menuHeight - 20)),
      text: sel.slice(0, 500),
    });
  };

  const selectionQuestions = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("mrp") || t.includes("price") || t.includes("₹") || t.includes("rs") || t.includes("cost") || t.includes("tax")) {
      return [
        "Does this MRP declaration comply with Rule 6(1)(e)?",
        "What is the statutory penalty for false or dual MRP print?",
        "Is missing Unit Sale Price (USP) compoundable for this item?",
        "What compliance notice applies for MRP violations?",
      ];
    }
    if (t.includes("qty") || t.includes("weight") || t.includes("net") || t.includes("height") || t.includes("font") || t.includes("mm") || t.includes("gram") || t.includes("kg") || t.includes("ml")) {
      return [
        "Does this net quantity violate Rule 6(1)(d) standards?",
        "What numeral height is mandatory under Rule 7 & Schedule II?",
        "Is using non-standard unit symbols punishable under Rule 13?",
        "Summarize the net quantity packaging infraction.",
      ];
    }
    if (t.includes("mfg") || t.includes("date") || t.includes("pkd") || t.includes("expiry") || t.includes("month") || t.includes("year") || t.includes("best before")) {
      return [
        "Is month & year of manufacture mandatory under Rule 6(1)(e)?",
        "What is the statutory format required for manufacturing date?",
        "What compliance escalation applies for missing mfg date?",
        "Can this labelling non-compliance be compounded under Section 48?",
      ];
    }
    if (t.includes("address") || t.includes("manufacturer") || t.includes("packer") || t.includes("import") || t.includes("origin") || t.includes("brand")) {
      return [
        "Does this manufacturer/packer address satisfy Rule 6(1)(a)?",
        "Is Country of Origin legally mandatory for this commodity?",
        "What Consumer Care details must be declared under Rule 6(1)(n)?",
        "What penalty applies for incomplete manufacturer credentials?",
      ];
    }
    return [
      "Verify if this excerpt is actionable under Legal Metrology Act",
      "Which exact rule and section apply to this excerpt?",
      "What statutory compliance notice should the officer issue?",
      "Summarize the legal metrology infraction in this text",
    ];
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await seedDemoReports();
        const db = await getLiveReports();
        if (!alive) return;
        setPosts(
          db.map((r: DBReport): OfficerPost => ({
            id: r.id,
            author: {
              name: r.author_name || "Community Inspector",
              badge: r.author_badge || "Community Inspector",
              avatar: r.author_avatar || "🥑",
              zone: r.author_zone || "India",
            },
            timeAgo: timeAgo(r.created_at),
            title: r.title,
            commodity: r.commodity,
            brand: r.brand,
            ruleCode: r.rule_code,
            ruleLabel: r.rule_label,
            severity: (r.severity as any) || "medium",
            description: r.description,
            penaltySection: "Section 36 — Legal Metrology Act, 2009",
            evidence: {
              labelRegion: r.evidence_label_region || "Auto-detected PDP",
              ocrSnippet: r.evidence_ocr_snippet || "",
              flagReason: r.evidence_flag_reason || "",
              measuredValue: r.evidence_measured_value,
              requiredValue: r.evidence_required_value,
            },
            upvotes: r.upvotes || 0,
            downvotes: r.downvotes || 0,
            imageUrl: r.image_url || undefined,
            auditReport: r.audit_report || undefined,
            commentsCount: r.comments?.length || 0,
            userVote: (r.user_votes || {})[adminEmail] || null,
            comments: r.comments || [],
            status: (r.status === "Compounded" ? "Compounded" : "Pending Approval") as OfficerPost["status"],
          }))
        );
      } catch (err) {
        console.warn("Admin feed load:", err);
      } finally {
        if (alive) setIsFeedLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = safeGet("klaro_admin_auth");
      if (!storedAuth) {
        safeSet(
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

  React.useEffect(() => {
    if (!selectionMenu) return;
    const close = () => setSelectionMenu(null);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [selectionMenu]);

  const handleAdminSignOut = () => {
    if (typeof window !== "undefined") {
      safeRemove("klaro_admin_auth");
      safeRemove("klaro_logged_in");
      document.cookie = "klaro_logged_in=; path=/; max-age=0; SameSite=Lax";
    }
    router.replace("/login");
  };

  const handleVote = (postId: string, direction: "up" | "down") => {
    const current = posts.find((p) => p.id === postId);
    if (!current) return;
    const next: "up" | "down" | null = current.userVote === direction ? null : direction;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        let upDelta = 0;
        let downDelta = 0;
        if (p.userVote === "up" && next !== "up") upDelta -= 1;
        if (p.userVote === "down" && next !== "down") downDelta -= 1;
        if (next === "up" && p.userVote !== "up") upDelta += 1;
        if (next === "down" && p.userVote !== "down") downDelta += 1;
        return { ...p, upvotes: p.upvotes + upDelta, downvotes: p.downvotes + downDelta, userVote: next };
      })
    );

    voteReport(postId, next, adminEmail).catch((err) => console.warn("Admin vote sync:", err));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: string, replyTo?: { id: string; author: string }) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: FeedComment = {
      id: `c-${Date.now()}`,
      author: adminUser.displayName,
      authorRole: adminUser.role,
      avatar: adminUser.avatar,
      timeAgo: "Just now",
      text,
      ...(replyTo ? { replyTo } : {}),
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

    addReportComment(postId, newComment).catch((err) => console.warn("Admin comment sync:", err));
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

  const handleScanPost = async ({ imageUrl, title }: { imageUrl: string; title: string }) => {
    const tempId = `post-${Date.now()}`;
    const newPost: OfficerPost = {
      id: tempId,
      downvotes: 0,
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
      penaltySection: "Section 36(1) • Compliance Review",
      description: "Official inspection scan. Compliance review queued for officer verification.",
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

    try {
      const res = await createInspectionReport({
        imageUrl,
        title,
        commodity: "Packaged Commodity (Scanned)",
        brand: "Detected via Klaro OCR",
        ruleCode: "Rule 6(1)(d)",
        ruleLabel: "Retail Price & USP Non-Compliance",
        severity: "high",
        description: "Official inspection scan. Compliance review queued for officer verification.",
        evidence: {
          labelRegion: "Auto-detected PDP • Confidence 98%",
          ocrSnippet: "MRP Rs 120.00 (PKD 07/2026)",
          flagReason: "Missing ₹ per g/kg specification and tax inclusion text.",
          requiredValue: "₹0.24 per g (Mandatory since 2022 Amendment)",
        },
      });
      if (res.success && res.report) {
        setPosts((prev) => prev.map((p) => (p.id === tempId ? { ...p, id: res.report!.id } : p)));
      }
    } catch (err) {
      console.warn("Officer scan Supabase sync error:", err);
    }
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

  const filteredPosts = [...posts].sort((a, b) => {
    const aIsCommunity = /community/i.test(a.author.badge);
    const bIsCommunity = /community/i.test(b.author.badge);
    return Number(bIsCommunity) - Number(aIsCommunity);
  }).filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.ruleCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All Infractions") return true;
    if (activeFilter === "Pending Review") return post.status === "Pending Approval";
    if (activeFilter === "Approved") return post.status === "Approved";
    if (activeFilter === "Compounded") return post.status === "Compounded";
    return true;
  });

  const openPostScript = (post: OfficerPost) => setScriptPost(post);
  const scriptPostData = scriptPost
    ? ({ ...scriptPost, authorZone: scriptPost.author.zone } satisfies ScriptPost)
    : null;

  return (
    <div className="min-h-screen w-full bg-[#E6E4E5] text-[rgb(18,18,18)] antialiased font-sans flex flex-col selection:bg-[#94EC40] selection:text-[rgb(18,18,18)]">
      
      <header className="hidden md:block sticky top-0 z-40 w-full pointer-events-none">
        <motion.div
          initial={false}
          animate={{ maxWidth: botOpen ? "820px" : "1280px" }}
          transition={{ type: "spring", stiffness: 270, damping: 28, mass: 0.9 }}
          className="mx-auto px-3 sm:px-6 lg:px-8 w-full"
        >
          <div className="relative pointer-events-auto h-[54px] filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <motion.div
              initial={false}
              animate={{ height: botOpen ? chatHeight : 54 }}
              transition={{ type: "spring", stiffness: 270, damping: 28, mass: 0.9 }}
              className="absolute top-0 left-0 right-0 bg-[#FCFCFB] border-b-[1.5px] border-[#D5D2D4]"
            >
            <div className="absolute top-0 bottom-0 -left-[38px] w-[39px] flex flex-col pointer-events-none z-10">
              <svg width="39" height="25" viewBox="0 0 39 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path
                  d="M 0 0 A 24 24 0 0 1 24 24 L 24 25 H 39 V 0 Z"
                  fill="#FCFCFB"
                />
                <path
                  d="M 0 0 A 24 24 0 0 1 24 24 L 24 25"
                  stroke="#D5D2D4"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <div className="flex-1 ml-[23.25px] w-[15.75px] bg-[#FCFCFB] border-l-[1.5px] border-[#D5D2D4]" />
              <svg width="39" height="16" viewBox="0 38 39 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path
                  d="M 24 38 L 24 40 A 14 14 0 0 0 38 54 H 39 V 38 Z"
                  fill="#FCFCFB"
                />
                <path
                  d="M 24 38 L 24 39.25 A 14 14 0 0 0 38 53.25 H 39"
                  stroke="#D5D2D4"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>

            <div className="absolute top-0 bottom-0 -right-[38px] w-[39px] flex flex-col pointer-events-none z-10">
              <svg width="39" height="25" viewBox="-1 0 39 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path
                  d="M 38 0 A 24 24 0 0 0 14 24 L 14 25 H -1 V 0 Z"
                  fill="#FCFCFB"
                />
                <path
                  d="M 38 0 A 24 24 0 0 0 14 24 L 14 25"
                  stroke="#D5D2D4"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <div className="flex-1 w-[15.75px] bg-[#FCFCFB] border-r-[1.5px] border-[#D5D2D4]" />
              <svg width="39" height="16" viewBox="-1 38 39 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path
                  d="M 0 54 A 14 14 0 0 0 14 40 L 14 38 H -1 V 54 Z"
                  fill="#FCFCFB"
                />
                <path
                  d="M -1 53.25 H 0 A 14 14 0 0 0 14 39.25 L 14 38"
                  stroke="#D5D2D4"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>

            <AnimatePresence initial={false}>
              {!botOpen && (
                <motion.div
                  key="nav-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.25, delay: 0.12 }}
                  className="absolute inset-x-0 top-0 h-[54px] px-4 sm:px-6 flex items-center justify-between gap-4"
                >
              
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

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="relative grid grid-cols-2 p-0.5 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] w-[184px]">
                        <motion.div
                          animate={{
                            x: feedView === "feed" ? 0 : "100%",
                            backgroundColor: feedView === "feed" ? "#FCFCFB" : "#94EB41",
                            borderColor: feedView === "feed" ? "#D5D2D4" : "#80D42F",
                            boxShadow:
                              feedView === "feed"
                                ? "0 1px 4px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.95)"
                                : "0 2px 8px rgba(148,235,65,0.35), inset 0 1px 1px rgba(255,255,255,0.7)",
                          }}
                          transition={{ type: "spring", stiffness: 480, damping: 32 }}
                          className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-lg border pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={() => setFeedView("feed")}
                          title="Simple feed — no map"
                          className={cn(
                            "relative z-10 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors duration-150 active:scale-95 select-none",
                            feedView === "feed"
                              ? "text-zinc-900"
                              : "text-zinc-500 hover:text-zinc-800"
                          )}
                        >
                          <FeedNavIcon className="w-3.5 h-3.5" />
                          <span>Feed</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeedView("map")}
                          title="View Map — reports pinned across India"
                          className={cn(
                            "relative z-10 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors duration-150 active:scale-95 select-none",
                            feedView === "map"
                              ? "text-[rgb(18,18,18)]"
                              : "text-zinc-500 hover:text-zinc-800"
                          )}
                        >
                          <ViewNavbarMapCustomIcon className="w-3.5 h-3.5" />
                          <span>View Map</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setBotOpen(true)}
                        title="Open KlaroReport"
                        className="rounded-xl border border-transparent bg-transparent p-1 transition-all hover:bg-[#ECEAEB] active:scale-95"
                      >
                        <KlaroBot state="idle" size="sm" showShadow={false} interactive={true} />
                      </button>
                <button
                  type="button"
                  onClick={openPickerChoice}
                  className="px-3.5 py-1.5 rounded-xl bg-[#94EB41] hover:bg-[#80D42F] text-[rgb(18,18,18)] font-bold text-xs shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-[#80D42F] flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <ReportNavbarCustomIcon className="w-4 h-4 stroke-[1.8]" />
                  <span>Report</span>
                </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {botOpen && (
                  <motion.div
                    key="klaro-chat"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10, transition: { duration: 0.16, ease: "easeIn" } }}
                    transition={{ type: "spring", stiffness: 380, damping: 34, delay: 0.06 }}
                    className="absolute inset-0 overflow-hidden flex flex-col"
                  >
                    <AdminBotPanel
                      open
                      onClose={() => setBotOpen(false)}
                      seed={botSeed}
                      onSeedConsumed={() => setBotSeed(null)}
                      adminEmail={adminEmail}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {selectionMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed z-[90] w-[320px] sm:w-[350px] rounded-2xl bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden"
            style={{ left: selectionMenu.x, top: selectionMenu.y }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="px-3.5 py-2.5 border-b border-[#ECEAEB] bg-gradient-to-r from-[#FCFCFB] via-[#F7FFF0] to-[#FCFCFB] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <QuestionCircleIcon className="w-3.5 h-3.5 text-[#346415]" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-800">
                  Got some questions from it
                </span>
              </div>
            </div>
            <div className="p-2 space-y-1.5 max-h-[340px] overflow-y-auto no-scrollbar">
              {selectionQuestions(selectionMenu.text).map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    openBot(q, selectionMenu.text);
                    setSelectionMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-[#ECEAEB] hover:bg-[#EAFBD9] border border-[#D5D2D4] hover:border-[#94EC40] text-[11px] font-semibold text-zinc-800 hover:text-[#346415] transition-all active:scale-[0.98] leading-snug break-words flex items-start gap-1.5 group"
                >
                  <span className="shrink-0 text-[#346415] font-bold group-hover:translate-x-0.5 transition-transform mt-0.5">
                    →
                  </span>
                  <span className="flex-1">{q}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={cn(
          "flex-1 w-full mx-auto px-3 sm:px-6",
          mobileTab === "home" || mobileTab === "reports" || (mobileTab === "feed" && feedView === "map")
            ? "py-1 pb-1 sm:py-6 sm:pb-6 overflow-hidden sm:overflow-visible"
            : "py-3 pb-28 sm:py-6 sm:pb-6",
          feedView === "map" && "sm:py-3.5 sm:pb-3.5"
        )}
      >
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
                  {mobileTab === "home" && (
                    <div className="flex flex-col justify-between h-[calc(100dvh-5.5rem)] max-h-[calc(100dvh-5.5rem)] gap-2.5 pt-0.5 pb-16 px-1 text-left overflow-hidden">
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

                      <div className="pt-0.5 shrink-0">
                        <h1
                          className="text-[30px] sm:text-[36px] font-[900] text-[rgb(18,18,18)] tracking-[-0.04em] leading-[1.08]"
                          style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                        >
                          <span className="flex items-center gap-2">
                            <WaveHandIcon className="w-7 h-7 text-[#94EB41] shrink-0" />
                            <span>What are we</span>
                          </span>
                          <span>inspecting today?</span>
                        </h1>
                      </div>

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

                        <div className="relative -mx-2 px-2 overflow-hidden">
                          <div
                            className={cn(
                              "absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#E6E4E5] to-transparent pointer-events-none z-10 transition-opacity duration-300 backdrop-blur-[1px]",
                              canScrollLeft ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div
                            className={cn(
                              "absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#E6E4E5] to-transparent pointer-events-none z-10 transition-opacity duration-300 backdrop-blur-[1px]",
                              canScrollRight ? "opacity-100" : "opacity-0"
                            )}
                          />

                          <div
                            ref={trendingScrollRef}
                            onScroll={handleTrendingScroll}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                            className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1 pt-0.5 px-2"
                          >
                            {isFeedLoading ? (
                              [1, 2, 3].map((skel) => (
                                <div
                                  key={`trending-skel-${skel}`}
                                  className="w-[265px] h-[175px] shrink-0 snap-start p-3.5 rounded-[20px] bg-[#E4E2E3] border-[1.5px] border-[#C8C5C9] animate-pulse flex flex-col justify-between"
                                >
                                  <div className="flex items-center justify-between border-b border-[#D2CFD3] pb-1.5">
                                    <div className="h-3.5 w-24 bg-zinc-300 rounded-md" />
                                    <div className="h-3 w-16 bg-[#94EB41]/30 rounded-md" />
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-2 w-14 bg-zinc-300 rounded" />
                                    <div className="h-3 w-36 bg-zinc-300 rounded" />
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-2 w-20 bg-zinc-300 rounded" />
                                    <div className="h-3 w-32 bg-zinc-300 rounded" />
                                  </div>
                                  <div className="pt-1.5 border-t border-[#D2CFD3]">
                                    <div className="h-2.5 w-28 bg-zinc-300 rounded" />
                                  </div>
                                </div>
                              ))
                            ) : (
                              posts.map((post) => (
                                <div
                                  key={`trending-home-${post.id}`}
                                  onClick={() => openPostScript(post)}
                                  className="w-[265px] shrink-0 snap-start p-3.5 rounded-[20px] bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono space-y-2 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)] ring-1 ring-black/[0.04] text-left cursor-pointer active:scale-[0.99]"
                                >
                                  <div className="flex items-center justify-between border-b border-[#D2CFD3] pb-1.5 text-[10px]">
                                    <span className="truncate pr-1 text-zinc-900 font-bold text-xs max-w-[135px]">{post.commodity}</span>
                                    <span className="text-[#346415] shrink-0 font-extrabold bg-[#EAFBD9] px-2 py-0.5 rounded-md border border-[#B8F27D] text-[9px] truncate max-w-[115px]">
                                      BRAND: {post.brand}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">OCR REGION</span>
                                    <span className="text-zinc-900 font-bold block text-[10.5px] leading-tight mt-0.5">{post.evidence.labelRegion}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">OCR EXTRACTED STRING</span>
                                    <span className="text-[#92400E] font-extrabold block text-[11px] leading-tight mt-0.5">{post.evidence.ocrSnippet}</span>
                                  </div>
                                  <div className="pt-1.5 border-t border-[#D2CFD3] space-y-0.5 text-[10px] leading-tight">
                                    <span className="text-rose-700 font-bold block truncate">Flag: {post.evidence.flagReason}</span>
                                    {post.evidence.requiredValue && (
                                      <span className="text-zinc-700 font-medium block truncate">Req: {post.evidence.requiredValue}</span>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mobileTab === "feed" && (
                    <div className={cn("space-y-2 pt-1 text-left", feedView === "feed" ? "pb-28" : "pb-0")}>
                      <div className="sticky top-0 z-20 pt-1 pb-2 bg-[#E6E4E5]/90 backdrop-blur-md flex items-center justify-between gap-2">
                        <div className="relative grid grid-cols-2 p-1 bg-[#ECEAEB] rounded-full border border-[#D5D2D4] shadow-inner w-[184px]">
                          <motion.div
                            animate={{
                              x: feedView === "feed" ? 0 : "100%",
                              backgroundColor: feedView === "feed" ? "#FCFCFB" : "#94EB41",
                              borderColor: feedView === "feed" ? "#D5D2D4" : "#80D42F",
                              boxShadow:
                                feedView === "feed"
                                  ? "0 1px 4px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.95)"
                                  : "0 2px 8px rgba(148,235,65,0.35), inset 0 1px 1px rgba(255,255,255,0.7)",
                            }}
                            transition={{ type: "spring", stiffness: 480, damping: 32 }}
                            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full border pointer-events-none"
                          />
                          <button
                            type="button"
                            onClick={() => setFeedView("feed")}
                            className={cn(
                              "relative z-10 py-1.5 rounded-full text-xs font-bold transition-colors duration-150 active:scale-95 flex items-center justify-center select-none",
                              feedView === "feed"
                                ? "text-zinc-900"
                                : "text-zinc-600 hover:text-zinc-900"
                            )}
                          >
                            Feed
                          </button>
                          <button
                            type="button"
                            onClick={() => setFeedView("map")}
                            className={cn(
                              "relative z-10 py-1.5 rounded-full text-xs font-bold transition-colors duration-150 active:scale-95 flex items-center justify-center gap-1.5 select-none",
                              feedView === "map"
                                ? "text-[rgb(18,18,18)]"
                                : "text-zinc-600 hover:text-zinc-900"
                            )}
                          >
                            <ViewNavbarMapCustomIcon className="w-3.5 h-3.5" />
                            <span>View Map</span>
                          </button>
                        </div>

                        <span className="text-[10.5px] font-mono font-bold text-zinc-600 bg-[#FCFCFB] px-3 py-1.5 rounded-full border border-[#D5D2D4] shadow-xs">
                          {filteredPosts.length} Infractions
                        </span>
                      </div>

                      {feedView === "map" ? (
                        <div className="h-[calc(100dvh-7.6rem)] flex flex-col justify-center items-center gap-1.5 overflow-hidden pb-1">
                          <div className="grid grid-cols-3 gap-2 w-full max-w-[min(94vw,395px)] mx-auto text-center shrink-0">
                            <div className="p-2 rounded-[14px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)]">
                              <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Total Filed</span>
                              <span className="text-sm font-bold text-zinc-900 font-mono">1,284</span>
                            </div>
                            <div className="p-2 rounded-[14px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)]">
                              <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">In Review</span>
                              <span className="text-sm font-bold text-amber-700 font-mono">2</span>
                            </div>
                            <div className="p-2 rounded-[14px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)]">
                              <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Compounded</span>
                              <span className="text-sm font-bold text-[#346415] font-mono">86.2%</span>
                            </div>
                          </div>

                          <div className="w-full flex items-center justify-center shrink-0">
                            <AdminPostMap
                              className="w-full max-w-[min(94vw,395px)] mx-auto"
                              hideHeader
                              hideFooter
                              posts={posts.map((p) => ({
                                id: p.id,
                                title: p.title,
                                ruleCode: p.ruleCode,
                                severity: p.severity,
                                status: p.status,
                                zone: p.author.zone,
                                avatar: p.author.avatar,
                                isOfficial: !/community/i.test(p.author.badge),
                              }))}
                              onPostSelect={(postId) => {
                                const post = posts.find((p) => p.id === postId);
                                if (post) openPostScript(post);
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
                            <div className="flex items-center gap-1.5 w-max">
                              {["All Infractions", "Pending Review", "Approved", "Compounded"].map((filter) => (
                                <button
                                  key={`mobile-chip-${filter}`}
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

                          {isFeedLoading && <PostSkeleton count={2} />}
                          {!isFeedLoading && filteredPosts.length === 0 && (
                            <div className="p-8 rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] text-center">
                              <p className="text-sm font-bold text-zinc-900">No community violations reported yet</p>
                              <p className="text-xs text-zinc-500 mt-1">Reports will appear here as the community scans products.</p>
                            </div>
                          )}
                          {!isFeedLoading && filteredPosts.map((post) => (
                            <article
                              key={`feed-${post.id}`}
                              className="rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] overflow-hidden p-4 space-y-3 text-left"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar
                                    avatar={post.author.avatar}
                                    name={post.author.name}
                                    className="w-6 h-6 rounded-full border border-zinc-200"
                                  />
                                  <span className="text-zinc-800 font-bold text-xs flex items-center gap-1">
                                    {post.author.zone}
                                    {!/community/i.test(post.author.badge) && <ShieldCheck className="w-3 h-3 text-[#346415]" />}
                                  </span>
                                </div>
                                <span className="text-zinc-500 text-[11px] font-medium">{post.timeAgo}</span>
                              </div>

                              <div>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-block mb-1">
                                  {post.ruleCode} • {post.ruleLabel}
                                </span>
                                <h2 className="text-[15px] font-bold text-zinc-950 tracking-tight leading-snug">
                                  {post.title}
                                </h2>
                              </div>

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

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setAnalyzePost(post)}
                                    className="p-2 rounded-xl text-zinc-700 hover:text-zinc-950 active:scale-90 transition-all"
                                    title="Analyze & Compound violation"
                                  >
                                    <AnalyzePostCustomIcon className="w-4 h-4 stroke-[1.8]" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => openPostScript(post)}
                                    className="p-2 rounded-xl text-zinc-700 hover:text-zinc-950 active:scale-90 transition-all"
                                    title="View Inspection Report"
                                  >
                                    <ReportDossierCustomIcon className="w-4 h-4 stroke-[1.8]" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleOpenShare(post.title, post.id)}
                                    className="p-2 rounded-xl text-zinc-700 hover:text-zinc-950 active:scale-90 transition-all"
                                    title="Share"
                                  >
                                    <ShareCustomIcon className="w-4 h-4 stroke-[1.8]" />
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {mobileTab === "reports" && (() => {
                    const officerActionedReports = posts.filter(
                      (rep) => rep.auditReport?.compoundingOrder || rep.status === "Compounded" || rep.status === "Notice Drafted"
                    );
                    const noticeCount = officerActionedReports.filter((r) => r.status === "Notice Drafted").length;
                    const compoundedCount = officerActionedReports.filter((r) => r.status === "Compounded").length;

                    return (
                      <div className="flex flex-col h-[calc(100dvh-5.5rem)] max-h-[calc(100dvh-5.5rem)] space-y-3 pt-0.5 text-left overflow-hidden">
                        
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
                                  My Statutory Actioned Cases
                                </h2>
                                <span className="text-[11px] text-zinc-500 font-medium">Reports analyzed, noticed or compounded by officer</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                            <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                              <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Total Actioned</span>
                              <span className="text-sm font-bold text-zinc-900 font-mono">{officerActionedReports.length}</span>
                            </div>
                            <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                              <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Notices</span>
                              <span className="text-sm font-bold text-amber-700 font-mono">{noticeCount}</span>
                            </div>
                            <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                              <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Compounded</span>
                              <span className="text-sm font-bold text-[#346415] font-mono">{compoundedCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 no-scrollbar pb-36">
                          {officerActionedReports.length === 0 ? (
                            <div className="p-6 rounded-[20px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] text-center space-y-1.5">
                              <p className="text-xs font-bold text-zinc-800">No Actioned Reports Yet</p>
                              <p className="text-[11px] text-zinc-500 leading-relaxed">
                                When you analyze reports in the feed and issue notices or compounding orders, they will appear here under your docket.
                              </p>
                            </div>
                          ) : (
                            officerActionedReports.map((rep) => (
                              <div
                                key={rep.id}
                                className="p-4 rounded-[20px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-2.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    {rep.ruleCode}
                                  </span>
                                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border", statusColorOf(rep.status))}>
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
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10.5px] text-zinc-400 font-medium">{rep.timeAgo}</span>
                                    {rep.auditReport?.compoundingOrder?.penaltyAmount && (
                                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]">
                                        {rep.auditReport.compoundingOrder.penaltyAmount}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setAnalyzePost(rep)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#94EB41] hover:bg-[#80D42F] text-[rgb(18,18,18)] text-[11px] font-extrabold shadow-[0_1.5px_6px_rgba(148,235,65,0.25)] border border-[#80D42F] active:scale-95 transition-all cursor-pointer"
                                      title="View & Edit Statutory Notice"
                                    >
                                      <AnalyzePostCustomIcon className="w-3.5 h-3.5" />
                                      <span>Notice</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => openPostScript(rep)}
                                      className="p-1.5 rounded-xl bg-[#ECEAEB] hover:bg-[#E0DEE0] text-zinc-700 active:scale-95 transition-all border border-[#D5D2D4]"
                                      title="View Inspection Report"
                                    >
                                      <ReportDossierCustomIcon className="w-3.5 h-3.5 text-[#346415]" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                      </div>
                    );
                  })()}

                  {mobileTab === "profile" && (
                    <div className="space-y-4 pt-1 text-left pb-6">
                      
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

            <div className="hidden sm:block">

              <AnimatePresence mode="wait" initial={false}>

              {feedView === "map" && (
                <motion.div
                  key="admin-map-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="max-w-[1600px] 2xl:max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-center"
                >
                  <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7 flex flex-col items-center justify-center my-auto w-full">
                    <AdminPostMap
                      posts={posts.map((p) => ({
                        id: p.id,
                        title: p.title,
                        ruleCode: p.ruleCode,
                        severity: p.severity,
                        status: p.status,
                        zone: p.author.zone,
                        avatar: p.author.avatar,
                        isOfficial: !/community/i.test(p.author.badge),
                      }))}
                      onPostSelect={(postId) => {
                        const targetEl = document.getElementById(`map-issue-${postId}`);
                        if (targetEl) {
                          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
                          setHighlightedPostId(postId);
                          if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
                          highlightTimerRef.current = setTimeout(() => setHighlightedPostId(null), 2500);
                        } else {
                          const post = posts.find((p) => p.id === postId);
                          if (post) openPostScript(post);
                        }
                      }}
                    />
                  </div>

                  <section
                    className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 w-full lg:h-[calc(100dvh-6.5rem)] lg:max-h-[calc(100dvh-6.5rem)] flex flex-col min-h-0"
                    aria-label="Mapped community issues"
                  >
                    <div className="flex items-end justify-between px-1 pb-2 shrink-0">
                      <div>
                        <p className="text-[9.5px] font-mono font-bold uppercase tracking-[0.16em] text-zinc-400">Map issue log</p>
                        <h2 className="text-sm sm:text-[15px] font-[900] tracking-tight text-zinc-950">Issues found across the feed</h2>
                      </div>
                      <span className="text-[9.5px] font-mono font-bold text-zinc-600 bg-[#ECEAEB] px-2 py-0.5 rounded-md border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                        {filteredPosts.length} mapped
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 px-2 py-1.5 overscroll-contain pb-8">
                      {isFeedLoading ? (
                        <PostSkeleton count={2} />
                      ) : filteredPosts.length === 0 ? (
                        <div className="rounded-[18px] border-[1.5px] border-[#C8C5C9] bg-[#FCFCFB] p-5 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] ring-1 ring-black/[0.03]">
                          <p className="text-xs font-bold text-zinc-900">No mapped issues yet</p>
                          <p className="mt-0.5 text-[11px] text-zinc-500">Community reports will appear here with their evidence.</p>
                        </div>
                      ) : (
                        filteredPosts.map((post) => (
                          <article
                            key={`map-issue-${post.id}`}
                            id={`map-issue-${post.id}`}
                            className={cn(
                              "rounded-[17px] sm:rounded-[18px] border-[1.5px] bg-[#FCFCFB] p-2.5 sm:p-3 shadow-[0_2px_10px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.95)] transition-all duration-300",
                              highlightedPostId === post.id
                                ? "border-[#80D42F] ring-2 ring-[#94EB41] shadow-[0_4px_20px_rgba(148,235,65,0.3)] bg-[#F8FDF2]"
                                : "border-[#C8C5C9] ring-1 ring-black/[0.03] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                                    {post.commodity}
                                  </span>
                                  {post.ruleCode && (
                                    <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                      {post.ruleCode}
                                    </span>
                                  )}
                                </div>
                                <h3 className="mt-0.5 text-[12.5px] sm:text-[13px] font-[800] leading-snug tracking-tight text-zinc-950">
                                  {post.title}
                                </h3>
                              </div>
                              <span className={cn("shrink-0 rounded-full border px-2 py-0.2 text-[8.5px] font-mono font-bold uppercase", statusColorOf(post.status))}>
                                {post.status}
                              </span>
                            </div>

                            <div className="mt-2 rounded-[14px] border border-[#C8C5C9] bg-[#E4E2E3] p-2.5 font-mono text-[10px] sm:text-[10.5px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                              <div className="flex items-center justify-between gap-2 border-b border-[#D5D2D6] pb-1.5">
                                <span className="truncate font-medium text-zinc-900">{post.commodity}</span>
                                <span className="shrink-0 rounded-md border border-[#B8F27D] bg-[#EAFBD9] px-1.5 py-0.2 text-[9px] font-bold text-[#346415]">
                                  BRAND: {post.brand}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-1.5 border-b border-[#D5D2D6] py-1.5 sm:grid-cols-2">
                                <div className="min-w-0">
                                  <span className="block text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">OCR REGION</span>
                                  <span className="mt-0.2 block leading-snug text-zinc-950 font-bold truncate">{post.evidence.labelRegion || "Auto-detected region"}</span>
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">OCR EXTRACTED STRING</span>
                                  <span className="mt-0.2 block leading-snug text-[#A8500D] font-bold truncate">{post.evidence.ocrSnippet || "No OCR captured"}</span>
                                </div>
                              </div>
                              <div className="space-y-1 pt-1.5">
                                {getFlagIssues(post).slice(0, 2).map((issue, index) => (
                                  <div key={`${post.id}-map-issue-${index}`} className="flex items-start justify-between gap-2 leading-snug text-[9.5px]">
                                    <span className="text-rose-700 truncate">
                                      <span className="font-bold">Flag:</span> {issue.title} <span className="text-rose-400">({issue.ruleCode})</span>
                                    </span>
                                    {issue.requiredValue && (
                                      <span className="shrink-0 max-w-[42%] truncate text-right text-zinc-700 font-medium">
                                        Req: {issue.requiredValue}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-1.5 border-t border-[#ECEAEB] pt-1.5 text-[11px] font-semibold text-zinc-500">
                              <button
                                type="button"
                                onClick={() => setCommentsModalPostId(post.id)}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-[#ECEAEB] hover:text-zinc-900"
                              >
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.commentsCount} Comments</span>
                              </button>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenShare(post.title, post.id)}
                                  className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-[#ECEAEB] hover:text-zinc-900"
                                >
                                  <ShareCustomIcon className="h-3 w-3" />
                                  <span>Share</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAnalyzePost(post)}
                                  className="flex items-center gap-1 rounded-lg bg-[#94EB41] px-2.5 py-1 text-[rgb(18,18,18)] shadow-[0_1.5px_6px_rgba(148,235,65,0.25)] transition-colors hover:bg-[#80D42F] active:scale-95 text-[11px] font-extrabold cursor-pointer"
                                  title="Analyze & Compound violation"
                                >
                                  <AnalyzePostCustomIcon className="h-3.5 w-3.5" />
                                  <span>Analyze</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openPostScript(post)}
                                  className="flex items-center gap-1 rounded-lg bg-[#ECEAEB] hover:bg-[#E0DEE0] px-2 py-1 text-zinc-700 transition-colors active:scale-95 text-[11px] font-bold border border-[#D5D2D4]"
                                >
                                  <ReportDossierCustomIcon className="h-3 w-3 text-[#346415]" />
                                  <span>Report</span>
                                </button>
                              </div>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                </motion.div>
              )}

              {feedView === "feed" && (
                <motion.div
                  key="admin-feed-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start"
                >
                  <div className="lg:col-span-8 space-y-4">
              <div className="p-3 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {["All Infractions", "Pending Review", "Approved", "Compounded"].map((filter) => (
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

              <div className="p-3.5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                    <TrendingFlameCustomIcon className="w-4 h-4 text-amber-600" />
                    <span>Trending Infractions</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">Real-time surveillance</span>
                </div>

                {isFeedLoading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((idx) => (
                      <div
                        key={`trending-skeleton-${idx}`}
                        className="p-2.5 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] animate-pulse space-y-1.5"
                      >
                        <div className="h-3 w-20 bg-zinc-300 rounded-md" />
                        <div className="flex items-center justify-between">
                          <div className="h-2.5 w-12 bg-zinc-300 rounded" />
                          <div className="h-2.5 w-8 bg-[#94EB41]/30 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>

              <div className="flex items-center justify-between px-1 pt-1">
                <div>
                  <h2 className="text-sm font-[900] tracking-tight text-zinc-950">Original community posts</h2>
                  <p className="text-[11px] text-zinc-500">Use View Report on any post to open its Klaro script.</p>
                </div>
              </div>

              {isFeedLoading && <PostSkeleton count={3} />}

              {!isFeedLoading && filteredPosts.length === 0 && (
                  <div className="p-8 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] text-center">
                    <p className="text-sm font-bold text-zinc-900">No community violations reported yet</p>
                    <p className="text-xs text-zinc-500 mt-1">Reports will appear here as the community scans products.</p>
                  </div>
              )}
              {!isFeedLoading && filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onContextMenu={handleFeedContextMenu}
                  className="rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:border-[#B8F27D] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)]"
                >
                  <div className="p-5 flex items-start gap-4">
                    
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

                    <div className="flex-1 w-full space-y-2.5 text-left">
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Avatar
                            avatar={post.author.avatar}
                            name={post.author.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="font-bold text-zinc-900 flex items-center gap-1">
                            {post.author.name}
                            {!/community/i.test(post.author.badge) && (
                              <ShieldCheck className="w-3.5 h-3.5 text-[#346415]" aria-label="Verified Legal Metrology Officer" />
                            )}
                          </span>
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

                      <p className="text-[13px] text-zinc-600 leading-relaxed font-normal">
                        {post.description}
                      </p>

                      <div className="p-4 rounded-2xl bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono text-xs space-y-3 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-black/[0.04]">
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

                        <div className="pt-0.5 space-y-1.5">
                          {(expandedIssues[post.id]
                            ? getFlagIssues(post)
                            : getFlagIssues(post).slice(0, 2)
                          ).map((iss, i) => (
                            <div key={`${post.id}-flag-${i}`} className="flex items-start justify-between gap-3">
                              <span className="text-[11px] font-mono font-medium text-rose-700 leading-snug">
                                Flag: {iss.title} <span className="text-rose-400 font-bold">({iss.ruleCode})</span>
                              </span>
                              <span className="text-[11px] font-mono font-medium text-zinc-700 leading-snug text-right shrink-0 max-w-[45%] truncate">
                                {iss.requiredValue ? `Req: ${iss.requiredValue}` : ""}
                              </span>
                            </div>
                          ))}

                          {getFlagIssues(post).length > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedIssues((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                              }
                              className="flex items-center gap-1 text-[10.5px] font-mono font-bold text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all pt-0.5"
                            >
                              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expandedIssues[post.id] && "rotate-180")} />
                              <span>
                                {expandedIssues[post.id] ? "Show fewer issues" : `View all issues (${getFlagIssues(post).length})`}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-[#ECEAEB] text-xs text-zinc-600 font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setCommentsModalPostId(post.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.commentsCount} Comments</span>
                          </button>

                          {post.imageUrl && (
                            <button
                              type="button"
                              onClick={() => setLightboxImage(post.imageUrl!)}
                              title="View evidence image"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors text-zinc-600 hover:text-zinc-900 active:scale-95"
                            >
                              <Paperclip className="w-3.5 h-3.5 -rotate-45 text-[#346415]" />
                              <span>Image</span>
                            </button>
                          )}

                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAnalyzePost(post)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#94EB41] hover:bg-[#80D42F] text-[rgb(18,18,18)] font-extrabold text-xs shadow-[0_1.5px_6px_rgba(148,235,65,0.25)] transition-all active:scale-95 cursor-pointer"
                            title="Analyze & Compound violation"
                          >
                            <AnalyzePostCustomIcon className="w-4 h-4" />
                            <span>Analyze</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openPostScript(post)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors text-zinc-600 hover:text-zinc-900 active:scale-95 font-bold text-xs"
                          >
                            <ReportDossierCustomIcon className="w-3.5 h-3.5 text-[#346415]" />
                            <span>View Report</span>
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



                    </div>
                  </div>
                </article>
              ))}
                  </div>

                  <aside className="hidden lg:block lg:col-span-4 space-y-4 text-left sticky top-[4.5rem] self-start transition-none">
                    
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

                      {isFeedLoading ? (
                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={`stat-skeleton-${i}`} className="p-2 rounded-xl bg-[#ECEAEB] animate-pulse space-y-1">
                              <div className="h-2 w-10 mx-auto bg-zinc-300 rounded" />
                              <div className="h-4 w-8 mx-auto bg-zinc-300 rounded" />
                            </div>
                          ))}
                        </div>
                      ) : (
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
                      )}

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

                    <div className="p-5 rounded-2xl bg-[#FCFCFB] border border-[#D5D2D4] shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-800" />
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900">
                          RECENT COMMUNITY POSTS
                        </h4>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto no-scrollbar pr-0.5 space-y-2 text-xs">
                        {isFeedLoading ? (
                          <div className="space-y-2 py-1">
                            {[1, 2, 3, 4].map((s) => (
                              <div key={`recent-skel-${s}`} className="p-2.5 rounded-xl bg-[#ECEAEB] animate-pulse space-y-1.5">
                                <div className="h-3 w-28 bg-zinc-300 rounded" />
                                <div className="h-2.5 w-40 bg-zinc-300 rounded" />
                              </div>
                            ))}
                          </div>
                        ) : posts.length === 0 ? (
                          <p className="text-[11px] text-zinc-400 font-medium py-2">No community posts yet.</p>
                        ) : (
                          posts.map((rep) => (
                            <div key={rep.id} className="p-2.5 rounded-xl bg-[#ECEAEB] flex items-center justify-between shrink-0">
                              <div>
                                <span className="text-[10.5px] font-bold text-zinc-900 block font-mono">{rep.ruleCode}</span>
                                <span className="text-[11px] text-zinc-600 truncate max-w-[170px] block">{rep.title}</span>
                              </div>
                              <span className={cn("text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border", statusColorOf(rep.status))}>
                                {rep.status}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

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
                </motion.div>
              )}
              </AnimatePresence>
            </div>
      </main>

      <ReportScriptModal
        post={scriptPostData}
        report={scriptPost?.auditReport || null}
        onClose={() => setScriptPost(null)}
      />

      <AdminAnalyzeModal
        post={analyzePost}
        officerUser={adminUser}
        onClose={() => setAnalyzePost(null)}
        onStatusUpdated={handleStatusUpdated}
      />

      <nav
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 sm:hidden flex items-center justify-between w-[325px] px-3.5 py-2 rounded-full bg-[#FCFCFB]/75 backdrop-blur-2xl border border-white/80"
        style={{
          boxShadow: "0 14px 40px -4px rgba(0, 0, 0, 0.16), 0 2px 8px 0 rgba(0, 0, 0, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
        aria-label="Mobile Navigation"
      >
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

        <button
          type="button"
          onClick={() => {
            setMobileTab("feed");
            setFeedView("feed");
          }}
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

        <button
          type="button"
          onClick={openPickerChoice}
          className="relative w-10 h-10 -my-2 rounded-full bg-[#94EB41] text-[rgb(18,18,18)] shadow-[0_4px_14px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center hover:bg-[#80D42F] active:scale-90 transition-all cursor-pointer border border-[#80D42F] shrink-0"
          title="New Scan — take or pick photo"
        >
          <Plus className="w-5 h-5 stroke-[2.8]" />
        </button>

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

        <button
          type="button"
          onClick={() => setBotOpen(true)}
          className={cn(
            "relative p-1.5 rounded-full transition-all flex items-center justify-center active:scale-90",
            botOpen ? "text-zinc-950 scale-105" : "hover:scale-105"
          )}
          title="Klaro Assistant"
        >
          {botOpen && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-full bg-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] border border-black/5"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <div className="relative z-10 w-7 h-7 flex items-center justify-center overflow-visible scale-[0.72] -my-1">
            <KlaroBot state="idle" size="sm" showShadow={false} interactive={true} />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("profile")}
          className={cn(
            "relative p-1.5 rounded-full transition-all flex items-center justify-center active:scale-90",
            mobileTab === "profile" ? "text-zinc-950" : "opacity-80 hover:opacity-100"
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
          <div className="relative z-10 w-6 h-6 rounded-full overflow-hidden border border-zinc-300 flex items-center justify-center text-[13px] bg-white">
            {adminUser.avatar?.startsWith("http") || adminUser.avatar?.startsWith("data:") ? (
              <img src={adminUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{adminUser.avatar || "🛡️"}</span>
            )}
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {botOpen && (
          <div className="fixed inset-0 z-[10000] sm:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBotOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="relative z-10 w-full h-[88dvh] max-h-[88dvh] rounded-t-[28px] bg-[#FCFCFB] border-t border-white/80 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col"
            >
              <AdminBotPanel
                open
                onClose={() => setBotOpen(false)}
                seed={botSeed}
                onSeedConsumed={() => setBotSeed(null)}
                adminEmail={adminEmail}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      {scanImageUrl && (
        <ScanFlow
          isOpen={Boolean(scanImageUrl)}
          imageUrl={scanImageUrl}
          onClose={() => setScanImageUrl(null)}
          onPost={handleScanPost}
          onSave={handleScanSave}
        />
      )}

      <CommentsDialog
        post={commentsModalPost}
        inputValue={commentsModalPostId ? commentInputs[commentsModalPostId] || "" : ""}
        onInputChange={(v) =>
          setCommentInputs((prev) => ({ ...prev, [commentsModalPostId as string]: v }))
        }
        onSubmit={(replyTo) => {
          if (commentsModalPostId) handleAddComment(commentsModalPostId, replyTo);
        }}
        onClose={() => setCommentsModalPostId(null)}
      />

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />

      <ShareModal
        isOpen={sharingPost.isOpen}
        onClose={handleCloseShare}
        postTitle={sharingPost.title}
        shareUrl={sharingPost.url}
      />

    </div>
  );
}
