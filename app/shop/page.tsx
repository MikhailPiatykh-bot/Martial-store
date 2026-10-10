import type { Metadata } from "next";
import { CatalogView } from "@/components/CatalogView";
import { categoryFromParams, productsInCategory, toCard } from "@/lib/catalog";

export const metadata: Metadata = {
  title: { absolute: "Инвентарь для ушу | Martial Store (СТАРАЯ ВЕРСИЯ)" },
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const activeCategory = categoryFromParams(params);
  const list = productsInCategory(activeCategory);

  return (
    <CatalogView
      title="Каталог"
      cards={list.map(toCard)}
      activeCategory={activeCategory}
    />
  );
}
