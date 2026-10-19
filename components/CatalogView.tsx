"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CLOTHES_FILTER,
  COLOR_FILTER,
  COLOR_SWATCH,
  SHOES_FILTER,
  cardMatches,
  categories,
  categoryHref,
  categoryImage,
  priceLabel,
  optionValues,
  type ProductCard,
} from "@/lib/catalog";

function SizeOptions({
  title,
  values,
  picked,
  folded,
  onToggle,
  onFold,
}: {
  title: string;
  values: string[];
  picked: string[];
  folded: boolean;
  onToggle: (value: string) => void;
  onFold: () => void;
}) {
  if (!values.length) return null;

  return (
    <fieldset className="filter-block">
      <legend>
        <button type="button" className="filter-fold" aria-expanded={!folded} onClick={onFold}>
          <span>{title}</span>
          <span className={folded ? "filter-flag" : "filter-flag is-open"} aria-hidden="true" />
        </button>
      </legend>
      {folded ? null : (
        <div className="filter-checks">
          {values.map((value) => (
            <label key={value} className="filter-check">
              <input
                type="checkbox"
                checked={picked.includes(value)}
                onChange={() => onToggle(value)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function CatalogView({
  title,
  cards,
  activeCategory,
  kicker = "Каталог",
  showCategories = true,
}: {
  title: string;
  cards: ProductCard[];
  activeCategory: string | null;
  kicker?: string;
  showCategories?: boolean;
}) {
  const colors = useMemo(() => optionValues(cards, COLOR_FILTER), [cards]);
  const clothes = useMemo(() => optionValues(cards, CLOTHES_FILTER), [cards]);
  const shoes = useMemo(() => optionValues(cards, SHOES_FILTER), [cards]);
  const hasFilters = colors.length > 0 || clothes.length > 0 || shoes.length > 0;

  const [query, setQuery] = useState("");
  const [pickedColors, setPickedColors] = useState<string[]>([]);
  const [pickedClothes, setPickedClothes] = useState<string[]>([]);
  const [pickedShoes, setPickedShoes] = useState<string[]>([]);
  const [clothesFolded, setClothesFolded] = useState(true);
  const [shoesFolded, setShoesFolded] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setQuery("");
    setPickedColors([]);
    setPickedClothes([]);
    setPickedShoes([]);
    setClothesFolded(true);
    setShoesFolded(true);
    setPanelOpen(false);
  }, [activeCategory]);

  function resetFilters() {
    setPickedColors([]);
    setPickedClothes([]);
    setPickedShoes([]);
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return cards.filter((card) => {
      if (needle && !`${card.title} ${card.lead} ${card.categories.join(" ")}`.toLowerCase().includes(needle)) {
        return false;
      }
      return cardMatches(card, {
        color: pickedColors,
        clothes: pickedClothes,
        shoes: pickedShoes,
      });
    });
  }, [cards, pickedClothes, pickedColors, pickedShoes, query]);

  const filtersOn = pickedColors.length > 0 || pickedClothes.length > 0 || pickedShoes.length > 0;
  const allImage = categoryImage("Все товары");

  return (
    <div className="wrap">
        <div className="page-title catalog-head">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
      </div>
      {!showCategories ? null : activeCategory ? (
        <nav className="cat-links" aria-label="Разделы">
          <Link href="/catalog">Все</Link>
          {categories.map((category) => (
            <Link
              key={category.uid}
              href={categoryHref(category.title)}
              aria-current={activeCategory === category.title ? "page" : undefined}
            >
              {category.title}
            </Link>
          ))}
        </nav>
      ) : (
        <div className="cats" style={{ marginBottom: 18 }}>
          <Link className={allImage ? "cat has-photo" : "cat"} href="/catalog" aria-current="page">
            {allImage ? <img src={allImage} alt="" /> : null}
            <span>Все товары</span>
          </Link>
          {categories.map((category) => {
            const image = categoryImage(category.title);
            return (
              <Link
                key={category.uid}
                className={image ? "cat has-photo" : "cat"}
                href={categoryHref(category.title)}
              >
                {image ? <img src={image} alt="" /> : null}
                <span>{category.title}</span>
              </Link>
            );
          })}
        </div>
      )}
      <div className={hasFilters ? "catalog-layout" : "catalog-layout is-plain"}>
        {hasFilters ? (
          <button
            className="filters-toggle"
            type="button"
            aria-expanded={panelOpen}
            onClick={() => setPanelOpen((current) => !current)}
          >
            Фильтры
          </button>
        ) : null}
        {hasFilters ? (
          <aside className={panelOpen ? "filters is-open" : "filters"}>
          {colors.length ? (
            <fieldset className="filter-block">
              <legend>Цвет</legend>
              <div className="swatches">
                {colors.map((color) => {
                  const on = pickedColors.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      className={on ? "swatch is-on" : "swatch"}
                      style={{ backgroundColor: COLOR_SWATCH[color] ?? "#888" }}
                      aria-pressed={on}
                      aria-label={color}
                      title={color}
                      onClick={() => setPickedColors((current) => toggleValue(current, color))}
                    />
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          <SizeOptions
            title={CLOTHES_FILTER}
            values={clothes}
            picked={pickedClothes}
            folded={clothesFolded}
            onToggle={(value) => setPickedClothes((current) => toggleValue(current, value))}
            onFold={() => setClothesFolded((current) => !current)}
          />
          <SizeOptions
            title={SHOES_FILTER}
            values={shoes}
            picked={pickedShoes}
            folded={shoesFolded}
            onToggle={(value) => setPickedShoes((current) => toggleValue(current, value))}
            onFold={() => setShoesFolded((current) => !current)}
          />

          {filtersOn ? (
            <button className="filter-reset" type="button" onClick={resetFilters}>
              Сбросить
            </button>
          ) : null}
          </aside>
        ) : null}

        <div className="catalog-main">
          {cards.length > 0 ? (
            <div className="toolbar">
              <p className="muted">{visible.length} из {cards.length}</p>
              <input
                className="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Найти в разделе"
                aria-label="Поиск по каталогу"
              />
            </div>
          ) : null}
          {cards.length === 0 ? (
            <p>В этом разделе пока нет товаров.</p>
          ) : visible.length === 0 ? (
            <p>В этом разделе ничего не нашлось. Измените фильтры или сбросьте поиск.</p>
          ) : (
            <div className="grid">
              {visible.map((card) => (
                <Link key={card.path} href={card.path} className="card">
                  <span className="card-media">
                    {card.image ? <img src={card.image} alt="" /> : <span className="ph" />}
                  </span>
                  <div>
                    <small>{card.categories.join(" · ")}</small>
                    <strong>{card.title}</strong>
                    <span>{priceLabel(card.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
