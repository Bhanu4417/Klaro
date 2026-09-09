"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, Share2 } from "lucide-react";
import { cn } from "../lib/utils";

const QR_MATRIX_21: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
  [0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1],
  [0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
];

const CELL = 9;
const SUB = 3;
const GRAIN_SIZE = 3;
const STAGE_W = 220;
const STAGE_H = 220;
const QR_SIZE = 21 * CELL;
const QR_OFFSET = (STAGE_W - QR_SIZE) / 2;

const T_FLIGHT = 580;
const T_STAGGER = 640;
const TOTAL_DURATION = T_FLIGHT + T_STAGGER;

function easeOutQuint(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 5);
}

function hash2(x: number, y: number): number {
  const sin = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return sin - Math.floor(sin);
}

interface ParticleData {
  targetX: number;
  targetY: number;
  row: number;
  col: number;
  staggerNorm: number;
  grains: Array<{
    subX: number;
    subY: number;
    scatterX: number;
    scatterY: number;
  }>;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
  shareUrl?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  shareUrl = "https://klaro.app/p/inspection-rep-4417",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const clockRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const qrParticles: ParticleData[] = useMemo(() => {
    const launchX = STAGE_W / 2;
    const launchY = STAGE_H + 20;

    let maxDist = 0;
    const rawList: Array<{ row: number; col: number; targetX: number; targetY: number; dist: number }> = [];

    for (let r = 0; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        if (QR_MATRIX_21[r][c] === 1) {
          const targetX = QR_OFFSET + c * CELL;
          const targetY = QR_OFFSET + r * CELL;
          const dx = targetX + CELL / 2 - launchX;
          const dy = targetY + CELL / 2 - launchY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > maxDist) maxDist = dist;
          rawList.push({ row: r, col: c, targetX, targetY, dist });
        }
      }
    }

    rawList.sort((a, b) => a.dist - b.dist);
    const minDist = rawList[0]?.dist || 1;

    return rawList.map((item) => {
      const staggerNorm = maxDist > minDist ? (item.dist - minDist) / (maxDist - minDist) : 0;

      const grains: ParticleData["grains"] = [];
      for (let gy = 0; gy < SUB; gy++) {
        for (let gx = 0; gx < SUB; gx++) {
          const subX = gx * GRAIN_SIZE;
          const subY = gy * GRAIN_SIZE;
          const seed = item.row * 1000 + item.col * 50 + gy * SUB + gx;
          const angle = hash2(seed, 1.1) * Math.PI * 2;
          const radius = 14 + hash2(seed, 2.2) * 28;

          grains.push({
            subX,
            subY,
            scatterX: Math.cos(angle) * radius,
            scatterY: Math.sin(angle) * radius,
          });
        }
      }

      return {
        targetX: item.targetX,
        targetY: item.targetY,
        row: item.row,
        col: item.col,
        staggerNorm,
        grains,
      };
    });
  }, []);

  const renderFrame = useCallback(
    (clockMs: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx.fillStyle = "#FCFCFC";
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);

      const launchX = STAGE_W / 2;
      const launchY = STAGE_H + 20;

      ctx.fillStyle = "#141416";

      for (let i = 0; i < qrParticles.length; i++) {
        const p = qrParticles[i];
        const startTime = p.staggerNorm * T_STAGGER;
        const localTime = clockMs - startTime;

        if (prefersReducedMotion) {
          const alpha = Math.max(0, Math.min(1, clockMs / 200));
          ctx.globalAlpha = alpha;
          ctx.fillRect(p.targetX, p.targetY, CELL, CELL);
          ctx.globalAlpha = 1;
          continue;
        }

        if (localTime <= 0) continue;

        const progressRaw = localTime / T_FLIGHT;
        const progress = easeOutQuint(progressRaw);

        if (progress >= 1) {
          ctx.fillRect(p.targetX, p.targetY, CELL, CELL);
        } else {
          const moduleFlightX = launchX + (p.targetX - launchX) * progress;
          const moduleFlightY = launchY + (p.targetY - launchY) * progress;
          const scatterFactor = Math.pow(1 - progress, 1.8);

          for (let g = 0; g < p.grains.length; g++) {
            const grain = p.grains[g];
            const gx = moduleFlightX + grain.subX + grain.scatterX * scatterFactor;
            const gy = moduleFlightY + grain.subY + grain.scatterY * scatterFactor;

            ctx.fillRect(Math.round(gx), Math.round(gy), GRAIN_SIZE, GRAIN_SIZE);
          }
        }
      }
    },
    [qrParticles]
  );

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = STAGE_W * dpr;
    canvas.height = STAGE_H * dpr;
    canvas.style.width = `${STAGE_W}px`;
    canvas.style.height = `${STAGE_H}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    let isCancelled = false;
    clockRef.current = 0;
    lastTimeRef.current = null;

    const tick = (now: number) => {
      if (isCancelled) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min(now - lastTimeRef.current, 50);
      lastTimeRef.current = now;

      clockRef.current = Math.min(TOTAL_DURATION, clockRef.current + dt);
      renderFrame(clockRef.current);

      if (clockRef.current < TOTAL_DURATION) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    renderFrame(0);
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isCancelled = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen, renderFrame]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="share-modal" className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.65, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 5 }}
            transition={{
              type: "spring",
              stiffness: 460,
              damping: 26,
              mass: 0.85,
            }}
            className="relative w-[268px] bg-[#FCFCFB] rounded-[24px] border border-white/80 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] text-zinc-950 z-10 space-y-2.5 text-center"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#94EB41] text-[rgb(18,18,18)] flex items-center justify-center border border-[#80D42F] shadow-xs">
                  <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <h3
                  className="text-xs font-[900] text-zinc-950 tracking-tight"
                  style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                >
                  Share Report
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-black/5 text-zinc-400 hover:text-zinc-900 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center p-1.5 rounded-xl bg-[#FCFCFC] border border-[#E2DFE2] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
              <canvas
                ref={canvasRef}
                className="rounded-lg block"
                style={{ width: "220px", height: "220px" }}
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#ECEAEB] rounded-xl border border-[#D5D2D4]">
              <div className="flex-1 px-2 py-1 text-[11px] font-mono text-zinc-700 truncate select-all text-left">
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "p-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center shrink-0 shadow-xs",
                  copied
                    ? "bg-[#94EB41] text-[rgb(18,18,18)] border border-[#80D42F]"
                    : "bg-[#0B0B0D] text-white hover:bg-zinc-800"
                )}
                title={copied ? "Copied" : "Copy Link"}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
