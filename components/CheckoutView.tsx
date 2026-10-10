"use client";

import Link from "next/link";
import { useState } from "react";
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
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
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          phone: `+7${phoneDigits}`,
          delivery,
          city: delivery === "cdek" ? city.trim() : "",
          terminal: delivery === "cdek" ? terminal.trim() : "",
          comment: comment.trim(),
          consent: true,
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
            Сумма {formatPrice(done.total)}. Мы проверим наличие и свяжемся с вами, чтобы подтвердить заказ и способ оплаты.
            Отправка в СДЭК — по вторникам и четвергам.
          </p>
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
          После заявки мы проверим склад и подтвердим заказ. Оплата — наличная или безналичная, способ фиксируем при подтверждении.
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
            <label className="checkout-consent">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>
                Принимаю <Link href="/oferta">договор оферты</Link> и даю{" "}
                <Link href="/pers">согласие на обработку персональных данных</Link> для оформления заказа.
              </span>
            </label>
            {errors.consent ? <span className="checkout-error">{errors.consent}</span> : null}
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
