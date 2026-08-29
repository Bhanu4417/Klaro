"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { INDIA_MAP_CONFIG, INDIA_COMMUNITY_PINS, IndiaProfilePin } from "./indiaMapData";
import { MessageBubble } from "./MessageBubble";
import { cn } from "../../lib/utils";

interface IndiaPixelMapProps {
  className?: string;
}

export const IndiaPixelMap: React.FC<IndiaPixelMapProps> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();
  const [visiblePins, setVisiblePins] = useState<string[]>([]);
  const [flickerIndex, setFlickerIndex] = useState<number>(0);

  // Active India pixel coordinate lookup
  const activePixelSet = React.useMemo(() => {
    const set = new Set<string>();
    for (const [col, row] of INDIA_MAP_CONFIG.activePixels) {
      set.add(`${col},${row}`);
    }
    return set;
  }, []);

  // Stagger reveal pins on load
  useEffect(() => {
    INDIA_COMMUNITY_PINS.forEach((pin) => {
      const timer = setTimeout(() => {
        setVisiblePins((prev) => [...prev, pin.id]);
      }, pin.delay * 1000);
      return () => clearTimeout(timer);
    });
  }, []);

  // Ambient flickering lines loop across matrix rows
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setFlickerIndex((prev) => (prev + 1) % INDIA_MAP_CONFIG.rows);
    }, 180);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[640px] flex items-center justify-center overflow-hidden select-none bg-[#0B0B0D] p-3 sm:p-6 lg:p-8",
        className
      )}
      aria-label="Community Food Discovery Map of India"
    >
      {/* Ambient background soft glow */}
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-[#94EB41]/[0.06] rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* SVG Canvas for High-Resolution Pixel Grid & Map */}
      <div className="relative w-full max-w-[620px] xl:max-w-[700px] aspect-[52/58] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${INDIA_MAP_CONFIG.cols * 10} ${INDIA_MAP_CONFIG.rows * 10}`}
          className="w-full h-full object-contain overflow-visible"
        >
          {/* Render Full Matrix of Pixel Dots & Flickering Scan Lines */}
          {Array.from({ length: INDIA_MAP_CONFIG.rows }).map((_, r) => {
            const isFlickeringRow = Math.abs(r - flickerIndex) <= 1;
            const isAltFlickerRow = Math.abs(r - ((flickerIndex + 25) % INDIA_MAP_CONFIG.rows)) <= 1;

            return Array.from({ length: INDIA_MAP_CONFIG.cols }).map((_, c) => {
              const isIndia = activePixelSet.has(`${c},${r}`);

              // Background dots (entire grid like uploaded Image 1)
              if (!isIndia) {
                const isFlickerDot = (isFlickeringRow || isAltFlickerRow) && (c % 3 === 0);
                const bgOpacity = isFlickerDot ? 0.35 : 0.12;
                const bgFill = isFlickerDot ? "#94EB41" : "#4A4A52";

                return (
                  <rect
                    key={`bg-${c}-${r}`}
                    x={c * 10 + 3.8}
                    y={r * 10 + 3.8}
                    width={2.4}
                    height={2.4}
                    rx={0.6}
                    fill={bgFill}
                    opacity={bgOpacity}
                    className="transition-opacity duration-200"
                  />
                );
              }

              // Active India map pixels (vibrant green with natural density variations)
              const pseudoHash = (c * 19 + r * 37) % 10;
              const isRowScan = isFlickeringRow || isAltFlickerRow;
              const opacity = isRowScan ? 1 : pseudoHash > 7 ? 0.95 : pseudoHash > 3 ? 0.8 : 0.65;
              const pixelSize = isRowScan ? 4.6 : pseudoHash > 7 ? 4.2 : 3.8;
              const offset = (10 - pixelSize) / 2;

              return (
                <rect
                  key={`in-${c}-${r}`}
                  x={c * 10 + offset}
                  y={r * 10 + offset}
                  width={pixelSize}
                  height={pixelSize}
                  rx={0.9}
                  fill="#94EB41"
                  opacity={opacity}
                  className="transition-all duration-150"
                />
              );
            });
          })}
        </svg>

        {/* Dynamic Profile Pins (No pinging rings, clean spacious positioning) */}
        {INDIA_COMMUNITY_PINS.map((pin) => {
          const isVisible = shouldReduceMotion || visiblePins.includes(pin.id);
          if (!isVisible) return null;

          /* Bubbles are wide — anchor them inward so nothing ever escapes the
             map square, regardless of hand-tuned messagePosition in the data. */
          const h: "left" | "right" =
            pin.x > 55 ? "left" : pin.x < 38 ? "right" : pin.messagePosition?.includes("left") ? "left" : "right";
          const v: "top" | "bottom" =
            pin.y < 20 ? "bottom" : pin.y > 84 ? "top" : pin.messagePosition?.startsWith("top") ? "top" : "bottom";
          const safePosition = `${v}-${h}` as "top-left" | "top-right" | "bottom-left" | "bottom-right";

          return (
            <motion.div
              key={pin.id}
              style={{
                left: `${Math.min(92, Math.max(8, pin.x))}%`,
                top: `${Math.min(92, Math.max(8, pin.y))}%`,
              }}
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.65,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 select-none"
            >
              {/* Profile Avatar Frame (Rounded Square Squircle) */}
              <div
                className={cn(
                  "relative w-12 h-12 sm:w-14 sm:h-14 rounded-[18px] p-0.5 bg-zinc-900 border border-zinc-700/80 shadow-[0_10px_28px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,0.5)]",
                  "transition-transform duration-200 hover:scale-115 hover:border-[#94EB41] cursor-pointer"
                )}
              >
                <img
                  src={pin.avatarUrl}
                  alt={pin.name}
                  className="w-full h-full rounded-[14px] object-cover pointer-events-none select-none"
                />
              </div>

              {/* Message Bubble popping from profile with directional arrow */}
              <MessageBubble
                message={pin.message}
                position={safePosition}
                rotation={pin.rotation || 0}
                delay={0.25}
                isReducedMotion={Boolean(shouldReduceMotion)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
