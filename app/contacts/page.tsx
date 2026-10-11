import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Контакты" },
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <section className="section" id="contacts">
      <div className="wrap split">
        <div>
          <h2>Контакты</h2>
          <p><a href={site.phoneHref}>{site.phoneDisplay}</a></p>
          <p>{site.address}</p>
          {site.hours.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>{site.pickupNote}</p>
          <div className="actions">
            <a className="btn red" href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="btn light" href={site.telegram} target="_blank" rel="noreferrer">Telegram</a>
            <a className="btn light" href={site.vk} target="_blank" rel="noreferrer">ВКонтакте</a>
            <a className="btn light" href={site.map} target="_blank" rel="noreferrer">Карта</a>
          </div>
        </div>
        <div className="panel">
          <h2>Шоурум</h2>
          <p>Москва, проспект Маршала Жукова, дом 51.</p>
          <p>{site.pickupNote}</p>
          <iframe
            className="contacts-map"
            title="Martial Store на Яндекс Картах"
            src={site.mapWidget}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
