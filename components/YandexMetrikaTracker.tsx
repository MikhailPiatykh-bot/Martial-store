"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { goalForHref, metrikaHit, reachGoal } from "@/lib/metrika";

export function YandexMetrikaHit() {
  const pathname = usePathname();
  const search = useSearchParams();
  const skipFirstHit = useRef(true);

  useEffect(() => {
    if (skipFirstHit.current) {
      skipFirstHit.current = false;
      return;
    }
    const query = search.toString();
    metrikaHit(query ? `${pathname}?${query}` : pathname);
  }, [pathname, search]);

  return null;
}

export function YandexMetrikaClicks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0) return;
      const node = event.target;
      if (!(node instanceof Node)) return;
      const element = node instanceof Element ? node : node.parentElement;
      if (!element) return;
      const anchor = element.closest("a");
      if (!(anchor instanceof HTMLAnchorElement) || !anchor.hasAttribute("href")) return;
      const goal = goalForHref(anchor.href);
      if (!goal) return;
      reachGoal(goal);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
