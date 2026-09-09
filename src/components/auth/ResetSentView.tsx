"use client";

import React, { useState, useEffect } from "react";
import { MailCheck, ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "../ui/Button";

interface ResetSentViewProps {
  email: string;
  onResend: () => void;
  onBackToSignIn: () => void;
  isResending?: boolean;
}

export const ResetSentView: React.FC<ResetSentViewProps> = ({
  email,
  onResend,
  onBackToSignIn,
  isResending = false,
}) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    if (countdown > 0 || isResending) return;
    onResend();
    setCountdown(30);
  };

  return (
    <div className="w-full space-y-5 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-[#EAFBD9] border border-[#B8F27D] flex items-center justify-center text-[#417F14] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <MailCheck className="w-6 h-6 text-[#478516]" />
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-zinc-500 font-normal">
          We've sent password reset instructions to:
        </p>
        <p className="text-sm font-semibold font-mono text-[rgb(18,18,18)] bg-zinc-100 py-1.5 px-3 rounded-xl border border-zinc-200 inline-block">
          {email || "your email address"}
        </p>
        <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
          Please check your spam or promotions folder if you do not see it within a few moments.
        </p>
      </div>

      <div className="space-y-2.5 pt-2">
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          isLoading={isResending}
          leftIcon={<RotateCw className="w-3.5 h-3.5" />}
        >
          {countdown > 0 ? `Resend email in ${countdown}s` : "Resend reset link"}
        </Button>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onBackToSignIn}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Sign in
        </Button>
      </div>
    </div>
  );
};
