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
  "/shop",
  "/users-agreement",
  "/pers",
  "/page106377886.html",
  "/page106378306.html",
  "/chinatrip",
  "/page106455226.html",
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
