import React from "react";
import { cn } from "../../lib/utils";

interface DividerProps {
  text?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ text = "or", className }) => {
  return (
    <div className={cn("relative flex items-center justify-center my-6", className)}>
      <div className="w-full border-t border-paper-300" />
      {text && (
        <span className="absolute bg-white px-3 text-xs font-mono uppercase tracking-widest text-charcoal-400 select-none">
          {text}
        </span>
      )}
    </div>
  );
};
