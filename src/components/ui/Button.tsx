"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark" | "green";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "lg",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl sm:rounded-2xl transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#94EC40] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.985]";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-4 text-sm gap-2",
      lg: "h-12 min-h-[48px] sm:min-h-[50px] px-5 text-sm sm:text-[15px] gap-2.5 font-[600] tracking-tight",
    }[size];

    const variantStyles = {
      primary:
        "bg-[#94EB41] text-[rgb(18,18,18)] hover:bg-[#88E430] active:bg-[#7ED428] border-2 border-[#62C414] shadow-[0_4px_14px_rgba(104,202,26,0.35),inset_0_1.5px_1.5px_rgba(255,255,255,0.85),inset_0_-1.5px_2px_rgba(0,0,0,0.08)] focus-visible:ring-[#94EC40] font-bold rounded-[18px]",
      green:
        "bg-[#94EB41] text-[rgb(18,18,18)] hover:bg-[#88E430] active:bg-[#7ED428] border-2 border-[#62C414] shadow-[0_4px_14px_rgba(104,202,26,0.35),inset_0_1.5px_1.5px_rgba(255,255,255,0.85),inset_0_-1.5px_2px_rgba(0,0,0,0.08)] focus-visible:ring-[#94EC40] font-bold rounded-[18px]",
      secondary:
        "bg-[#F4F4F5] text-[rgb(18,18,18)] hover:bg-[#EBEBEF] active:bg-[#E4E4E8] border border-zinc-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-visible:ring-[#94EC40]",
      outline:
        "bg-white text-[rgb(18,18,18)] border border-zinc-200/80 hover:border-[#94EC40] hover:bg-[#F5FDF0] active:bg-[#EAFBD9] shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-visible:ring-[#94EC40]",
      dark:
        "bg-[#121212] text-white hover:bg-[#1E1E1E] active:bg-[#0A0A0A] border border-zinc-800 focus-visible:ring-[#94EC40]",
      ghost:
        "bg-transparent text-zinc-600 hover:text-[rgb(18,18,18)] hover:bg-zinc-100/60 active:bg-zinc-100 focus-visible:ring-[#94EC40]",
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles,
          variantStyles,
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span className="opacity-90">Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
