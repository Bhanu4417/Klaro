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
        "relative w-full bg-[#E6E4E5] rounded-2xl sm:rounded-[24px] border border-[#D5D2D4] shadow-[0_2px_14px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300",
        className
      )}
    >
      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
};
