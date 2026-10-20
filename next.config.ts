import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
};

export default withNextIntl(nextConfig);
