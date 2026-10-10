import type { Metadata } from "next";
import { CatalogView } from "@/components/CatalogView";
import { categoryFromParams, productsInCategory, toCard } from "@/lib/catalog";

export const metadata: Metadata = {
  title: { absolute: "Martial Store | Инвентарь для ушу | Каталог" },
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const activeCategory = categoryFromParams(params);
  const list = productsInCategory(activeCategory);

  return (
    <CatalogView
      title={activeCategory || "Каталог"}
      cards={list.map(toCard)}
      activeCategory={activeCategory}
    />
  );
}
