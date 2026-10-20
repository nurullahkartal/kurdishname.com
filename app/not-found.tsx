import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Sayfa Bulunamadı | KurdishName',
  description: 'Aradığınız sayfa bulunamadı veya taşınmış olabilir.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function GlobalNotFound() {
  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-black mb-4 text-[var(--accent)]">404</h1>
      <h2 className="text-2xl font-bold mb-3">Sayfa Bulunamadı / Page Not Found</h2>
      <p className="opacity-80 mb-8">
        Aradığınız sayfa mevcut değil. Aşağıdaki bağlantılardan ana sayfaya dönebilirsiniz.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/tr"
          className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold"
        >
          Türkçe Anasayfa
        </Link>
        <Link
          href="/en"
          className="px-5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] font-semibold"
        >
          English Home
        </Link>
      </div>
    </main>
  );
}
