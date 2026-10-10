import type { Metadata } from "next";
import { CatalogView } from "@/components/CatalogView";
import { novinkiCards } from "@/lib/novinki";

export const metadata: Metadata = {
  title: { absolute: "Новинки" },
  alternates: { canonical: "/novinki" },
};

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
