"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt?: string;
  readTime?: number;
  category?: { name: string; color?: string };
  author?: { name: string };
  heroImage?: { url?: string; alt?: string; sizes?: { card?: { url?: string } } };
  index?: number;
  featured?: boolean;
}

export function PostCard({
  title,
  slug,
  publishedAt,
  readTime,
  category,
  heroImage,
  index = 0,
  featured = false,
}: PostCardProps) {
  const imageUrl = heroImage?.sizes?.card?.url || heroImage?.url;

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#2a2a2a] transition-all duration-300 hover:border-[#00e5ff]/30 md:grid md:grid-cols-2">
        {/* Image */}
        <div className="relative h-64 md:h-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={heroImage?.alt || title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-[#333] flex items-center justify-center">
              <span className="text-4xl opacity-20">+</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative p-8 flex flex-col justify-center">
          {category && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-0.5 h-4 bg-[#00e5ff]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00e5ff]">
                {category.name}
              </span>
            </div>
          )}

          <h3 className="text-2xl font-bold leading-tight text-white transition-colors group-hover:text-[#00e5ff]">
            <Link href={`/blog/${slug}`} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h3>

          <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
            {publishedAt && <span>{formatDate(publishedAt)}</span>}
            {readTime && (
              <>
                <span>·</span>
                <span>{readTime} min read</span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#2a2a2a] transition-all duration-300 hover:border-[#00e5ff]/30 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={heroImage?.alt || title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[#333] flex items-center justify-center">
            <span className="text-4xl opacity-20">+</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {category && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 bg-[#00e5ff]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00e5ff]">
              {category.name}
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-[#00e5ff]">
          <Link href={`/blog/${slug}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>

        <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
          {readTime && (
            <>
              <span>·</span>
              <span>{readTime} min read</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
