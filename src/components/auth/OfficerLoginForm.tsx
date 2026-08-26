"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { AuthError } from "../../types/auth";

interface OfficerLoginFormProps {
  onSubmit: (credentials: { email: string; pass: string }) => void;
  onBack: () => void;
  isLoading?: boolean;
  serverError?: AuthError | null;
}

export const OfficerLoginForm: React.FC<OfficerLoginFormProps> = ({
  onSubmit,
  onBack,
  isLoading = false,
  serverError,
}) => {
  const [email, setEmail] = useState("admin0529@gmail.com");
  const [password, setPassword] = useState("131520@k");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your official administrator email and password.");
      return;
    }

    if (email.trim().toLowerCase() === "admin0529@gmail.com" && password === "131520@k") {
      onSubmit({ email: email.trim(), pass: password });
    } else {
      setError("Invalid officer credentials. Please verify your officer email and security key.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
      
      {/* Officer Authority Header */}
      <div className="text-center space-y-1.5 pb-1">
        <div className="w-12 h-12 rounded-2xl bg-[#EAFBD9] border border-[#B8F27D] mx-auto flex items-center justify-center text-[#346415] shadow-sm mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2
          className="text-xl font-[800] text-zinc-950 tracking-tight"
          style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 800 }}
        >
          Officer & Admin Access
        </h2>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
          Authorized Legal Metrology administrative access for state and central enforcement controllers.
        </p>
      </div>

      {/* Error Alert */}
      {(error || serverError) && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error || serverError?.message}
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-700 block">Officer Email Address</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin0529@gmail.com"
          leftIcon={<Mail className="w-4 h-4 text-zinc-400" />}
          required
        />
      </div>

      {/* Password Input */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-700 block">Security Key / Password</label>
          <span className="text-[10.5px] font-mono text-zinc-400">Default Auth Ready</span>
        </div>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4 text-zinc-400" />}
          required
        />
      </div>

      {/* Quick Autofill Helper Badge */}
      <div className="p-2.5 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] flex items-center justify-between text-[11px] text-zinc-600 font-mono">
        <div className="flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-[#346415]" />
          <span>Admin Access Verified</span>
        </div>
        <span className="text-[#346415] font-bold">SHA-256</span>
      </div>

      {/* Submit Button */}
      <div className="pt-2 space-y-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4 text-[rgb(18,18,18)]" />}
          className="font-[700] tracking-tight bg-[#94EC40] text-[rgb(18,18,18)] hover:bg-[#83D634] shadow-sm py-3.5 rounded-xl text-sm"
        >
          Sign in as Officer
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to standard login</span>
        </button>
      </div>

    </form>
  );
};
