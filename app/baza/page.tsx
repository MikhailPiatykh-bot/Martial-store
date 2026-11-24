import { BazaView } from "@/components/BazaView";
import { bazaSections } from "@/lib/baza";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/baza",
  title: "База знаний — Martial Store",
  description:
    "Обучающие видео и материалы Martial Store об ушу: академия магазина, поездки в Китай и турнир «Кайши».",
});

export default function BazaPage() {
  return (
    <section className="section">
      <div className="wrap">
        <BazaView sections={bazaSections} />
      </div>
    </section>
  );
}
