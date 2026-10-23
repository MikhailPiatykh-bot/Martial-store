import { products, toCard, type ProductCard } from "@/lib/catalog";

export const SALE_CATEGORY = "Распродажа";

export function rasprodazhaCards(): ProductCard[] {
  return products.filter((product) => product.categories.includes(SALE_CATEGORY)).map(toCard);
}
