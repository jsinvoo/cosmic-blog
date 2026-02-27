"use client";

import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
}

export function CategoryPills({ categories }: { categories: Category[] }) {
  if (!categories?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/blog?category=${cat.slug}`}
          className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-neutral-400 transition-all hover:border-[#00e5ff]/50 hover:text-[#00e5ff]"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
