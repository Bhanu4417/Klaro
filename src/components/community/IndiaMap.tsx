"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import indiaGeoMap from "@svg-maps/india";
import { DISCOVERY_SEQUENCE_50, DiscoveryStep } from "./indiaMapData";
import { cn } from "../../lib/utils";

const OMITTED_ISLANDS = new Set(["an", "ld"]);

export const IndiaMap: React.FC<{ className?: string }> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();

  // Active step index cycling through all 50 verified Indian locations
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPinVisible, setIsPinVisible] = useState<boolean>(true);

  // Smooth continuous camera journey loop across 50 locations
  useEffect(() => {
    if (shouldReduceMotion) return;

    // Flight duration: 3.8 seconds per location
    const interval = setInterval(() => {
      // 1. Fade out current pin smoothly right before camera travels
      setIsPinVisible(false);

      // 2. Camera starts gliding to next location, then new pin pops in
      setTimeout(() => {
        setStepIndex((prev) => (prev + 1) % DISCOVERY_SEQUENCE_50.length);
        setIsPinVisible(true);
      }, 500);
    }, 3800);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const activeStep: DiscoveryStep = DISCOVERY_SEQUENCE_50[stepIndex] || DISCOVERY_SEQUENCE_50[0];

  // Camera Target Transform (scale, x, y)
  const cameraTarget = !shouldReduceMotion
    ? {
        scale: activeStep.camera.scale,
        x: `${activeStep.camera.x}%`,
        y: `${activeStep.camera.y}%`,
      }
    : {
        scale: 1,
        x: "0%",
        y: "0%",
      };

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[660px] flex items-center justify-center overflow-hidden select-none bg-[#0B0B0D] p-4 sm:p-6 lg:p-10",
        className
      )}
      aria-label="Continuous Community Packaged Commodity Discovery Map"
    >
      {/* Solid charcoal stage keeps copy and callouts readable while the map passes behind it. */}
      <div className="absolute inset-0 pointer-events-none bg-[#202023]" />

      <div className="india-dot-glow absolute inset-0 pointer-events-none" aria-hidden="true">
        <span className="india-flow-glow india-flow-glow-one" />
        <span className="india-flow-glow india-flow-glow-two" />
        <span className="india-flow-glow india-flow-glow-three" />
      </div>

      {/* 2. CINEMATIC CAMERA VIEWPORT FRAME */}
      <div className="relative w-full max-w-[440px] lg:max-w-[500px] xl:max-w-[580px] 2xl:max-w-[660px] max-h-[58vh] lg:max-h-[64vh] xl:max-h-[70vh] aspect-[612/696] flex items-center justify-center z-10">
        
        {/* Continuous Camera Transform Rig */}
        <motion.div
          animate={cameraTarget}
          transition={{
            duration: 1.6,
            ease: [0.25, 1, 0.5, 1], // Ultra-smooth camera flight glide
          }}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformOrigin: "50% 50%",
          }}
        >
          {/* Razor-Sharp India Vector Geometry with Emerald Dot Texture */}
          <svg
            viewBox={indiaGeoMap.viewBox}
            className="absolute inset-0 w-full h-full object-contain overflow-visible"
            role="img"
            aria-label="Pixelated map of India"
            shapeRendering="geometricPrecision"
          >
            <defs>
              <pattern
                id="cinematicIndiaPixels"
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
                  fill="url(#cinematicIndiaPixels)"
                  stroke="#1E1E24"
                  strokeWidth="0.5"
                />
              ))}
          </svg>

          {/* 3. DYNAMICALLY DISCOVERED LOCATION PIN & CALLOUT (Unified Flex Assembly) */}
          <AnimatePresence mode="wait">
            {isPinVisible && (
              <motion.div
                key={activeStep.id}
                style={{
                  left: `${activeStep.x}%`,
                  top: `${activeStep.y}%`,
                }}
                transformTemplate={(transform) => `translate(-50%, -100%) ${transform}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 24,
                  mass: 0.7,
                }}
                className="absolute z-30 select-none pointer-events-none flex flex-col items-center"
              >
                {/* A. Speech Message Bubble */}
                <div className="relative max-w-[210px] sm:max-w-[245px] text-left">
                  <div className="relative px-3.5 py-2.5 rounded-2xl bg-[#94EB41] text-[rgb(18,18,18)] shadow-[0_8px_24px_rgba(148,235,65,0.42),0_2px_8px_rgba(0,0,0,0.5)] border border-[#A5F35C]">
                    
                    {/* Header Tag & City */}
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[8.5px] font-mono font-bold tracking-wider uppercase text-[rgb(18,18,18)]/85 truncate">
                        {activeStep.tag}
                      </span>
                      <span className="text-[8.5px] font-mono text-[rgb(18,18,18)]/65 font-bold shrink-0">
                        {activeStep.city}
                      </span>
                    </div>

                    {/* Discovery Text */}
                    <p className="text-[11px] sm:text-[12px] font-[800] tracking-tight leading-[1.3] font-satoshi text-[rgb(18,18,18)] break-words">
                      {activeStep.message}
                    </p>

                    {/* Subvalue */}
                    {activeStep.subvalue && (
                      <p className="text-[9.5px] font-mono font-medium text-[rgb(18,18,18)]/75 mt-0.5 truncate">
                        {activeStep.subvalue}
                      </p>
                    )}

                    {/* Downward Pointer Tail Attached Directly into Avatar Frame */}
                    <svg
                      className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-3 text-[#94EB41] overflow-visible z-20 pointer-events-none drop-shadow-sm"
                      viewBox="0 0 16 12"
                      fill="currentColor"
                    >
                      <path d="M0 0 L16 0 L8 12 Z" />
                    </svg>

                  </div>
                </div>

                {/* B. Profile Avatar Frame (Directly Underneath Pointer Tail) */}
                <div className="relative z-10 -mt-0.5 flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[15px] p-0.5 bg-zinc-950 border-2 border-zinc-700 shadow-[0_10px_24px_rgba(0,0,0,0.8),0_2px_6px_rgba(0,0,0,0.6)] overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${activeStep.avatarSeed}&size=256&backgroundColor=27272a`}
                      alt={activeStep.name}
                      className="w-full h-full rounded-[12px] object-cover pointer-events-none select-none"
                      style={{ imageRendering: "auto" }}
                    />
                  </div>

                  {/* Downward Stem Pointer to Beacon */}
                  <svg className="w-3.5 h-2.5 -mt-0.5 overflow-visible z-0" viewBox="0 0 16 12">
                    <path
                      d="M 0 0 L 16 0 L 8 12 Z"
                      className="fill-[#18181B] stroke-zinc-600 stroke-[1.5]"
                    />
                  </svg>

                  {/* Ground Marker Beacon on Map */}
                  <div className="relative -mt-0.5 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#94EB41] shadow-[0_0_10px_#94EB41,0_0_3px_#94EB41] z-10" />
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      {/* 4. BOTTOM LEFT BRAND & MISSION STATEMENT */}
      <div className="india-copy-panel absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20 max-w-sm px-4 py-3.5 rounded-[18px] bg-zinc-800/95 border border-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)] pointer-events-none select-none text-left space-y-1.5 backdrop-blur-sm">
        <div>
          <span
            className="text-[20px] sm:text-[22px] font-[800] text-white tracking-[-0.03em]"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
          >
            klaro
          </span>
        </div>

        <h2
          className="text-[17px] sm:text-[20px] font-[700] text-zinc-100 tracking-[-0.02em] leading-[1.2]"
          style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 700 }}
        >
          Community discovery network.
        </h2>

        <p
          className="text-[11.5px] sm:text-[12.5px] text-zinc-300 leading-relaxed max-w-[300px] sm:max-w-[340px]"
          style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 400 }}
        >
          People across India scanning packaged commodities and verifying Legal Metrology compliance nationwide.
        </p>
      </div>

    </div>
  );
};
