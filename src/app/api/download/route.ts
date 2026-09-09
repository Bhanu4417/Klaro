import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const file = url.searchParams.get("file") || "klaro-source.zip";

  return NextResponse.redirect(new URL(`/${file}`, url.origin));
}