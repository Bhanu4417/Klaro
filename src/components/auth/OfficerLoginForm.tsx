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

const OfficerCustomBadgeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16.3083 4.38394C15.7173 4.38394 15.4217 4.38394 15.1525 4.28405C15.1151 4.27017 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1922 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8077 2.52977 9.84585 3.49166C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27017 8.84747 4.28405C8.57825 4.38394 8.28273 4.38394 7.69171 4.38394H7.58269C6.07478 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07478 4.38394 7.58269V7.69171C4.38394 8.28273 4.38394 8.57825 4.28405 8.84747C4.27017 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49166 9.84585C2.52977 10.8077 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1922 3.49166 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27017 15.1151 4.28405 15.1525C4.38394 15.4217 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07478 19.6161 7.58269 19.6161H7.69171C8.28273 19.6161 8.57825 19.6161 8.84747 19.7159C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8077 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.04 22.0015 12.1195 21.9955C12.7113 21.9512 13.1922 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.7159C15.4217 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4217 19.7159 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1922 21.9512 12.7113 21.9955 12.1195C22.0015 12.04 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8077 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.7159 8.84747C19.6161 8.57825 19.6161 8.28273 19.6161 7.69171V7.58269C19.6161 6.07478 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083Z" />
    <path d="M8.5 16.5C9.19863 15.2923 10.5044 14.4797 12 14.4797C13.4956 14.4797 14.8014 15.2923 15.5 16.5M14 10C14 11.1046 13.1046 12 12 12C10.8955 12 10 11.1046 10 10C10 8.89544 10.8955 8.00001 12 8.00001C13.1046 8.00001 14 8.89544 14 10Z" strokeLinecap="round" />
  </svg>
);

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
      <div className="text-center space-y-2 pb-2">
        <div className="flex items-center justify-center mx-auto mb-3">
          <OfficerCustomBadgeIcon className="w-14 h-14 text-[#346415]" />
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
        <label className="text-xs font-bold text-zinc-700 block">Security Key / Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4 text-zinc-400" />}
          required
        />
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
