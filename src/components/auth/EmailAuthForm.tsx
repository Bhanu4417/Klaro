"use client";

import React, { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { AuthError } from "../../types/auth";

interface EmailAuthFormProps {
  initialMode?: "signin" | "signup";
  onSignInSuccess: (data: { email: string }) => void;
  onSignUpSuccess: (data: { email: string }) => void;
  onForgotPassword: () => void;
  onBackToMethods: () => void;
  isLoading?: boolean;
  serverError?: AuthError | null;
}

export const EmailAuthForm: React.FC<EmailAuthFormProps> = ({
  initialMode = "signin",
  onSignInSuccess,
  onSignUpSuccess,
  onForgotPassword,
  onBackToMethods,
  isLoading = false,
  serverError,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 p-1 mb-5 bg-zinc-100 rounded-xl border border-zinc-200/60 select-none">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`py-2 text-xs font-[600] rounded-lg transition-all ${
            mode === "signin"
              ? "bg-[#94EC40] text-[rgb(18,18,18)] shadow-[0_1px_3px_rgba(148,236,64,0.3)] font-semibold"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`py-2 text-xs font-[600] rounded-lg transition-all ${
            mode === "signup"
              ? "bg-[#94EC40] text-[rgb(18,18,18)] shadow-[0_1px_3px_rgba(148,236,64,0.3)] font-semibold"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          Create account
        </button>
      </div>

      {mode === "signin" ? (
        <SignInForm
          onSubmit={(data) => onSignInSuccess({ email: data.email })}
          onForgotPassword={onForgotPassword}
          onNavigateToSignUp={() => setMode("signup")}
          onBackToMethods={onBackToMethods}
          isLoading={isLoading}
          serverError={serverError}
        />
      ) : (
        <SignUpForm
          onSubmit={(data) => onSignUpSuccess({ email: data.email })}
          onNavigateToSignIn={() => setMode("signin")}
          onBackToMethods={onBackToMethods}
          isLoading={isLoading}
          serverError={serverError}
        />
      )}
    </div>
  );
};
