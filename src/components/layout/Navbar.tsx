"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#1a1a1a]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          CosmicCuriosity.
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/admin" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/5"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#1a1a1a]">
          <div className="flex flex-col gap-4 px-6 py-6">
            <Link href="/" className="text-sm text-neutral-400 hover:text-[#00e5ff] transition-colors" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/blog" className="text-sm text-neutral-400 hover:text-[#00e5ff] transition-colors" onClick={() => setIsOpen(false)}>
              Blog
            </Link>
            <Link href="/about" className="text-sm text-neutral-400 hover:text-[#00e5ff] transition-colors" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/admin" className="text-sm text-neutral-400 hover:text-[#00e5ff] transition-colors" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
