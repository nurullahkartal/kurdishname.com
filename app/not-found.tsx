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
  const notFoundFixScript = `(function(){
    try {
      var p = window.location.pathname;
      var lower = p.toLowerCase();
      if (p.indexOf('/names/') === 0) {
        window.location.replace('/tr/isim/' + lower.substring(7));
        return;
      }
      if (p.indexOf('/isim/') === 0) {
        window.location.replace('/tr/isim/' + lower.substring(6));
        return;
      }
      if (p !== lower) {
        window.location.replace(lower);
        return;
      }
    } catch(e) {}
  })();`;

  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <script dangerouslySetInnerHTML={{ __html: notFoundFixScript }} />
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
