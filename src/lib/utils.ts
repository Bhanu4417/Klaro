import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PasswordValidation } from "../types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validatePassword(password: string): PasswordValidation {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const passedChecks = [hasMinLength, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length;

  return {
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    score: passedChecks,
  };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username) return { isValid: false, error: "Username is required" };
  if (username.length < 3) return { isValid: false, error: "Must be at least 3 characters" };
  if (username.length > 20) return { isValid: false, error: "Must be at most 20 characters" };
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: "Only letters, numbers, and underscores allowed" };
  }
  return { isValid: true };
}
