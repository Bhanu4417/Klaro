"use client";

import React from "react";
import { motion } from "framer-motion";
import { CommunityProfile } from "./types";
import { MessageBubble } from "./MessageBubble";
import { cn } from "../../lib/utils";

interface FloatingAvatarProps {
  profile: CommunityProfile;
  originX?: number;
  originY?: number;
  isReducedMotion?: boolean;
}

export const FloatingAvatar: React.FC<FloatingAvatarProps> = ({
  profile,
  originX = 50,
  originY = 50,
  isReducedMotion = false,
}) => {
  const offsetXPercent = originX - profile.x;
  const offsetYPercent = originY - profile.y;

  return (
    <motion.div
      style={{
        left: `${profile.x}%`,
        top: `${profile.y}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 select-none"
      initial={
        isReducedMotion
          ? { opacity: 1, scale: 1, x: 0, y: 0 }
          : {
              opacity: 0,
              scale: 0.45,
              x: `${offsetXPercent * 4.5}px`,
              y: `${offsetYPercent * 4.5}px`,
            }
      }
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: isReducedMotion ? 0 : 0.85,
        delay: isReducedMotion ? 0 : profile.delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        animate={
          isReducedMotion
            ? {}
            : {
                y: [-profile.floatDistance!, profile.floatDistance!, -profile.floatDistance!],
                rotate: [0, profile.messageRotation || 0.5, 0],
              }
        }
        transition={{
          duration: profile.floatDuration || 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: profile.delay + 0.9,
        }}
        className="relative group cursor-default"
      >
        <div
          style={{ width: profile.size, height: profile.size }}
          className={cn(
            "relative rounded-[20px] p-1 bg-zinc-900 border border-zinc-700/60 shadow-[0_12px_32px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]",
            "transition-all duration-300 hover:scale-110 hover:border-[#94EB41] hover:shadow-[0_16px_40px_rgba(148,235,65,0.25)]"
          )}
        >
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            loading="eager"
            className="w-full h-full rounded-[16px] object-cover select-none pointer-events-none"
          />

          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#94EB41] border-2 border-zinc-900 shadow-sm" />
        </div>

        {profile.message && (
          <MessageBubble
            message={profile.message}
            position={profile.messagePosition || "bottom-right"}
            rotation={profile.messageRotation || 0}
            delay={profile.messageDelay || profile.delay + 1.1}
            isReducedMotion={isReducedMotion}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
