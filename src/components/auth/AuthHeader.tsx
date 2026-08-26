"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../ui/Logo";
import { AuthView } from "../../types/auth";
import { cn } from "../../lib/utils";

interface AuthHeaderProps {
  view: AuthView;
  className?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ view, className }) => {
  const getHeaderContent = () => {
    switch (view) {
      case "welcome":
        return {
          title: "Know what you're eating.",
          subtitle: "Scan packaged food, uncover hidden additives, and track your daily nutrition with AI.",
        };
      case "signin":
        return {
          title: "Sign in to Klaro",
          subtitle: "Access your saved food scripts, barcode logs, and community feed.",
        };
      case "signup":
        return {
          title: "Create your account",
          subtitle: "Start scanning ingredients and making healthier everyday choices.",
        };
      case "verify_email":
        return {
          title: "Verify your email",
          subtitle: "Enter the verification code sent to your inbox to activate your account.",
        };
      case "forgot_password":
        return {
          title: "Reset your password",
          subtitle: "Enter the email associated with your account and we'll send a secure reset link.",
        };
      case "reset_sent":
        return {
          title: "Reset link dispatched",
          subtitle: "We have sent password reset instructions to your email address.",
        };
      case "onboarding":
        return {
          title: "Let's create your profile.",
          subtitle: "Set up your public identity for food discoveries and community reviews.",
        };
      case "officer_login":
        return {
          title: "Officer & Admin Portal",
          subtitle: "Legal Metrology administrative access and enforcement panel.",
        };
      case "authenticated_preview":
        return {
          title: "Welcome to your feed",
          subtitle: "Your personal food discovery and scan activity journal.",
        };
    }
  };

  const content = getHeaderContent();

  return (
    <div className={cn("text-center flex flex-col items-center select-none", className)}>
      <div className="mb-2 transition-transform duration-200 hover:scale-105">
        <Logo size="md" showText={false} variant="charcoal" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="space-y-2 max-w-sm mx-auto"
        >
          <h1
            className="text-[24px] leading-[34px] sm:text-[31px] sm:leading-[46px] font-[600] tracking-[-0.015em] text-[rgb(18,18,18)]"
            style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 600 }}
          >
            {content.title}
          </h1>
          <p
            className="text-xs sm:text-[14px] sm:leading-[22px] text-zinc-500 max-w-xs sm:max-w-sm mx-auto"
            style={{ fontFamily: 'saans, "saans Fallback", sans-serif' }}
          >
            {content.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
