import { NextResponse } from "next/server";

function buildLocalReply(question: string, context?: string): string {
  const normalized = question.toLowerCase();
  const evidenceNote = context ? " I’ve kept the selected post in context for your review." : "";

  if (normalized.includes("mrp") || normalized.includes("retail price")) {
    return `Check the declared MRP, inclusive of all taxes, against the package and any digital listing. Record the exact OCR text and a clear image before escalating under the applicable packaged-commodities rule.${evidenceNote}`;
  }
  if (normalized.includes("ocr") || normalized.includes("genuine") || normalized.includes("verify")) {
    return `Verify the source image, OCR crop, commodity details, and measured-versus-required value as one chain of evidence. Treat unclear text as NEEDS REVIEW until it is confirmed manually.${evidenceNote}`;
  }
  if (normalized.includes("font") || normalized.includes("size")) {
    return `Compare the printed declaration with the minimum height required for the pack size under the applicable packaged-commodities rule. Capture a scale reference in the evidence image before recording a violation.${evidenceNote}`;
  }
  if (normalized.includes("penalty") || normalized.includes("section")) {
    return `Confirm the exact contravention and current rule text first, then verify the applicable penalty section against the official gazette before enforcement.${evidenceNote}`;
  }
  return `Review the post’s evidence, declared particulars, and applicable Legal Metrology rule together. If any material detail is missing, mark it NEEDS REVIEW and request a clearer package image.${evidenceNote}`;
}

export async function POST(req: Request) {
  try {
    const { question, context } = (await req.json()) as { question?: string; context?: string };

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "question required" }, { status: 400 });
    }

    return NextResponse.json({ reply: buildLocalReply(question, context) });
  } catch {
    return NextResponse.json({ reply: "Officer Assist could not read that prompt. Try again." }, { status: 200 });
  }
}
