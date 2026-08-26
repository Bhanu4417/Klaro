"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getServiceSupabase } from "../lib/supabase";
import { UserProfile } from "../types/auth";

export async function getUserProfile(): Promise<UserProfile | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    username: data.username || "",
    displayName: data.display_name || "",
    avatarUrl: data.avatar_url || "🥑",
    dietaryPreferences: data.dietary_preferences || [],
    createdAt: data.created_at || new Date().toISOString(),
  };
}

export async function saveUserProfile(profileData: {
  username: string;
  displayName: string;
  avatarUrl: string;
  dietaryPreferences: string[];
}): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const email = user.emailAddresses[0]?.emailAddress || "";
  const supabase = getServiceSupabase();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email,
      username: profileData.username,
      display_name: profileData.displayName,
      avatar_url: profileData.avatarUrl,
      dietary_preferences: profileData.dietaryPreferences,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Supabase profile save error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
