import { readFileSync, renameSync, writeFileSync } from "fs";

type Entry = {
  key: string;
  fingerprint: string;
  id: string;
  total: number;
  at: number;
};

const file = "/tmp/martial-store-order-ledger.json";
const windowMs = 10 * 60 * 1000;

export function cleanIdempotencyKey(value: unknown) {
  if (typeof value !== "string") return "";
  const key = value.trim();
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(key)) return "";
  return key;
}

export function orderFingerprint(
  phone: string,
  lines: { path: string; variant: string; qty: number }[],
) {
  const digits = phone.replace(/\D/g, "");
  const items = lines
    .map((line) => `${line.path}|${line.variant}|${line.qty}`)
    .sort()
    .join(";");
  return `${digits}:${items}`;
}

function read(now: number): Entry[] {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Partial<Entry>;
      if (typeof record.id !== "string" || typeof record.fingerprint !== "string") return [];
      if (typeof record.total !== "number" || typeof record.at !== "number") return [];
      const key = typeof record.key === "string" ? record.key : "";
      if (now - record.at >= windowMs || record.at - now > 60_000) return [];
      return [{ key, fingerprint: record.fingerprint, id: record.id, total: record.total, at: record.at }];
    });
  } catch {
    return [];
  }
}

function write(entries: Entry[]) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(entries.slice(-100)));
  renameSync(tmp, file);
}

export function findRecentOrder(key: string, fingerprint: string, now = Date.now()) {
  const entries = read(now);
  if (key) {
    const byKey = entries.find((entry) => entry.key === key);
    if (byKey) return { id: byKey.id, total: byKey.total };
  }
  const byFingerprint = entries.find((entry) => entry.fingerprint === fingerprint);
  if (byFingerprint) return { id: byFingerprint.id, total: byFingerprint.total };
  return null;
}

export function rememberOrder(entry: Entry) {
  const entries = read(entry.at);
  const same = entries.find(
    (item) => (entry.key && item.key === entry.key) || item.fingerprint === entry.fingerprint,
  );
  if (same) return { id: same.id, total: same.total };
  entries.push({
    key: entry.key,
    fingerprint: entry.fingerprint,
    id: entry.id,
    total: entry.total,
    at: entry.at,
  });
  write(entries);
  return { id: entry.id, total: entry.total };
}
