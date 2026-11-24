import { products, toCard, type ProductCard } from "@/lib/catalog";

const novinkiSlugs = [
  "618988042-704918263501-sportivnaya-futbolka-golubaya",
  "618988042-704918263502-sportivnaya-futbolka-rozovaya",
  "618988042-508213954023-nunchaka-sorevnovatelnaya",
  "618988042-609352718408-nunchaka-uchebnaya-krasnaya",
  "618988042-710463829519-nunchaka-uchebnaya-chernaya",
  "618988042-487130596286-taitszi-tszyan-skladnoi",
  "618988042-809362718409-nakonechnik-na-kope-pro",
  "618988042-587140496287-lezvie-dlya-guidin-dao",
  "618988042-698251607398-lezvie-dlya-guidin-tszyan",
  "618988042-265918374064-tsilin-dao",
  "618988042-476029385176-mechi-duanbin",
  "618988042-365918274065-mechi-da-tszyan",
  "618988042-142831881453-zaschitnaya-ekipirovka",
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
