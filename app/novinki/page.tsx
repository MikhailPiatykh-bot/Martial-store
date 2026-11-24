import { CatalogView } from "@/components/CatalogView";
import { novinkiCards } from "@/lib/novinki";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/novinki",
  title: "Новинки — Martial Store",
  description:
    "Новые товары для ушу в Martial Store: оружие, обувь, форма и экипировка. Шоурум в Москве, доставка СДЭК по России.",
});

export default function NovinkiPage() {
  return (
    <CatalogView
      title="Новинки"
      kicker="Новинки"
      cards={novinkiCards()}
      activeCategory={null}
      showCategories={false}
    />
  );
}
