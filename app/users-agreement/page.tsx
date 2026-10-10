import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Пользовательское соглашение" },
  alternates: { canonical: "/users-agreement" },
};

export default function UsersAgreementPage() {
  return (
    <Article kicker="Документы" title="Пользовательское соглашение">
      <p>
        Сайт martial-store.ru принадлежит {site.sellerShort} и показывает инвентарь для ушу и кунг-фу:
        оружие, форму, обувь и аксессуары. Пользуясь сайтом, вы соглашаетесь с этими условиями,
        <Link href="/oferta"> договором оферты</Link> и <Link href="/politic"> политикой обработки данных</Link>.
      </p>
      <h2>Каталог</h2>
      <p>
        Цена и наличие в карточке актуальны на момент просмотра и подтверждаются при заказе.
        Фотографии передают вид товара; оттенок ткани может немного отличаться от экрана.
      </p>
      <h2>Заказ</h2>
      <p>
        Для отправки нужны имя, телефон, город и адрес пункта СДЭК. Заказы принимаются {site.orderHours}.
        Доставка по России обычно занимает до пяти рабочих дней после передачи в службу доставки.
      </p>
      <p>Вопросы по сайту: <a href={site.phoneHref}>{site.phoneDisplay}</a>.</p>
    </Article>
  );
}
