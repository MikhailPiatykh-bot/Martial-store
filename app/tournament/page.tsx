import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";
import { categoryHref } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Кайши турнир" },
  alternates: { canonical: "/tournament" },
};

export default function TournamentPage() {
  return (
    <Article kicker="Соревнования" title="Кайши турнир">
      <p>
        Страница турнира Кайши. Положение, дату и стартовый взнос публикуем здесь,
        когда набор открыт. Пока заявку можно оставить заранее, чтобы получить регламент первым.
      </p>
      <p>
        Форму, обувь и оружие к старту смотрите в каталоге:{" "}
        <Link href={categoryHref("Ифу и одежда")}>ифу</Link>,{" "}
        <Link href={categoryHref("Обувь")}>обувь</Link>,{" "}
        <Link href={categoryHref("Мечи")}>мечи</Link>.
      </p>
      <p>
        Вопросы по участию: <a href={site.phoneHref}>{site.phoneDisplay}</a>.
      </p>
    </Article>
  );
}
