import type { Metadata } from 'next';
import SocialTrackerClient from '@/components/admin/SocialTrackerClient';

export const metadata: Metadata = {
  title: 'Sosyal Medya Paylaşım Takip Paneli | KurdishName',
  description: 'KurdishName 4.709 Kürtçe İsim Sosyal Medya Paylaşım Yönetim ve İçerik Takip Paneli.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SosyalMedyaPage() {
  return <SocialTrackerClient />;
}
