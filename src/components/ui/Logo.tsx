import React from "react";
import Image from "next/image";
import { cn } from "../../lib/utils";
import logoImage from "../../assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  variant?: "charcoal" | "green" | "mono";
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = false,
  className,
}) => {
  const iconDimensions = {
    sm: "w-8 h-8 sm:w-9 sm:h-9",
    md: "w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14",
    lg: "w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18",
    xl: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
  }[size];

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-xl tracking-tight",
    lg: "text-2xl tracking-tight",
    xl: "text-3xl tracking-tight",
  }[size];

  return (
    <div className={cn("inline-flex flex-col items-center justify-center gap-2 select-none", className)}>
      <div className={cn("relative flex items-center justify-center rounded-none overflow-hidden", iconDimensions)}>
        <Image
          src={logoImage}
          alt="Logo"
          priority
          className="w-full h-full object-contain rounded-none select-none"
        />
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 text-center leading-none">
          <span className={cn("font-[600] text-[rgb(18,18,18)] tracking-tight font-satoshi", textSizes)}>
            Klaro
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#94EC40] mb-0.5" />
        </div>
      )}
    </div>
  );
};
