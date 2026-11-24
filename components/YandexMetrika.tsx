import { metrikaInitSource, metrikaNoscriptHtml } from "@/lib/metrika";

export function YandexMetrika() {
  return (
    <>
      <script id="yandex-metrika" dangerouslySetInnerHTML={{ __html: metrikaInitSource() }} />
      <noscript dangerouslySetInnerHTML={{ __html: metrikaNoscriptHtml() }} />
    </>
  );
}
