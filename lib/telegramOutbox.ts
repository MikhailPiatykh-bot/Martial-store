import { createHash, timingSafeEqual } from "crypto";
import { readFileSync, renameSync, writeFileSync } from "fs";

type Item = {
  id: string;
  text: string;
  leasedUntil: number;
};

const file = "/tmp/martial-store-telegram-outbox.json";
const leaseMs = 4 * 60 * 1000;

function read(): Item[] {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Partial<Item>;
      if (typeof record.id !== "string" || typeof record.text !== "string") return [];
      const leasedUntil = typeof record.leasedUntil === "number" ? record.leasedUntil : 0;
      return [{ id: record.id, text: record.text, leasedUntil }];
    });
  } catch {
    return [];
  }
}

function write(items: Item[]) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(items));
  renameSync(tmp, file);
}

export function enqueueTelegram(id: string, text: string) {
  const items = read().filter((item) => item.id !== id);
  items.push({ id, text: text.slice(0, 4000), leasedUntil: 0 });
  write(items.slice(-20));
}

export function claimTelegram(now = Date.now()) {
  const items = read();
  const ready = items.filter((item) => item.leasedUntil <= now).slice(0, 20);
  const readyIds = new Set(ready.map((item) => item.id));
  write(
    items.map((item) => (readyIds.has(item.id) ? { ...item, leasedUntil: now + leaseMs } : item)),
  );
  return ready.map(({ id, text }) => ({ id, text }));
}

export function ackTelegram(ids: string[]) {
  const done = new Set(ids);
  write(read().filter((item) => !done.has(item.id)));
}

export function bearerMatches(header: string | null, token: string) {
  const match = /^Bearer\s+(\S+)\s*$/i.exec(header ?? "");
  const got = createHash("sha256").update(match?.[1] ?? "").digest();
  const expected = createHash("sha256").update(token).digest();
  return timingSafeEqual(got, expected);
}
