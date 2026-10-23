const token = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
const chatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";
const url = process.env.OUTBOX_URL || "https://martial-store.ru/api/telegram-outbox";

if (!token || !chatId) {
  console.error("missing telegram secrets");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const claim = await fetch(url, { headers });
if (!claim.ok) {
  console.error("outbox http", claim.status);
  process.exit(1);
}

const body = await claim.json();
const items = Array.isArray(body.items) ? body.items : [];
console.log("claimed", items.length);

const sent = [];
for (const item of items) {
  if (!item || typeof item.id !== "string" || typeof item.text !== "string") continue;
  let response;
  try {
    response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: item.text }),
    });
  } catch (error) {
    console.error("telegram unreachable", error instanceof Error ? error.name : "error");
    continue;
  }
  const payload = await response.json().catch(() => null);
  if (response.ok && payload?.ok === true) {
    sent.push(item.id);
    continue;
  }
  const description = typeof payload?.description === "string" ? payload.description.slice(0, 180) : "";
  console.error("telegram send failed", response.status, description);
}

if (sent.length) {
  const ack = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ ids: sent }),
  });
  console.log("acked", sent.length, ack.status);
}

if (sent.length !== items.length) process.exit(1);
