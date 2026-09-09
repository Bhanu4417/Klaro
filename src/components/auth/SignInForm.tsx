"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateEmail } from "../../lib/utils";
import { AuthError } from "../../types/auth";

interface SignInFormProps {
  onSubmit: (data: { email: string; password: string; rememberMe: boolean }) => void;
  onForgotPassword: () => void;
  onNavigateToSignUp: () => void;
  onBackToMethods: () => void;
  isLoading?: boolean;
  serverError?: AuthError | null;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  onForgotPassword,
  onNavigateToSignUp,
  onBackToMethods,
  isLoading = false,
  serverError,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ email: email.trim(), password, rememberMe });
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

      <div className="space-y-1">
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password || (serverError?.field === "password" ? serverError.message : undefined)}
          leftIcon={<Lock className="w-4 h-4" />}
          disabled={isLoading}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-[rgb(18,18,18)] focus:ring-[#94EC40] cursor-pointer accent-[#94EC40]"
            />
            <span className="font-normal text-zinc-700">Keep me signed in</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="font-[600] text-zinc-600 hover:text-[rgb(18,18,18)] underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#94EC40] rounded"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="mt-2 font-[600]"
      >
        Sign in to Klaro
      </Button>

      <div className="space-y-3 pt-3 border-t border-zinc-100 text-center">
        <p className="text-xs sm:text-[13px] text-zinc-500 font-normal">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="font-[600] text-[rgb(18,18,18)] underline underline-offset-4 decoration-[#94EC40] decoration-2 hover:text-[#346415] hover:decoration-[#346415] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#94EC40] rounded"
          >
            Sign up
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
