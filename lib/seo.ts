import type { Metadata } from "next";
import { formatPrice, type Product } from "@/lib/catalog";

const shareImage = {
  url: "/brand/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Martial Store — товары для ушу",
};

export function pageMeta(input: { title: string; description: string; path: string }): Metadata {
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [shareImage.url],
    },
  };
}

function clipWords(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max + 1);
  const space = cut.lastIndexOf(" ");
  return (space > 40 ? cut.slice(0, space) : clean.slice(0, max)).trim().replace(/[.,;:]+$/, "");
}

export function productSeo(product: Product) {
  const title = `${product.title} — купить в Martial Store`;
  const price = product.price > 0 ? `Цена ${formatPrice(product.price)}.` : "Цена по запросу.";
  const tail = `${price} Доставка СДЭК по России, шоурум в Москве.`;
  const lead = (product.lead || product.text).replace(/\s+/g, " ").trim().replace(/[.。]+$/, "");
  if (!lead) return { title, description: tail };
  const full = `${lead}. ${tail}`;
  if (full.length <= 160) return { title, description: full };
  const room = 160 - tail.length - 2;
  const description = room >= 24 ? `${clipWords(lead, room)}. ${tail}` : clipWords(full, 160);
  return { title, description };
}
