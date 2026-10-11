import { NextResponse } from "next/server";
import { editionLabel, formatPrice, products } from "@/lib/catalog";
import { formsRecipient, rejectFlood, rejectSpam } from "@/lib/formGuard";

type IncomingItem = {
  path?: unknown;
  variant?: unknown;
  qty?: unknown;
};

type Line = {
  title: string;
  variant: string;
  qty: number;
  price: number;
};

function nationalDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  return digits;
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
    return { title: product.title, variant: "", qty, price: product.price };
  }
  const edition = product.editions.find((entry) => editionLabel(entry) === item.variant);
  if (!edition || !(edition.price > 0)) return null;
  return { title: product.title, variant: item.variant, qty, price: edition.price };
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

async function sendTelegram(token: string, chatId: string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  const payload = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  return response.ok && payload?.ok === true;
}

async function sendEmail(
  request: Request,
  id: string,
  total: number,
  name: string,
  phone: string,
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
    body: JSON.stringify({
      _subject: `Заказ ${id} — ${formatPrice(total)}`,
      _template: "table",
      _captcha: "false",
      Заказ: id,
      Имя: name,
      Телефон: `+7${phone}`,
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
    delivery?: unknown;
    city?: unknown;
    terminal?: unknown;
    comment?: unknown;
    consent?: unknown;
    items?: unknown;
    company?: unknown;
    started?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать заказ." }, { status: 400 });
  }

  const spam = rejectSpam(request, body);
  if (spam) return spam;

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const phone = typeof body.phone === "string" ? nationalDigits(body.phone) : "";
  const delivery = body.delivery === "cdek" || body.delivery === "pickup" ? body.delivery : "";
  const city = typeof body.city === "string" ? body.city.trim().replace(/\s+/g, " ") : "";
  const terminal = typeof body.terminal === "string" ? body.terminal.trim().replace(/\s+/g, " ") : "";
  const comment = typeof body.comment === "string" ? body.comment.trim().replace(/\s+/g, " ") : "";
  const items = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  const lines = items.map((item) => resolveLine(item as IncomingItem));

  const nameOk = name.split(" ").length >= 2 && name.length <= 120;
  const phoneOk = phone.length === 10;
  const deliveryOk = delivery === "pickup" || (delivery === "cdek" && city.length >= 2 && city.length <= 80 && terminal.length >= 5 && terminal.length <= 200);
  const commentOk = comment.length <= 800;
  const linesOk = lines.length > 0 && lines.every((line): line is Line => line !== null);

  if (!nameOk || !phoneOk || !deliveryOk || !commentOk || !linesOk || body.consent !== true) {
    return NextResponse.json({ error: "Проверьте данные получателя и состав заказа." }, { status: 400 });
  }

  const flood = rejectFlood(request);
  if (flood) return flood;

  const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const id = orderId();
  const composition = lines
    .map((line, index) => {
      const variant = line.variant ? ` (${line.variant})` : "";
      return `${index + 1}. ${line.title}${variant} × ${line.qty} — ${formatPrice(line.price * line.qty)}`;
    })
    .join("\n");

  const text = orderMessage({
    id,
    total,
    name,
    phone: `+7${phone}`,
    delivery,
    city,
    terminal,
    comment,
    composition,
  });

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (token && chatId) {
    const sent = await sendTelegram(token, chatId, text);
    if (!sent) {
      return NextResponse.json({ error: "Не удалось отправить заказ. Попробуйте ещё раз." }, { status: 502 });
    }
    await sendEmail(request, id, total, name, phone, delivery, city, terminal, comment, composition);
    return NextResponse.json({ ok: true, id, total });
  }

  const email = await sendEmail(request, id, total, name, phone, delivery, city, terminal, comment, composition);
  if (email === "activation") {
    return NextResponse.json(
      {
        error:
          "На почту магазина отправлено письмо для включения формы. Откройте его и нажмите ссылку, затем отправьте заказ ещё раз.",
      },
      { status: 409 },
    );
  }
  if (email === "failed") {
    return NextResponse.json({ error: "Не удалось отправить заказ. Попробуйте ещё раз." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id, total });
}
