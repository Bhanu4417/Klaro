"use client";

import React, { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff, X, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  allowClear?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftIcon,
      allowClear = false,
      onClear,
      value,
      onChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const hasValue = value !== undefined && value !== null && String(value).length > 0;

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-medium uppercase tracking-wider text-charcoal-600 select-none block"
            >
              {label}
            </label>
          </div>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 pointer-events-none text-charcoal-400 flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              "w-full h-12 min-h-[48px] sm:min-h-[50px] rounded-[18px] bg-[#ECEAEB] text-[rgb(18,18,18)] placeholder:text-zinc-400 text-sm sm:text-[15px] font-medium transition-all duration-150 border-[1.5px]",
              "shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)] focus:outline-none focus:ring-2 focus:ring-[#94EC40]/25 focus:border-[#94EC40] focus:bg-white",
              leftIcon ? "pl-10" : "pl-4",
              isPassword || (allowClear && hasValue) ? "pr-10" : "pr-4",
              error
                ? "border-red-400 bg-red-50/20 text-red-950 focus:border-red-500 focus:ring-red-500/20"
                : "border-[#D5D2D4] hover:border-[#CAC7C9]",
              disabled && "bg-[#DFDCDE] text-zinc-400 cursor-not-allowed border-[#D5D2D4]",
              className
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#94EC40]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : allowClear && hasValue && onClear && !disabled ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear input"
              className="absolute right-3 p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#94EC40]"
              tabIndex={-1}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium pt-0.5 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <p className="text-xs text-charcoal-400 font-normal leading-relaxed">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
