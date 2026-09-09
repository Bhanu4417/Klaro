"use client";

import React, { useState } from "react";
import { User, AtSign, Camera, Check, Sparkles, ArrowRight, Upload } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateUsername } from "../../lib/utils";
import { UserProfile } from "../../types/auth";
import confetti from "canvas-confetti";

interface ProfileOnboardingProps {
  email: string;
  onComplete: (profile: Partial<UserProfile>) => void;
  isLoading?: boolean;
}

const AVATAR_PRESETS = ["🥑", "🥗", "☕", "🥐", "🫐", "🌱"];
const DIETARY_PRESETS = [
  "Clean Label",
  "High Protein",
  "Plant Based",
  "Gluten Free",
  "Low Sugar",
  "Organic",
];

export const ProfileOnboarding: React.FC<ProfileOnboardingProps> = ({
  email,
  onComplete,
  isLoading = false,
}) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🥑");
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<string[]>(["Clean Label"]);
  const [errors, setErrors] = useState<{ username?: string; displayName?: string }>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: string; displayName?: string } = {};

    const cleanUsername = username.replace(/^@/, "").trim();
    const usernameCheck = validateUsername(cleanUsername);
    if (!usernameCheck.isValid) {
      newErrors.username = usernameCheck.error;
    }

    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2C7850", "#65B288", "#18181B", "#C4E3D0"],
      });
    } catch {
    }

    setErrors({});
    onComplete({
      email,
      username: `@${cleanUsername}`,
      displayName: displayName.trim(),
      avatarUrl: customAvatarPreview || selectedAvatar,
      dietaryPreferences: selectedDietary,
    });
  };

  const cleanUsername = username.replace(/^@/, "").trim();
  const isUsernameValid = cleanUsername.length >= 3 && /^[a-zA-Z0-9_]+$/.test(cleanUsername);

  return (
    <form onSubmit={handleFormSubmit} className="w-full space-y-5 text-left" noValidate>
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative group">
          <div className="w-20 h-20 rounded-3xl bg-paper-100 border-2 border-paper-300 flex items-center justify-center text-3xl shadow-tactile-sm overflow-hidden select-none">
            {customAvatarPreview ? (
              <img
                src={customAvatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{selectedAvatar}</span>
            )}
          </div>

          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-charcoal-900 text-white shadow-tactile-sm cursor-pointer hover:bg-charcoal-800 transition-colors"
            title="Upload custom image"
          >
            <Camera className="w-3.5 h-3.5" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </label>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-paper-100 border border-paper-200">
          {AVATAR_PRESETS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setCustomAvatarPreview(null);
                setSelectedAvatar(emoji);
              }}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm transition-all ${
                !customAvatarPreview && selectedAvatar === emoji
                  ? "bg-white shadow-tactile-sm scale-110"
                  : "hover:bg-paper-200 opacity-70 hover:opacity-100"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <div className="relative">
          <Input
            label="Community Username"
            type="text"
            placeholder="alexcooks"
            value={username}
            onChange={(e) => {
              const val = e.target.value.replace(/^@/, "");
              setUsername(val);
              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            error={errors.username}
            leftIcon={<AtSign className="w-4 h-4" />}
            helperText="Your handle for posting food scans & community notes."
            disabled={isLoading}
            autoFocus
          />

          {isUsernameValid && !errors.username && (
            <div className="absolute right-3 top-8.5 flex items-center gap-1 text-[11px] font-semibold text-[#346415] bg-[#EAFBD9] px-2 py-0.5 rounded-full border border-[#B8F27D] animate-fade-in">
              <Check className="w-3 h-3 text-[#417F14]" />
              <span>Available</span>
            </div>
          )}
        </div>
      </div>

      <Input
        label="Display Name"
        type="text"
        placeholder="Alex Morgan"
        value={displayName}
        onChange={(e) => {
          setDisplayName(e.target.value);
          if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: undefined }));
        }}
        error={errors.displayName}
        leftIcon={<User className="w-4 h-4" />}
        disabled={isLoading}
      />

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-600 select-none block">
            Scan Dietary Focus (Optional)
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DIETARY_PRESETS.map((item) => {
            const isSelected = selectedDietary.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleDietary(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all select-none border ${
                  isSelected
                    ? "bg-[#94EC40] text-[rgb(18,18,18)] border-[#83D634] font-semibold shadow-[0_1px_3px_rgba(148,236,64,0.3)]"
                    : "bg-zinc-100 text-zinc-700 border-zinc-200/60 hover:bg-zinc-200/70"
                }`}
              >
                {isSelected && <span className="mr-1 text-[rgb(18,18,18)]">✓</span>}
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="mt-3 font-[600]"
      >
        Complete Setup & Open Feed
      </Button>
    </form>
  );
};
