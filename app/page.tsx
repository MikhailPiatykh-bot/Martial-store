import Link from "next/link";
import { ReviewsRail } from "@/components/ReviewsRail";
import { categories, categoryHref, categoryImage, priceLabel } from "@/lib/catalog";
import { SALE_CATEGORY, rasprodazhaCards } from "@/lib/rasprodazha";
import { loadYandexReviews, reviewsLabel, yandexReviewsUrl } from "@/lib/reviews";

export default async function HomePage() {
  const { reviews, total } = await loadYandexReviews();
  const sale = rasprodazhaCards();
  return (
    <>
      <section className="section advantages" id="advantages">
        <div className="wrap">
          <h2>Преимущества работы с нами</h2>
          <ul className="advantages-list">
            <li>Всё в наличии на складе</li>
            <li>Работаем по безналу</li>
            <li>Работаем с тендерами и гос. заказами</li>
            <li>Оффлайн шоурум — ждём вас</li>
            <li>Поможем подобрать экипировку</li>
            <li>Пошив на заказ</li>
            <li>Гарантия, обмен и возврат</li>
            <li>Мечи с сертификацией</li>
            <li>Высокое качество товара</li>
            <li>Оригинальная продукция</li>
          </ul>
        </div>
      </section>

      {sale.length > 0 ? (
      <section className="section sale" id="rasprodazha">
        <div className="wrap">
          <div className="sale-head">
            <h2>Распродажа</h2>
            <Link href={categoryHref(SALE_CATEGORY)}>Смотреть все</Link>
          </div>
            <div className="grid">
              {sale.map((card) => (
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
        </div>
      </section>
      ) : null}

      <section className="section">
        <div className="wrap">
          <h2>Витрина</h2>
          <div className="cats">
            {categories.map((category) => {
              const image = categoryImage(category.title);
              return (
                <Link key={category.uid} className={image ? "cat has-photo" : "cat"} href={categoryHref(category.title)}>
                  {image ? <img src={image} alt="" /> : null}
                  <span>{category.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section reviews" id="reviews">
        <div className="wrap">
          <h2>Отзывы</h2>
          <p className="reviews-lead">
            <a href={yandexReviewsUrl} target="_blank" rel="noreferrer">
              Яндекс Карты · {total} {reviewsLabel(total)}
            </a>
          </p>
          <ReviewsRail>
            {reviews.map((review) => (
              <article key={review.id ?? `${review.name}-${review.date}`} className="review-card">
                <div className="review-top">
                  <span className="review-stars" aria-label={`Оценка ${review.rating} из 5`}>
                    {"★★★★★".slice(0, review.rating)}
                    <span>{"★★★★★".slice(review.rating)}</span>
                  </span>
                  <span className="review-source">{review.source}</span>
                </div>
                <p>{review.text}</p>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </footer>
              </article>
            ))}
          </ReviewsRail>
        </div>
      </section>
    </>
  );
}
