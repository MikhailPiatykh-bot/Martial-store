"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/catalog";
import { site } from "@/lib/site";

type Delivery = "cdek" | "pickup";

function nationalDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

function formatRuPhone(digits: string) {
  if (!digits) return "";
  let out = "+7 (" + digits.slice(0, 3);
  if (digits.length >= 3) out += ")";
  if (digits.length > 3) out += " " + digits.slice(3, 6);
  if (digits.length > 6) out += "-" + digits.slice(6, 8);
  if (digits.length > 8) out += "-" + digits.slice(8, 10);
  return out;
}

export function CheckoutView() {
  const cart = useCart();
  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("cdek");
  const [city, setCity] = useState("");
  const [terminal, setTerminal] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(Date.now());
  const [done, setDone] = useState<{ id: string; total: number } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || cart.items.length === 0) return;
    const next: Record<string, string> = {};
    const cleanName = name.trim().replace(/\s+/g, " ");
    if (cleanName.split(" ").length < 2) next.name = "Укажите фамилию и имя";
    if (phoneDigits.length !== 10) next.phone = "Укажите телефон полностью";
    if (delivery === "cdek") {
      if (city.trim().length < 2) next.city = "Укажите город";
      if (terminal.trim().length < 5) next.terminal = "Укажите адрес пункта СДЭК";
    }
    if (!consent) next.consent = "Нужно согласие, чтобы оформить заказ";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => {
        document.querySelector(".checkout-alert")?.scrollIntoView({ block: "center" });
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          name: cleanName,
          phone: `+7${phoneDigits}`,
          delivery,
          city: delivery === "cdek" ? city.trim() : "",
          terminal: delivery === "cdek" ? terminal.trim() : "",
          comment: comment.trim(),
          consent: true,
          company,
          started: started.current,
          items: cart.items.map((item) => ({
            path: item.path,
            variant: item.variant,
            qty: item.qty,
          })),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; id?: string; total?: number };
      if (!response.ok || !data.id || typeof data.total !== "number") {
        setErrors({ form: data.error || "Не удалось отправить заказ. Попробуйте ещё раз." });
        requestAnimationFrame(() => {
          document.querySelector(".checkout-alert")?.scrollIntoView({ block: "center" });
        });
        return;
      }
      setDone({ id: data.id, total: data.total });
      cart.clear();
    } catch {
      setErrors({ form: "Не удалось отправить заказ. Попробуйте ещё раз." });
    } finally {
      setSubmitting(false);
    }
  }

  if (!cart.ready) {
    return (
      <section className="section checkout">
        <div className="wrap">
          <p className="muted">Загружаем корзину…</p>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section className="section checkout">
        <div className="wrap checkout-done">
          <p className="kicker">Заказ {done.id}</p>
          <h1>Заказ принят</h1>
          <p>
            Сумма {formatPrice(done.total)}. Мы проверим наличие и свяжемся с вами: менеджер подтвердит заказ и способ оплаты. На сайте оплата не принимается, в том числе банковской картой.
            Отправка в СДЭК — по вторникам и четвергам.
          </p>
          <p>
            {site.hours.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            <strong>Суббота и воскресенье — выходные, заказы не обрабатываются.</strong>
          </p>
          <p>Также вы можете написать нам в мессенджер</p>
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
            <a href={site.vk} target="_blank" rel="noreferrer" aria-label="ВКонтакте" title="ВКонтакте">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2Zm3.08 14.27h-1.45c-.55 0-.72-.44-1.71-1.44-.86-.83-1.24-.95-1.45-.95-.3 0-.38.08-.38.49v1.31c0 .35-.11.56-1.04.56-1.54 0-3.25-.93-4.45-2.67C6.18 11.55 5.69 9.64 5.69 9.25c0-.21.08-.41.49-.41h1.45c.37 0 .51.17.65.56.72 2.08 1.92 3.9 2.41 3.9.18 0 .27-.08.27-.55V10.6c-.06-.99-.58-1.07-.58-1.42 0-.17.14-.34.37-.34h2.29c.31 0 .42.17.42.54v2.89c0 .31.14.42.23.42.18 0 .34-.11.68-.45 1.04-1.17 1.79-2.98 1.79-2.98.1-.21.27-.41.64-.41h1.45c.44 0 .54.22.44.54-.18.85-1.96 3.36-1.96 3.36-.16.25-.21.37 0 .65.15.21.66.65 1 1.04.62.71 1.1 1.3 1.23 1.71.14.41-.07.62-.48.62Z"/></svg>
            </a>
          </div>
          <Link className="btn light" href="/catalog">Вернуться в каталог</Link>
        </div>
      </section>
    );
  }

  if (cart.items.length === 0) {
    return (
      <section className="section checkout">
        <div className="wrap checkout-done">
          <h1>Корзина пуста</h1>
          <p>Добавьте товары из каталога, затем вернитесь к оформлению.</p>
          <Link className="btn red" href="/catalog">Перейти в каталог</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section checkout">
      <div className="wrap">
        <h1>Оформление заказа</h1>
        <p className="checkout-lead">
          После заявки мы проверим склад и свяжемся с вами. Менеджер подтвердит заказ и способ оплаты: наличный или безналичный расчёт. Оплата на сайте не принимается, в том числе банковской картой.
        </p>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={submit} noValidate>
            {errors.form ? <p className="checkout-error">{errors.form}</p> : null}
            <label>
              ФИО получателя
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Фамилия Имя Отчество"
                autoComplete="name"
              />
              {errors.name ? <span className="checkout-error">{errors.name}</span> : null}
            </label>
            <label>
              Телефон
              <span className="checkout-phone">
                <span className="china-flag" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <input
                  value={formatRuPhone(phoneDigits)}
                  onChange={(event) => setPhoneDigits(nationalDigits(event.target.value))}
                  placeholder="+7 (000) 000-00-00"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </span>
              {errors.phone ? <span className="checkout-error">{errors.phone}</span> : null}
            </label>
            <fieldset className="delivery-options">
              <legend>Получение</legend>
              <label className={delivery === "cdek" ? "delivery-option is-on" : "delivery-option"}>
                <input
                  type="radio"
                  name="delivery"
                  value="cdek"
                  checked={delivery === "cdek"}
                  onChange={() => setDelivery("cdek")}
                />
                <span>
                  <strong>Пункт СДЭК</strong>
                  <small>Доставка по России. Перевозку оплачиваете при получении.</small>
                </span>
              </label>
              <label className={delivery === "pickup" ? "delivery-option is-on" : "delivery-option"}>
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={delivery === "pickup"}
                  onChange={() => setDelivery("pickup")}
                />
                <span>
                  <strong>Самовывоз</strong>
                  <small>{site.address}. Перед визитом предупредите магазин.</small>
                </span>
              </label>
            </fieldset>
            {delivery === "cdek" ? (
              <>
                <label>
                  Город
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Город получателя"
                    autoComplete="address-level2"
                  />
                  {errors.city ? <span className="checkout-error">{errors.city}</span> : null}
                </label>
                <label>
                  Адрес пункта СДЭК
                  <input
                    value={terminal}
                    onChange={(event) => setTerminal(event.target.value)}
                    placeholder="Улица и номер пункта"
                    autoComplete="off"
                  />
                  {errors.terminal ? <span className="checkout-error">{errors.terminal}</span> : null}
                  <a className="checkout-hint" href="https://www.cdek.ru/ru/offices" target="_blank" rel="noreferrer">
                    Найти пункт на cdek.ru
                  </a>
                </label>
              </>
            ) : (
              <p className="muted">{site.pickupNote}</p>
            )}
            <label>
              Комментарий
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value.slice(0, 800))}
                placeholder="Пожелания к заказу"
                rows={3}
              />
            </label>
            <div className="checkout-consent">
              <input id="order-consent" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>
                <label htmlFor="order-consent">Принимаю</label>{" "}
                <Link href="/oferta" onClick={(event) => event.stopPropagation()}>договор оферты</Link>{" "}
                и даю{" "}
                <Link href="/pers" onClick={(event) => event.stopPropagation()}>согласие на обработку персональных данных</Link>{" "}
                <label htmlFor="order-consent">для оформления заказа.</label>
              </span>
            </div>
            <div className="form-hp" aria-hidden="true">
              <input tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
            </div>
            {errors.consent ? <span className="checkout-error">{errors.consent}</span> : null}
            {errors.form ? <p className="checkout-error checkout-alert">{errors.form}</p> : Object.keys(errors).length > 0 ? <p className="checkout-error checkout-alert">Проверьте поля выше: без них заказ не отправится.</p> : null}
            <button className="btn red" type="submit" disabled={submitting}>
              {submitting ? "Отправляем…" : `Заказать на ${formatPrice(cart.total)}`}
            </button>
          </form>
          <aside className="checkout-summary">
            <h2>Ваш заказ</h2>
            <div className="checkout-items">
              {cart.items.map((item) => (
                <div className="checkout-item" key={`${item.path}-${item.variant}`}>
                  {item.image ? <img src={item.image} alt="" /> : <span className="cart-ph" />}
                  <div>
                    <Link href={item.path}>{item.title}</Link>
                    <small>{item.variant || "Базовый вариант"}</small>
                    <div className="qty">
                      <button type="button" aria-label="Уменьшить количество" onClick={() => cart.setQty(item.path, item.variant, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label="Увеличить количество" onClick={() => cart.setQty(item.path, item.variant, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <strong>{formatPrice(item.price * item.qty)}</strong>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <span>Итого</span>
              <strong>{formatPrice(cart.total)}</strong>
            </div>
            <p className="muted">Срок сборки заказа — 1–2 дня после подтверждения.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
