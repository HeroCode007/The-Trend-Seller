'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) =>
    pathname === path ? 'text-amber-600 font-semibold' : 'text-neutral-700 hover:text-neutral-900';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="text-2xl font-bold text-neutral-900 tracking-tight">
            The Trend Seller
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/watches" className={`text-sm transition-colors ${isActive('/watches')}`}>
              Watches
            </Link>
            <Link href="/belts" className={`text-sm transition-colors ${isActive('/belts')}`}>
              Belts
            </Link>
            <Link href="/wallets" className={`text-sm transition-colors ${isActive('/wallets')}`}>
              Wallets
            </Link>
            <Link href="/about" className={`text-sm transition-colors ${isActive('/about')}`}>
              About
            </Link>
            <Link href="/contact" className={`text-sm transition-colors ${isActive('/contact')}`}>
              Contact
            </Link>
            <Link href="/cart" className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/cart" className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-neutral-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slideDown">
            <Link
              href="/watches"
              className={`block text-sm font-medium ${isActive('/watches')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Watches
            </Link>
            <Link
              href="/belts"
              className={`block text-sm font-medium ${isActive('/belts')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Belts
            </Link>
            <Link
              href="/wallets"
              className={`block text-sm font-medium ${isActive('/wallets')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Wallets
            </Link>
            <Link
              href="/about"
              className={`block text-sm font-medium ${isActive('/about')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block text-sm font-medium ${isActive('/contact')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/cart"
              className="block text-sm font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
