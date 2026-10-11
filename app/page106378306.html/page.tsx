import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Webinar" },
  alternates: { canonical: "/page106378306.html" },
  robots: { index: false, follow: false },
};

export default function WebinarPage() {
  return (
    <Article kicker="События" title="Webinar">
      <p>
        Адрес вебинара сохранён. Когда назначим эфир по ушу или экипировке, дата и ссылка
        на подключение появятся на этой странице.
      </p>
      <p>
        Пока вопросы можно задать по телефону <a href={site.phoneHref}>{site.phoneDisplay}</a>{" "}
        или посмотреть <Link href="/baza">базу знаний</Link>.
      </p>
    </Article>
  );
}
