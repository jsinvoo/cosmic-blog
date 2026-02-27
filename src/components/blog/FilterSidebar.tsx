"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: Category[];
}

const DATE_OPTIONS = [
  { label: "Last week", value: "last-week" },
  { label: "Last month", value: "last-month" },
  { label: "Last 3 months", value: "last-3-months" },
  { label: "This year", value: "this-year" },
] as const;

const READ_TIME_OPTIONS = [
  { label: "Under 5 min", value: "under-5" },
  { label: "5–10 min", value: "5-10" },
  { label: "Over 10 min", value: "over-10" },
] as const;

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) ?? [];
  const selectedDate = searchParams.get("date") ?? "";
  const selectedReadTime = searchParams.get("readTime") ?? "";

  const hasFilters = selectedCategories.length > 0 || !!selectedDate || !!selectedReadTime;

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      updater(params);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  const toggleCategory = (slug: string) => {
    pushParams((p) => {
      const current = p.get("categories")?.split(",").filter(Boolean) ?? [];
      const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      if (next.length) p.set("categories", next.join(","));
      else p.delete("categories");
    });
  };

  const setDate = (value: string) => {
    pushParams((p) => {
      if (p.get("date") === value) p.delete("date");
      else p.set("date", value);
    });
  };

  const setReadTime = (value: string) => {
    pushParams((p) => {
      if (p.get("readTime") === value) p.delete("readTime");
      else p.set("readTime", value);
    });
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const content = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="h-4 w-4 rounded border-white/20 bg-transparent text-[#00e5ff] accent-[#00e5ff] focus:ring-[#00e5ff]/30"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Date Range
        </h3>
        <div className="space-y-2">
          {DATE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <input
                type="radio"
                name="date"
                checked={selectedDate === opt.value}
                onChange={() => setDate(opt.value)}
                className="h-4 w-4 border-white/20 bg-transparent text-[#00e5ff] accent-[#00e5ff] focus:ring-[#00e5ff]/30"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Read time */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Read Time
        </h3>
        <div className="space-y-2">
          {READ_TIME_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <input
                type="radio"
                name="readTime"
                checked={selectedReadTime === opt.value}
                onChange={() => setReadTime(opt.value)}
                className="h-4 w-4 border-white/20 bg-transparent text-[#00e5ff] accent-[#00e5ff] focus:ring-[#00e5ff]/30"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-[#00e5ff]/50 hover:text-[#00e5ff]"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-xl border border-white/10 bg-[#2a2a2a] p-5">
          <h2 className="mb-5 text-sm font-bold text-white">Filters</h2>
          {content}
        </div>
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#2a2a2a] px-5 py-3 text-sm font-bold text-white"
        >
          <span>Filters{hasFilters ? ` (active)` : ""}</span>
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="mt-2 rounded-xl border border-white/10 bg-[#2a2a2a] p-5">
            {content}
          </div>
        )}
      </div>
    </>
  );
}
