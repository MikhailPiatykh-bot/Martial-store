import { products, toCard, type ProductCard } from "@/lib/catalog";

const novinkiSlugs = [
  "618988042-142831881453-zaschitnaya-ekipirovka",
  "618988042-508213954023-nunchaka-sorevnovatelnaya",
  "618988042-283070608183-obuv-iskra",
  "618988042-119012373473-obuv-iskra",
  "618988042-660355773543-obuv-marshalki",
  "618988042-637050571253-obuv-iskra",
  "618988042-411956535133-obuv-marshalki",
  "618988042-528837479923-obuv-iskra",
  "618988042-630677475841-obuv-marshalki",
];

export function novinkiCards(): ProductCard[] {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return novinkiSlugs.flatMap((slug) => {
    const product = bySlug.get(slug);
    return product ? [toCard(product)] : [];
  });
}
