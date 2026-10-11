import type { MetadataRoute } from "next";
import { bazaPath, bazaPosts } from "@/lib/baza";
import { products } from "@/lib/catalog";

const staticPaths = [
  "/",
  "/about",
  "/contacts",
  "/delivery",
  "/baza",
  "/catalog",
  "/novinki",
  "/vozvrat",
  "/oferta",
  "/politic",
  "/users-agreement",
  "/pers",
  "/chinatrip",
  "/tournament",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticPaths.map((path) => ({
      url: `https://martial-store.ru${path === "/" ? "" : path}`,
      lastModified: now,
    })),
    ...products.map((product) => ({
      url: `https://martial-store.ru${product.path}`,
      lastModified: now,
    })),
    ...bazaPosts.map((post) => ({
      url: `https://martial-store.ru${bazaPath(post.slug)}`,
      lastModified: now,
    })),
  ];
}
