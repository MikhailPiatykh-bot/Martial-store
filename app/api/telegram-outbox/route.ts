import { NextResponse } from "next/server";
import { ackTelegram, bearerMatches, claimTelegram } from "@/lib/telegramOutbox";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function allowed(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  if (!token) return false;
  return bearerMatches(request.headers.get("authorization"), token);
}

export function GET(request: Request) {
  if (!allowed(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ items: claimTelegram() });
}

export async function POST(request: Request) {
  if (!allowed(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: { ids?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string" && id.length > 0 && id.length <= 40).slice(0, 20)
    : [];
  ackTelegram(ids);
  return NextResponse.json({ ok: true });
}
