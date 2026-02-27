"use client";

export function NewsletterSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-xl border border-white/10 bg-[#2a2a2a] p-10 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold italic text-white">
          Don&apos;t miss our weekly post
        </h2>
        <p className="mt-3 text-neutral-500 max-w-md mx-auto text-sm leading-relaxed">
          Get the latest posts delivered to your inbox. No spam, just pure
          curiosity fuel.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/20 transition-all"
          />
          <button
            type="submit"
            className="rounded-lg border border-[#00e5ff] px-7 py-3 text-sm font-medium text-[#00e5ff] transition-all hover:bg-[#00e5ff]/10 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
