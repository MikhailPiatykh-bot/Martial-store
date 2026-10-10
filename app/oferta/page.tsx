import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Договор оферты" },
  alternates: { canonical: "/oferta" },
};

export default function OfertaPage() {
  return (
    <Article kicker="Документы" title="Договор оферты">
      <p>
        Публичная оферта {site.sellerShort} о заключении договора розничной купли-продажи
        дистанционным способом от {site.offerDate}. Оферта действует со дня публикации на сайте.
      </p>
      <p>
        Продавец: {site.seller}, ОГРНИП {site.ogrnip}, ИНН {site.inn}, {site.address}.
        Телефон: <a href={site.phoneHref}>{site.phoneDisplay}</a>.
      </p>
      <h2>Как заключается договор</h2>
      <p>
        Оформляя заказ в каталоге, по телефону или в мессенджере, покупатель принимает условия
        оферты. Договор считается заключённым после подтверждения заказа продавцом.
        Описание, цена и комплектация берутся из карточки товара на момент заказа.
      </p>
      <h2>Доставка и получение</h2>
      <p>
        Доставка выполняется в пункт выдачи СДЭК. Самовывоз — из шоурума по адресу {site.address},
        {site.hours.join(". ")}. Перед визитом нужно предупредить магазин.
      </p>
      <h2>Оплата и возврат</h2>
      <p>
        Доступны наличный и безналичный расчёт. Способ фиксируется при подтверждении заказа.
        Возврат и обмен регулируются <Link href="/vozvrat">правилами возврата</Link> и законом
        о защите прав потребителей.
      </p>
    </Article>
  );
}
