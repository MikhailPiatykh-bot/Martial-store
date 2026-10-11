import { NextResponse } from "next/server";
import { formsRecipient, rejectFlood, rejectSpam } from "@/lib/formGuard";
import { wuwayShifts } from "@/lib/wuway";

function nationalDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  return digits;
}

export async function POST(request: Request) {
  let body: { name?: unknown; age?: unknown; phone?: unknown; shift?: unknown; company?: unknown; started?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать заявку." }, { status: 400 });
  }

  const spam = rejectSpam(request, body);
  if (spam) return spam;

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const age = typeof body.age === "number" ? body.age : Number(body.age);
  const phone = typeof body.phone === "string" ? nationalDigits(body.phone) : "";
  const shift = typeof body.shift === "string" ? body.shift : "";
  const shiftLabel = wuwayShifts.find((item) => item.value === shift)?.label;

  if (name.length < 2 || name.length > 120 || !Number.isInteger(age) || age < 4 || age > 99 || phone.length !== 10 || !shiftLabel) {
    return NextResponse.json({ error: "Проверьте имя, возраст, телефон и смену." }, { status: 400 });
  }

  const flood = rejectFlood(request);
  if (flood) return flood;

  const recipient = formsRecipient();
  if (!recipient) {
    return NextResponse.json({ error: "Не удалось отправить заявку. Попробуйте ещё раз." }, { status: 503 });
  }

  const origin = request.headers.get("origin") || "https://martial-store.ru";
  const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: origin,
      Referer: `${origin}/chinatrip`,
    },
    body: JSON.stringify({
      _subject: "Заявка на сборы в Китай",
      _template: "table",
      _captcha: "false",
      Имя: name,
      Возраст: String(age),
      Телефон: `+7${phone}`,
      Смена: shiftLabel,
    }),
  });

  let payload: { success?: string | boolean; message?: string } = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (typeof payload.message === "string" && payload.message.includes("Activation")) {
    return NextResponse.json(
      {
        error:
          "На почту магазина отправлено письмо для включения формы. Откройте его и нажмите ссылку, затем отправьте заявку ещё раз.",
      },
      { status: 409 },
    );
  }

  if (!response.ok || payload.success === false || payload.success === "false") {
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте ещё раз." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
