"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getServiceSupabase } from "../lib/supabase";
import { uploadToCloudinary } from "../lib/cloudinary";

export interface DBReport {
  id: string;
  author_id?: string;
  author_name: string;
  author_badge: string;
  author_avatar: string;
  author_zone: string;
  title: string;
  commodity: string;
  brand: string;
  rule_code: string;
  rule_label: string;
  severity: "high" | "medium" | "critical" | "low";
  description: string;
  image_url?: string;
  evidence_label_region?: string;
  evidence_ocr_snippet?: string;
  evidence_flag_reason?: string;
  evidence_measured_value?: string;
  evidence_required_value?: string;
  upvotes: number;
  downvotes: number;
  status: "Under Review" | "Notice Drafted" | "Compounded";
  created_at: string;
  comments?: any[];
  audit_report?: any;
  user_votes?: Record<string, "up" | "down">;
}

/**
 * Fetch all live community reports
 */
export async function getLiveReports(): Promise<DBReport[]> {
  const supabase = getServiceSupabase();
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as DBReport[];
  } catch {
    return [];
  }
}

/**
 * Save a new inspection report to Cloudinary & Supabase.
 * The full audit dossier (all issues) is persisted in `audit_report`;
 * the image is uploaded to Cloudinary and only its URL is stored.
 */
export async function createInspectionReport(reportInput: {
  imageUrl?: string | null;
  title: string;
  commodity: string;
  brand: string;
  ruleCode: string;
  ruleLabel: string;
  severity: "high" | "medium" | "critical" | "low";
  description: string;
  auditReport?: any;
  evidence?: {
    labelRegion?: string;
    ocrSnippet?: string;
    flagReason?: string;
    measuredValue?: string;
    requiredValue?: string;
  };
}): Promise<{ success: boolean; report?: DBReport; error?: string }> {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    const authorName = user?.fullName || user?.firstName || "Community Inspector";
    const authorAvatar = user?.imageUrl || "🥑";
    const authorZone = "Your Zone";

    // 1. Upload image to Cloudinary (cloud: dzkdfwh1v) — persist ONLY the Cloudinary https URL
    let uploadedImageUrl = "";
    if (reportInput.imageUrl && (reportInput.imageUrl.startsWith("data:") || reportInput.imageUrl.startsWith("blob:"))) {
      const uploadRes = await uploadToCloudinary(reportInput.imageUrl);
      if (uploadRes.success && uploadRes.secure_url?.startsWith("https://")) {
        uploadedImageUrl = uploadRes.secure_url;
      }
    } else if (reportInput.imageUrl?.startsWith("https://")) {
      uploadedImageUrl = reportInput.imageUrl;
    }

    const reportId = `rep-${Date.now()}`;
    const newReport: DBReport = {
      id: reportId,
      author_id: userId || undefined,
      author_name: authorName,
      author_badge: "Community Inspector",
      author_avatar: authorAvatar,
      author_zone: authorZone,
      title: reportInput.title,
      commodity: reportInput.commodity,
      brand: reportInput.brand,
      rule_code: reportInput.ruleCode,
      rule_label: reportInput.ruleLabel,
      severity: reportInput.severity,
      description: reportInput.description,
      image_url: uploadedImageUrl,
      evidence_label_region: reportInput.evidence?.labelRegion,
      evidence_ocr_snippet: reportInput.evidence?.ocrSnippet,
      evidence_flag_reason: reportInput.evidence?.flagReason,
      evidence_measured_value: reportInput.evidence?.measuredValue,
      evidence_required_value: reportInput.evidence?.requiredValue,
      upvotes: 0,
      downvotes: 0,
      status: "Under Review",
      created_at: new Date().toISOString(),
      comments: [],
      audit_report: reportInput.auditReport ?? null,
      user_votes: {},
    };

    // 2. Persist to Supabase — retry without audit_report if the column is missing
    const supabase = getServiceSupabase();
    let insertError: string | null = null;
    try {
      const { data, error } = await supabase
        .from("reports")
        .insert(newReport)
        .select()
        .single();
      if (!error && data) {
        return { success: true, report: data as DBReport };
      }
      insertError = error?.message || "unknown insert error";
      console.error("[reports] Insert failed:", insertError);

      // Column missing on legacy schema — retry with only the base fields
      const { audit_report, user_votes, ...baseReport } = newReport;
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("reports")
        .insert(baseReport)
        .select()
        .single();
      if (!fallbackError && fallbackData) {
        return { success: true, report: fallbackData as DBReport };
      }
      console.error("[reports] Fallback insert failed:", fallbackError?.message);
      return { success: false, error: fallbackError?.message || insertError };
    } catch (err: any) {
      console.error("[reports] Supabase save threw:", err?.message);
      return { success: false, error: err?.message || insertError };
    }
  } catch (err: any) {
    console.error("Failed to create report:", err);
    return { success: false, error: err?.message };
  }
}

/**
 * Persist an upvote/downvote for the signed-in user.
 * `next` is the desired end state ("up" | "down" | null = cleared).
 */
export async function voteReport(
  reportId: string,
  next: "up" | "down" | null
): Promise<{ success: boolean; upvotes?: number; downvotes?: number; userVote?: "up" | "down" | null }> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false };

    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("reports")
      .select("upvotes, downvotes, user_votes")
      .eq("id", reportId)
      .single();

    if (!data) return { success: false };

    const votes = (data.user_votes || {}) as Record<string, "up" | "down">;
    const prev = votes[userId] || null;

    let upDelta = 0;
    let downDelta = 0;
    if (prev === "up" && next !== "up") upDelta -= 1;
    if (prev === "down" && next !== "down") downDelta -= 1;
    if (next === "up" && prev !== "up") upDelta += 1;
    if (next === "down" && prev !== "down") downDelta += 1;

    if (next) votes[userId] = next;
    else delete votes[userId];

    const upvotes = Math.max(0, (data.upvotes || 0) + upDelta);
    const downvotes = Math.max(0, (data.downvotes || 0) + downDelta);

    const { error } = await supabase
      .from("reports")
      .update({ upvotes, downvotes, user_votes: votes })
      .eq("id", reportId);

    if (error) return { success: false };
    return { success: true, upvotes, downvotes, userVote: next };
  } catch (err: any) {
    console.error("Failed to persist vote:", err);
    return { success: false };
  }
}

/**
 * Append an officer comment to a report's comment thread in Supabase
 */
export async function addReportComment(
  reportId: string,
  comment: { id: string; author: string; authorRole: string; avatar: string; timeAgo: string; text: string }
): Promise<{ success: boolean }> {
  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("reports")
      .select("comments")
      .eq("id", reportId)
      .single();

    if (!data) return { success: false };

    const comments = Array.isArray(data.comments) ? [...data.comments, comment] : [comment];
    const { error } = await supabase
      .from("reports")
      .update({ comments })
      .eq("id", reportId);

    return { success: !error };
  } catch (err: any) {
    console.error("Failed to persist comment:", err);
    return { success: false };
  }
}

/**
 * Delete a report by id (owner-initiated from My Recent Filed Reports)
 */
export async function deleteReport(reportId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getServiceSupabase();
    await supabase.from("reports").delete().eq("id", reportId);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete report:", err);
    return { success: false, error: err?.message };
  }
}
