"use client";

import React, { useState } from "react";
import { Mail, ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateEmail } from "../../lib/utils";
import { AuthError } from "../../types/auth";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  onBackToSignIn: () => void;
  isLoading?: boolean;
  serverError?: AuthError | null;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  onBackToSignIn,
  isLoading = false,
  serverError,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setError(undefined);
    onSubmit(email.trim());
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full space-y-4" noValidate>
      <Input
        label="Account Email"
        type="email"
        placeholder="alex@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(undefined);
        }}
        error={error || (serverError?.field === "email" ? serverError.message : undefined)}
        leftIcon={<Mail className="w-4 h-4" />}
        allowClear
        onClear={() => setEmail("")}
        disabled={isLoading}
        autoComplete="email"
        autoFocus
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="mt-2 font-[600]"
      >
        Send Recovery Link
      </Button>

      <div className="pt-3 border-t border-zinc-100 text-center">
        <button
          type="button"
          onClick={onBackToSignIn}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[rgb(18,18,18)] transition-colors py-1 px-2.5 rounded-lg hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#94EC40]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sign In</span>
        </button>
      </div>
    </form>
  );
};
