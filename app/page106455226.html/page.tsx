import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";

export const metadata: Metadata = {
  title: { absolute: "Blank page" },
  alternates: { canonical: "/page106455226.html" },
  robots: { index: false, follow: false },
};

export default function BlankBPage() {
  return (
    <Article kicker="Служебная страница" title="Blank page">
      <p>Адрес сохранён, чтобы старые ссылки не пропадали из поиска.</p>
      <p><Link href="/">На главную</Link></p>
    </Article>
  );
}
