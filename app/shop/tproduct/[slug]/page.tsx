import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";
import { productBySlug, products } from "@/lib/catalog";
import { publicImageSize } from "@/lib/imageSize";
import { productSeo } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: { absolute: "Товар не найден" } };
  const { title, description } = productSeo(product);
  const image = product.images[0];
  const size = image ? publicImageSize(image) : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: product.path },
    openGraph: {
      title,
      description,
      url: product.path,
      images: image ? [{ url: image, alt: product.title, ...size }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    other: {
      "og:type": "product",
      "product:price:amount": String(product.price),
      "product:price:currency": "RUB",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.lead || product.text.slice(0, 300),
    image: product.images,
    category: product.categories.join(", "),
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `https://martial-store.ru${product.path}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} />
    </>
  );
}
