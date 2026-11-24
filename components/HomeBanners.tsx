"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { SiteImage } from "@/components/SiteImage";

type BrandLogo = { src: string; alt: string; width: number; height: number };

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
  { src: "/brand/ccwushu.png", alt: "CC Wushu", width: 172, height: 140 },
  { src: "/brand/feiyue.png", alt: "Feiyue", width: 556, height: 139 },
  { src: "/brand/budosaga.png", alt: "Budosaga", width: 400, height: 146 },
  { src: "/brand/wesing.png", alt: "Wesing", width: 556, height: 370 },
];

const slides: Slide[] = [
  {
    kicker: "Поставщик оригинальной продукции:",
    title: "CC Wushu, Feiyue, Budosaga, Dari Huntong, Wesing",
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
    float: "/brand/telegram-float.webp",
  },
  {
    kicker: "",
    title: "Обучающие видео\nи база знаний",
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
    photo: "/brand/cooperation-group.png",
  },
  {
    kicker: "",
    title: "Официальный партнер «Профессиональный Альянс Ушу и Кунгфу»",
    accent: "",
    note: "",
    cta: "",
    href: "",
    external: false,
    logo: "/brand/pak-seal-round.webp",
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
            const titleLines = item.title.split("\n");
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
                      {titleLines.map((line, lineIndex) => (
                        <Fragment key={line}>
                          {lineIndex > 0 ? <br /> : null}
                          {line}
                        </Fragment>
                      ))}
                      {item.accent ? <><br /><span>{item.accent}</span></> : null}
                    </h1>
                  ) : item.logo ? (
                    <h2 className="banner-title banner-title-pak">
                      <span className="pak-desk">Официальный партнер «Профессиональный Альянс Ушу и Кунгфу»</span>
                      <span className="pak-land">
                        <span>Официальный партнер</span>
                        <span>«Профессиональный Альянс</span>
                        <span>Ушу и Кунгфу»</span>
                      </span>
                      <span className="pak-port">
                        <span>Официальный партнер</span>
                        <span>«Профессиональный</span>
                        <span>Альянс Ушу и Кунгфу»</span>
                      </span>
                    </h2>
                  ) : (
                    <h2 className="banner-title">
                      {titleLines.map((line, lineIndex) => (
                        <Fragment key={line}>
                          {lineIndex > 0 ? <br /> : null}
                          {line}
                        </Fragment>
                      ))}
                      {item.accent ? <><br /><span>{item.accent}</span></> : null}
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
                {active && item.logos ? (
                  <div className="banner-visual logo-wall" aria-hidden="true">
                    <ul>
                      {Array.from({ length: 24 }, (_, logoIndex) => {
                        const logo = item.logos?.[logoIndex % item.logos.length];
                        if (!logo) return null;
                        return (
                          <li key={logoIndex}>
                            <SiteImage
                              src={logo.src}
                              alt=""
                              width={logo.width}
                              height={logo.height}
                              sizes="168px"
                              eager={itemIndex === 0 && logoIndex < 4}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : active && item.float ? (
                  <div className="banner-visual banner-float" aria-hidden="true">
                    <SiteImage src={item.float} alt="" width={440} height={440} sizes="220px" />
                  </div>
                ) : active && item.athlete ? (
                  <div className="banner-visual banner-athlete" aria-hidden="true">
                    <SiteImage src={item.athlete} alt="" width={659} height={461} sizes="(max-width: 640px) 190px, 400px" />
                  </div>
                ) : active && item.photo ? (
                  <div className="banner-visual banner-partners">
                    <SiteImage
                      src={item.photo}
                      alt="Спортсмены Martial Store в форме для ушу"
                      width={636}
                      height={846}
                      sizes="(max-width: 640px) 220px, 240px"
                    />
                  </div>
                ) : (
                  <div className={item.logo ? "banner-visual has-logo" : "banner-visual"} aria-hidden={item.logo ? undefined : true}>
                    {active && item.logo ? (
                      <SiteImage
                        className="banner-logo"
                        src={item.logo}
                        alt="Логотип Профессионального Альянса Ушу и Кунгфу"
                        width={560}
                        height={560}
                        sizes="280px"
                      />
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
