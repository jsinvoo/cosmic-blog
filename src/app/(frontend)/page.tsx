import { getPayloadClient } from "@/lib/payload";
import { PostCard } from "@/components/blog/PostCard";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const payload = await getPayloadClient();

  const postsResult = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 7,
    depth: 2,
  });

  const posts = postsResult.docs;
  const featuredPost = posts.find((p: any) => p.featured) || posts[0];
  const latestPosts = posts.filter((p: any) => p.id !== featuredPost?.id).slice(0, 6);

  return (
    <>
      {/* Featured Post */}
      {featuredPost && (
        <section className="mx-auto max-w-6xl px-6 pt-8 pb-10">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Featured posts
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <PostCard {...(featuredPost as any)} featured index={0} />
        </section>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section id="latest" className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Latest posts
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post: any, i: number) => (
              <PostCard key={post.id} {...post} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#00e5ff] hover:underline transition-colors"
            >
              Explore more articles &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="rounded-xl border border-white/10 bg-[#2a2a2a] p-16">
            <h2 className="text-2xl font-bold">No posts yet</h2>
            <p className="mt-2 text-neutral-400 text-sm">
              Head to the{" "}
              <a href="/admin" className="text-[#00e5ff] hover:underline">
                admin dashboard
              </a>{" "}
              to create your first post, or run the seed script.
            </p>
          </div>
        </section>
      )}

      <NewsletterSection />
    </>
  );
}
