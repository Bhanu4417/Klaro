import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await req.json();
  } catch {}

  return NextResponse.json({ ok: true });
}