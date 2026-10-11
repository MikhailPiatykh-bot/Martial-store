"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { bazaEmbedSrc } from "@/lib/baza";
import { categoryHref, editionLabel, priceLabel, type Product } from "@/lib/catalog";

type Slide = { kind: "video" | "image"; src: string };

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
  const edition = product.editions[editionIndex];
  const price = edition ? edition.price : product.price;
  const variant = edition ? editionLabel(edition) : "";
  const slide = slides[slideIndex] ?? slides[0];
  const image = product.images[0] || "";
  const poster = product.images[0] || "";

  return (
    <article className="wrap product">
      <div className="gallery">
        {slide?.kind === "video" ? (
          <VideoSlide src={slide.src} title={`Видео: ${product.title}`} />
        ) : slide?.kind === "image" ? (
          <img src={slide.src} alt={product.title} />
        ) : (
          <div className="ph" />
        )}
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
                  {editionLabel(item)} — {priceLabel(item.price)}
                </option>
              ))}
            </select>
          </label>
        )}
        {product.editions.length === 1 && edition?.options.length ? <p>{editionLabel(edition)}</p> : null}
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
        {product.text ? product.text.split("\n\n").map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>) : null}
      </div>
    </article>
  );
}
