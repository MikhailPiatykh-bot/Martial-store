import { readFileSync, writeFileSync } from "fs";
import { parseYandexReviewsHtml } from "../../lib/reviews.ts";

const page = "https://yandex.ru/maps/org/96913793575/reviews/";
const file = new URL("../../data/yandex-reviews.json", import.meta.url);

const response = await fetch(page, {
  headers: {
    "Accept-Language": "ru-RU,ru;q=0.9",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  },
  signal: AbortSignal.timeout(20000),
});

if (!response.ok) {
  console.error("yandex http", response.status);
  process.exit(1);
}

const parsed = parseYandexReviewsHtml(await response.text());
if (!parsed) {
  console.error("yandex parse failed");
  process.exit(1);
}

const next = `${JSON.stringify({ total: parsed.total, reviews: parsed.reviews }, null, 2)}\n`;
let prev = "";
try {
  prev = readFileSync(file, "utf8");
} catch {
  prev = "";
}

if (prev === next) {
  console.log("unchanged", parsed.total, parsed.reviews.length);
  process.exit(0);
}

writeFileSync(file, next);
console.log("updated", parsed.total, parsed.reviews.length);
