"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { bazaEmbedSrc } from "@/lib/baza";
import { categoryHref, editionChoiceLabel, editionLabel, priceLabel, type Edition, type Product } from "@/lib/catalog";

type Slide = { kind: "video" | "image"; src: string };

function choiceText(edition: Edition, editions: Edition[]) {
  const label = editionChoiceLabel(edition);
  const shared = editions.filter((item) => editionChoiceLabel(item) === label).length > 1;
  return shared ? editionLabel(edition) : label;
}

function ProductText({ text }: { text: string }) {
  const paragraphs = text.split("\n\n").map((paragraph) => paragraph.trim()).filter(Boolean);
  const [open, setOpen] = useState(false);
  if (!paragraphs.length) return null;
  const mobileMore = paragraphs.length > 1;
  const desktopMore = paragraphs.length > 2;

  return (
    <div
      className={[
        "product-text",
        open ? "is-open" : "",
        mobileMore ? "has-mobile-more" : "",
        desktopMore ? "has-desktop-more" : "",
      ].filter(Boolean).join(" ")}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-p">{paragraph}</p>
      ))}
      {mobileMore ? (
        <button type="button" className="text-fold text-fold-mobile" aria-expanded={open} onClick={() => setOpen(true)}>
          Развернуть описание
        </button>
      ) : null}
      {desktopMore ? (
        <button type="button" className="text-fold text-fold-desktop" aria-expanded={open} onClick={() => setOpen(true)}>
          Развернуть описание
        </button>
      ) : null}
      {mobileMore ? (
        <button type="button" className="text-fold text-fold-close" aria-expanded={open} onClick={() => setOpen(false)}>
          Свернуть описание
        </button>
      ) : null}
    </div>
  );
}

function isFileVideo(src: string) {
  return /\.(mp4|webm|ogg)(?:$|\?)/i.test(src);
}

function VideoSlide({ src, title }: { src: string; title: string }) {
  if (isFileVideo(src)) {
    return <video className="gallery-video" src={src} controls playsInline preload="metadata" />;
  }
  const embed = bazaEmbedSrc(src);
  if (!embed) return null;
  return (
    <div className="video-frame gallery-video">
      <iframe
        src={embed}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function ProductView({ product }: { product: Product }) {
  const cart = useCart();
  const videos = product.videos ?? [];
  const slides: Slide[] = [
    ...videos.map((src) => ({ kind: "video" as const, src })),
    ...product.images.map((src) => ({ kind: "image" as const, src })),
  ];
  const [slideIndex, setSlideIndex] = useState(0);
  const [editionIndex, setEditionIndex] = useState(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    setSlideIndex(0);
  }, [product.path]);
  const edition = product.editions[editionIndex];
  const price = edition ? edition.price : product.price;
  const variant = edition ? editionLabel(edition) : "";
  const slide = slides[slideIndex] ?? slides[0];
  const image = product.images[0] || "";
  const poster = product.images[0] || "";

  function showSlide(next: number) {
    if (slides.length < 2) return;
    setSlideIndex((next + slides.length) % slides.length);
  }

  function onTouchStart(event: React.TouchEvent) {
    const touch = event.changedTouches[0];
    swipe.current = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (!swipe.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - swipe.current.x;
    const dy = touch.clientY - swipe.current.y;
    swipe.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    showSlide(slideIndex + (dx < 0 ? 1 : -1));
  }

  return (
    <article className="wrap product">
      <div className="gallery">
        <div className="gallery-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {slide?.kind === "video" ? (
            <VideoSlide src={slide.src} title={`Видео: ${product.title}`} />
          ) : slide?.kind === "image" ? (
            <img src={slide.src} alt={product.title} draggable={false} />
          ) : (
            <div className="ph" />
          )}
        </div>
        {slides.length > 1 && (
          <div className="thumbs">
            {slides.map((item, index) => (
              <button
                key={`${item.kind}-${item.src}-${index}`}
                type="button"
                className={index === slideIndex ? "on" : undefined}
                onClick={() => setSlideIndex(index)}
                aria-label={item.kind === "video" ? "Видео" : `Фото ${index - videos.length + 1}`}
              >
                {item.kind === "video" ? (
                  <span className="thumb-play">
                    {poster ? <img src={poster} alt="" /> : <span className="ph" />}
                    <span aria-hidden="true" />
                  </span>
                ) : (
                  <img src={item.src} alt="" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="buy">
        <p className="kicker">{product.categories.join(" · ") || "Каталог"}</p>
        <h1>{product.title}</h1>
        {product.lead ? <p className="lede">{product.lead}</p> : null}
        <div className="price">{priceLabel(price)}</div>
        {product.editions.length > 1 && (
          <label>
            Вариант
            <select className="field" value={editionIndex} onChange={(event) => setEditionIndex(Number(event.target.value))}>
              {product.editions.map((item, index) => (
                <option key={`${editionLabel(item)}-${index}`} value={index}>
                  {choiceText(item, product.editions)}
                </option>
              ))}
            </select>
          </label>
        )}
        {product.editions.length === 1 && edition?.options.length ? <p>{choiceText(edition, product.editions)}</p> : null}
        {price > 0 ? (
          <button
            className="btn red"
            type="button"
            onClick={() => cart.add({ path: product.path, title: product.title, price, image, variant })}
          >
            Добавить в корзину
          </button>
        ) : (
          <p>Этот товар пока нельзя заказать на сайте. Напишите нам, чтобы уточнить цену.</p>
        )}
        <div>
          {product.categories.map((category) => (
            <Link key={category} href={categoryHref(category)}>{category}</Link>
          ))}
        </div>
      </div>
      {product.text ? <ProductText key={product.path} text={product.text} /> : null}
    </article>
  );
}
