import { redirect } from "next/navigation";
import { categoryHref } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/rasprodazha",
  title: "Распродажа — Martial Store",
  description:
    "Товары для ушу со скидкой в Martial Store. Доставка СДЭК по России, самовывоз из шоурума в Москве.",
});

export default function RasprodazhaPage() {
  redirect(categoryHref("Распродажа"));
}
