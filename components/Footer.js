import Link from 'next/link';
import { Watch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Watch className="h-6 w-6 text-white" />
              <span className="text-lg font-semibold text-white">The Trend Seller</span>
            </Link>
            <p className="text-sm text-neutral-300 max-w-md">
              Premium watches, belts, and wallets crafted with precision and style.
              Quality accessories for the modern individual.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/watches" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  Watches
                </Link>
              </li>
              <li>
                <Link href="/belts" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  Belts
                </Link>
              </li>
              <li>
                <Link href="/wallets" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  Wallets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800">
          <p className="text-sm text-neutral-300 text-center">
            &copy; {new Date().getFullYear()} The Trend Seller. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
