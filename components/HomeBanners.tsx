"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BrandLogo = { src: string; alt: string };

type Slide = {
  kicker: string;
  title: string;
  accent: string;
  note: string;
  cta: string;
  href: string;
  external: boolean;
  logo?: string;
  logos?: BrandLogo[];
  float?: string;
  athlete?: string;
  photo?: string;
};

const brandLogos: BrandLogo[] = [
  { src: "/brand/ccwushu.png", alt: "CC Wushu" },
  { src: "/brand/feiyue.png", alt: "Feiyue" },
  { src: "/brand/budosaga.png", alt: "Budosaga" },
  { src: "/brand/wesing.png", alt: "Wesing" },
];

const slides: Slide[] = [
  {
    kicker: "Поставщик оригинальной продукции:",
    title: "CC Wushu, Feiyue TopOne, Feiyue DaFu, Budosaga, Dari Huntong, Wesing",
    accent: "",
    note: "",
    cta: "Перейти в каталог",
    href: "/catalog",
    external: false,
    logos: brandLogos,
  },
  {
    kicker: "",
    title: "Закрытые распродажи и лучшие акции - только для своих.",
    accent: "",
    note: "Подписывайтесь и будьте первыми.",
    cta: "Перейти в телеграм-канал",
    href: "https://t.me/martialstorerus",
    external: true,
    float: "/brand/telegram-float.png",
  },
  {
    kicker: "",
    title: "Обучающие видео и база знаний",
    accent: "",
    note: "",
    cta: "Подробнее",
    href: "/baza",
    external: false,
    athlete: "/brand/athlete-cutout.png",
  },
  {
    kicker: "",
    title: "Спонсорство турниров",
    accent: "и сотрудничество",
    note: "",
    cta: "Подробнее",
    href: "/tournament",
    external: false,
    photo: "/brand/cooperation-group.png?v=3",
  },
  {
    kicker: "",
    title: "Официальный партнер ООО «Профессиональный Альянс Ушу и Кунгфу»",
    accent: "",
    note: "",
    cta: "",
    href: "",
    external: false,
    logo: "/brand/pak-seal-round.png",
  },
];

export function HomeBanners() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const step = (delta: number) => {
    setIndex((current) => (current + delta + slides.length) % slides.length);
  };

  return (
    <section
      className="home-banners"
      aria-roledescription="карусель"
      aria-label="Баннеры"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="wrap">
        <div className="banner-stage">
          {slides.map((item, itemIndex) => {
            const active = itemIndex === index;
            return (
              <article
                key={item.title}
                className={active ? "banner-card" : "banner-card banner-card-off"}
                aria-hidden={active ? undefined : true}
                inert={active ? undefined : true}
              >
                <div className="banner-copy">
                  {item.kicker ? <p className="banner-kicker">{item.kicker}</p> : null}
                  {itemIndex === 0 ? (
                    <h1 className="banner-title">
                      {item.title}
                      {item.accent ? <span> {item.accent}</span> : null}
                    </h1>
                  ) : (
                    <h2 className="banner-title">
                      {item.title}
                      {item.accent ? <span> {item.accent}</span> : null}
                    </h2>
                  )}
                  {item.note ? <p className="banner-note">{item.note}</p> : null}
                  {item.cta ? (
                    item.external ? (
                      <a className="banner-cta" href={item.href} target="_blank" rel="noreferrer">
                        {item.cta}
                      </a>
                    ) : (
                      <Link className="banner-cta" href={item.href}>
                        {item.cta}
                      </Link>
                    )
                  ) : null}
                </div>
                {item.logos ? (
                  <div className="banner-visual logo-wall" aria-hidden="true">
                    <ul>
                      {Array.from({ length: 24 }, (_, logoIndex) => {
                        const logo = item.logos?.[logoIndex % item.logos.length];
                        if (!logo) return null;
                        return (
                          <li key={logoIndex}>
                            <img src={logo.src} alt="" />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : item.float ? (
                  <div className="banner-visual banner-float" aria-hidden="true">
                    <img src={item.float} alt="" />
                  </div>
                ) : item.athlete ? (
                  <div className="banner-visual banner-athlete" aria-hidden="true">
                    <img src={item.athlete} alt="" />
                  </div>
                ) : item.photo ? (
                  <div className="banner-visual banner-partners">
                    <img src={item.photo} alt="Спортсмены Martial Store в форме для ушу" />
                  </div>
                ) : (
                  <div className={item.logo ? "banner-visual has-logo" : "banner-visual"} aria-hidden={item.logo ? undefined : true}>
                    {item.logo ? (
                      <img className="banner-logo" src={item.logo} alt="Логотип Профессионального Альянса Ушу и Кунгфу" />
                    ) : null}
                  </div>
                )}
              </article>
            );
          })}
          <button className="banner-arrow prev" type="button" aria-label="Предыдущий баннер" onClick={() => step(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="banner-arrow next" type="button" aria-label="Следующий баннер" onClick={() => step(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
