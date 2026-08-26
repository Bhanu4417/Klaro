import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  variant?: "botanical" | "charcoal" | "neutral" | "warning";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "botanical",
  size = "sm",
  className,
  children,
}) => {
  const variantStyles = {
    botanical: "bg-[#EAFBD9] text-[#346415] border-[#B8F27D]",
    charcoal: "bg-zinc-100 text-[rgb(18,18,18)] border-zinc-200",
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  }[variant];

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 font-medium",
    md: "text-xs px-3 py-1 font-medium",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border tracking-tight select-none",
        variantStyles,
        sizeStyles,
        className
      )}
    >
      {children}
    </span>
  );
};
