"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface AuthLoadingStateProps {
  message?: string;
  className?: string;
}

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({
  message = "Authenticating with food intelligence...",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center space-y-4 select-none min-h-[220px]",
        className
      )}
    >
      {/* Tactile scanning reticle animation */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-[#D4F7B0] animate-ping opacity-40" />
        
        {/* Center card box with laser scan */}
        <div className="relative w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {/* Laser beam */}
          <div className="absolute inset-x-0 h-0.5 bg-[#94EC40] shadow-[0_0_8px_#94EC40] animate-scan-line" />
          
          <Loader2 className="w-6 h-6 text-zinc-800 animate-spin" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-[rgb(18,18,18)] tracking-tight">
          {message}
        </p>
        <p className="text-xs text-zinc-400 font-mono">Securing session...</p>
      </div>
    </div>
  );
};
