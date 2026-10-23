import { redirect } from "next/navigation";
import { categoryHref } from "@/lib/catalog";

export default function RasprodazhaPage() {
  redirect(categoryHref("Распродажа"));
}
