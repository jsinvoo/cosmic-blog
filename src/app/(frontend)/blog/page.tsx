import { getPayloadClient } from "@/lib/payload";
import { PostCard } from "@/components/blog/PostCard";
import { FilterSidebar } from "@/components/blog/FilterSidebar";
import { dateRangeToISO, readTimeToRange } from "@/lib/filters";
import Link from "next/link";
import type { Where } from "payload";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — CosmicCuriosity",
  description: "All articles from CosmicCuriosity",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categorySlugs = (typeof params.categories === "string" ? params.categories : "")
    .split(",")
    .filter(Boolean);
  const dateParam = typeof params.date === "string" ? params.date : "";
  const readTimeParam = typeof params.readTime === "string" ? params.readTime : "";

  const payload = await getPayloadClient();

  const categoriesResult = await payload.find({
    collection: "categories",
    limit: 50,
  });
  const categories = categoriesResult.docs;

  // Resolve selected category slugs to IDs
  let categoryIds: string[] = [];
  if (categorySlugs.length > 0) {
    categoryIds = categories
      .filter((c: any) => categorySlugs.includes(c.slug))
      .map((c: any) => c.id);
  }

  // Build dynamic where clause
  const where: Where = { _status: { equals: "published" } };

  if (categoryIds.length > 0) {
    where.category = { in: categoryIds };
  }

  const dateISO = dateRangeToISO(dateParam);
  if (dateISO) {
    where.publishedAt = { greater_than: dateISO };
  }

  const readRange = readTimeToRange(readTimeParam);
  if (readRange) {
    if (readRange.min !== undefined && readRange.max !== undefined) {
      where.and = [
        ...(Array.isArray((where as any).and) ? (where as any).and : []),
        { readTime: { greater_than_equal: readRange.min } },
        { readTime: { less_than_equal: readRange.max } },
      ];
    } else if (readRange.max !== undefined) {
      where.readTime = { less_than_equal: readRange.max };
    } else if (readRange.min !== undefined) {
      where.readTime = { greater_than_equal: readRange.min };
    }
  }

  const postsResult = await payload.find({
    collection: "posts",
    where,
    sort: "-publishedAt",
    limit: 20,
    depth: 2,
  });

  const posts = postsResult.docs;
  const hasFilters = categorySlugs.length > 0 || !!dateParam || !!readTimeParam;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white">All Posts</h1>
        <p className="mt-3 text-neutral-500 max-w-lg text-sm">
          Dive into our collection of articles on technology, science, and creativity.
        </p>
      </div>

      <div className="lg:flex lg:gap-8">
        <FilterSidebar categories={categories as any} />

        <div className="min-w-0 flex-1">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post: any, i: number) => (
                <PostCard key={post.id} {...post} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#2a2a2a] p-16 text-center">
              <h2 className="text-xl font-bold">
                {hasFilters ? "No posts match your filters" : "No posts published yet"}
              </h2>
              <p className="mt-2 text-neutral-400 text-sm">
                {hasFilters ? (
                  <Link href="/blog" className="text-[#00e5ff] hover:underline">
                    Clear all filters
                  </Link>
                ) : (
                  <>
                    Create posts in the{" "}
                    <a href="/admin" className="text-[#00e5ff] hover:underline">
                      admin dashboard
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
