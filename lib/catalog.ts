import data from "@/data/catalog.json";

export type Edition = {
  price: number;
  options: { name: string; value: string }[];
};

export type Product = {
  uid: string;
  slug: string;
  path: string;
  title: string;
  sku: string;
  price: number;
  lead: string;
  text: string;
  images: string[];
  videos: string[];
  categories: string[];
  editions: Edition[];
};

export type ProductCard = {
  path: string;
  title: string;
  price: number;
  image: string;
  videos: string[];
  categories: string[];
  lead: string;
  editions: Edition[];
};

export const COLOR_FILTER = "Цвет";
export const CLOTHES_FILTER = "Размер одежды";
export const SHOES_FILTER = "Размер обуви";

export const COLOR_SWATCH: Record<string, string> = {
  Белый: "#ffffff",
  Голубой: "#33ccff",
  Желтый: "#f3ff0d",
  Зеленый: "#00e065",
  Красный: "#ff0000",
  Розовый: "#f230d5",
  Синий: "#0059ff",
  Черный: "#000000",
};

const COLOR_ORDER = Object.keys(COLOR_SWATCH);

export type CatalogFilters = {
  color: string[];
  clothes: string[];
  shoes: string[];
};

export const FILTER_KEY = data.filterKey;
export const categories = data.categories;

const categoryImages: Record<string, string> = {
  "Все товары": "/catalog/vse.jpg",
  "Ифу и одежда": "/catalog/ifu.jpg",
  "Обувь": "/catalog/obuv.jpg",
  "Аксессуары": "/catalog/aksessuary.jpg",
  "Традиционное оружие": "/catalog/tradicionnoe.jpg",
  "Мечи": "/catalog/mechi.jpg",
  "Палки": "/catalog/palki.jpg",
  "Ковры/помосты/львы": "/catalog/kovry.jpg",
  "Чехлы": "/catalog/chehly.jpg",
  "Саньда": "/catalog/sanda.jpg",
};

export function categoryImage(title: string) {
  return categoryImages[title];
}
export const products = data.products as Product[];

export function categoryHref(title: string) {
  const params = new URLSearchParams();
  params.set(FILTER_KEY, title);
  params.set("tfc_div", ":::");
  return `/catalog?${params.toString()}`;
}

export function categoryFromParams(
  params: Record<string, string | string[] | undefined>,
) {
  const direct = params[FILTER_KEY];
  const value = Array.isArray(direct) ? direct[0] : direct;
  return value || null;
}

export function productsInCategory(title: string | null) {
  if (!title) return products;
  return products.filter((product) => product.categories.includes(title));
}

export function productBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function toCard(product: Product): ProductCard {
  return {
    path: product.path,
    title: product.title,
    price: product.price,
    image: product.images[0] ?? "",
    videos: product.videos ?? [],
    categories: product.categories,
    lead: product.lead,
    editions: product.editions,
  };
}

export function optionValues(cards: ProductCard[], name: string) {
  const seen = new Set<string>();
  for (const card of cards) {
    for (const edition of card.editions) {
      for (const option of edition.options) {
        if (option.name === name) seen.add(option.value);
      }
    }
  }
  const values = [...seen].filter((value) => {
    if (name === COLOR_FILTER) return value in COLOR_SWATCH;
    if (name === CLOTHES_FILTER) return /^\d+$/.test(value);
    return true;
  });
  if (name === COLOR_FILTER) {
    return values.sort((a, b) => {
      const left = COLOR_ORDER.indexOf(a);
      const right = COLOR_ORDER.indexOf(b);
      return (left === -1 ? 99 : left) - (right === -1 ? 99 : right);
    });
  }
  return values.sort((a, b) => a.localeCompare(b, "ru", { numeric: true }));
}

function editionHas(edition: Edition, name: string, picked: string[]) {
  if (!picked.length) return true;
  const value = edition.options.find((option) => option.name === name)?.value;
  return Boolean(value && picked.includes(value));
}

export function cardMatches(card: ProductCard, filters: CatalogFilters) {
  const editions = card.editions.length ? card.editions : [{ price: card.price, options: [] }];
  return editions.some((edition) => {
    if (!editionHas(edition, COLOR_FILTER, filters.color)) return false;
    if (!editionHas(edition, CLOTHES_FILTER, filters.clothes)) return false;
    if (!editionHas(edition, SHOES_FILTER, filters.shoes)) return false;
    return true;
  });
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₽`;
}

export function editionLabel(edition: Edition) {
  if (!edition.options.length) return "Базовый вариант";
  return edition.options.map((option) => `${option.name}: ${option.value}`).join(" · ");
}
