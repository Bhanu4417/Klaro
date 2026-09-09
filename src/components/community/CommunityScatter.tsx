"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";
import { COMMUNITY_PROFILES } from "./data";
import { FloatingAvatar } from "./FloatingAvatar";
import { cn } from "../../lib/utils";

interface CommunityScatterProps {
  className?: string;
}

export const CommunityScatter: React.FC<CommunityScatterProps> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[640px] flex items-center justify-center overflow-hidden select-none bg-[#0B0B0D]",
        className
      )}
      aria-label="Community product discovery visualization"
    >
      <div className="absolute top-1/4 left-1/4 w-[460px] h-[460px] bg-[#94EB41]/[0.07] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#94EB41]/[0.05] rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative w-full h-full max-w-[800px] max-h-[860px] p-6">
        {COMMUNITY_PROFILES.map((profile) => (
          <FloatingAvatar
            key={profile.id}
            profile={profile}
            originX={50}
            originY={50}
            isReducedMotion={Boolean(shouldReduceMotion)}
          />
        ))}
      </div>
    </div>
  );
};
