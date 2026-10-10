import type { Metadata } from "next";
import { BazaView } from "@/components/BazaView";
import { bazaSections } from "@/lib/baza";

export const metadata: Metadata = {
  title: { absolute: "База знаний" },
  alternates: { canonical: "/baza" },
};

export default function BazaPage() {
  return (
    <section className="section">
      <div className="wrap">
        <BazaView sections={bazaSections} />
      </div>
    </section>
  );
}
