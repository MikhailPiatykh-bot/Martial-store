import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bazaEmbedSrc, bazaPath, bazaPostBySlug, bazaPosts } from "@/lib/baza";

export function generateStaticParams() {
  return bazaPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = bazaPostBySlug(slug);
  if (!post) return { title: { absolute: "Материал не найден" } };
  const description = post.descr || post.paragraphs[0] || post.title;
  return {
    title: { absolute: post.title },
    description,
    alternates: { canonical: bazaPath(post.slug) },
  };
}

export default async function BazaPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = bazaPostBySlug(slug);
  if (!post) notFound();
  const embed = bazaEmbedSrc(post.media);

  return (
    <article className="wrap prose">
      <div className="page-title">
        <p className="kicker">{post.part}</p>
        <h1>{post.title}</h1>
      </div>
      {embed ? (
        <div className="video-frame">
          <iframe src={embed} title={post.title} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      ) : null}
      {post.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {!post.paragraphs.length && post.descr ? <p>{post.descr}</p> : null}
      <p><Link href="/baza">Все материалы базы знаний</Link></p>
    </article>
  );
}
