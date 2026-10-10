"use client";

import Link from "next/link";
import { useState } from "react";
import { bazaExcerpt, bazaPath, type BazaPost } from "@/lib/baza";

const filters = [
  { id: "all", label: "По умолчанию" },
  { id: "КАЙШИ", label: "Кайши" },
  { id: "Китай", label: "Китай" },
  { id: "Martial Store академия", label: "Академия" },
] as const;

export function BazaView({
  sections,
}: {
  sections: { title: string; posts: BazaPost[] }[];
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const visible = filter === "all" ? sections : sections.filter((section) => section.title === filter);

  return (
    <>
      <div className="page-title baza-head">
        <h1>База знаний</h1>
      </div>
      <div className="baza-filters" role="tablist" aria-label="Разделы базы знаний">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={filter === item.id ? "is-on" : undefined}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {visible.map((section) => (
        <div key={section.title} className="baza-section">
          <h2>{section.title}</h2>
          <div className="baza-grid">
            {section.posts.map((post) => (
              <Link key={post.uid} className="baza-card" href={bazaPath(post.slug)}>
                {post.image ? <img src={post.image} alt="" /> : <span className="baza-cover" />}
                <h3>{post.title}</h3>
                {bazaExcerpt(post) ? <p>{bazaExcerpt(post)}</p> : null}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
