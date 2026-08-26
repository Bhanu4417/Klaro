"use client";

import React from "react";
import { AlertCircle, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthError } from "../../types/auth";
import { cn } from "../../lib/utils";

interface AuthErrorStateProps {
  error: AuthError | string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export const AuthErrorState: React.FC<AuthErrorStateProps> = ({
  error,
  onDismiss,
  onRetry,
  className,
}) => {
  if (!error) return null;

  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -6, height: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative flex items-start gap-3 p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-900 text-xs sm:text-sm my-3 shadow-tactile-sm",
          className
        )}
        role="alert"
        aria-live="assertive"
      >
        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
        <div className="flex-1 text-left leading-snug font-normal pr-4">
          <p className="text-red-900 font-medium">{errorMessage}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
              title="Retry"
              aria-label="Retry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-800 transition-colors"
              title="Dismiss error"
              aria-label="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
