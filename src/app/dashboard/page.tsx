"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserProfile } from "../../actions/profile";
import { UserProfile } from "../../types/auth";
import { hasLoginCookie, safeGet, safeRemove, safeSet } from "../../lib/storage";
import { Logo } from "../../components/ui/Logo";
import { AuthLoadingState } from "../../components/auth/AuthLoadingState";
import { CommentsDialog } from "../../components/community/CommentsDialog";
import { PostSkeleton } from "../../components/feed/PostSkeleton";
import { Button } from "../../components/ui/Button";
import { ShareModal } from "../../components/ShareModal";
import { ScanFlow } from "../../components/scan/ScanFlow";
import { ReportScriptModal } from "../../components/reports/ReportScriptModal";
import { ImageLightbox } from "../../components/reports/ImageLightbox";
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
  Trash2,
  Paperclip
} from "lucide-react";
import { cn, timeAgo } from "../../lib/utils";
import { Avatar } from "../../components/ui/Avatar";
import { createInspectionReport, getLiveReports, seedDemoReports, voteReport, addReportComment, deleteReportComment, deleteReport, DBReport } from "../../actions/reports";
import type { AuditReport } from "../../lib/auditEngine";

interface FeedComment {
  id: string;
  authorId?: string;
  author: string;
  authorRole: string;
  avatar: string;
  timeAgo: string;
  text: string;
  replyTo?: { id: string; author: string };
}

export interface FeedPost {
  id: string;
  authorId?: string;
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
  imageUrl?: string;
  evidence: {
    labelRegion: string;
    ocrSnippet: string;
    flagReason: string;
    measuredValue?: string;
    requiredValue?: string;
  };
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  userVote?: "up" | "down" | null;
  comments: FeedComment[];
  status: "Under Review" | "Notice Drafted" | "Compounded";
  auditReport?: AuditReport;
}

function getFlagIssues(post: FeedPost): Array<{ ruleCode: string; title: string; requiredValue?: string }> {
  const issues = post.auditReport?.issues?.length
    ? post.auditReport.issues.map((iss) => ({
        ruleCode: iss.ruleCode,
        title: iss.title,
        requiredValue: iss.requiredValue,
      }))
    : [{
        ruleCode: post.ruleCode,
        title: post.evidence.flagReason,
        requiredValue: post.evidence.requiredValue,
      }];
  return issues.filter((iss) => iss.title && iss.title.trim());
}

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
    <path d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z" />
    <path d="M15 21.5V16.5C15 15.0858 15 14.3787 14.5607 13.9393C14.1213 13.5 13.4142 13.5 12 13.5C10.5858 13.5 9.87868 13.5 9.43934 13.9393C9 14.3787 9 15.0858 9 16.5V21.5" />
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

const ReportDossierCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M19 10.5V10C19 6.22876 19 4.34315 17.8284 3.17157C16.6569 2 14.7712 2 11 2C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V16C3 17.8638 3 18.7956 3.30448 19.5307C3.71046 20.5108 4.48915 21.2895 5.46927 21.6955C6.20435 22 7.13623 22 9 22" strokeLinejoin="round" />
    <path d="M7 7H15M7 11H11" />
    <path d="M15.2825 19.0044C15.2235 18.1157 15.118 17.1658 14.6817 16.0917C14.3095 15.1756 14.4132 13.0205 16.5 13.0205C18.5868 13.0205 18.6664 15.1756 18.2942 16.0917C17.8578 17.1658 17.7765 18.1157 17.7175 19.0044M21 22H12V20.7543C12 20.3078 12.2664 19.9154 12.6528 19.7928L14.9076 19.077C15.0684 19.0259 15.2348 19 15.4021 19H17.5979C17.7652 19 17.9316 19.0259 18.0924 19.077L20.3472 19.7928C20.7336 19.9154 21 20.3078 21 20.7543V22Z" strokeLinejoin="round" />
  </svg>
);

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const TABS: Array<"home" | "feed" | "reports" | "profile"> = ["home", "feed", "reports", "profile"];
  const [mobileTab, setMobileTab] = useState<"home" | "feed" | "reports" | "profile">("home");

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

    if (Math.abs(distanceX) > distanceY && Math.abs(distanceX) > minSwipeDistance) {
      const currentIndex = TABS.indexOf(mobileTab);
      if (distanceX > 0 && currentIndex < TABS.length - 1) {
        setMobileTab(TABS[currentIndex + 1]);
      } else if (distanceX < 0 && currentIndex > 0) {
        setMobileTab(TABS[currentIndex - 1]);
      }
    }
  };

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

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isFeedLoaded, setIsFeedLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingPost, setSharingPost] = useState<{ title: string; url: string } | null>(null);

  const [scriptPostId, setScriptPostId] = useState<string | null>(null);
  const scriptPost = useMemo(
    () => posts.find((p) => p.id === scriptPostId) || null,
    [posts, scriptPostId]
  );

  const openScript = (post: FeedPost) => setScriptPostId(post.id);

  const [postToast, setPostToast] = useState<{ title: string; sub: string } | null>(null);

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!postToast) return;
    const t = setTimeout(() => setPostToast(null), 3400);
    return () => clearTimeout(t);
  }, [postToast]);

  useEffect(() => {
  async function loadCommunityPosts() {
    try {
      await seedDemoReports();
      const dbReports = await getLiveReports();
        if (dbReports && dbReports.length > 0) {
          const formatted: FeedPost[] = dbReports.map((db) => ({
            id: db.id,
            authorId: db.author_id,
            author: {
              name: db.author_name || "Community Inspector",
              badge: db.author_badge || "Community Inspector",
              avatar: db.author_avatar || "🥑",
              zone: db.author_zone || "Your Zone",
            },
            timeAgo: timeAgo(db.created_at),
            title: db.title,
            commodity: db.commodity,
            brand: db.brand,
            ruleCode: db.rule_code,
            ruleLabel: db.rule_label,
            severity: db.severity as any,
            description: db.description,
            imageUrl: db.image_url,
            evidence: {
              labelRegion: db.evidence_label_region || "Auto-detected PDP",
              ocrSnippet: db.evidence_ocr_snippet || "",
              flagReason: db.evidence_flag_reason || "",
              measuredValue: db.evidence_measured_value,
              requiredValue: db.evidence_required_value,
            },
            upvotes: db.upvotes || 0,
            downvotes: db.downvotes || 0,
            commentsCount: db.comments?.length || 0,
            userVote: (db.user_votes || {})[user?.id || ""] || null,
            comments: db.comments || [],
            status: db.status || "Under Review",
            auditReport: db.audit_report || undefined,
          }));

          setPosts(formatted);
        }
      } catch (err) {
        console.error("Error loading community posts:", err);
      } finally {
        setIsFeedLoaded(true);
      }
    }

    loadCommunityPosts();
  }, [user?.id]);

  const myReports = useMemo(() => {
    const myName = profile?.displayName || user?.fullName || "You";
    return posts.filter((p) => p.author.name === myName || (user?.id && p.authorId === user.id));
  }, [posts, profile, user]);

  const scoreOf = (p: FeedPost) => p.upvotes - p.downvotes;

  const isOfficialBadge = (badge?: string) =>
    !!badge && !/community/i.test(badge);

  const realKarma = useMemo(() => {
    return myReports.reduce((acc: number, r: FeedPost) => acc + Math.max(0, scoreOf(r)), 0);
  }, [myReports]);

  const realReportsCount = myReports.length;
  const realUpvotedCount = useMemo(() => posts.filter((p) => p.userVote === "up").length, [posts]);
  const realDownvotedCount = useMemo(() => posts.filter((p) => p.userVote === "down").length, [posts]);

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
    const reader = new FileReader();
    reader.onload = () => {
      setScanImageUrl(reader.result as string);
      setScanImageName(file.name);
      setShowPickerChoice(false);
      setShowScanFlow(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleScanPost = async ({ imageUrl, title, report, comment }: { imageUrl: string; title: string; report?: AuditReport; comment?: string }) => {
    const topIssue = report?.issues?.[0];
    const authorName = profile?.displayName || user?.fullName || "You";
    const authorAvatar = avatar || user?.imageUrl || "🥑";
    const authorZone = report?.zone || "Your Zone";

    const tempId = `post-${Date.now()}`;
    const newPost: FeedPost = {
      id: tempId,
      authorId: user?.id,
      author: {
        name: authorName,
        badge: "Community Inspector",
        avatar: authorAvatar,
        zone: authorZone,
      },
      timeAgo: "Just now",
      title: title || `${report?.productName || "Product"} — Statutory Compliance Audit`,
      commodity: report?.commodity || "Packaged Commodity (Scanned)",
      brand: report?.brand || "Detected via Klaro AI Vision",
      ruleCode: topIssue?.ruleCode || "Rule 6(1)(e)",
      ruleLabel: topIssue?.ruleLabel || "Legal Metrology Non-Compliance",
      severity: (topIssue?.severity as any) || "high",
      description: comment || `Klaro AI audited this package and flagged ${report?.issues?.length || 1} statutory non-compliance(s) under Legal Metrology Rules, 2011: ${report?.issues?.map((i: any) => `${i.ruleCode} (${i.title})`).join(", ")}.`,
      imageUrl: undefined,
      evidence: {
        labelRegion: `Auto-detected PDP • Confidence ${report?.confidenceScore || 98.6}%`,
        ocrSnippet: `Barcode ${report?.barcode || "8901207025372"} • Batch ${report?.batchCode || "1223104434"}`,
        flagReason: topIssue?.description || "Mandatory declarations omitted on packaging.",
        measuredValue: topIssue?.measuredValue || "Non-compliant",
        requiredValue: topIssue?.requiredValue || "Statutory Legal Requirement",
      },
      upvotes: 0,
      downvotes: 0,
      commentsCount: 0,
      userVote: null,
      status: "Under Review",
      comments: [],
      auditReport: report,
    };

    setPosts((prev) => [newPost, ...prev]);

    setMobileTab("feed");
    setScanImageUrl(null);
    setPostToast({
      title: "Report posted to the feed",
      sub: "Live in the community stream — visible to every officer & citizen.",
    });

    try {
      const saveRes = await createInspectionReport({
        imageUrl,
        title: newPost.title,
        commodity: newPost.commodity,
        brand: newPost.brand,
        ruleCode: newPost.ruleCode,
        ruleLabel: newPost.ruleLabel,
        severity: newPost.severity,
        description: newPost.description,
        auditReport: report,
        evidence: newPost.evidence,
      });

      if (saveRes.success && saveRes.report) {
        const savedId = saveRes.report.id;
        const savedImageUrl = saveRes.report.image_url || undefined;
        setPosts((current) =>
          current.map((p) =>
            p.id === tempId ? { ...p, id: savedId, auditReport: report, imageUrl: savedImageUrl } : p
          )
        );
        setScriptPostId((cur) => (cur === tempId ? savedId : cur));
      } else {
        console.error("Report was NOT saved to the database:", saveRes.error);
      }
    } catch (err) {
      console.warn("Background report sync:", err);
    }
  };

  const handleScanSave = async ({ imageUrl, report }: { imageUrl?: string | null; report?: AuditReport }) => {
    const topIssue = report?.issues?.[0];
    const authorName = profile?.displayName || user?.fullName || "You";
    const authorAvatar = avatar || user?.imageUrl || "🥑";
    const authorZone = report?.zone || "Your Zone";

    const privateReport: FeedPost = {
      id: `saved-${Date.now()}`,
      authorId: user?.id,
      author: {
        name: authorName,
        badge: "Private Inspection",
        avatar: authorAvatar,
        zone: authorZone,
      },
      timeAgo: "Saved Just now",
      title: `${report?.productName || "Product"} — Private Inspection Dossier`,
      commodity: report?.commodity || "Packaged Commodity",
      brand: report?.brand || "Detected via Klaro",
      ruleCode: topIssue?.ruleCode || "Rule 6(1)(e)",
      ruleLabel: topIssue?.ruleLabel || "Legal Metrology Non-Compliance",
      severity: (topIssue?.severity as any) || "high",
      description: `Court-Ready evidence dossier saved privately for Legal Metrology enforcement reference.`,
      imageUrl: imageUrl || undefined,
      evidence: {
        labelRegion: `Auto-detected PDP • Confidence ${report?.confidenceScore || 98.6}%`,
        ocrSnippet: `Barcode ${report?.barcode || "8901207025372"} • Batch ${report?.batchCode || "1223104434"}`,
        flagReason: topIssue?.description || "Mandatory declarations omitted.",
        measuredValue: topIssue?.measuredValue || "Non-compliant",
        requiredValue: topIssue?.requiredValue || "Statutory Legal Requirement",
      },
      upvotes: 0,
      downvotes: 0,
      commentsCount: 0,
      userVote: null,
      status: "Under Review",
      comments: [],
      auditReport: report,
    };

    setPosts((prev) => [privateReport, ...prev]);

    setMobileTab("reports");
    setScanImageUrl(null);
    setPostToast({
      title: "Report saved to your vault",
      sub: "Stored privately — open it anytime from My Recent Filed Reports.",
    });

    try {
      const saveRes = await createInspectionReport({
        imageUrl: imageUrl || null,
        title: privateReport.title,
        commodity: privateReport.commodity,
        brand: privateReport.brand,
        ruleCode: privateReport.ruleCode,
        ruleLabel: privateReport.ruleLabel,
        severity: privateReport.severity,
        description: privateReport.description,
        auditReport: report,
        evidence: privateReport.evidence,
      });

      if (saveRes.success && saveRes.report) {
        const savedId = saveRes.report.id;
        const savedImageUrl = saveRes.report.image_url || undefined;
        setPosts((current) =>
          current.map((p) =>
            p.id === privateReport.id ? { ...p, id: savedId, auditReport: report, imageUrl: savedImageUrl } : p
          )
        );
        setScriptPostId((cur) => (cur === privateReport.id ? savedId : cur));
      } else {
        console.error("Private report was NOT saved to the database:", saveRes.error);
      }
    } catch (err) {
      console.warn("Background private save sync:", err);
    }
  };

  const handleOpenShare = (title: string, postId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://klaro.app";
    setSharingPost({
      title,
      url: `${origin}/dashboard?post=${postId}`,
    });
    setShareModalOpen(true);
  };

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteReport = (postId: string) => setDeleteTarget(postId);

  const confirmDeleteReport = () => {
    const postId = deleteTarget;
    if (!postId) return;
    setIsDeleting(true);

    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setScriptPostId((current) => (current === postId ? null : current));

    deleteReport(postId)
      .catch((err) => console.warn("Report delete sync:", err))
      .finally(() => {
        setIsDeleting(false);
        setDeleteTarget(null);
      });
  };

  const handleVote = (postId: string, type: "up" | "down") => {
    const current = posts.find((p) => p.id === postId);
    if (!current) return;
    const nextVote: "up" | "down" | null = current.userVote === type ? null : type;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        let upDelta = 0;
        let downDelta = 0;
        if (post.userVote === "up" && nextVote !== "up") upDelta -= 1;
        if (post.userVote === "down" && nextVote !== "down") downDelta -= 1;
        if (nextVote === "up" && post.userVote !== "up") upDelta += 1;
        if (nextVote === "down" && post.userVote !== "down") downDelta += 1;

        return {
          ...post,
          userVote: nextVote,
          upvotes: post.upvotes + upDelta,
          downvotes: post.downvotes + downDelta,
        };
      })
    );

    voteReport(postId, nextVote).catch((err) => console.warn("Vote sync:", err));
  };

  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleWindowScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || document.documentElement.scrollTop;

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

    const mockOfficer =
      typeof window !== "undefined" &&
      (!!safeGet("klaro_admin_auth") || hasLoginCookie());

    if (!isSignedIn && !mockOfficer) {
      if (typeof window !== "undefined") {
        safeRemove("klaro_logged_in");
        document.cookie = "klaro_logged_in=; path=/; max-age=0; SameSite=Lax";
      }
      router.replace("/login");
      return;
    }

    if (typeof window !== "undefined") {
      safeSet("klaro_logged_in", "true");
      document.cookie = "klaro_logged_in=true; path=/; max-age=31536000; SameSite=Lax";
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
        } else if (mockOfficer) {
          setProfile({
            id: "admin",
            email: "admin0529@gmail.com",
            username: "@chief-administrator",
            displayName: "Chief Administrator",
            avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Officer&backgroundColor=27272a",
            dietaryPreferences: ["Field Inspector"],
            createdAt: new Date().toISOString(),
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
    if (typeof window !== "undefined") {
      safeRemove("klaro_logged_in");
      safeRemove("klaro_admin_auth");
      document.cookie = "klaro_logged_in=; path=/; max-age=0; SameSite=Lax";
    }
    try {
      await signOut();
      router.replace("/login");
    } catch (err) {
      console.error("Sign out error:", err);
      router.replace("/login");
    }
  };

  const [commentsModalPostId, setCommentsModalPostId] = useState<string | null>(null);
  const commentsModalPost = posts.find((p) => p.id === commentsModalPostId) || null;

  const openComments = (postId: string) => {
    setCommentsModalPostId(postId);
  };

  const handleAddComment = (postId: string, replyTo?: { id: string; author: string }) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: FeedComment = {
      id: `c-${Date.now()}`,
      authorId: user?.id,
      author: profile?.displayName || user?.fullName || "You",
      authorRole: "Enforcement Officer",
      avatar: profile?.avatarUrl || user?.imageUrl || "https://api.dicebear.com/9.x/lorelei/svg?seed=You&backgroundColor=27272a",
      timeAgo: "Just now",
      text,
      ...(replyTo ? { replyTo } : {}),
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

    addReportComment(postId, newComment).catch((err) => console.warn("Comment sync:", err));

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const isOwnComment = (c: FeedComment) => {
    if (c.authorId && user?.id) return c.authorId === user.id;
    return c.author === (profile?.displayName || user?.fullName || "You");
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    let removed = 0;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const remaining = post.comments.filter(
          (c) => c.id !== commentId && c.replyTo?.id !== commentId
        );
        removed = post.comments.length - remaining.length;
        return { ...post, comments: remaining, commentsCount: remaining.length };
      })
    );

    deleteReportComment(postId, commentId)
      .catch((err) => console.warn("Comment delete sync:", err));
  };

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
      <div className="min-h-screen w-full bg-[#E6E4E5] flex flex-col items-center justify-center select-none">
        <AuthLoadingState message="Loading inspection feed…" />
      </div>
    );
  }

  const avatar = profile?.avatarUrl || user?.imageUrl || "https://api.dicebear.com/9.x/lorelei/svg?seed=Officer&backgroundColor=27272a";

  return (
    <div className="min-h-screen w-full bg-[#E6E4E5] text-[rgb(18,18,18)] antialiased font-sans flex flex-col selection:bg-[#94EC40] selection:text-[rgb(18,18,18)]">
      
      <header className="hidden md:block sticky top-0 z-40 w-full pointer-events-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative pointer-events-auto filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
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

            <div className="h-[54px] bg-[#FCFCFB] border-b-[1.5px] border-[#D5D2D4] px-4 sm:px-6 flex items-center justify-between gap-4">
              
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

      <main
        className={cn(
          "flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8",
          mobileTab === "home" || mobileTab === "reports"
            ? "py-2 pb-2 sm:py-6 sm:pb-6 overflow-hidden sm:overflow-visible"
            : "py-3 pb-28 sm:py-6 sm:pb-6"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-3 sm:space-y-4 bg-transparent pt-0 sm:pt-0">
            
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
                            {posts.map((post) => (
                              <div
                                key={`trending-${post.id}`}
                                className="w-[265px] shrink-0 snap-start p-3.5 rounded-[20px] bg-[#E4E2E3] text-[rgb(18,18,18)] font-mono space-y-2 border-[1.5px] border-[#C8C5C9] shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)] ring-1 ring-black/[0.04] text-left"
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
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {mobileTab === "feed" && (
                    <div className="space-y-4 pt-1 text-left pb-28">
                      <div
                        className={cn(
                          "sticky top-1 z-30 rounded-2xl bg-[#FCFCFB]/95 backdrop-blur-md border border-[#D5D2D4] shadow-sm transition-all duration-300 ease-out text-left",
                          isSearchCollapsed ? "p-2 shadow-md" : "p-3.5"
                        )}
                      >
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

                      {!isFeedLoaded ? (
                        <PostSkeleton count={3} />
                      ) : filteredPosts.length === 0 ? (
                        <div className="p-8 rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] text-center space-y-3">
                          <ShieldAlert className="w-10 h-10 text-zinc-400 mx-auto" />
                          <h3 className="text-sm font-bold text-zinc-900">No community violations reported yet</h3>
                          <p className="text-xs text-zinc-500 max-w-[260px] mx-auto">
                            Scan any packaged product to audit Legal Metrology declarations and file your first report.
                          </p>
                          <button
                            type="button"
                            onClick={openPickerChoice}
                            className="px-4 py-2.5 rounded-xl bg-[#94EC40] text-black font-bold text-xs shadow-sm hover:bg-[#80D42F] transition-all"
                          >
                            Scan & Audit Product
                          </button>
                        </div>
                      ) : (
                        filteredPosts.map((post) => (
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
                                <span className="text-zinc-800 font-bold text-xs">{post.author.zone}</span>
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

                            <div className="pt-0.5 space-y-1.5">
                              {getFlagIssues(post).slice(0, 2).map((iss, i) => (
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
                                  onClick={() => openScript(post)}
                                  className="flex items-center gap-1 text-[10.5px] font-mono font-bold text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all pt-0.5"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                  <span>View all issues ({getFlagIssues(post).length})</span>
                                </button>
                              )}
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
                              <span className={cn("text-xs font-bold font-mono px-1", scoreOf(post) < 0 ? "text-rose-600" : "text-zinc-800")}>{scoreOf(post)}</span>
                              <button
                                type="button"
                                onClick={() => handleVote(post.id, "down")}
                                className={cn("p-1 rounded-lg transition-colors hover:bg-white", post.userVote === "down" ? "text-rose-600" : "text-zinc-500")}
                              >
                                <ArrowBigDown className="w-5 h-5 fill-current" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {post.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setLightboxImage(post.imageUrl!)}
                                  title="View evidence image"
                                  className="p-2 rounded-[14px] bg-[#ECEAEB] hover:bg-[#E0DEE0] active:scale-95 transition-all text-[#346415] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]"
                                >
                                  <Paperclip className="w-4 h-4 -rotate-45" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleOpenShare(post.title, post.id)}
                                className="p-2 rounded-[14px] bg-[#ECEAEB] hover:bg-[#E0DEE0] active:scale-95 transition-all text-zinc-600 border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] flex items-center gap-1.5 font-bold text-xs"
                              >
                                <ShareCustomIcon className="w-4 h-4" />
                                <span>Share</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      )))}
                    </div>
                  )}

                  {mobileTab === "reports" && (
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
                                My Submitted Reports
                              </h2>
                              <span className="text-[11px] text-zinc-500 font-medium">Violations you flagged to the Klaro community</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Total Filed</span>
                            <span className="text-sm font-bold text-zinc-900 font-mono">4</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Total Filed</span>
                            <span className="text-sm font-bold text-zinc-900 font-mono">{myReports.length}</span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Notices</span>
                            <span className="text-sm font-bold text-amber-700 font-mono">
                              {myReports.filter((r: FeedPost) => r.status === "Notice Drafted").length}
                            </span>
                          </div>
                          <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9.5px] font-mono uppercase text-zinc-500 block">Compounded</span>
                            <span className="text-sm font-bold text-[#346415] font-mono">
                              {myReports.filter((r: FeedPost) => r.status === "Compounded").length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 no-scrollbar pb-36">
                        {myReports.length === 0 ? (
                          <div className="p-6 rounded-[20px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] text-center space-y-2.5">
                            <ShieldAlert className="w-8 h-8 text-zinc-400 mx-auto" />
                            <p className="text-xs font-bold text-zinc-800">No inspection reports filed yet</p>
                            <p className="text-[11px] text-zinc-500 max-w-[240px] mx-auto">
                              Take a photo or upload product packaging to generate a verified inspection dossier.
                            </p>
                            <button
                              type="button"
                              onClick={openPickerChoice}
                              className="px-4 py-2 rounded-xl bg-[#94EC40] text-black font-bold text-xs shadow-sm hover:bg-[#80D42F] transition-all"
                            >
                              Scan Product Now
                            </button>
                          </div>
                        ) : (
                          myReports.map((rep: FeedPost) => (
                            <div
                              key={rep.id}
                              onClick={() => openScript(rep)}
                              className="p-4 rounded-[20px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-2.5 cursor-pointer hover:border-zinc-400 active:scale-[0.99] transition-all"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                  {rep.ruleCode}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {(rep.status === "Notice Drafted" || rep.status === "Compounded" || rep.auditReport?.compoundingOrder) && (
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openScript(rep);
                                      }}
                                      title="Official Statutory Notice Attached — tap to view"
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-[#EAFBD9] text-[#346415] border border-[#B8F27D] hover:bg-[#D5F7B3] active:scale-95 transition-all shadow-xs cursor-pointer"
                                    >
                                      <Paperclip className="w-3 h-3 -rotate-45" />
                                      <span>Notice Attached</span>
                                    </span>
                                  )}
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border",
                                    rep.status === "Compounded" ? "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]" : rep.status === "Notice Drafted" ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-blue-100 text-blue-900 border-blue-300"
                                  )}>
                                    {rep.status}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteReport(rep.id); }}
                                    title="Delete report"
                                    className="p-1.5 rounded-lg bg-[#ECEAEB] border border-[#D5D2D4] text-zinc-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-300 active:scale-90 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
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
                                  {scoreOf(rep)} karma
                                </span>
                                <span className="text-[10.5px] text-zinc-400 font-medium">{rep.timeAgo}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}

                  {mobileTab === "profile" && (
                    <div className="space-y-4 pt-1 text-left pb-6">
                      
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

                        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#ECEAEB] text-center">
                          <div className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Karma</span>
                            <span className="text-base font-extrabold text-[#346415] font-mono">{realKarma}</span>
                          </div>
                          <div className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Reports</span>
                            <span className="text-base font-extrabold text-zinc-900 font-mono">{realReportsCount}</span>
                          </div>
                          <div className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Upvoted</span>
                            <span className="text-base font-extrabold text-zinc-900 font-mono">{realUpvotedCount}</span>
                          </div>
                          <div className="p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Downvoted</span>
                            <span className="text-base font-extrabold text-rose-700 font-mono">{realDownvotedCount}</span>
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

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hidden sm:block space-y-4">
              
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

              {!isFeedLoaded ? (
                <PostSkeleton count={4} />
              ) : filteredPosts.length === 0 ? (
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
                        <span className={cn("text-xs font-bold font-mono", scoreOf(post) < 0 ? "text-rose-600" : "text-zinc-800")}>
                          {scoreOf(post)}
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
                              {isOfficialBadge(post.author.badge) && (
                                <ShieldCheck className="w-3.5 h-3.5 text-[#346415]" aria-label="Verified Legal Metrology Officer" />
                              )}
                            </span>
                            <span className="text-zinc-400">•</span>
                            <span className="text-zinc-500 text-[11px]">{post.author.zone}</span>
                            <span className="text-zinc-400">•</span>
                            <span className="text-zinc-400 text-[11px]">{post.timeAgo}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {(post.status === "Notice Drafted" || post.status === "Compounded" || post.auditReport?.compoundingOrder) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openScript(post);
                                }}
                                title="Official Statutory Notice Attached — click to inspect"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-[#EAFBD9] text-[#346415] border border-[#B8F27D] hover:bg-[#D5F7B3] active:scale-95 transition-all shadow-xs cursor-pointer"
                              >
                                <Paperclip className="w-3 h-3 -rotate-45" />
                                <span>Notice</span>
                              </button>
                            )}
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
                            {getFlagIssues(post).slice(0, 2).map((iss, i) => (
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
                                onClick={() => openScript(post)}
                                className="flex items-center gap-1 text-[10.5px] font-mono font-bold text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all pt-0.5"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                                <span>View all issues ({getFlagIssues(post).length})</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-[#ECEAEB] text-xs text-zinc-600 font-medium">
                          <button
                            type="button"
                            onClick={() => openComments(post.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.commentsCount} Comments</span>
                          </button>

                          <div className="flex items-center gap-2">
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

                            <button
                              type="button"
                              onClick={() => openScript(post)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-[#ECEAEB] transition-colors text-zinc-600 hover:text-zinc-900 active:scale-95"
                            >
                              <ReportDossierCustomIcon className="w-3.5 h-3.5 text-[#346415]" />
                              <span>Report</span>
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
                ))
              )}

            </div>

          </div>

          <aside className="hidden lg:block lg:col-span-4 space-y-4 text-left sticky top-[72px] self-start max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar overscroll-contain scrollbar-none">
            
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

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#ECEAEB] text-center">
                <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Karma</span>
                  <span className="text-sm font-bold text-[#346415] font-mono">{realKarma}</span>
                </div>
                <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Reports</span>
                  <span className="text-sm font-bold text-zinc-900 font-mono">{realReportsCount}</span>
                </div>
                <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Upvoted</span>
                  <span className="text-sm font-bold text-zinc-900 font-mono">{realUpvotedCount}</span>
                </div>
                <div className="p-2 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Downvoted</span>
                  <span className="text-sm font-bold text-rose-700 font-mono">{realDownvotedCount}</span>
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

            <div className="p-5 rounded-[22px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-800" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900">
                  MY RECENT FILED REPORTS ({myReports.length})
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {myReports.length === 0 ? (
                  <div className="p-3 text-center rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] text-zinc-500 text-[11px]">
                    No reports filed yet. Scan a package to file your first dossier.
                  </div>
                ) : (
                  myReports.slice(0, 4).map((rep: FeedPost) => (
                    <div
                      key={rep.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openScript(rep)}
                      onKeyDown={(e) => { if (e.key === "Enter") openScript(rep); }}
                      title="Open inspection dossier"
                      className="w-full text-left p-2.5 rounded-[14px] bg-[#ECEAEB] border border-[#D5D2D4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] flex items-center justify-between gap-2 hover:bg-[#E4E2E3] hover:border-zinc-400 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <div className="min-w-0">
                        <span className="text-[10.5px] font-bold text-zinc-900 block font-mono">{rep.ruleCode}</span>
                        <span className="text-[11px] text-zinc-600 truncate max-w-[150px] block">{rep.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {(rep.status === "Notice Drafted" || rep.status === "Compounded" || rep.auditReport?.compoundingOrder) && (
                          <span
                            title="Notice Attached"
                            className="inline-flex items-center p-1 rounded-md bg-[#EAFBD9] text-[#346415] border border-[#B8F27D]"
                          >
                            <Paperclip className="w-2.5 h-2.5 -rotate-45" />
                          </span>
                        )}
                        <span className={cn(
                          "text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border uppercase",
                          rep.status === "Compounded" ? "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]" : rep.status === "Notice Drafted" ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-blue-100 text-blue-900 border-blue-300"
                        )}>
                          {rep.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDeleteReport(rep.id); }}
                          title="Delete report"
                          className="p-1.5 rounded-lg bg-white/70 border border-[#D5D2D4] text-zinc-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-300 active:scale-90 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

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

      <nav
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 sm:hidden flex items-center justify-between w-[285px] px-3.5 py-2 rounded-full bg-[#FCFCFB]/75 backdrop-blur-2xl border border-white/80"
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

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        postTitle={sharingPost?.title}
        shareUrl={sharingPost?.url}
      />

      <ReportScriptModal post={scriptPost} report={scriptPost?.auditReport || null} onClose={() => setScriptPostId(null)} />

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
        isOwnComment={isOwnComment}
        onDeleteComment={(cid) => {
          if (commentsModalPostId) handleDeleteComment(commentsModalPostId, cid);
        }}
      />

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0B0B0D]/50 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="relative w-full max-w-[340px] p-5 rounded-[26px] bg-[#FCFCFB] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.28),inset_0_1px_1px_rgba(255,255,255,0.95)] z-[76] space-y-3.5 text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                </div>
                <h4
                  className="text-sm font-[900] text-zinc-950 tracking-tight"
                  style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                >
                  Delete this report?
                </h4>
              </div>

              <p className="text-[11.5px] text-zinc-500 font-medium leading-snug">
                This permanently removes the report, its dossier and evidence photo from the community feed and your vault. This action cannot be undone.
              </p>

              <div className="flex items-center gap-2.5 pt-0.5">
                <button
                  type="button"
                  onClick={confirmDeleteReport}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-[0_2px_8px_rgba(225,29,72,0.3)] flex items-center justify-center gap-1.5 hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? "Deleting…" : "Delete"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#ECEAEB] text-zinc-800 font-bold text-xs border border-[#D5D2D4] shadow-xs hover:bg-[#E2DFE1] active:scale-95 transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {postToast && (
          <div className="fixed bottom-24 sm:bottom-8 inset-x-0 z-[70] flex justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[20px] bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_18px_44px_rgba(0,0,0,0.18),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] max-w-[92vw]"
            >
              <div className="w-8 h-8 rounded-full bg-[#94EB41] border border-[#80D42F] shadow-[0_2px_8px_rgba(148,235,65,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-[18px] h-[18px] text-[rgb(18,18,18)]" strokeWidth={2.4} />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold text-zinc-900 truncate">{postToast.title}</p>
                <p className="text-[10.5px] text-zinc-500 font-medium leading-snug">{postToast.sub}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        onClose={() => setShowScanFlow(false)}
        onPost={handleScanPost}
        onSave={handleScanSave}
      />

    </div>
  );
}
