import { CatalogView } from "@/components/CatalogView";
import { categoryFromParams, productsInCategory, toCard } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/catalog",
  title: "Каталог товаров для ушу — мечи, оружие, обувь, ифу | Martial Store",
  description:
    "Мечи дао и цзянь, традиционное оружие, обувь Feiyue, ифу, чехлы, палки и копья, саньда. Всё в наличии в Москве, отправка СДЭК по России.",
});

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
