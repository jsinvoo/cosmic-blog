import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              CosmicCuriosity.
            </Link>
          </div>

          {/* Main */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Main</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/blog" className="text-sm text-neutral-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Utility */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Utility</h4>
            <ul className="space-y-3">
              <li><Link href="/admin" className="text-sm text-neutral-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/blog" className="text-sm text-neutral-400 hover:text-white transition-colors">Archives</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Connect</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">RSS</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} CosmicCuriosity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
