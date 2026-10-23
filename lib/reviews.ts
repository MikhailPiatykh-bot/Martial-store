export type Review = {
  id?: string;
  source: "Яндекс Карты";
  name: string;
  date: string;
  rating: number;
  text: string;
};

export const yandexReviewsUrl =
  "https://yandex.ru/maps/org/tovary_i_ekipirovka_dlya_ushu_i_kungfu/96913793575/reviews/";

const yandexReviewsPage = "https://yandex.ru/maps/org/96913793575/reviews/";
const ownerName = "михаил пятых";

export const reviews: Review[] = [
  {
    source: "Яндекс Карты",
    name: "Elizaveta B.",
    date: "6 сентября 2026",
    rating: 5,
    text: "Классный магазин! Очень большой выбор инвентаря и формы! Наконец-то нашла себе качественную и удобную форму для тренировок на каждый день. Уже год выдерживает почти ежедневные стирки. Ещё видела новые кеды для ушу выглядят очень качественно и красиво! Ждем поставки. Отвечают быстро, отправляют тоже.",
  },
  {
    source: "Яндекс Карты",
    name: "Марина Косарева",
    date: "24 сентября 2026",
    rating: 5,
    text: "Работаем с компанией уже 3 года! Качество товара всегда отличное, доставка в срок, индивидуальный подход. Могу смело рекомендовать.",
  },
  {
    source: "Яндекс Карты",
    name: "Галина Еронова",
    date: "4 октября 2026",
    rating: 5,
    text: "Пользуемся услугами этого магазина уже больше года. Живем в другом городе, товар всегда отличного качества, на заказ реагируют быстро, упаковывают хорошо, отправка и доставка в срок. Большое вам спасибо!",
  },
  {
    source: "Яндекс Карты",
    name: "Антон Андреев",
    date: "6 сентября 2026",
    rating: 5,
    text: "Лучший магазин для ушу. Закупаемся давно и много, все самого высокого качества. Если вдруг что-то не так, то всегда есть служба поддержки, которая максимально оперативно все решает.",
  },
  {
    source: "Яндекс Карты",
    name: "Юлия",
    date: "23 сентября 2026",
    rating: 5,
    text: "Нравится сотрудничать с магазином! Товары надлежащего качества. Живу в другом городе поэтому взаимодействуем онлайн. Реагируют на заказ быстро, упаковывают хорошо. Советую продавца.",
  },
  {
    source: "Яндекс Карты",
    name: "Настя В.",
    date: "6 сентября 2026",
    rating: 5,
    text: "Все супер, покупаем инвентарь для команды, а также личное снаряжение. Хорошие цены, всегда большой ассортимент, всем довольны)",
  },
  {
    source: "Яндекс Карты",
    name: "Дарья Агалакова",
    date: "23 сентября 2026",
    rating: 5,
    text: "Замечательный магазин! Покупаем товары для Академии Ушу, все очень нравится. Хорошие цены, отвечают быстро, заказ собирают оперативно. Рекомендуем!",
  },
  {
    source: "Яндекс Карты",
    name: "Алексей Косарев",
    date: "17 сентября 2026",
    rating: 5,
    text: "Работаю с Martial Store не один год. Всегда всё в срок. Ребята относятся к своим клиентам порядочено и всегда на связи.",
  },
  {
    source: "Яндекс Карты",
    name: "Марина Ермак",
    date: "3 сентября 2026",
    rating: 5,
    text: "Очень быстро доставили чехол, администратор оперативно отвечал в чате в телеграмме, посылка за два дня дошла СДЭКом. Чехол отличный, спасибо.",
  },
  {
    source: "Яндекс Карты",
    name: "Алексей Борейко",
    date: "6 сентября 2026",
    rating: 5,
    text: "Приобрел для ребенка форму для занятий, отличное качество и внешний вид, теперь не хочет носить вещи без логотипов клуба!!!",
  },
  {
    source: "Яндекс Карты",
    name: "Сергей Сумцов",
    date: "22 сентября 2026",
    rating: 5,
    text: "Магазин рекомендую! Очень качественная одежда и экипировка для ушу. Ценник более чем адекватный. Доставка быстрая.",
  },
  {
    source: "Яндекс Карты",
    name: "Анастасия Линдэ",
    date: "28 сентября 2026",
    rating: 5,
    text: "Рекомендую этот магазин спортивных товаров для ушу! Быстро отвечают, быстро доставляют. Качество проверено уже годами.",
  },
  {
    source: "Яндекс Карты",
    name: "Ольга Поветкина",
    date: "6 сентября 2026",
    rating: 5,
    text: "Покупали инвентарь на группу, все четко быстро. Мы довольны. Заказываем постоянно. Доставка быстро.",
  },
  {
    source: "Яндекс Карты",
    name: "Виктория Н",
    date: "6 сентября 2026",
    rating: 5,
    text: "Отличный магазин, весь товар в наличии, можно приехать и выбрать из большого ассортимента.",
  },
  {
    source: "Яндекс Карты",
    name: "KPV",
    date: "23 сентября 2026",
    rating: 5,
    text: "В России не много специализированных магазинов с товарами для УШУ. Этот магазин любим. Заказ удобный, доставка быстрая. И т.к. они недалеко от нашего города, то недорогая.",
  },
  {
    source: "Яндекс Карты",
    name: "Серяков Е.",
    date: "6 сентября 2026",
    rating: 5,
    text: "Хороший магазин, опытные консультанты. Искала меч ребенку для занятий, помогли определиться с размером и все быстро пришло.",
  },
  {
    source: "Яндекс Карты",
    name: "валентина п.",
    date: "6 сентября 2026",
    rating: 5,
    text: "С магазином знакомы давно, ребята знают свое дело, всегда помогут подскажут. Доставка, упаковка, обратная связь — все на уровне.",
  },
  {
    source: "Яндекс Карты",
    name: "Игорь Г.",
    date: "22 сентября 2026",
    rating: 5,
    text: "Хороший магазин. Большой выбор спортивного инвентаря. Опытный продавец помог подобрать меч Дао.",
  },
  {
    source: "Яндекс Карты",
    name: "Юлия Минаева",
    date: "16 сентября 2026",
    rating: 5,
    text: "Отличный магазин, всегда индувидуальный и профессиональный подход, все быстро и четко! Спасибо!",
  },
  {
    source: "Яндекс Карты",
    name: "Алёна Левина",
    date: "24 сентября 2026",
    rating: 5,
    text: "Отличный магазин, сотрудничаем не первый год, всегда все четко и быстро. Администрация всегда поможет и подскажет!",
  },
  {
    source: "Яндекс Карты",
    name: "Евгения О.",
    date: "5 октября 2026",
    rating: 5,
    text: "Уже не первый год заказываю обуви и форму для ушу, в Воронеж. Очень отзывчивые, быстро помогают с выбором и высылают. Спасают перед соревнованиями.",
  },
  {
    source: "Яндекс Карты",
    name: "Артём Алимкин",
    date: "6 сентября 2026",
    rating: 5,
    text: "Покупал костюм, меч и палку. Качество очень хороше. Рекомендую.",
  },
  {
    source: "Яндекс Карты",
    name: "Kristina",
    date: "24 сентября 2026",
    rating: 5,
    text: "Хороший магазин. Заказала меч и чехол. Отправка через сдек. Пришло все через 2 дня. Спасибо.",
  },
  {
    source: "Яндекс Карты",
    name: "Диана Никулина",
    date: "25 сентября 2026",
    rating: 5,
    text: "Хороший магазин, качественные товары, быстрая доставка.",
  },
  {
    source: "Яндекс Карты",
    name: "gildiyakuznecov",
    date: "16 сентября 2026",
    rating: 5,
    text: "Магазин супер!! Сотрудничаем уже 3 года. Профессионалы!",
  },
  {
    source: "Яндекс Карты",
    name: "Надежда К.",
    date: "23 сентября 2026",
    rating: 5,
    text: "Отличный магазин. Товары качественные.",
  },
  {
    source: "Яндекс Карты",
    name: "Олег",
    date: "24 сентября 2026",
    rating: 5,
    text: "Много лет сотрудничаем с martial store и довольны партнерством!",
  },
];

type YandexReview = {
  reviewId?: string;
  text?: string;
  rating?: number;
  updatedTime?: string;
  author?: { name?: string };
};

function extractJsonObject(html: string, marker: string) {
  const at = html.indexOf(marker);
  if (at < 0) return null;
  const start = at + marker.length;
  if (html[start] !== "{") return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < html.length; index += 1) {
    const char = html[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, index + 1)) as unknown;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function formatReviewDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Moscow",
  })
    .format(date)
    .replace(/\s*г\.\s*$/, "");
}

export function reviewsLabel(count: number) {
  const last = count % 10;
  const lastTwo = count % 100;
  if (last === 1 && lastTwo !== 11) return "отзыв";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return "отзыва";
  return "отзывов";
}

export function parseYandexReviewsHtml(html: string) {
  const payload = extractJsonObject(html, '"reviewResults":');
  if (!payload || typeof payload !== "object" || !("reviews" in payload)) return null;
  const list = (payload as { reviews?: YandexReview[] }).reviews;
  if (!Array.isArray(list)) return null;
  const parsed = list
    .flatMap((item) => {
      const name = item.author?.name?.trim() ?? "";
      const text = item.text?.trim() ?? "";
      const rating = Math.round(Number(item.rating));
      if (!name || !text || name.toLocaleLowerCase("ru") === ownerName) return [];
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) return [];
      const review: Review & { time: number } = {
        id: item.reviewId,
        source: "Яндекс Карты",
        name,
        date: item.updatedTime ? formatReviewDate(item.updatedTime) : "",
        rating,
        text,
        time: item.updatedTime ? Date.parse(item.updatedTime) : 0,
      };
      return [review];
    })
    .sort((a, b) => b.time - a.time)
    .map(({ time: _time, ...review }) => review);
  if (!parsed.length) return null;
  const countMatch = html.match(/"reviewCount":(\d+)/);
  const total = countMatch ? Number(countMatch[1]) : parsed.length;
  return { reviews: parsed, total: total > 0 ? total : parsed.length };
}

export async function loadYandexReviews() {
  try {
    const response = await fetch(yandexReviewsPage, {
      headers: {
        "Accept-Language": "ru",
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(String(response.status));
    const parsed = parseYandexReviewsHtml(await response.text());
    if (!parsed) throw new Error("empty");
    return parsed;
  } catch {
    return { reviews, total: reviews.length };
  }
}
