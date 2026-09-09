"use client";

import React, { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import indiaGeoMap from "@svg-maps/india";
import { MapPin, ShieldCheck, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface MapPost {
  id: string;
  title: string;
  ruleCode?: string;
  severity?: string;
  status?: string;
  zone?: string;
  avatar?: string;
  isOfficial?: boolean;
}

const ZONE_COORDS: Record<string, { x: number; y: number }> = {
  delhi: { x: 32.5, y: 28.5 },
  "new delhi": { x: 32.5, y: 28.5 },
  mumbai: { x: 20.0, y: 56.5 },
  bombay: { x: 20.0, y: 56.5 },
  jaipur: { x: 27.0, y: 34.0 },
  rajasthan: { x: 25.0, y: 35.0 },
  ahmedabad: { x: 18.5, y: 45.0 },
  gujarat: { x: 17.5, y: 46.0 },
  kolkata: { x: 64.0, y: 47.5 },
  "west bengal": { x: 63.5, y: 47.0 },
  chennai: { x: 42.0, y: 76.5 },
  "tamil nadu": { x: 39.0, y: 79.0 },
  bengaluru: { x: 35.0, y: 74.0 },
  bangalore: { x: 35.0, y: 74.0 },
  karnataka: { x: 32.0, y: 71.0 },
  hyderabad: { x: 38.5, y: 62.0 },
  telangana: { x: 39.0, y: 60.5 },
  pune: { x: 23.5, y: 59.0 },
  maharashtra: { x: 29.0, y: 56.0 },
  surat: { x: 19.5, y: 49.5 },
  lucknow: { x: 43.5, y: 33.0 },
  "uttar pradesh": { x: 44.0, y: 33.0 },
  kanpur: { x: 42.0, y: 34.5 },
  patna: { x: 56.0, y: 36.5 },
  bihar: { x: 56.5, y: 36.0 },
  nagpur: { x: 39.0, y: 49.5 },
  bhopal: { x: 34.5, y: 44.5 },
  "madhya pradesh": { x: 36.0, y: 45.0 },
  indore: { x: 29.5, y: 45.0 },
  varanasi: { x: 48.5, y: 35.5 },
  kochi: { x: 31.0, y: 84.0 },
  cochin: { x: 31.0, y: 84.0 },
  kerala: { x: 32.0, y: 83.0 },
  guwahati: { x: 77.0, y: 36.5 },
  assam: { x: 78.0, y: 36.0 },
  gurugram: { x: 31.5, y: 29.5 },
  gurgaon: { x: 31.5, y: 29.5 },
  noida: { x: 33.5, y: 29.0 },
  chandigarh: { x: 31.0, y: 23.5 },
  punjab: { x: 28.5, y: 23.5 },
  haryana: { x: 30.5, y: 27.5 },
  amritsar: { x: 27.5, y: 22.5 },
  ludhiana: { x: 29.0, y: 23.5 },
  srinagar: { x: 26.5, y: 11.5 },
  jammu: { x: 27.0, y: 16.5 },
  "jammu and kashmir": { x: 27.5, y: 14.0 },
  shimla: { x: 33.0, y: 22.0 },
  "himachal pradesh": { x: 33.0, y: 21.0 },
  dehradun: { x: 35.5, y: 24.5 },
  uttarakhand: { x: 36.5, y: 25.0 },
  ranchi: { x: 57.0, y: 44.5 },
  jharkhand: { x: 56.5, y: 44.0 },
  bhubaneswar: { x: 58.5, y: 55.5 },
  odisha: { x: 56.0, y: 54.0 },
  raipur: { x: 47.0, y: 50.0 },
  chhattisgarh: { x: 47.5, y: 51.0 },
  goa: { x: 23.0, y: 69.5 },
  thiruvananthapuram: { x: 33.5, y: 88.0 },
  trivandrum: { x: 33.5, y: 88.0 },
  coimbatore: { x: 34.5, y: 79.5 },
  madurai: { x: 37.0, y: 83.0 },
  visakhapatnam: { x: 52.0, y: 60.5 },
  vizag: { x: 52.0, y: 60.5 },
  "andhra pradesh": { x: 43.0, y: 67.0 },
  vijayawada: { x: 44.5, y: 65.5 },
  agra: { x: 36.0, y: 32.5 },
  meerut: { x: 34.5, y: 27.5 },
  gwalior: { x: 34.5, y: 36.0 },
  jabalpur: { x: 41.5, y: 45.5 },
  shillong: { x: 76.5, y: 38.0 },
  meghalaya: { x: 76.0, y: 38.0 },
  imphal: { x: 84.0, y: 40.0 },
  manipur: { x: 84.0, y: 40.0 },
};

const VERIFIED_LAND_ANCHORS = [
  { x: 32.5, y: 28.5 },
  { x: 20.0, y: 56.5 },
  { x: 35.0, y: 74.0 },
  { x: 64.0, y: 47.5 },
  { x: 42.0, y: 76.5 },
  { x: 38.5, y: 62.0 },
  { x: 27.0, y: 34.0 },
  { x: 43.5, y: 33.0 },
  { x: 56.0, y: 36.5 },
  { x: 34.5, y: 44.5 },
  { x: 18.5, y: 45.0 },
  { x: 39.0, y: 49.5 },
  { x: 77.0, y: 36.5 },
  { x: 31.0, y: 23.5 },
  { x: 23.5, y: 59.0 },
  { x: 48.5, y: 35.5 },
  { x: 58.5, y: 55.5 },
  { x: 31.0, y: 84.0 },
  { x: 52.0, y: 60.5 },
  { x: 47.0, y: 50.0 },
];

const OMITTED_ISLANDS = new Set(["an", "ld"]);

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pinFor(post: MapPost): { x: number; y: number } {
  const zone = (post.zone || "").toLowerCase().trim();
  for (const key of Object.keys(ZONE_COORDS)) {
    if (zone.includes(key)) return ZONE_COORDS[key];
  }
  const h = hashStr(post.id + zone);
  const base = VERIFIED_LAND_ANCHORS[h % VERIFIED_LAND_ANCHORS.length];
  const offsetX = ((h % 5) - 2) * 0.4;
  const offsetY = (((h >> 3) % 5) - 2) * 0.4;
  return { x: base.x + offsetX, y: base.y + offsetY };
}

function bubbleAnchorFor(x: number): "left" | "center" | "right" {
  if (x < 30) return "left";
  if (x > 70) return "right";
  return "center";
}

const FullscreenExpandIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3C17.4644 3 17.6966 3 17.8919 3.02201C19.5145 3.20484 20.7952 4.48545 20.978 6.10812C21 6.30344 21 6.53563 21 7M17 21C17.4644 21 17.6966 21 17.8919 20.978C19.5145 20.7952 20.7952 19.5145 20.978 17.8919C21 17.6966 21 17.4644 21 17M7 3C6.53563 3 6.30344 3 6.10812 3.02201C4.48545 3.20484 3.20484 4.48545 3.02201 6.10812C3 6.30344 3 6.53563 3 7M7 21C6.53563 21 6.30344 21 6.10812 20.978C4.48545 20.7952 3.20484 19.5145 3.02201 17.8919C3 17.6966 3 17.4644 3 17" />
  </svg>
);

const MapPinCustomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M14.9961 9.19621C14.3836 8.17979 13.2693 7.5 11.9961 7.5C10.0631 7.5 8.49609 9.067 8.49609 11C8.49609 12.2732 9.17588 13.3876 10.1923 14" />
    <path d="M20.9961 20.5L18.849 18.3529M18.849 18.3529C18.9636 18.2384 19.07 18.1158 19.1675 17.986C19.5981 17.413 19.8532 16.7006 19.8532 15.9286C19.8532 14.035 18.3182 12.5 16.4247 12.5C14.5311 12.5 12.9961 14.035 12.9961 15.9286C12.9961 17.8221 14.5311 19.3571 16.4247 19.3571C17.3714 19.3571 18.2286 18.9734 18.849 18.3529Z" strokeLinejoin="round" />
    <path d="M20.983 11C21.0565 9.86816 20.8623 8.66581 20.3121 7.37966C18.9087 4.09916 15.54 2 11.9972 2C8.45444 2 5.08573 4.09916 3.68236 7.37966C1.08686 13.4469 6.40912 17.626 10.3806 21.367C10.8143 21.773 11.3939 22 11.9972 22" />
  </svg>
);

export const AdminPostMap: React.FC<{
  posts: MapPost[];
  onPostSelect?: (postId: string) => void;
  compact?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  fullHeight?: boolean;
  className?: string;
}> = ({ posts, onPostSelect, compact, hideHeader, hideFooter, fullHeight, className }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const patternId = `adminIndiaPixels-${useId().replace(/:/g, "")}`;

  const placed = useMemo(
    () =>
      posts.slice(0, 40).map((p) => {
        const { x, y } = pinFor(p);
        return {
          ...p,
          x: Math.min(88, Math.max(12, x)),
          y: Math.min(88, Math.max(10, y)),
        };
      }),
    [posts]
  );

  const criticalCount = placed.filter(
    (p) => p.severity === "critical" || p.severity === "high"
  ).length;
  const reviewCount = placed.filter((p) => p.status !== "Compounded").length;
  const activeZoneCount = placed.length
    ? new Set(placed.map((p) => (p.zone || "India").trim().toLowerCase())).size
    : 0;

  return (
    <>
      <div
        className={cn(
          "relative isolate w-full overflow-hidden rounded-[20px] sm:rounded-[26px] bg-[#0B0B0D] border-[1.5px] border-[#C8C5C9] shadow-[0_6px_24px_rgba(0,0,0,0.06),inset_0_1.5px_1.5px_rgba(255,255,255,0.85)] ring-1 ring-black/[0.04] select-none",
          className
        )}
        aria-label="Community violation discovery map"
      >
        <div className="absolute inset-0 pointer-events-none rounded-[18.5px] sm:rounded-[24.5px] bg-[#202023]" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
          className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-xl bg-black/65 hover:bg-black/85 text-white/80 hover:text-white border border-white/15 backdrop-blur-md shadow-sm transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          title="Full Screen Map"
          aria-label="Open fullscreen map"
        >
          <FullscreenExpandIcon className="w-4 h-4 text-white" />
        </button>

        {!hideHeader && (
          <div className="relative z-20 px-4 sm:px-5 py-2.5 sm:py-3 rounded-t-[18.5px] sm:rounded-t-[24.5px] border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/45 to-transparent backdrop-blur-[2px] shrink-0 pr-12">
            <div className="flex items-center gap-2">
              <MapPinCustomIcon className="w-4 h-4 text-[#94EB41]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/95">
                Live Violation Map
              </span>
            </div>
          </div>
        )}

        <div className={cn(
          "relative w-full flex justify-center items-center overflow-hidden",
          compact
            ? "min-h-[220px] sm:min-h-[260px] px-2 pt-2.5 pb-1.5"
            : "px-1.5 py-3 sm:px-4 sm:pt-4 sm:pb-3 sm:min-h-[460px] lg:min-h-[500px] xl:min-h-[530px]"
        )}>
          <div className={cn(
            "relative mx-auto aspect-[612/696] w-full",
            compact
              ? "max-w-[240px]"
              : "max-w-[min(100%,440px)] sm:max-w-[520px] lg:max-w-[580px] xl:max-w-[620px]"
          )}>
            <svg
              viewBox={indiaGeoMap.viewBox}
              className="absolute inset-0 w-full h-full object-contain overflow-visible"
              role="img"
              aria-label="Pixelated map of India"
              shapeRendering="geometricPrecision"
            >
              <defs>
                <pattern
                  id={patternId}
                  width="14"
                  height="14"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2.5" cy="2.5" r="1.4" fill="#94EB41" />
                  <circle cx="7.5" cy="2.5" r="1.4" fill="#A8F45B" opacity="0.85" />
                  <circle cx="12.5" cy="2.5" r="1.4" fill="#79D63A" opacity="0.9" />
                  <circle cx="2.5" cy="7.5" r="1.4" fill="#86E344" opacity="0.9" />
                  <circle cx="7.5" cy="7.5" r="1.4" fill="#B6FF70" opacity="0.8" />
                  <circle cx="12.5" cy="7.5" r="1.4" fill="#94EB41" opacity="0.9" />
                  <circle cx="2.5" cy="12.5" r="1.4" fill="#70C934" opacity="0.88" />
                  <circle cx="7.5" cy="12.5" r="1.4" fill="#94EB41" opacity="0.95" />
                  <circle cx="12.5" cy="12.5" r="1.4" fill="#A8F45B" opacity="0.85" />
                </pattern>
              </defs>

              {indiaGeoMap.locations
                .filter((location: { id: string }) => !OMITTED_ISLANDS.has(location.id))
                .map((location: { id: string; path: string }) => (
                  <path
                    key={location.id}
                    d={location.path}
                    fill={`url(#${patternId})`}
                    stroke="#1E1E24"
                    strokeWidth="0.5"
                  />
                ))}
            </svg>

            {placed.map((p, i) => {
              const critical = p.severity === "critical" || p.severity === "high";
              const isActive = activeId === p.id;
              const bubbleAnchor = bubbleAnchorFor(p.x);
              return (
                <div
                  key={p.id}
                  className={cn(
                    "absolute z-10 group hover:z-[100]",
                    isActive && "z-[100]"
                  )}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 320, damping: 20 }}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute bottom-full mb-1.5 sm:mb-2 z-[120] w-max max-w-[min(64vw,185px)] sm:max-w-[260px] whitespace-normal opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200",
                        isActive && "opacity-100 translate-y-0 pointer-events-auto",
                        bubbleAnchor === "left" && "left-0",
                        bubbleAnchor === "right" && "right-0",
                        bubbleAnchor === "center" && "left-1/2 -translate-x-1/2"
                      )}
                    >
                      <div className="relative px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#94EB41] text-[rgb(18,18,18)] shadow-[0_8px_24px_rgba(148,235,65,0.42),0_2px_8px_rgba(0,0,0,0.5)] border border-[#A5F35C]">
                        <div className="flex items-center justify-between gap-1 sm:gap-2 mb-0.5">
                          <span className="text-[7.5px] sm:text-[8.5px] font-mono font-bold tracking-wider uppercase text-[rgb(18,18,18)]/85 truncate flex items-center gap-0.5">
                            {p.isOfficial && <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />}
                            {p.ruleCode || "Report"}
                          </span>
                          <span className="text-[7.5px] sm:text-[8.5px] font-mono text-[rgb(18,18,18)]/65 font-bold shrink-0">
                            {p.zone || "India"}
                          </span>
                        </div>

                        <p className="text-[9.5px] sm:text-[12px] font-[800] tracking-tight leading-[1.2] sm:leading-[1.3] font-satoshi text-[rgb(18,18,18)] break-words text-left">
                          {p.title}
                        </p>

                        <p className="text-[7.5px] sm:text-[9.5px] font-mono font-medium text-[rgb(18,18,18)]/75 mt-0.5">
                          {p.status || "Review"} • Tap to open
                        </p>

                        <svg
                          className={cn(
                            "absolute -bottom-2 sm:-bottom-2.5 w-3.5 h-2.5 sm:w-4 sm:h-3 text-[#94EB41] overflow-visible z-20 pointer-events-none drop-shadow-sm",
                            bubbleAnchor === "left" && "left-[14px] sm:left-[20px] -translate-x-1/2",
                            bubbleAnchor === "right" && "right-[14px] sm:right-[20px] translate-x-1/2",
                            bubbleAnchor === "center" && "left-1/2 -translate-x-1/2"
                          )}
                          viewBox="0 0 16 12"
                          fill="currentColor"
                        >
                          <path d="M0 0 L16 0 L8 12 Z" />
                        </svg>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveId((cur) => (cur === p.id ? null : p.id));
                        onPostSelect?.(p.id);
                      }}
                      aria-label={`Open report: ${p.title}`}
                      className="relative z-10 flex flex-col items-center cursor-pointer outline-none"
                    >
                      <div
                        className={cn(
                          compact
                            ? "w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] sm:rounded-[12px]"
                            : "w-7 h-7 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-[10px] sm:rounded-[14px]",
                          "bg-zinc-900 border-2 shadow-[0_10px_24px_rgba(0,0,0,0.8),0_2px_6px_rgba(0,0,0,0.6)] flex items-center justify-center select-none overflow-hidden transition-transform duration-200 group-hover:scale-110",
                          isActive ? "border-[#94EB41]" : critical ? "border-rose-400" : "border-zinc-700"
                        )}
                      >
                        {p.avatar ? (
                          p.avatar.startsWith("http") ? (
                            <img src={p.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className={compact ? "text-sm leading-none" : "text-sm sm:text-lg lg:text-xl leading-none"}>
                              {p.avatar}
                            </span>
                          )
                        ) : (
                          <ShieldCheck className={cn(compact ? "w-3 h-3" : "w-3.5 h-3.5 sm:w-4 sm:h-4", critical ? "text-rose-400" : "text-[#94EB41]")} />
                        )}
                      </div>

                      <svg className="w-3 h-2 sm:w-3.5 sm:h-2.5 -mt-0.5 overflow-visible z-0" viewBox="0 0 16 12">
                        <path
                          d="M 0 0 L 16 0 L 8 12 Z"
                          className={cn(
                            critical ? "fill-[#2B1220] stroke-rose-400" : "fill-[#18181B] stroke-zinc-600",
                            "stroke-[1.5]"
                          )}
                        />
                      </svg>

                      <div className="relative -mt-0.5 flex items-center justify-center">
                        <div
                          className={cn(
                            "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full z-10",
                            critical
                              ? "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.9),0_0_3px_rgba(251,113,133,0.9)]"
                              : "bg-[#94EB41] shadow-[0_0_10px_#94EB41,0_0_3px_#94EB41]"
                          )}
                        />
                      </div>
                    </button>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {!hideFooter && (
          <div className="relative z-20 rounded-b-[18.5px] sm:rounded-b-[24.5px] border-t border-white/10 bg-[#17171A]/95 px-4 sm:px-5 py-3 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-white/45">Pinned</span>
                <span className="mt-0.5 block text-sm sm:text-base font-[900] text-white">{placed.length}</span>
              </div>
              <div className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] px-3 py-2">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-rose-200/65">High priority</span>
                <span className="mt-0.5 block text-sm sm:text-base font-[900] text-rose-200">{criticalCount}</span>
              </div>
              <div className="rounded-xl border border-[#94EB41]/20 bg-[#94EB41]/[0.06] px-3 py-2">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-[#B6FF70]/65">Active zones</span>
                <span className="mt-0.5 block text-sm sm:text-base font-[900] text-[#B6FF70]">{activeZoneCount}</span>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2 text-[10px] font-mono text-white/45">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#94EB41] shadow-[0_0_8px_#94EB41]" />
                {reviewCount} awaiting review
              </span>
              <span className="text-white/60 font-medium">Hover a ping · tap to open script</span>
            </div>
          </div>
        )}
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-[#0B0B0D]/95 backdrop-blur-2xl flex flex-col p-3 sm:p-5 overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-1.5">
              <MapPinCustomIcon className="w-3.5 h-3.5 text-[#94EB41]" />
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-white/90">
                Live Violation Map
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 transition-all cursor-pointer flex items-center justify-center active:scale-90"
              title="Close Fullscreen"
              aria-label="Close fullscreen map"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 w-full h-full min-h-0 flex items-center justify-center p-1 sm:p-3 overflow-hidden">
            <div className="relative aspect-[612/696] w-full max-w-[min(100%,calc((100dvh-8rem)*612/696))] max-h-full mx-auto">
              <svg
                viewBox={indiaGeoMap.viewBox}
                className="absolute inset-0 w-full h-full overflow-visible"
                role="img"
                aria-label="Pixelated map of India"
                shapeRendering="geometricPrecision"
              >
                <defs>
                  <pattern
                    id={`${patternId}-fs`}
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2.5" cy="2.5" r="1.4" fill="#94EB41" />
                    <circle cx="7.5" cy="2.5" r="1.4" fill="#A8F45B" opacity="0.85" />
                    <circle cx="12.5" cy="2.5" r="1.4" fill="#79D63A" opacity="0.9" />
                    <circle cx="2.5" cy="7.5" r="1.4" fill="#86E344" opacity="0.9" />
                    <circle cx="7.5" cy="7.5" r="1.4" fill="#B6FF70" opacity="0.8" />
                    <circle cx="12.5" cy="7.5" r="1.4" fill="#94EB41" opacity="0.9" />
                    <circle cx="2.5" cy="12.5" r="1.4" fill="#70C934" opacity="0.88" />
                    <circle cx="7.5" cy="12.5" r="1.4" fill="#94EB41" opacity="0.95" />
                    <circle cx="12.5" cy="12.5" r="1.4" fill="#A8F45B" opacity="0.85" />
                  </pattern>
                </defs>

                {indiaGeoMap.locations
                  .filter((location: { id: string }) => !OMITTED_ISLANDS.has(location.id))
                  .map((location: { id: string; path: string }) => (
                    <path
                      key={`fs-${location.id}`}
                      d={location.path}
                      fill={`url(#${patternId}-fs)`}
                      stroke="#1E1E24"
                      strokeWidth="0.5"
                    />
                  ))}
              </svg>

              {placed.map((p, i) => {
                const critical = p.severity === "critical" || p.severity === "high";
                const isActive = activeId === p.id;
                const bubbleAnchor = bubbleAnchorFor(p.x);
                return (
                  <div
                    key={`fs-pin-${p.id}`}
                    className={cn("absolute z-10 group hover:z-[100]", isActive && "z-[100]")}
                    style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -100%)" }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.02, type: "spring", stiffness: 320, damping: 20 }}
                      className="flex flex-col items-center relative"
                    >
                      <div
                        className={cn(
                          "pointer-events-none absolute bottom-full mb-1.5 sm:mb-2 z-[120] w-max max-w-[min(65vw,220px)] sm:max-w-[280px] whitespace-normal opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200",
                          isActive && "opacity-100 translate-y-0 pointer-events-auto",
                          bubbleAnchor === "left" && "left-0",
                          bubbleAnchor === "right" && "right-0",
                          bubbleAnchor === "center" && "left-1/2 -translate-x-1/2"
                        )}
                      >
                        <div className="relative px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#94EB41] text-[rgb(18,18,18)] shadow-[0_8px_24px_rgba(148,235,65,0.42),0_2px_8px_rgba(0,0,0,0.5)] border border-[#A5F35C]">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[7.5px] sm:text-[8.5px] font-mono font-bold tracking-wider uppercase text-[rgb(18,18,18)]/85 truncate flex items-center gap-0.5">
                              {p.isOfficial && <ShieldCheck className="w-2.5 h-2.5 shrink-0" />}
                              {p.ruleCode || "Report"}
                            </span>
                            <span className="text-[7.5px] sm:text-[8.5px] font-mono text-[rgb(18,18,18)]/65 font-bold shrink-0">
                              {p.zone || "India"}
                            </span>
                          </div>
                          <p className="text-[9.5px] sm:text-[12px] font-[800] tracking-tight leading-[1.2] font-satoshi text-[rgb(18,18,18)] break-words text-left">
                            {p.title}
                          </p>
                          <svg
                            className={cn(
                              "absolute -bottom-2 w-3.5 h-2.5 text-[#94EB41] overflow-visible z-20 pointer-events-none drop-shadow-sm",
                              bubbleAnchor === "left" && "left-[16px] sm:left-[20px] -translate-x-1/2",
                              bubbleAnchor === "right" && "right-[16px] sm:right-[20px] translate-x-1/2",
                              bubbleAnchor === "center" && "left-1/2 -translate-x-1/2"
                            )}
                            viewBox="0 0 16 12"
                            fill="currentColor"
                          >
                            <path d="M0 0 L16 0 L8 12 Z" />
                          </svg>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveId((cur) => (cur === p.id ? null : p.id));
                          onPostSelect?.(p.id);
                        }}
                        className="relative z-10 flex flex-col items-center cursor-pointer outline-none"
                      >
                        <div className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[14px] bg-zinc-900 border-2 shadow-[0_10px_24px_rgba(0,0,0,0.8)] flex items-center justify-center select-none overflow-hidden transition-transform group-hover:scale-110",
                          isActive ? "border-[#94EB41]" : critical ? "border-rose-400" : "border-zinc-700"
                        )}>
                          {p.avatar ? (
                            p.avatar.startsWith("http") ? (
                              <img src={p.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm sm:text-base leading-none">{p.avatar}</span>
                            )
                          ) : (
                            <ShieldCheck className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", critical ? "text-rose-400" : "text-[#94EB41]")} />
                          )}
                        </div>
                        <svg className="w-3 h-2 -mt-0.5 overflow-visible z-0" viewBox="0 0 16 12">
                          <path d="M 0 0 L 16 0 L 8 12 Z" className={cn(critical ? "fill-[#2B1220] stroke-rose-400" : "fill-[#18181B] stroke-zinc-600", "stroke-[1.5]")} />
                        </svg>
                        <div className="relative -mt-0.5 flex items-center justify-center">
                          <div className={cn("w-2 h-2 rounded-full z-10", critical ? "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.9)]" : "bg-[#94EB41] shadow-[0_0_8px_#94EB41]")} />
                        </div>
                      </button>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 pt-2 border-t border-white/10 w-full max-w-[480px] mx-auto">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-center">
                <span className="block text-[8px] font-mono uppercase tracking-wider text-white/45">Pinned</span>
                <span className="mt-0.5 block text-xs sm:text-sm font-[900] text-white">{placed.length}</span>
              </div>
              <div className="rounded-lg border border-rose-300/20 bg-rose-300/[0.06] px-2 py-1 text-center">
                <span className="block text-[8.5px] font-mono uppercase tracking-wider text-rose-200/65">High priority</span>
                <span className="mt-0.5 block text-xs sm:text-sm font-[900] text-rose-200">{criticalCount}</span>
              </div>
              <div className="rounded-lg border border-[#94EB41]/20 bg-[#94EB41]/[0.06] px-2 py-1 text-center">
                <span className="block text-[8.5px] font-mono uppercase tracking-wider text-[#B6FF70]/65">Active zones</span>
                <span className="mt-0.5 block text-xs sm:text-sm font-[900] text-[#B6FF70]">{activeZoneCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
