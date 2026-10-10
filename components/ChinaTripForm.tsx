"use client";

import { useState } from "react";
import { wuwayShifts } from "@/lib/wuway";

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

export function ChinaTripForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [shift, setShift] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const next: Record<string, string> = {};
    const cleanName = name.trim().replace(/\s+/g, " ");
    const ageNum = Number(age);
    if (cleanName.length < 2) next.name = "Укажите фамилию и имя";
    if (!Number.isInteger(ageNum) || ageNum < 4 || ageNum > 99) next.age = "Укажите возраст";
    if (phoneDigits.length !== 10) next.phone = "Укажите телефон полностью";
    if (!wuwayShifts.some((item) => item.value === shift)) next.shift = "Выберите смену";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/chinatrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, age: ageNum, phone: `+7${phoneDigits}`, shift }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setErrors({ form: data.error || "Не удалось отправить заявку. Попробуйте ещё раз." });
        return;
      }
      setSent(true);
    } catch {
      setErrors({ form: "Не удалось отправить заявку. Попробуйте ещё раз." });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <section className="china-form">
        <h2>Заявка отправлена</h2>
        <p className="china-form-note">Мы получили данные и свяжемся с вами.</p>
      </section>
    );
  }

  return (
    <form className="china-form" onSubmit={submit} noValidate>
      <h2>Забронировать место на сборы</h2>
      <label>
        Имя
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Фамилия Имя" autoComplete="name" />
        {errors.name ? <span>{errors.name}</span> : null}
      </label>
      <label>
        Возраст
        <input
          value={age}
          inputMode="numeric"
          onChange={(event) => setAge(event.target.value.replace(/\D/g, "").slice(0, 2))}
          placeholder="Возраст"
        />
        {errors.age ? <span>{errors.age}</span> : null}
      </label>
      <label>
        Телефон
        <span className="china-phone">
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
        {errors.phone ? <span>{errors.phone}</span> : null}
      </label>
      <label>
        Выбор смены
        <select value={shift} onChange={(event) => setShift(event.target.value)}>
          <option value="">Выберите смену</option>
          {wuwayShifts.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {errors.shift ? <span>{errors.shift}</span> : null}
      </label>
      {errors.form ? <p className="china-form-error">{errors.form}</p> : null}
      <button type="submit" className="china-submit" disabled={submitting}>
        {submitting ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}
