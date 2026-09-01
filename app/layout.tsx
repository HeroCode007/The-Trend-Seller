import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  metadataBase: new URL('https://www.thetrendseller.com/'),
  title: {
    default: 'The Trend Seller - Premium Watches, Belts & Wallets',
    template: '%s | The Trend Seller',
  },
  description:
    'Discover premium watches, belts, and wallets. Quality craftsmanship and timeless style for the modern individual.',
  keywords: [
    'watches',
    'belts',
    'wallets',
    'luxury accessories',
    'leather goods',
    'timepieces',
  ],
  icons: {
    icon: [
      { url: '/TTS.ico', sizes: 'any' },
      { url: '/TTS.png', type: 'image/svg+xml,png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.thetrendseller.com/',
    title: 'The Trend Seller - Premium Watches, Belts & Wallets',
    description:
      'Discover premium watches, belts, and wallets. Quality craftsmanship and timeless style for the modern individual.',
    siteName: 'The Trend Seller',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Trend Seller - Premium Watches, Belts & Wallets',
    description:
      'Discover premium watches, belts, and wallets. Quality craftsmanship and timeless style for the modern individual.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable}`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
