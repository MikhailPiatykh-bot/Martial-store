import { NextResponse } from "next/server";

const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "local";
  return request.headers.get("x-real-ip")?.trim() || "local";
}

export function formsRecipient() {
  return process.env.FORMS_EMAIL?.trim() || "";
}

export function rejectSpam(request: Request, body: { company?: unknown; started?: unknown }) {
  const company = typeof body.company === "string" ? body.company.trim() : "";
  if (company) {
    return NextResponse.json({ error: "Не удалось отправить. Попробуйте ещё раз." }, { status: 400 });
  }

  const started = typeof body.started === "number" ? body.started : Number(body.started);
  const elapsed = Date.now() - started;
  if (!Number.isFinite(started) || elapsed < 1500 || elapsed > 6 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Подождите пару секунд и отправьте ещё раз." }, { status: 400 });
  }

  return null;
}

export function rejectFlood(request: Request) {
  const ip = clientIp(request);
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 6) {
    return NextResponse.json({ error: "Слишком много отправок. Попробуйте позже." }, { status: 429 });
  }
  recent.push(now);
  hits.set(ip, recent);
  return null;
}
