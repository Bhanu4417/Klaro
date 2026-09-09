"use client";

import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthView, UserProfile, AuthError, SocialProvider } from "../../types/auth";
import { AuthShell } from "../../components/auth/AuthShell";
import { WelcomeView } from "../../components/auth/WelcomeView";
import { SignInForm } from "../../components/auth/SignInForm";
import { SignUpForm } from "../../components/auth/SignUpForm";
import { VerifyEmailForm } from "../../components/auth/VerifyEmailForm";
import { ForgotPasswordForm } from "../../components/auth/ForgotPasswordForm";
import { ResetSentView } from "../../components/auth/ResetSentView";
import { ProfileOnboarding } from "../../components/auth/ProfileOnboarding";
import { OfficerLoginForm } from "../../components/auth/OfficerLoginForm";
import { AuthenticatedAppPreview } from "../../components/preview/AuthenticatedAppPreview";
import { AuthErrorState } from "../../components/auth/AuthErrorState";
import { AuthLoadingState } from "../../components/auth/AuthLoadingState";
import { getUserProfile, saveUserProfile } from "../../actions/profile";

function setLoginStorage(active: boolean) {
  if (typeof window === "undefined") return;
  if (active) {
    localStorage.setItem("klaro_logged_in", "true");
    document.cookie = "klaro_logged_in=true; path=/; max-age=31536000; SameSite=Lax";
  } else {
    localStorage.removeItem("klaro_logged_in");
    localStorage.removeItem("klaro_admin_auth");
    document.cookie = "klaro_logged_in=; path=/; max-age=0; SameSite=Lax";
  }
}

export default function LoginPage() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const router = useRouter();

  const [view, setView] = useState<AuthView>("welcome");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("Connecting to Klaro...");
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isFramed, setIsFramed] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "",
    email: "",
    username: "",
    displayName: "",
    avatarUrl: "🥑",
    dietaryPreferences: ["Clean Label"],
    createdAt: "2026-08-25T00:00:00.000Z",
  });

  const [authEmail, setAuthEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAlreadyLoggedIn = localStorage.getItem("klaro_logged_in") === "true";
      const hasAdminAuth = !!localStorage.getItem("klaro_admin_auth");

      if (hasAdminAuth) {
        setLoadingMessage("Directing to administrator portal...");
        router.replace("/admin");
        return;
      }

      if (isAlreadyLoggedIn) {
        setLoadingMessage("Directing to dashboard...");
        router.replace("/dashboard");
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    async function syncSession() {
      if (!isUserLoaded) return;

      if (isSignedIn && user) {
        setLoginStorage(true);
        setIsLoading(true);
        setLoadingMessage("Directing to dashboard...");
        try {
          const profile = await getUserProfile();
          if (profile && profile.username) {
            setCurrentUser(profile);
          } else {
            const email = user.emailAddresses[0]?.emailAddress || "";
            const displayName = user.fullName || user.firstName || email.split("@")[0] || "User";
            const username = (user.username || email.split("@")[0] || `user_${user.id.slice(-6)}`).toLowerCase().replace(/[^a-z0-9_]/g, "");
            const avatarUrl = user.imageUrl || "🥑";

            saveUserProfile({
              username,
              displayName,
              avatarUrl,
              dietaryPreferences: ["Clean Label"],
            }).catch(() => {});
          }
        } catch (err) {
          console.error("Profile sync error:", err);
        } finally {
          router.replace("/dashboard");
        }
      } else if (isUserLoaded && !isSignedIn) {
        if (typeof window !== "undefined") {
          const hasAdmin = !!localStorage.getItem("klaro_admin_auth");
          const hasLocalLogin = localStorage.getItem("klaro_logged_in") === "true";
          if (!hasAdmin && !hasLocalLogin) {
            setIsLoading(false);
          } else if (!hasAdmin && hasLocalLogin) {
            setLoginStorage(false);
            setIsLoading(false);
          }
        }
      }
    }

    syncSession();
  }, [isUserLoaded, isSignedIn, user, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && view !== "welcome" && view !== "authenticated_preview") {
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view]);

  const handleBack = () => {
    setAuthError(null);
    if (view === "signin" || view === "signup" || view === "officer_login") {
      setView("welcome");
    } else if (view === "verify_email") {
      setView("signup");
    } else if (view === "forgot_password" || view === "reset_sent") {
      setView("signin");
    } else if (view === "onboarding") {
      setView("welcome");
    } else if (view === "authenticated_preview") {
      setView("welcome");
    }
  };

  const handleOfficerLogin = (credentials: { email: string; pass: string }) => {
    setIsLoading(true);
    setLoadingMessage("Authenticating administrator credentials...");
    setAuthError(null);

    try {
      if (
        credentials.email.toLowerCase() === "admin0529@gmail.com" &&
        credentials.pass === "131520@k"
      ) {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "klaro_admin_auth",
            JSON.stringify({
              email: "admin0529@gmail.com",
              displayName: "Chief Administrator",
              role: "Senior Controller of Legal Metrology",
              authenticatedAt: new Date().toISOString(),
            })
          );
        }
        setLoginStorage(true);
        router.push("/admin");
      } else {
        setAuthError({ message: "Invalid officer credentials. Access denied." });
      }
    } catch (err: any) {
      console.error("Officer login error:", err);
      setAuthError({ message: "Could not complete administrator authentication." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSocial = async (provider: SocialProvider) => {
    if (!clerk.loaded || !clerk.client) return;
    setSocialLoading(provider);
    setAuthError(null);

    const strategy = provider === "google" ? "oauth_google" : "oauth_github";

    try {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("OAuth signIn error, trying signUp fallback:", err);
      try {
        await clerk.client.signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        });
      } catch (fallbackErr: any) {
        setSocialLoading(null);
        setAuthError({
          message:
            fallbackErr.errors?.[0]?.longMessage ||
            fallbackErr.errors?.[0]?.message ||
            err.errors?.[0]?.message ||
            "Could not connect with social provider",
        });
      }
    }
  };

  const handleSignIn = async (data: { email: string; password: string }) => {
    if (!clerk.loaded || !clerk.client) return;
    setIsLoading(true);
    setLoadingMessage("Verifying credentials...");
    setAuthError(null);

    try {
      const result = await clerk.client.signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        setLoginStorage(true);
        await clerk.setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setAuthError({ message: "Additional verification required. Please check your account settings." });
      }
    } catch (err: any) {
      console.error("Sign In Error:", err);
      setAuthError({
        message: err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: { email: string; password: string }) => {
    if (!clerk.loaded || !clerk.client) return;
    setIsLoading(true);
    setLoadingMessage("Creating secure profile...");
    setAuthError(null);

    try {
      const signUpRes = await clerk.client.signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUpRes.prepareEmailAddressVerification({ strategy: "email_code" });
      setAuthEmail(data.email);
      setView("verify_email");
    } catch (err: any) {
      console.error("Sign Up Error:", err);
      setAuthError({
        message: err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Could not create account. Please check your details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (code: string) => {
    if (!clerk.loaded || !clerk.client) return;
    setIsLoading(true);
    setLoadingMessage("Verifying security code...");
    setAuthError(null);

    try {
      const completeSignUp = await clerk.client.signUp.attemptEmailAddressVerification({ code });

      if (completeSignUp.status === "complete") {
        setLoginStorage(true);
        await clerk.setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      } else {
        setAuthError({ message: "Verification incomplete. Please enter the correct code." });
      }
    } catch (err: any) {
      console.error("Verify Code Error:", err);
      setAuthError({
        message: err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Invalid code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!clerk.loaded || !clerk.client) return;
    try {
      await clerk.client.signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err: any) {
      setAuthError({
        message: err.errors?.[0]?.message || "Could not resend code. Please wait a moment.",
      });
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!clerk.loaded || !clerk.client) return;
    setIsLoading(true);
    setLoadingMessage("Sending password reset link...");
    setAuthError(null);

    try {
      await clerk.client.signIn.create({
        strategy: "reset_password_email_code" as any,
        identifier: email,
      });
      setResetEmail(email);
      setView("reset_sent");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setAuthError({
        message: err.errors?.[0]?.message || "Could not send reset link. Please check your email.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = async (profile: Partial<UserProfile>) => {
    setIsLoading(true);
    setLoadingMessage("Saving nutrition profile preferences...");
    setAuthError(null);

    try {
      const result = await saveUserProfile({
        username: profile.username || "",
        displayName: profile.displayName || "",
        avatarUrl: profile.avatarUrl || "🥑",
        dietaryPreferences: profile.dietaryPreferences || [],
      });

      if (!result.success) {
        throw new Error(result.error || "Could not save profile to Supabase");
      }

      setLoginStorage(true);

      setCurrentUser((prev) => ({
        ...prev,
        username: profile.username || prev.username,
        displayName: profile.displayName || prev.displayName,
        avatarUrl: profile.avatarUrl || prev.avatarUrl,
        dietaryPreferences: profile.dietaryPreferences || prev.dietaryPreferences,
      }));

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Save profile error:", err);
      setAuthError({
        message: err.message || "Failed to save profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setLoadingMessage("Signing out...");
    setLoginStorage(false);
    try {
      await clerk.signOut();
      setView("welcome");
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showBackButton = view !== "welcome" && view !== "authenticated_preview";

  return (
    <>
      <AuthShell
        view={view}
        showBack={showBackButton}
        onBack={handleBack}
        isFramed={isFramed}
      >
        <AuthErrorState
          error={authError}
          onDismiss={() => setAuthError(null)}
          onRetry={() => setAuthError(null)}
        />

        {isLoading ? (
          <AuthLoadingState message={loadingMessage} />
        ) : (
          <>
            {view === "welcome" && (
              <WelcomeView
                onSelectSocial={handleSelectSocial}
                onSelectEmail={() => {
                  setAuthError(null);
                  setView("signup");
                }}
                onDirectSignIn={() => {
                  setAuthError(null);
                  setView("signin");
                }}
                onOfficerLogin={() => {
                  setAuthError(null);
                  setView("officer_login");
                }}
                isLoadingSocial={socialLoading}
              />
            )}

            {view === "officer_login" && (
              <OfficerLoginForm
                onSubmit={handleOfficerLogin}
                onBack={() => {
                  setAuthError(null);
                  setView("welcome");
                }}
                serverError={authError}
              />
            )}

            {view === "signin" && (
              <SignInForm
                onSubmit={handleSignIn}
                onForgotPassword={() => {
                  setAuthError(null);
                  setView("forgot_password");
                }}
                onNavigateToSignUp={() => {
                  setAuthError(null);
                  setView("signup");
                }}
                onBackToMethods={() => {
                  setAuthError(null);
                  setView("welcome");
                }}
                serverError={authError}
              />
            )}

            {view === "signup" && (
              <SignUpForm
                onSubmit={handleSignUp}
                onNavigateToSignIn={() => {
                  setAuthError(null);
                  setView("signin");
                }}
                onBackToMethods={() => {
                  setAuthError(null);
                  setView("welcome");
                }}
                serverError={authError}
              />
            )}

            {view === "verify_email" && (
              <VerifyEmailForm
                email={authEmail}
                onVerify={handleVerifyEmail}
                onResend={handleResendCode}
                serverError={authError}
              />
            )}

            {view === "forgot_password" && (
              <ForgotPasswordForm
                onSubmit={handleForgotPassword}
                onBackToSignIn={() => {
                  setAuthError(null);
                  setView("signin");
                }}
                serverError={authError}
              />
            )}

            {view === "reset_sent" && (
              <ResetSentView
                email={resetEmail}
                onResend={() => handleForgotPassword(resetEmail)}
                onBackToSignIn={() => {
                  setAuthError(null);
                  setView("signin");
                }}
              />
            )}

            {view === "onboarding" && (
              <ProfileOnboarding
                email={authEmail}
                onComplete={handleCompleteOnboarding}
              />
            )}

            {view === "authenticated_preview" && (
              <AuthenticatedAppPreview
                user={currentUser}
                onSignOut={handleSignOut}
              />
            )}
          </>
        )}
      </AuthShell>
    </>
  );
}
