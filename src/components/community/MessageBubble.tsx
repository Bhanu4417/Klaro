"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface MessageBubbleProps {
  message: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom";
  rotation?: number;
  delay?: number;
  className?: string;
  isReducedMotion?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  position = "bottom-right",
  rotation = 0,
  delay = 0.5,
  className,
  isReducedMotion = false,
}) => {
  const positionClasses = {
    "bottom-right": "top-[calc(100%+10px)] left-0 sm:left-2",
    "bottom-left": "top-[calc(100%+10px)] right-0 sm:right-2",
    "top-right": "bottom-[calc(100%+10px)] left-0 sm:left-2",
    "top-left": "bottom-[calc(100%+10px)] right-0 sm:right-2",
    top: "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
    bottom: "top-[calc(100%+10px)] left-1/2 -translate-x-1/2",
  }[position];

  const renderTail = () => {
    switch (position) {
      case "bottom-right":
        return (
          <svg
            className="absolute -top-2.5 left-4 w-4 h-3 text-[#94EB41] overflow-visible"
            viewBox="0 0 16 12"
            fill="currentColor"
          >
            <path d="M0 0 C6 3, 11 8, 16 12 L0 12 Z" />
          </svg>
        );
      case "bottom-left":
        return (
          <svg
            className="absolute -top-2.5 right-4 w-4 h-3 text-[#94EB41] overflow-visible"
            viewBox="0 0 16 12"
            fill="currentColor"
          >
            <path d="M16 0 C10 3, 5 8, 0 12 L16 12 Z" />
          </svg>
        );
      case "top-right":
        return (
          <svg
            className="absolute -bottom-2.5 left-4 w-4 h-3 text-[#94EB41] overflow-visible"
            viewBox="0 0 16 12"
            fill="currentColor"
          >
            <path d="M0 12 C6 9, 11 4, 16 0 L0 0 Z" />
          </svg>
        );
      case "top-left":
        return (
          <svg
            className="absolute -bottom-2.5 right-4 w-4 h-3 text-[#94EB41] overflow-visible"
            viewBox="0 0 16 12"
            fill="currentColor"
          >
            <path d="M16 12 C10 9, 5 4, 0 0 L16 0 Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={isReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: isReducedMotion ? 0 : 0.45,
        delay: isReducedMotion ? 0 : delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      style={{
        rotate: isReducedMotion ? 0 : `${rotation}deg`,
      }}
      className={cn(
        "absolute z-20 whitespace-normal sm:whitespace-nowrap max-w-[170px] sm:max-w-none pointer-events-none select-none",
        positionClasses,
        className
      )}
    >
      <div className="relative px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#94EB41] text-[rgb(18,18,18)] shadow-[0_8px_28px_rgba(148,235,65,0.35),0_2px_8px_rgba(0,0,0,0.4)] border border-[#A5F35C]">
        {renderTail()}
        <p className="text-[13px] sm:text-[15px] font-[600] tracking-tight leading-snug font-satoshi text-[rgb(18,18,18)]">
          {message}
        </p>
      </div>
    </motion.div>
  );
};
