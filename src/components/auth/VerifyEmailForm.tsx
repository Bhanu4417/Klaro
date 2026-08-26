"use client";

import React, { useState } from "react";
import { KeyRound, ArrowRight, RefreshCw } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { AuthError } from "../../types/auth";

interface VerifyEmailFormProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  serverError?: AuthError | null;
}

export const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  email,
  onVerify,
  onResend,
  isLoading = false,
  serverError,
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length < 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }
    setError(undefined);
    onVerify(code.trim());
  };

  const handleResendClick = () => {
    if (resendCooldown) return;
    onResend();
    setResendCooldown(true);
    setTimeout(() => setResendCooldown(false), 30000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 text-left" noValidate>
      <div className="p-3 rounded-2xl bg-[#ECEAEB] border border-[#D5D2D4] text-xs text-zinc-700 leading-relaxed">
        We sent a 6-digit security code to{" "}
        <span className="font-semibold text-zinc-950 font-mono">{email}</span>.
      </div>

      <Input
        label="Verification Code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
          if (error) setError(undefined);
        }}
        error={error || serverError?.message}
        leftIcon={<KeyRound className="w-4 h-4 text-zinc-500" />}
        disabled={isLoading}
        autoFocus
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="font-[600]"
      >
        Verify & Continue
      </Button>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={handleResendClick}
          disabled={resendCooldown || isLoading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          <span>{resendCooldown ? "Code resent. Check your inbox" : "Didn't receive a code? Resend"}</span>
        </button>
      </div>
    </form>
  );
};
