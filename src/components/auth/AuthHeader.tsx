"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KlaroBot } from "./KlaroBot";
import { AuthView } from "../../types/auth";
import { cn } from "../../lib/utils";

interface AuthHeaderProps {
  view: AuthView;
  className?: string;
}

const SPEECH_LINES = [
  "Psst — login first! I don't make the rules.",
  "Want to check what's really in your food?",
  "I can sniff out hidden additives in seconds.",
  "Scan the barcode, I'll do the detective work.",
  "That 'healthy' snack might be lying to you.",
  "I've read the labels so you don't have to.",
  "MRP tricks? I catch those every single day.",
  "Login and I'll remember everything you scan.",
  "Your food journal is waiting on the other side.",
  "Fresh ingredients or fine print — I'll tell you.",
  "Know what you eat before it knows you back.",
  "I once caught a juice with nine hidden sugars.",
  "Scanning is caring — for your own health.",
  "Login first, then we hunt misleading labels.",
  "I speak fluent ingredient-list. Truly.",
  "The community feed is full of food finds.",
  "One little scan can save your whole meal.",
  "I'm basically a nutrition detective, really.",
  "Hunger is temporary, label-checking is forever.",
  "Sign in — your stomach will thank you later.",
];

const OFFICER_SPEECH_LINES = [
  "Aye aye, sir!",
  "Scanning the perimeter, sir.",
  "Labels under inspection, sir!",
  "No smuggled sugars on my watch.",
  "Officer mode: engaged.",
  "Every MRP cross-checked, sir!",
  "Requesting permission to scan, sir.",
  "All snacks suspicious until proven healthy.",
  "Patrolling the shelves, sir.",
  "I have clearance for classified kitchens.",
  "Status: hungry for justice, sir.",
  "Discipline in every ingredient, sir.",
  "All clear on the snacks front, sir.",
  "Sir, yes sir!",
];

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

  const getBotState = () => {
    switch (view) {
      case "welcome":
        return "idle";
      case "signin":
      case "signup":
      case "onboarding":
        return "typing";
      case "officer_login":
        return "idle";
      case "verify_email":
        return "typing";
      case "forgot_password":
      case "reset_sent":
        return "peek";
      case "authenticated_preview":
        return "happy";
      default:
        return "idle";
    }
  };

  return (
    <div className={cn("text-center flex flex-col items-center select-none", className)}>
      <div className="mb-2 transition-transform duration-200 hover:scale-105">
        <KlaroBot
          size="md"
          state={getBotState()}
          showShadow={true}
          interactive={true}
          speech={view === "officer_login" ? OFFICER_SPEECH_LINES : SPEECH_LINES}
          speechTone={view === "officer_login" ? "officer" : "standard"}
        />
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
