import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";

export const metadata: Metadata = {
  title: { absolute: "Blank page" },
  alternates: { canonical: "/page106377886.html" },
};

export default function BlankAPage() {
  return (
    <Article kicker="Служебная страница" title="Blank page">
      <p>Адрес сохранён, чтобы старые ссылки не пропадали из поиска.</p>
      <p><Link href="/catalog">Перейти в каталог</Link></p>
    </Article>
  );
}
