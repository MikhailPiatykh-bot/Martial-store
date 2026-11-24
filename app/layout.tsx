import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/components/CartProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { YandexMetrika } from "@/components/YandexMetrika";
import { YandexMetrikaClicks, YandexMetrikaHit } from "@/components/YandexMetrikaTracker";
import "./globals.css";

const sans = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const display = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://martial-store.ru"),
  title: { absolute: "Инвентарь для ушу | Martial Store" },
  description:
    "Оружие, форма, обувь и аксессуары для ушу. Доставка по России в пункт СДЭК, самовывоз в Москве.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable}`}>
      <body>
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
        <YandexMetrika />
        <YandexMetrikaClicks />
        <Suspense fallback={null}>
          <YandexMetrikaHit />
        </Suspense>
      </body>
    </html>
  );
}
