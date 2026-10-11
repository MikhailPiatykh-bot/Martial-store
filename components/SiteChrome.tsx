"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { CountUp } from "@/components/CountUp";
import { HomeBanners } from "@/components/HomeBanners";
import { useCart } from "@/components/CartProvider";
import { categories, categoryHref, formatPrice } from "@/lib/catalog";
import { infoLinks, legalLinks, site } from "@/lib/site";

function withoutSmoothScroll(scroll: () => void) {
  const root = document.documentElement;
  root.style.scrollBehavior = "auto";
  scroll();
  requestAnimationFrame(() => {
    root.style.scrollBehavior = "";
  });
}

function scrollToPageStart() {
  withoutSmoothScroll(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
}

function scrollToHash() {
  const id = window.location.hash.slice(1);
  if (!id) return false;
  const node = document.getElementById(id);
  if (!node) return false;
  withoutSmoothScroll(() => node.scrollIntoView({ block: "start", behavior: "instant" }));
  return true;
}

function scrollForRoute() {
  if (window.location.hash) scrollToHash();
  else scrollToPageStart();
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const showPromo = pathname === "/";

  useEffect(() => {
    if (!menuOpen && !cart.open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen, cart.open]);

  useLayoutEffect(() => {
    scrollForRoute();
    setMenuOpen(false);
    cart.setOpen(false);
  }, [pathname, cart.setOpen]);

  useEffect(() => {
    scrollForRoute();
    document.querySelectorAll("details.drop").forEach((node) => {
      if (node instanceof HTMLDetailsElement) node.open = false;
    });
    const frame = requestAnimationFrame(scrollForRoute);
    const timer = window.setTimeout(scrollForRoute, 60);
    const later = window.setTimeout(scrollForRoute, 220);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.clearTimeout(later);
    };
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#content">К содержанию</a>
      <Link
        href="/"
        className="brand-banner"
        aria-label="Martial Store"
        onClick={(event) => {
          if (pathname === "/" && !window.location.hash) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <img
          src="/brand/martial-header-3840.jpg"
          srcSet="/brand/martial-header-1920.jpg 1920w, /brand/martial-header-2560.jpg 2560w, /brand/martial-header-3840.jpg 3840w"
          sizes="100vw"
          alt="Martial Store"
        />
      </Link>
      <header className="header">
        <div className="header-inner">
          <Link
            href="/"
            className="home-mark"
            aria-label="Главная"
            onClick={(event) => {
              if (pathname === "/" && !window.location.hash) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img src="/brand/logo-icon.png" alt="" />
          </Link>
          <div className="header-social" aria-label="Мессенджеры">
            <a href={site.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" title="Telegram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.5 4.4 2.7 11.2c-.9.3-.9.9-.2 1.1l4.8 1.5 1.9 5.8c.2.7.1.9.8.9.4 0 .6-.2.9-.4l2.6-2.5 5.4 4c.6.4 1.1.2 1.2-.6l2.2-15.2c.2-1-.4-1.5-1.2-1.2Zm-3.2 3.1-8.7 8c-.2.2-.4.5-.3.8l.5 3.2-1.3-4.1 10.2-8.6c.4-.3.7.1.4.4l-.8.7Z"/></svg>
            </a>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 13.87c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.12.1-1.81-.11-.41-.13-.95-.31-1.63-.61-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.26-.29.57-.36.76-.36h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.27.7 1.16 1.51 1.88 1.04.92 1.91 1.21 2.18 1.35.27.14.43.12.59-.07.16-.19.67-.78.85-1.05.18-.26.35-.22.59-.13.24.09 1.52.72 1.78.85.26.13.43.19.5.3.06.1.06.61-.18 1.29Z"/></svg>
            </a>
            <a href={site.max} target="_blank" rel="noreferrer" aria-label="Max" title="Max">
              <svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="800" fontFamily="Arial, sans-serif">MAX</text></svg>
            </a>
            <a href={site.vkPage} target="_blank" rel="noreferrer" aria-label="ВКонтакте" title="ВКонтакте">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2Zm3.08 14.27h-1.45c-.55 0-.72-.44-1.71-1.44-.86-.83-1.24-.95-1.45-.95-.3 0-.38.08-.38.49v1.31c0 .35-.11.56-1.04.56-1.54 0-3.25-.93-4.45-2.67C6.18 11.55 5.69 9.64 5.69 9.25c0-.21.08-.41.49-.41h1.45c.37 0 .51.17.65.56.72 2.08 1.92 3.9 2.41 3.9.18 0 .27-.08.27-.55V10.6c-.06-.99-.58-1.07-.58-1.42 0-.17.14-.34.37-.34h2.29c.31 0 .42.17.42.54v2.89c0 .31.14.42.23.42.18 0 .34-.11.68-.45 1.04-1.17 1.79-2.98 1.79-2.98.1-.21.27-.41.64-.41h1.45c.44 0 .54.22.44.54-.18.85-1.96 3.36-1.96 3.36-.16.25-.21.37 0 .65.15.21.66.65 1 1.04.62.71 1.1 1.3 1.23 1.71.14.41-.07.62-.48.62Z"/></svg>
            </a>
          </div>
          <nav className="nav" aria-label="Основное меню">
            <Link href="/about">О нас</Link>
            <details className="drop">
              <summary>Каталог</summary>
              <div className="drop-panel" onClick={(event) => {
                if ((event.target as Element).closest("a")) event.currentTarget.closest("details")!.open = false;
              }}>
                <Link href="/catalog">Весь каталог</Link>
                {categories.map((category) => (
                  <Link key={category.uid} href={categoryHref(category.title)}>{category.title}</Link>
                ))}
              </div>
            </details>
            <Link href="/novinki">Новинки</Link>
            <details className="drop">
              <summary>Информация для клиентов</summary>
              <div className="drop-panel" onClick={(event) => {
                if ((event.target as Element).closest("a")) event.currentTarget.closest("details")!.open = false;
              }}>
                {infoLinks.map((link) => (
                  <Link key={link.href} href={link.href}>{link.label}</Link>
                ))}
              </div>
            </details>
            <Link href="/contacts">Контакты</Link>
          </nav>
          <button className="cart-btn" type="button" onClick={() => cart.setOpen(true)}>
            Корзина <b>{cart.count}</b>
          </button>
          <button className="burger cart-btn" type="button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню">
            Меню
          </button>
        </div>
      </header>
      {showPromo && (
        <>
          <HomeBanners />
          <section className="stats" aria-label="О магазине в цифрах">
            <div className="wrap stats-row">
              <article className="stat-square stat-square-athletes">
                <p className="counter"><CountUp to={1572} /></p>
                <p className="orders-copy">
                  заказов отправлено
                  <br />
                  в 2026 году
                </p>
              </article>
              <article className="stat-square stat-square-clubs">
                <p className="counter"><CountUp to={100} /></p>
                <p className="clubs-copy">
                  спортивных клубов уже сотрудничают
                  <br />
                  с нами на регулярной основе.
                </p>
              </article>
            </div>
          </section>
        </>
      )}
      <main id="content">{children}</main>
      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <h3>Martial Store</h3>
            <p>{site.address}</p>
            <p><a href={site.phoneHref}>{site.phoneDisplay}</a></p>
            {site.hours.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>{site.pickupNote}</p>
          </div>
          <div>
            <h3>Покупателям</h3>
            <ul>
              {infoLinks.map((link) => (
                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Документы</h3>
            <ul>
              {legalLinks.map((link) => (
                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="wrap legal">{site.sellerShort}. ОГРНИП {site.ogrnip}. ИНН {site.inn}.</div>
      </footer>

      {menuOpen && (
        <div className="drawer-back" onClick={() => setMenuOpen(false)}>
          <div className="drawer mobile-nav" role="dialog" aria-modal="true" aria-label="Меню" onClick={(event) => event.stopPropagation()}>
            <header>
              <strong>Меню</strong>
              <button className="btn light" type="button" onClick={() => setMenuOpen(false)}>Закрыть</button>
            </header>
            <nav className="mobile-nav-list">
              <Link href="/catalog" onClick={() => setMenuOpen(false)}>Каталог</Link>
              <Link href="/novinki" onClick={() => setMenuOpen(false)}>Новинки</Link>
              {infoLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>
              ))}
              <Link href="/contacts" onClick={() => setMenuOpen(false)}>Контакты</Link>
            </nav>
          </div>
        </div>
      )}

      {cart.open && (
        <div className="drawer-back" onClick={() => cart.setOpen(false)}>
          <aside className="drawer" role="dialog" aria-label="Корзина" onClick={(event) => event.stopPropagation()}>
            <header>
              <strong>Ваш заказ</strong>
              <button className="btn light" type="button" onClick={() => cart.setOpen(false)}>Закрыть</button>
            </header>
            <div className="cart-body">
              {cart.items.length === 0 ? (
                <p>В корзине пока пусто.</p>
              ) : (
                <div className="cart-list">
                  {cart.items.map((item) => (
                    <div className="cart-line" key={`${item.path}-${item.variant}`}>
                      {item.image ? <img src={item.image} alt="" /> : <span className="cart-ph" />}
                      <div>
                        <Link href={item.path} onClick={() => cart.setOpen(false)}>{item.title}</Link>
                        <small>{item.variant || "Базовый вариант"}</small>
                        <div className="qty">
                          <button type="button" aria-label="Уменьшить количество" onClick={() => cart.setQty(item.path, item.variant, item.qty - 1)}>−</button>
                          <span>{item.qty}</span>
                          <button type="button" aria-label="Увеличить количество" onClick={() => cart.setQty(item.path, item.variant, item.qty + 1)}>+</button>
                        </div>
                      </div>
                      <div className="cart-line-side">
                        <div>{formatPrice(item.price * item.qty)}</div>
                        <button type="button" onClick={() => cart.remove(item.path, item.variant)}>Убрать</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="cart-foot">
              {cart.items.length > 0 ? (
                <>
                  <strong>Итого: {formatPrice(cart.total)}</strong>
                  <p className="muted">Наличие и оплату подтвердим после заказа. Доставка — в пункт СДЭК, самовывоз — из шоурума.</p>
                  <button
                    className="btn red"
                    type="button"
                    onClick={() => {
                      cart.setOpen(false);
                      router.push("/checkout");
                    }}
                  >
                    Оформить заказ
                  </button>
                </>
              ) : null}
              <Link className="btn light" href="/catalog" onClick={() => cart.setOpen(false)}>Перейти в каталог</Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
