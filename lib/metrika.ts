export const METRIKA_GOALS = [
  "order_submit",
  "add_to_cart",
  "checkout_open",
  "click_whatsapp",
  "click_telegram",
  "click_max",
  "click_vk",
  "click_phone",
  "click_tg_channel",
] as const;

export type MetrikaGoal = (typeof METRIKA_GOALS)[number];

export type MetrikaParams = Record<string, string | number | boolean>;

const DEFAULT_COUNTER_ID = 84772357;
const STORE_PHONE = "79852202326";
const TG_CHANNEL = "martialstorerus";

/** Production counter, unless NEXT_PUBLIC_YM_ID overrides it at build time. */
export function metrikaCounterId() {
  const raw = process.env.NEXT_PUBLIC_YM_ID?.trim();
  if (raw && /^[1-9]\d{0,14}$/.test(raw)) return Number(raw);
  return DEFAULT_COUNTER_ID;
}

export const METRIKA_COUNTER_ID = metrikaCounterId();

type YmFn = ((counterId: number, method: string, ...args: unknown[]) => void) & {
  a?: IArguments[];
  l?: number;
};

function createYmStub(): YmFn {
  const ym = function (this: unknown) {
    const stub = ym as YmFn;
    (stub.a = stub.a || []).push(arguments);
  } as YmFn;
  ym.l = Date.now();
  return ym;
}

function ensureYm(): YmFn | null {
  if (typeof window === "undefined") return null;
  const host = window as Window & { ym?: YmFn };
  if (typeof host.ym !== "function") host.ym = createYmStub();
  return host.ym;
}

export function reachGoal(id: MetrikaGoal, params?: MetrikaParams) {
  const ym = ensureYm();
  if (!ym) return;
  if (params) ym(METRIKA_COUNTER_ID, "reachGoal", id, params);
  else ym(METRIKA_COUNTER_ID, "reachGoal", id);
}

export function metrikaHit(url: string) {
  const ym = ensureYm();
  if (!ym) return;
  ym(METRIKA_COUNTER_ID, "hit", url);
}

const reportedOrders = new Set<string>();
const ORDER_GOAL_KEY = "martial-metrika-order-goals";

function readReportedOrders() {
  try {
    const raw = sessionStorage.getItem(ORDER_GOAL_KEY);
    const ids = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(ids)) return [];
    return ids.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function rememberReportedOrder(orderId: string) {
  reportedOrders.add(orderId);
  try {
    const ids = readReportedOrders();
    if (!ids.includes(orderId)) ids.push(orderId);
    sessionStorage.setItem(ORDER_GOAL_KEY, JSON.stringify(ids.slice(-30)));
  } catch {
    // Storage can be unavailable. The in-memory set still covers this document.
  }
}

export function reachOrderSubmit(orderId: string, orderPrice: number) {
  if (typeof window === "undefined" || !orderId) return;
  if (reportedOrders.has(orderId) || readReportedOrders().includes(orderId)) return;
  rememberReportedOrder(orderId);
  reachGoal("order_submit", { order_id: orderId, order_price: orderPrice });
}

export function goalForHref(href: string): MetrikaGoal | null {
  let url: URL;
  try {
    url = new URL(href, "https://martial-store.ru");
  } catch {
    return null;
  }
  if (url.protocol === "tel:") {
    const digits = `${url.pathname}${url.search}`.replace(/\D/g, "");
    return digits === STORE_PHONE ? "click_phone" : null;
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "wa.me") return "click_whatsapp";
  if (host === "max.ru") return "click_max";
  if (host === "vk.com" || host === "m.vk.com") return "click_vk";
  if (host === "t.me" || host === "telegram.me") {
    let path = url.pathname;
    try {
      path = decodeURIComponent(path);
    } catch {
      return null;
    }
    const segment = path.replace(/\/+$/, "").split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
    if (segment === TG_CHANNEL) return "click_tg_channel";
    if (segment === `+${STORE_PHONE}` || segment === STORE_PHONE) return "click_telegram";
  }
  return null;
}

export function metrikaInitSource(counterId = METRIKA_COUNTER_ID) {
  return `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${counterId}","ym");ym(${counterId},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});`;
}

export function metrikaNoscriptHtml(counterId = METRIKA_COUNTER_ID) {
  return `<div><img src="https://mc.yandex.ru/watch/${counterId}" style="position:absolute;left:-9999px" alt="" /></div>`;
}
