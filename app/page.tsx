// app/page.tsx (Server Component - NO "use client")

import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'The Trend Seller - Premium Watches, Belts & Wallets',
  description: 'Shop our curated collection of premium watches, genuine leather belts, and luxury wallets. Quality craftsmanship meets timeless style.',
  openGraph: {
    title: 'The Trend Seller - Premium Watches, Belts & Wallets',
    description: 'Shop our curated collection of premium watches, genuine leather belts, and luxury wallets. Quality craftsmanship meets timeless style.',
  },
};

export default function Page() {
  return <HomeClient />;
}
