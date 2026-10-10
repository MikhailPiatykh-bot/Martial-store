import posts from "@/data/baza.json";

export type BazaPost = {
  uid: string;
  slug: string;
  title: string;
  descr: string;
  paragraphs: string[];
  date: string;
  part: string;
  partuid: string;
  media: string;
  image: string;
};

const sectionOrder = ["Martial Store академия", "Китай", "КАЙШИ"] as const;

export const bazaPosts = posts as BazaPost[];

export const bazaSections = sectionOrder.map((title) => ({
  title,
  posts: bazaPosts
    .filter((post) => post.part === title)
    .sort((a, b) => b.date.localeCompare(a.date)),
}));

export function bazaPostBySlug(slug: string) {
  return bazaPosts.find((post) => post.slug === slug);
}

export function bazaPath(slug: string) {
  return `/tpost/${slug}`;
}

export function bazaExcerpt(post: BazaPost) {
  return post.descr || post.paragraphs[0] || "";
}

export function bazaEmbedSrc(url: string) {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;

  const vk = url.match(/video(-?\d+)_(\d+)/);
  if (!vk) return "";
  const params = new URLSearchParams({ oid: vk[1], id: vk[2], hd: "2" });
  const start = url.match(/[?&]t=(\d+)/);
  if (start) params.set("t", `${start[1]}s`);
  return `https://vkvideo.ru/video_ext.php?${params.toString()}`;
}
