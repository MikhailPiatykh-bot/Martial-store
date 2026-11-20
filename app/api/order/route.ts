import { NextResponse } from "next/server";
import { editionLabel, formatPrice, products } from "@/lib/catalog";
import { formsRecipient, rejectFlood, rejectSpam } from "@/lib/formGuard";
import { cleanIdempotencyKey, findRecentOrder, orderFingerprint, rememberOrder } from "@/lib/orderLedger";
import { enqueueTelegram } from "@/lib/telegramOutbox";

type IncomingItem = {
  path?: unknown;
  variant?: unknown;
  qty?: unknown;
};

type Line = {
  path: string;
  title: string;
  variant: string;
  qty: number;
  price: number;
};

const contactLabels = {
  telegram: "Телеграм",
  whatsapp: "WhatsApp",
  max: "Max",
  email: "Email",
} as const;

type Contact = keyof typeof contactLabels;

function internationalPhone(value: string) {
  let phone = value.trim().replace(/\s+/g, " ").replace(/\+/g, "");
  phone = `+${phone}`;
  if (phone.length > 24) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return "";
  if (!/^\+[0-9][0-9\s()-]*$/.test(phone)) return "";
  return phone;
}

function cleanContacts(value: unknown) {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  return (Object.keys(contactLabels) as Contact[]).filter((id) => raw.includes(id));
}

function cleanEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "";
  return email;
}

function resolveLine(item: IncomingItem): Line | null {
  if (typeof item.path !== "string" || typeof item.variant !== "string") return null;
  const qty = typeof item.qty === "number" ? item.qty : Number(item.qty);
  if (!Number.isInteger(qty) || qty < 1 || qty > 99) return null;
  const product = products.find((entry) => entry.path === item.path);
  if (!product) return null;
  if (!product.editions.length) {
    if (item.variant !== "") return null;
    if (!(product.price > 0)) return null;
    return { path: product.path, title: product.title, variant: "", qty, price: product.price };
  }
  const edition = product.editions.find((entry) => editionLabel(entry) === item.variant);
  if (!edition || !(edition.price > 0)) return null;
  return { path: product.path, title: product.title, variant: item.variant, qty, price: edition.price };
}

function orderId() {
  const now = new Date();
  const day = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MS-${day}-${tail}`;
}

function orderMessage(order: {
  id: string;
  total: number;
  name: string;
  phone: string;
  email: string;
  contact: string;
  delivery: "cdek" | "pickup";
  city: string;
  terminal: string;
  comment: string;
  composition: string;
}) {
  const lines = [
    `Новый заказ ${order.id}`,
    `Итого: ${formatPrice(order.total)}`,
    "",
    order.name,
    order.phone,
    `Почта: ${order.email}`,
    `Связь: ${order.contact}`,
    order.delivery === "cdek" ? "Получение: пункт СДЭК" : "Получение: самовывоз",
  ];
  if (order.delivery === "cdek") {
    lines.push(`Город: ${order.city}`, `Пункт: ${order.terminal}`);
  } else {
    lines.push("Адрес: шоурум, пр-т Маршала Жукова, 51");
  }
  lines.push("", order.composition);
  if (order.comment) lines.push("", `Комментарий: ${order.comment}`);
  return lines.join("\n").slice(0, 4000);
}

async function sendEmail(
  request: Request,
  id: string,
  total: number,
  name: string,
  phone: string,
  email: string,
  contact: string,
  delivery: "cdek" | "pickup",
  city: string,
  terminal: string,
  comment: string,
  composition: string,
) {
  const origin = request.headers.get("origin") || "https://martial-store.ru";
  const recipient = formsRecipient();
  if (!recipient) return "failed" as const;
  const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: origin,
      Referer: `${origin}/checkout`,
    },
    signal: AbortSignal.timeout(12000),
    body: JSON.stringify({
      _subject: `Заказ ${id} — ${formatPrice(total)}`,
      _template: "table",
      _captcha: "false",
      Заказ: id,
      Имя: name,
      Телефон: phone,
      Почта: email,
      Связь: contact,
      Получение: delivery === "cdek" ? "Пункт СДЭК" : "Самовывоз",
      Город: delivery === "cdek" ? city : "Москва",
      "Пункт СДЭК": delivery === "cdek" ? terminal : "Шоурум, пр-т Маршала Жукова, 51",
      Комментарий: comment || "—",
      Состав: composition,
      Итого: formatPrice(total),
    }),
  });

  let payload: { success?: string | boolean; message?: string } = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (typeof payload.message === "string" && payload.message.includes("Activation")) return "activation" as const;
  if (!response.ok || payload.success === false || payload.success === "false") return "failed" as const;
  return "ok" as const;
}

export async function POST(request: Request) {
  let body: {
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    contact?: unknown;
    delivery?: unknown;
    city?: unknown;
    terminal?: unknown;
    comment?: unknown;
    consent?: unknown;
    items?: unknown;
    company?: unknown;
    started?: unknown;
    idempotencyKey?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать заказ." }, { status: 400 });
  }

  const spam = rejectSpam(request, body);
  if (spam) return spam;

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const phone = typeof body.phone === "string" ? internationalPhone(body.phone) : "";
  const email = typeof body.email === "string" ? cleanEmail(body.email) : "";
  const contacts = cleanContacts(body.contact);
  const delivery = body.delivery === "cdek" || body.delivery === "pickup" ? body.delivery : "";
  const city = typeof body.city === "string" ? body.city.trim().replace(/\s+/g, " ") : "";
  const terminal = typeof body.terminal === "string" ? body.terminal.trim().replace(/\s+/g, " ") : "";
  const comment = typeof body.comment === "string" ? body.comment.trim().replace(/\s+/g, " ") : "";
  const items = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  const lines = items.map((item) => resolveLine(item as IncomingItem));

  const nameOk = name.split(" ").length >= 2 && name.length <= 120;
  const phoneOk = phone.length > 0;
  const emailOk = email.length > 0;
  const contactOk = contacts.length > 0;
  const deliveryOk = delivery === "pickup" || (delivery === "cdek" && city.length >= 2 && city.length <= 80 && terminal.length >= 5 && terminal.length <= 200);
  const commentOk = comment.length <= 800;
  const linesOk = lines.length > 0 && lines.every((line): line is Line => line !== null);

  if (!nameOk || !phoneOk || !emailOk || !contactOk || !deliveryOk || !commentOk || !linesOk || body.consent !== true) {
    return NextResponse.json({ error: "Проверьте данные получателя и состав заказа." }, { status: 400 });
  }

  const readyLines = lines.filter((line): line is Line => line !== null);
  const idempotencyKey = cleanIdempotencyKey(body.idempotencyKey);
  const fingerprint = orderFingerprint(phone, readyLines);
  const existing = findRecentOrder(idempotencyKey, fingerprint);
  if (existing) {
    console.info("order repeat", existing.id);
    return NextResponse.json({ ok: true, id: existing.id, total: existing.total });
  }

  const flood = rejectFlood(request);
  if (flood) return flood;

  const total = readyLines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const id = orderId();
  const composition = readyLines
    .map((line, index) => {
      const variant = line.variant ? ` (${line.variant})` : "";
      return `${index + 1}. ${line.title}${variant} × ${line.qty} — ${formatPrice(line.price * line.qty)}`;
    })
    .join("\n");

  const contactText = contacts.map((id) => contactLabels[id]).join(", ");
  const text = orderMessage({
    id,
    total,
    name,
    phone,
    email,
    contact: contactText,
    delivery,
    city,
    terminal,
    comment,
    composition,
  });

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  // The shop host cannot reach api.telegram.org, so a synchronous send waits out
  // its 12s timeout and the buyer submits again. Hand the same message to the
  // outbox and answer immediately; the existing worker delivers it.
  if (token && chatId) {
    try {
      enqueueTelegram(id, text);
    } catch (error) {
      console.error("order telegram queue failed", error instanceof Error ? error.name : "error");
      return NextResponse.json(
        { error: "Не удалось записать заказ. Нажмите «Заказать» ещё раз — повтор не создаст второй заказ." },
        { status: 502 },
      );
    }
    try {
      rememberOrder({ key: idempotencyKey, fingerprint, id, total, at: Date.now() });
    } catch (error) {
      console.error("order ledger failed", error instanceof Error ? error.name : "error");
    }
    void sendEmail(request, id, total, name, phone, email, contactText, delivery, city, terminal, comment, composition).catch((error) => {
      console.error("order email failed", error instanceof Error ? error.name : "error");
    });
    console.info("order accepted", id);
    return NextResponse.json({ ok: true, id, total });
  }

  let mailed: "ok" | "failed" | "activation" = "failed";
  try {
    mailed = await sendEmail(request, id, total, name, phone, email, contactText, delivery, city, terminal, comment, composition);
  } catch (error) {
    console.error("order email failed", error instanceof Error ? error.name : "error");
    mailed = "failed";
  }
  if (mailed === "ok") {
    rememberOrder({ key: idempotencyKey, fingerprint, id, total, at: Date.now() });
    return NextResponse.json({ ok: true, id, total });
  }
  if (mailed === "activation") {
    return NextResponse.json(
      {
        error:
          "На почту магазина отправлено письмо для включения формы. Откройте его и нажмите ссылку, затем отправьте заказ ещё раз.",
      },
      { status: 409 },
    );
  }
  return NextResponse.json(
    { error: "Не удалось записать заказ. Нажмите «Заказать» ещё раз — повтор не создаст второй заказ." },
    { status: 502 },
  );
}
