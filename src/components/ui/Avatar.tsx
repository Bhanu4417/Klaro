"use client";

import React from "react";
import { cn } from "../../lib/utils";

export const Avatar: React.FC<{
  avatar?: string;
  name?: string;
  className?: string;
}> = ({ avatar, name, className }) => {
  if (avatar && avatar.startsWith("http")) {
    return <img src={avatar} alt={name || "Avatar"} className={className} />;
  }
  return (
    <span
      role="img"
      aria-label={name ? `${name}'s avatar` : "Avatar"}
      className={cn(
        "flex items-center justify-center overflow-hidden bg-[#EAFBD9] border border-[#B8F27D] text-[11px] leading-none select-none",
        className
      )}
    >
      {avatar || "🥑"}
    </span>
  );
};
