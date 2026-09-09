"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateEmail, validatePassword } from "../../lib/utils";
import { AuthError } from "../../types/auth";
import { cn } from "../../lib/utils";

interface SignUpFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  onNavigateToSignIn: () => void;
  onBackToMethods: () => void;
  isLoading?: boolean;
  serverError?: AuthError | null;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onNavigateToSignIn,
  onBackToMethods,
  isLoading = false,
  serverError,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const passwordEval = validatePassword(password);

  const getStrengthLabel = (score: number) => {
    if (!password) return { label: "", color: "bg-zinc-200" };
    if (score <= 1) return { label: "Weak", color: "bg-red-400" };
    if (score === 2) return { label: "Fair", color: "bg-amber-400" };
    if (score === 3) return { label: "Good", color: "bg-blue-400" };
    return { label: "Strong & Secure", color: "bg-[#94EC40]" };
  };

  const strength = getStrengthLabel(passwordEval.score);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ email: email.trim(), password });
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full space-y-4" noValidate>
      <Input
        label="Email address"
        type="email"
        placeholder="alex@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={errors.email || (serverError?.field === "email" ? serverError.message : undefined)}
        leftIcon={<Mail className="w-4 h-4" />}
        allowClear
        onClear={() => setEmail("")}
        disabled={isLoading}
        autoComplete="email"
        autoFocus
      />

      <div className="space-y-1.5">
        <Input
          label="Create Password"
          type="password"
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password || (serverError?.field === "password" ? serverError.message : undefined)}
          leftIcon={<Lock className="w-4 h-4" />}
          disabled={isLoading}
          autoComplete="new-password"
        />

        {password.length > 0 && (
          <div className="pt-1 space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 font-mono">Password strength</span>
              <span className="font-semibold text-zinc-800">{strength.label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    step <= passwordEval.score ? strength.color : "bg-zinc-100"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
        error={errors.confirmPassword}
        leftIcon={<Lock className="w-4 h-4" />}
        disabled={isLoading}
        autoComplete="new-password"
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
        Create Account & Continue
      </Button>

      <div className="space-y-3 pt-3 border-t border-zinc-100 text-center">
        <p className="text-xs sm:text-[13px] text-zinc-500 font-normal">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onNavigateToSignIn}
            className="font-[600] text-[rgb(18,18,18)] underline underline-offset-4 decoration-[#94EC40] decoration-2 hover:text-[#346415] hover:decoration-[#346415] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#94EC40] rounded"
          >
            Sign in
          </button>
        </p>

        <div>
          <button
            type="button"
            onClick={onBackToMethods}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[rgb(18,18,18)] transition-colors py-1 px-2.5 rounded-lg hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#94EC40]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All sign-in options</span>
          </button>
        </div>
      </div>
    </form>
  );
};
