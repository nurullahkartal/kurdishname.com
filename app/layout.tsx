import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SITE_URL } from '@/lib/routes-config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'KurdishName',
  authors: [{ name: 'KurdishName Editorial Board' }],
  publisher: 'KurdishName',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="TJ1/pH6WLCLfpnFgVAmZsA"
          async
        />
      </head>
      <body style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
