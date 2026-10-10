import type { Metadata } from "next";
import { ChinaGallery } from "@/components/ChinaGallery";
import { ChinaMaster } from "@/components/ChinaMaster";
import { ChinaRail } from "@/components/ChinaRail";
import { ChinaTripForm } from "@/components/ChinaTripForm";
import { wuwayFaq, wuwayPhotos, wuwayReviews } from "@/lib/wuway";

export const metadata: Metadata = {
  title: { absolute: "Тур в китай" },
  alternates: { canonical: "/chinatrip" },
};

export default function ChinaTripPage() {
  return (
    <section className="section china-trip">
      <div className="wrap">
        <div className="china-hero">
          <div className="china-mark">
            <img src="/wuway/mark.png" alt="WuWay" width={638} height={442} />
          </div>
          <div>
            <h1>Открой настоящий Китай</h1>
            <p className="china-lead">
              Тренируйся с китайскими мастерами.{"\n"}
              Живи внутри школы.{"\n"}
              Почувствуй Китай изнутри.
            </p>
          </div>
        </div>

        <div className="china-cards">
          <article>
            <span className="china-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.035 17.012a3 3 0 0 0-3-3l-.311-.002a.72.72 0 0 1-.505-1.229l1.195-1.195A2 2 0 0 1 10.828 11H12a2 2 0 0 0 0-4H9.243a3 3 0 0 0-2.122.879l-2.707 2.707A4.83 4.83 0 0 0 3 14a8 8 0 0 0 8 8h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v2a2 2 0 1 0 4 0" />
                <path d="M13.888 9.662A2 2 0 0 0 17 8V5A2 2 0 1 0 13 5" />
                <path d="M9 5A2 2 0 1 0 5 5V10" />
                <path d="M9 7V4A2 2 0 1 1 13 4V7.268" />
              </svg>
            </span>
            <h2>Тренировочные сборы</h2>
            <p>
              Школа Паньгу приглашает на сборы, где вы освоите традиционные стили в месте их зарождения. Интенсивная программа включает от 2 до 3 тренировок ежедневно.
            </p>
          </article>
          <article>
            <span className="china-icon china-icon-temple" aria-hidden />
            <h2>Семинары</h2>
            <p>
              Культурная программа в Китае. Мы посетим храмы, парки, исторические места и памятники культуры, которые никого не оставят равнодушными, и конечно же посетим Великую стену. И вишенкой на торте - шоппинг.
            </p>
          </article>
          <article>
            <span className="china-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20" />
                <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
                <path d="m4 8 16-4" />
                <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
              </svg>
            </span>
            <h2>Сопровождение</h2>
            <p>
              Китай на вкус. Легендарные самовары HotPot, местная кухня и гастрономические открытия на каждом шагу - попробуем все, что стоит попробовать.
            </p>
          </article>
        </div>

        <h2>О школе и Мастере Лю</h2>
        <ChinaMaster>
            <p>
              Лю Ляньцзюнь, 65 лет, наследник бацзицюань, заместитель председателя Ассоциации боевых искусств Цанчжоу. За последние десять лет его школа обучила более 700 российских практиков.
            </p>
            <p>Программа школы Паньгу охватывает всю суть традиционной системы бацзицюань:</p>
            <p><strong>Кулачные техники</strong></p>
            <ul>
              <li>бацзицюань</li>
              <li>фаньцзыцюань</li>
              <li>багуачжан</li>
            </ul>
            <p><strong>Оружие</strong></p>
            <ul>
              <li>меч-дао</li>
              <li>большой меч бацзи</li>
              <li>верёвочный дротик шэнбяо</li>
            </ul>
            <p><strong>Почему именно школа Паньгу?</strong></p>
            <p>
              <strong>Первое: здесь живая традиция боевых искусств.</strong> В Цанчжоу зарегистрировано 53 вида кулачных и оружейных стилей — это 41% от 129 стилей, зарегистрированных по всему Китаю, и центральное место среди них занимает бацзицюань.
            </p>
            <p>
              <strong>Второе: международная среда, но кунг-фу без компромиссов.</strong> Школа Паньгу постоянно принимает группы из России и Европы.
            </p>
            <p>
              <strong>Третье: настоящее погружение.</strong> Ученики живут на территории школы, едят в столовой, тренируются два, а то и три раза в день.
            </p>
            <p>
              Школа находится в уезде Цинсянь города Цанчжоу провинции Хэбэй, примерно в двух часах езды от Пекина, ещё ближе к Тяньцзиню.
            </p>
        </ChinaMaster>

        <ChinaRail title="Отзывы о нас">
          {wuwayReviews.map((review) => (
            <article key={review.name} className="china-review">
              <p>«{review.text}»</p>
              <footer>{review.name}</footer>
            </article>
          ))}
        </ChinaRail>

        <ChinaTripForm />

        <details className="china-faq">
          <summary>
            Часто задаваемые вопросы
            <span aria-hidden>⌄</span>
          </summary>
          <div className="china-faq-list">
            {wuwayFaq.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span aria-hidden>⌄</span>
                </summary>
                {item.a ? <p>{item.a}</p> : null}
                {item.lead ? <p>{item.lead}</p> : null}
                {item.items?.length ? (
                  item.ordered ? (
                    <ol>
                      {item.items.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul>
                      {item.items.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )
                ) : null}
                {item.tail ? <p>{item.tail}</p> : null}
              </details>
            ))}
          </div>
        </details>

        <h2 className="china-video-title">Спортивные сборы в Китае 2025</h2>
        <div className="video-frame china-video">
          <iframe
            src="https://www.youtube.com/embed/DqpoF3qpQ9A"
            title="Спортивные сборы в Китае 2025"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <ChinaGallery photos={wuwayPhotos} />
      </div>
    </section>
  );
}
