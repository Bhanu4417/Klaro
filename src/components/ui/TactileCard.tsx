import React from "react";
import { cn } from "../../lib/utils";

interface TactileCardProps {
  children: React.ReactNode;
  className?: string;
  showReceiptBorder?: boolean;
}

export const TactileCard: React.FC<TactileCardProps> = ({
  children,
  className,
  showReceiptBorder = false,
}) => {
  return (
    <div
      className={cn(
        "relative w-full bg-[#FCFCFB] rounded-[24px] sm:rounded-[28px] border-[1.5px] border-[#D5D2D4] shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] overflow-hidden transition-all duration-300",
        className
      )}
    >
      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
};
