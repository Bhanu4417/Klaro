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

export async function voteReport(
  reportId: string,
  next: "up" | "down" | null,
  voterKey?: string
): Promise<{ success: boolean; upvotes?: number; downvotes?: number; userVote?: "up" | "down" | null }> {
  try {
    const { userId } = await auth();
    const voter = userId || voterKey;
    if (!voter) return { success: false };

    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("reports")
      .select("upvotes, downvotes, user_votes")
      .eq("id", reportId)
      .single();

    if (!data) return { success: false };

    const votes = (data.user_votes || {}) as Record<string, "up" | "down">;
    const prev = votes[voter] || null;

    let upDelta = 0;
    let downDelta = 0;
    if (prev === "up" && next !== "up") upDelta -= 1;
    if (prev === "down" && next !== "down") downDelta -= 1;
    if (next === "up" && prev !== "up") upDelta += 1;
    if (next === "down" && prev !== "down") downDelta += 1;

    if (next) votes[voter] = next;
    else delete votes[voter];

    const upvotes = (data.upvotes || 0) + upDelta;
    const downvotes = (data.downvotes || 0) + downDelta;

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

export async function addReportComment(
  reportId: string,
  comment: {
    id: string;
    author: string;
    authorRole: string;
    avatar: string;
    timeAgo: string;
    text: string;
    replyTo?: { id: string; author: string };
  }
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

export async function deleteReportComment(
  reportId: string,
  commentId: string
): Promise<{ success: boolean; deletedCount?: number }> {
  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("reports")
      .select("comments")
      .eq("id", reportId)
      .single();

    if (!data || !Array.isArray(data.comments)) return { success: false };

    const remaining = data.comments.filter(
      (c: any) => c.id !== commentId && c.replyTo?.id !== commentId
    );
    const deletedCount = data.comments.length - remaining.length;
    if (deletedCount === 0) return { success: true, deletedCount: 0 };

    const { error } = await supabase
      .from("reports")
      .update({ comments: remaining })
      .eq("id", reportId);

    return { success: !error, deletedCount };
  } catch (err: any) {
    console.error("Failed to delete comment:", err);
    return { success: false };
  }
}

const SEED_AVATARS = ["🥑", "🥗", "☕", "🥐", "🫐", "🌱"];

const FOOD_IMAGE = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

const seedComment = (
  n: number,
  reportId: string,
  author: string,
  authorRole: string,
  avatar: string,
  timeAgo: string,
  text: string,
  replyTo?: { id: string; author: string }
) => ({
  id: `${reportId}-c${n}`,
  author,
  authorRole,
  avatar,
  timeAgo,
  text,
  ...(replyTo ? { replyTo } : {}),
});

export async function seedDemoReports(): Promise<{ seeded: boolean }> {
  try {
    const supabase = getServiceSupabase();

    await supabase.from("reports").delete().like("id", "rep-demo-%");

    const { data: existingSeed } = await supabase
      .from("reports")
      .select("id")
      .like("id", "rep-seed-%")
      .limit(1);
    if (existingSeed && existingSeed.length > 0) return { seeded: false };

    const now = Date.now();
    const postedAt = (hoursAgo: number) =>
      new Date(now - Math.round(hoursAgo * 3600_000 + Math.random() * 2400_000)).toISOString();

    const seed = [
      {
        author_name: "Riya Sharma", avatar: SEED_AVATARS[0], zone: "New Delhi",
        title: "Missing month & year of manufacture on juice bottle",
        commodity: "Mixed Fruit Juice 1L", brand: "FreshKo", img: "1546069901-ba9599a7e63c",
        rule_code: "Rule 6(1)(e)", rule_label: "Non-declaration of Month & Year", severity: "medium",
        description: "The bottle label carries no month & year of manufacture anywhere — checked the shoulder, base and back panel. Rule 6(1)(e) requires it on every prepackaged label.",
        evidence: { region: "Back panel, below nutrition table", ocr: "BEST BEFORE 6 MONTHS … MRP ₹90 (incl. of all taxes)", reason: "No 'MFG [MM/YYYY]' declaration found in OCR output", measured: "Not printed", required: "Month & year of manufacture, e.g. MFG 08/2026" },
        up: 34, down: 2, status: "Under Review" as const, hours: 5,
        comments: [
          ["Kabir Mehta", "Community Inspector", "Same brand from my local store — mine has the MFG date smudged beyond reading.", 3],
          ["Officer Ananya R.", "Legal Metrology Officer", "Logged for the next inspection cycle. Keep the bottle till the notice is served.", 2],
        ],
      },
      {
        author_name: "Arjun Patel", avatar: SEED_AVATARS[1], zone: "Ahmedabad",
        title: "Net quantity printed in smaller font than MRP",
        commodity: "Instant Noodles 70g", brand: "slurpO", img: "1585032226651-759b368d7246",
        rule_code: "Rule 6(1)(d)", rule_label: "Net Quantity Declaration Violation", severity: "high",
        description: "Net quantity (70g) is printed in ~1.5mm numerals while the MRP is 5mm — the declaration is not prominent as required. Standard numerical height for this pack size is 3mm minimum.",
        evidence: { region: "Front face, bottom-left corner", ocr: "Net Qty. 70g  MRP ₹14.00", reason: "Net-quantity numeral height ~1.5mm vs required 3.0mm", measured: "1.5mm numeral height", required: "≥ 3.0mm numeral height (70–200g pack)" },
        up: 52, down: 3, status: "Notice Drafted" as const, hours: 11,
        comments: [
          ["Meera J.", "Community Inspector", "Mine measures the same — took a caliper to it and it's under 2mm for sure.", 8],
          ["Harsh V.", "Community Member", "The MRP is printed so much bolder, it's clearly bait pricing.", 6],
          ["Officer Ananya R.", "Legal Metrology Officer", "Photograph the pack with a ruler in frame — that becomes conclusive evidence.", 4],
        ],
      },
      {
        author_name: "Meera Nair", avatar: SEED_AVATARS[2], zone: "Kochi",
        title: "No storage instructions on packaged plum fruit cake",
        commodity: "Plum Fruit Cake 400g", brand: "BakeHarvest", img: "1509440159596-0249088772ff",
        rule_code: "Rule 6(1)(h)", rule_label: "Care Instruction Declaration Missing", severity: "medium",
        description: "The pack carries zero storage or handling guidance — no 'store in a cool, dry place', nothing about consuming within days of opening. Rule 6(1)(h) mandates care instructions on such packages.",
        evidence: { region: "Rear pack panel", ocr: "BAKEHARVEST PLUM CAKE … 400g … MRP ₹160", reason: "OCR found no storage or handling statements", measured: "0 care statements", required: "Storage / handling declarations" },
        up: 19, down: 1, status: "Under Review" as const, hours: 26,
        comments: [
          ["Devika P.", "Community Inspector", "Bakery packs always skip this. Reported their 800g one last month too.", 20],
        ],
      },
      {
        author_name: "Kunal Bisht", avatar: SEED_AVATARS[3], zone: "Lucknow",
        title: "Vegetarian logo missing on new paneer pack design",
        commodity: "Malai Paneer 200g", brand: "DairyPure", img: "1512621776951-a57141f2eefd",
        rule_code: "Rule 6(1)(g)", rule_label: "Veg Symbol Non-display", severity: "high",
        description: "The redesigned pack dropped the green dot entirely — the symbol must be within 2mm of the product name and legible. Old stock had it, new batch doesn't.",
        evidence: { region: "Front face, near product name", ocr: "MALAI PANEER … KEEP REFRIGERATED … MRP ₹75", reason: "No green dot detected in the front-face crop", measured: "Symbol absent", required: "Veg logo within 2mm of product name" },
        up: 41, down: 0, status: "Under Review" as const, hours: 30,
        comments: [
          ["Simran K.", "Community Inspector", "Even my family noticed — the new design hides everything except the MRP.", 26],
          ["Rohit S.", "Community Member", "This is a serious one for vegetarians, hope it gets escalated fast.", 22],
        ],
      },
      {
        author_name: "Sneha Reddy", avatar: SEED_AVATARS[4], zone: "Hyderabad",
        title: "Ingredient list not in descending order of quantity",
        commodity: "Tomato Ketchup 950g", brand: "TangyTree", img: "1547592180-85f173990554",
        rule_code: "Rule 6(1)(b)", rule_label: "Ingredients Order Violation", severity: "medium",
        description: "Water is listed after tomatoes but the paste is only 28% — sequence of ingredients must follow descending weight. Also 'thickener (E1422)' is buried without a class name.",
        evidence: { region: "Back panel, ingredients block", ocr: "Ingredients: Tomatoes, Water, Sugar, Salt…", reason: "Listed order contradicts declared paste percentage", measured: "Tomatoes listed first despite 28% paste", required: "Descending order by weight" },
        up: 27, down: 4, status: "Under Review" as const, hours: 49,
        comments: [
          ["Aditya D.", "Community Inspector", "Good catch — most people never read the order, just the headline %.", 40],
        ],
      },
      {
        author_name: "Imran Qureshi", avatar: SEED_AVATARS[5], zone: "Kolkata",
        title: "MRP revised sticker overlaps expiry date completely",
        commodity: "Cold Coffee 250ml", brand: "BrewBuddy", img: "1528712306091-ed0763094c98",
        rule_code: "Rule 6(1)(f)", rule_label: "Legibility Obstruction — Batch & Expiry", severity: "high",
        description: "The '₹40' over the old '₹35' MRP sticker is pasted right on top of the use-by date. Now neither the original date nor the batch code can be read. Stickers must not obscure mandatory declarations.",
        evidence: { region: "Neck of the bottle", ocr: "MRP ₹4[obscured]… USE BY [obscured]", reason: "Revision sticker covers expiry & batch printing", measured: "Both fields unreadable", required: "Fully legible expiry and batch code" },
        up: 63, down: 1, status: "Notice Drafted" as const, hours: 74,
        comments: [
          ["Zaid K.", "Community Inspector", "Saw the exact same sticker job on three bottles at my retailer.", 60],
          ["Officer Vikram S.", "Legal Metrology Officer", "Retailer's responsibility too — notice will cover both parties.", 55],
          ["Pooja K.", "Community Member", "This is why I photograph every pack now, Klaro made it a habit 😅", 48],
        ],
      },
      {
        author_name: "Tanya Grover", avatar: SEED_AVATARS[0], zone: "Mumbai",
        title: "FSSAI license number missing from imported chocolate bar",
        commodity: "Dark Chocolate 90g", brand: "CacaoNord", img: "1558961363-fa8fdf82db35",
        rule_code: "Rule 6(4)", rule_label: "FSSAI Logo & License Number Missing", severity: "critical",
        description: "Imported pack carries no FSSAI logo or 14-digit license number anywhere — not on the wrapper, not on the imported sticker. Prepackaged food cannot be sold without it.",
        evidence: { region: "Full wrapper scan", ocr: "IMPORTED BY … 90g … MRP ₹290", reason: "No FSSAI mark detected across all faces", measured: "License number absent", required: "FSSAI logo + 14-digit license number" },
        up: 88, down: 2, status: "Notice Drafted" as const, hours: 98,
        comments: [
          ["Naveen C.", "Community Inspector", "Imported shelf in my area is full of these — flagging the same brand today.", 90],
          ["Officer Vikram S.", "Legal Metrology Officer", "Critical severity confirmed. Customs consignment details requested.", 82],
          ["Sneha R.", "Community Inspector", "The sticker only had the importer address, no license at all.", 75],
        ],
      },
      {
        author_name: "Rohit Deshmukh", avatar: SEED_AVATARS[1], zone: "Pune",
        title: "Serving size claimed per biscuit but nutrition is per 100g",
        commodity: "Marie Light Biscuits 250g", brand: "TeaTime", img: "1567620905732-2d1ec7ab7445",
        rule_code: "Rule 6(1)(b)", rule_label: "Misleading Nutritional Basis", severity: "low",
        description: "Front claims 'only 28 kcal per biscuit' while the nutrition panel is per 100g — the declaration basis doesn't match and the front claim misleads on sugar per serving.",
        evidence: { region: "Front claim vs back panel", ocr: "28 kcal per biscuit … Nutrition (per 100g): Sugar 22g", reason: "Front-of-pack basis differs from panel basis", measured: "28 kcal/biscuit claim", required: "Consistent per-serving declaration" },
        up: 15, down: 3, status: "Compounded" as const, hours: 130,
        comments: [
          ["Kavita J.", "Community Inspector", "Classic trick — 22g sugar per 100g hides nicely behind a per-biscuit claim.", 120],
        ],
      },
      {
        author_name: "Gaurav Saxena", avatar: SEED_AVATARS[2], zone: "Jaipur",
        title: "Pack sold at above-MRP price during weekend rush",
        commodity: "Packaged Drinking Water 1L", brand: "AquaSure", img: "1553979459-d2229ba7433b",
        rule_code: "Rule 6(1)(a)", rule_label: "Charged Above Printed MRP", severity: "high",
        description: "Printed MRP is ₹20 but the multiplex counter charged ₹50 — no twin-pack declaration, no premium variant. Charged above MRP on a non-premium pack is an offence under the Act.",
        evidence: { region: "Bill capture + label", ocr: "MRP ₹20 (incl. of all taxes)", reason: "Billed amount ₹50 exceeds declared MRP", measured: "₹50 charged", required: "Sale at or below MRP ₹20" },
        up: 74, down: 5, status: "Compounded" as const, hours: 158,
        comments: [
          ["Alok N.", "Community Inspector", "Take the bill photo — that's the strongest evidence for MRP overcharging.", 140],
          ["Manish S.", "Community Member", "Happens at every event venue, glad someone finally logged it.", 135],
        ],
      },
      {
        author_name: "Divya Iyer", avatar: SEED_AVATARS[3], zone: "Chennai",
        title: "Allergen 'contains milk & wheat' not declared prominently",
        commodity: "Choco Cream Biscuits 120g", brand: "CocoaCove", img: "1488477181946-6428a0291777",
        rule_code: "Rule 5(3)", rule_label: "Allergen Declaration Not Prominent", severity: "critical",
        description: "Milk and wheat appear only in the tiny ingredients paragraph — no separate 'ALLERGENS:' line anywhere. For a child-targeted product this is a serious safety gap.",
        evidence: { region: "Back panel, full OCR sweep", ocr: "INGREDIENTS: wheat flour, sugar, milk solids…", reason: "No standalone allergen statement found", measured: "Allergens buried in ingredients list", required: "Prominent 'Contains: milk, wheat' declaration" },
        up: 91, down: 0, status: "Notice Drafted" as const, hours: 190,
        comments: [
          ["Ritu M.", "Community Inspector", "My nephew is allergic to milk — this brand is everywhere in school canteens.", 180],
          ["Officer Ananya R.", "Legal Metrology Officer", "Escalated with FSSAI benchmark — allergen gaps are treated as priority.", 170],
          ["Shivam G.", "Community Member", "Sharing this in our apartment group, more people should scan this brand.", 160],
        ],
      },
      {
        author_name: "Harpreet Singh", avatar: SEED_AVATARS[4], zone: "Bhopal",
        title: "Best-before printed without 'Use By' clarity on RTE meal",
        commodity: "Rajma Chawal RTE 300g", brand: "MasalaBox", img: "1512058564366-18510be2db19",
        rule_code: "Rule 6(1)(e)", rule_label: "Ambiguous Date Marking", severity: "medium",
        description: "Only 'BB 11/26' is printed — no 'Best Before' or 'Use By' words on the pack. Date marking must carry the words themselves, an abbreviation alone doesn't comply.",
        evidence: { region: "Top crimp of the tray", ocr: "BB 11/26 LOT 44B", reason: "Date printed as bare abbreviation", measured: "'BB 11/26' only", required: "'Best Before: MM/YYYY' in full" },
        up: 22, down: 1, status: "Under Review" as const, hours: 250,
        comments: [
          ["Tarun K.", "Community Inspector", "Half the RTE shelf does this. Scanned four trays, all had 'BB' only.", 230],
        ],
      },
      {
        author_name: "Anjali Tiwari", avatar: SEED_AVATARS[5], zone: "Varanasi",
        title: "Non-veg logo printed green on export variant",
        commodity: "Chicken Pepperoni 150g", brand: "MeatCraft", img: "1467003909585-2f8a72700288",
        rule_code: "Rule 5(1)", rule_label: "Wrong Symbol Colour — Non-Veg", severity: "critical",
        description: "The pepperoni pack shows a GREEN dot for a meat product. Non-veg symbol must be brown. Likely a misprinted export variant released domestically — dangerous for vegetarian consumers.",
        evidence: { region: "Front face, symbol area", ocr: "CHICKEN PEPPERONI … 150g … MRP ₹180", reason: "Green symbol detected on declared non-veg product", measured: "Green dot present", required: "Brown non-veg symbol" },
        up: 105, down: 2, status: "Notice Drafted" as const, hours: 310,
        comments: [
          ["Bikash C.", "Community Inspector", "A green dot on pepperoni is scary — imagine a vegetarian buying this.", 300],
          ["Officer Vikram S.", "Legal Metrology Officer", "Batch recall request filed with the commissionerate. Excellent report quality.", 290],
        ],
      },
      {
        author_name: "Nikhil Chowdhury", avatar: SEED_AVATARS[0], zone: "Patna",
        title: "Consumer care details missing — phone number disconnected",
        commodity: "Fruit Loops Cereal 275g", brand: "CrunchCo", img: "1563805042-7684c019e1cb",
        rule_code: "Rule 6(1)(h)", rule_label: "Consumer Care Declaration Invalid", severity: "low",
        description: "Pack lists a toll-free number that is 'temporarily out of service' and no email or address is given. Consumer care declarations must be reachable, not decorative.",
        evidence: { region: "Side panel, bottom strip", ocr: "TOLL FREE 1800-XXX-XXXX", reason: "Listed consumer care number unreachable", measured: "Number out of service", required: "Working consumer care contact" },
        up: 12, down: 2, status: "Under Review" as const, hours: 400,
        comments: [
          ["Pranab B.", "Community Inspector", "Called the number myself — dead line. Good verification work.", 380],
        ],
      },
      {
        author_name: "Wafa Khan", avatar: SEED_AVATARS[1], zone: "Nagpur",
        title: "Quantity in grams dominates, serving count hidden in fold",
        commodity: "Trail Mix 200g", brand: "NuttyBowl", img: "1490645935967-10de6ba17061",
        rule_code: "Rule 6(1)(d)", rule_label: "Net Quantity Declaration Placement", severity: "medium",
        description: "Net quantity is printed only on the bottom fold of the pouch, invisible on the shelf. The declaration must be on the principal display panel — shoppers can't compare value.",
        evidence: { region: "Bottom fold vs front panel", ocr: "NET WT. 200g (bottom fold only)", reason: "Net quantity absent from principal display panel", measured: "Bottom fold only", required: "Front-face net quantity declaration" },
        up: 29, down: 1, status: "Under Review" as const, hours: 470,
        comments: [
          ["Sravani B.", "Community Inspector", "Same brand, same fold trick on their 500g pack.", 450],
          ["Gautam P.", "Community Member", "Never noticed this until Klaro's label region highlight. Scanning everything now.", 420],
        ],
      },
      {
        author_name: "Debasish Roy", avatar: SEED_AVATARS[2], zone: "Surat",
        title: "Textile-like 'food grade' claim without certification mark",
        commodity: "Coconut Oil 500ml", brand: "KeraPure", img: "1541592106381-b31e9677c0e5",
        rule_code: "Rule 6(2)", rule_label: "Unsubstantiated Grade Claim", severity: "medium",
        description: "Bottle claims '100% Food Grade Cold Pressed' with zero certification reference or license number backing the grade claim. A claim of grade must be verifiable on the label itself.",
        evidence: { region: "Front label, claim strip", ocr: "100% FOOD GRADE COLD PRESSED … MRP ₹340", reason: "Grade claim carries no certification reference", measured: "Claim unverifiable", required: "Certification mark or license reference" },
        up: 37, down: 3, status: "Compounded" as const, hours: 560,
        comments: [
          ["Kalyan R.", "Community Inspector", "Cold-pressed claims are everywhere now — none carry proof. Well spotted.", 540],
          ["Divya N.", "Community Inspector", "Compounded already? That was fast — good to see the system move.", 500],
          ["Officer Ananya R.", "Legal Metrology Officer", "First-time offender compounded under Section 36. Repeat triggers a full notice.", 480],
        ],
      },
    ];

    const rows = seed.map((s, i) => {
      const id = `rep-seed-${i + 1}`;
      return {
        id,
        author_name: s.author_name,
        author_badge: "Community Inspector",
        author_avatar: s.avatar,
        author_zone: s.zone,
        title: s.title,
        commodity: s.commodity,
        brand: s.brand,
        rule_code: s.rule_code,
        rule_label: s.rule_label,
        severity: s.severity,
        description: s.description,
        image_url: FOOD_IMAGE(s.img),
        evidence_label_region: s.evidence.region,
        evidence_ocr_snippet: s.evidence.ocr,
        evidence_flag_reason: s.evidence.reason,
        evidence_measured_value: s.evidence.measured,
        evidence_required_value: s.evidence.required,
        upvotes: s.up,
        downvotes: s.down,
        status: s.status,
        created_at: postedAt(s.hours),
        comments: s.comments.map(([author, role, text, hours], ci) =>
          seedComment(
            ci + 1,
            id,
            author as string,
            role as string,
            SEED_AVATARS[(i + ci + 2) % SEED_AVATARS.length],
            `${Math.max(1, Math.round((hours as number) / 2))}h ago`,
            text as string
          )
        ),
        user_votes: {},
        audit_report: {
          productName: `${s.brand} ${s.commodity}`,
          commodity: s.commodity,
          brand: s.brand,
          zone: s.zone,
          issues: [
            {
              ruleCode: s.rule_code,
              title: s.rule_label,
              severity: s.severity,
              description: s.evidence.reason,
              requiredValue: s.evidence.required,
            },
          ],
        },
      };
    });

    const { error } = await supabase.from("reports").insert(rows);
    if (error) {
      const base = rows.map(({ audit_report, user_votes, ...rest }: any) => rest);
      const retry = await supabase.from("reports").insert(base);
      if (retry.error) return { seeded: false };
    }
    return { seeded: true };
  } catch {
    return { seeded: false };
  }
}

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

export async function updateReportStatus(
  reportId: string,
  status: "Under Review" | "Notice Drafted" | "Compounded" | "Approved" | "Pending Approval" | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from("reports")
      .update({ status })
      .eq("id", reportId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update report status:", err);
    return { success: false, error: err?.message };
  }
}

export interface CompoundingOrderPayload {
  reportId: string;
  status: "Under Review" | "Notice Drafted" | "Compounded";
  officerName: string;
  officerRole: string;
  penaltyAmount?: string;
  remarks?: string;
  sectionCode?: string;
  noticeRef?: string;
}

export async function signAndCompoundReport(
  payload: CompoundingOrderPayload
): Promise<{ success: boolean; error?: string; compoundingOrder?: any }> {
  try {
    const supabase = getServiceSupabase();
    const { data: current } = await supabase
      .from("reports")
      .select("audit_report")
      .eq("id", payload.reportId)
      .single();

    const compoundingOrder = {
      signedAt: new Date().toISOString(),
      officerName: payload.officerName || "Chief Administrator",
      officerRole: payload.officerRole || "Senior Controller of Legal Metrology",
      status: payload.status,
      penaltyAmount: payload.penaltyAmount || "₹25,000",
      sectionCode: payload.sectionCode || "Section 48 / Rule 32 of Legal Metrology Act, 2009",
      noticeRef: payload.noticeRef || `NOT-LM-${Date.now().toString().slice(-6)}`,
      remarks: payload.remarks || "Offence admitted; statutory compounding notice executed under Section 48(1).",
      signatureHash: `SHA256:${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    };

    const updatedAuditReport = {
      ...(current?.audit_report || {}),
      compoundingOrder,
    };

    const { error } = await supabase
      .from("reports")
      .update({
        status: payload.status,
        audit_report: updatedAuditReport,
      })
      .eq("id", payload.reportId);

    if (error) {
      const { error: fallbackError } = await supabase
        .from("reports")
        .update({ status: payload.status })
        .eq("id", payload.reportId);
      if (fallbackError) return { success: false, error: fallbackError.message };
    }

    return { success: true, compoundingOrder };
  } catch (err: any) {
    console.error("Failed to sign and compound report:", err);
    return { success: false, error: err?.message };
  }
}


