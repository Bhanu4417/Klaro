export type AuthView =
  | "welcome"
  | "signin"
  | "signup"
  | "officer_login"
  | "verify_email"
  | "forgot_password"
  | "reset_sent"
  | "onboarding"
  | "authenticated_preview";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  dietaryPreferences: string[];
  createdAt: string;
}

export interface AuthError {
  field?: string;
  message: string;
}

export type SocialProvider = "google" | "github" | "apple";

export interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number;
}
