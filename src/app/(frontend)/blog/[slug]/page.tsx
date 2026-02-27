import { getPayloadClient } from "@/lib/payload";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  const post = result.docs[0];
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — CosmicCuriosity`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  const post = result.docs[0] as any;
  if (!post) notFound();

  const heroImage = post.heroImage;
  const imageUrl = heroImage?.sizes?.hero?.url || heroImage?.url;
  const category = typeof post.category === "object" ? post.category : null;
  const author = typeof post.author === "object" ? post.author : null;

  return (
    <article>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={heroImage?.alt || post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#2a2a2a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl px-6 pb-10">
          {category && (
            <span className="inline-flex items-center gap-1.5 rounded border border-[#00e5ff]/20 bg-[#00e5ff]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00e5ff] mb-4">
              <Tag className="h-3 w-3" />
              {category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-400">
            {author && (
              <div className="flex items-center gap-2">
                {author.avatar?.url && (
                  <img
                    src={author.avatar.sizes?.thumbnail?.url || author.avatar.url}
                    alt={author.name}
                    className="h-8 w-8 rounded-full object-cover border border-white/10"
                  />
                )}
                <span>{author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <>
                <span className="opacity-30">·</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
            {post.readTime && (
              <>
                <span className="opacity-30">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime} min read
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {post.excerpt && (
          <p className="text-lg text-neutral-400 leading-relaxed mb-8 border-l-2 border-[#00e5ff]/30 pl-6 italic">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#00e5ff] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
          <RichTextContent content={post.content} />
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#00e5ff] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </div>
      </div>
    </article>
  );
}

function RichTextContent({ content }: { content: any }) {
  if (!content?.root?.children) {
    return <p className="text-neutral-400">No content available.</p>;
  }

  return (
    <div>
      {content.root.children.map((node: any, index: number) => (
        <RichTextNode key={index} node={node} />
      ))}
    </div>
  );
}

function RichTextNode({ node }: { node: any }) {
  if (!node) return null;

  if (node.type === "text") {
    let text: React.ReactNode = node.text;
    if (node.format & 1) text = <strong>{text}</strong>;
    if (node.format & 2) text = <em>{text}</em>;
    if (node.format & 8) text = <s>{text}</s>;
    if (node.format & 16) text = <code>{text}</code>;
    return <>{text}</>;
  }

  const children = node.children?.map((child: any, i: number) => (
    <RichTextNode key={i} node={child} />
  ));

  switch (node.type) {
    case "heading":
      const Tag = (`h${node.tag?.replace("h", "") || "2"}`) as keyof React.JSX.IntrinsicElements;
      return <Tag>{children}</Tag>;
    case "paragraph":
      return <p>{children}</p>;
    case "list":
      return node.listType === "number" ? <ol>{children}</ol> : <ul>{children}</ul>;
    case "listitem":
      return <li>{children}</li>;
    case "link":
    case "autolink":
      return (
        <a href={node.fields?.url || node.url} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    case "quote":
      return <blockquote>{children}</blockquote>;
    case "upload":
      const img = node.value;
      if (img?.url) {
        return (
          <figure>
            <img src={img.url} alt={img.alt || ""} className="rounded-xl" />
            {img.alt && <figcaption>{img.alt}</figcaption>}
          </figure>
        );
      }
      return null;
    default:
      return children ? <div>{children}</div> : null;
  }
}
