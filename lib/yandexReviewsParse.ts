export type Review = {
  id?: string;
  source: "Яндекс Карты";
  name: string;
  date: string;
  rating: number;
  text: string;
};

const ownerName = "михаил пятых";

type YandexReview = {
  reviewId?: string;
  text?: string;
  rating?: number;
  updatedTime?: string;
  author?: { name?: string };
};

function extractJsonObject(html: string, marker: string) {
  const at = html.indexOf(marker);
  if (at < 0) return null;
  const start = at + marker.length;
  if (html[start] !== "{") return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < html.length; index += 1) {
    const char = html[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, index + 1)) as unknown;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function formatReviewDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Moscow",
  })
    .format(date)
    .replace(/\s*г\.\s*$/, "");
}

export function parseYandexReviewsHtml(html: string) {
  const payload = extractJsonObject(html, '"reviewResults":');
  if (!payload || typeof payload !== "object" || !("reviews" in payload)) return null;
  const list = (payload as { reviews?: YandexReview[] }).reviews;
  if (!Array.isArray(list)) return null;
  const parsed = list
    .flatMap((item) => {
      const name = item.author?.name?.trim() ?? "";
      const text = item.text?.trim() ?? "";
      const rating = Math.round(Number(item.rating));
      if (!name || !text || name.toLocaleLowerCase("ru") === ownerName) return [];
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) return [];
      const review: Review & { time: number } = {
        id: item.reviewId,
        source: "Яндекс Карты",
        name,
        date: item.updatedTime ? formatReviewDate(item.updatedTime) : "",
        rating,
        text,
        time: item.updatedTime ? Date.parse(item.updatedTime) : 0,
      };
      return [review];
    })
    .sort((a, b) => b.time - a.time)
    .map(({ time: _time, ...review }) => review);
  if (!parsed.length) return null;
  const countMatch = html.match(/"reviewCount":(\d+)/);
  const total = countMatch ? Number(countMatch[1]) : parsed.length;
  return { reviews: parsed, total: total > 0 ? total : parsed.length };
}
