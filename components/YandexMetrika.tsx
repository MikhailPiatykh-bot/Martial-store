"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const counterId = 84772357;

type Metrika = (id: number, method: string, ...args: unknown[]) => void;

export function YandexMetrika() {
  const pathname = usePathname();
  const search = useSearchParams();
  const skipFirstHit = useRef(true);

  useEffect(() => {
    if (skipFirstHit.current) {
      skipFirstHit.current = false;
      return;
    }
    const query = search.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    (window as Window & { ym?: Metrika }).ym?.(counterId, "hit", url);
  }, [pathname, search]);

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${counterId}","ym");ym(${counterId},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});`}
      </Script>
      <noscript>
        <div>
          <img src={`https://mc.yandex.ru/watch/${counterId}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
        </div>
      </noscript>
    </>
  );
}
