'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getItemCount } = useCart();
  const pathname = usePathname();

  // Fix hydration mismatch - only show cart count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Check if path is active (supports sub-routes)
  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Get link classes based on active state
  const getLinkClasses = (path) => {
    return isActive(path)
      ? 'text-amber-600 font-semibold'
      : 'text-neutral-700 hover:text-neutral-900';
  };

  // Navigation links data
  const navLinks = [
    { href: '/watches', label: 'Watches' },
    { href: '/belts', label: 'Belts' },
    { href: '/wallets', label: 'Wallets' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Cart badge component to avoid duplication
  const CartBadge = ({ className = '' }) => (
    <Link
      href="/cart"
      className={`relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors ${className}`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in duration-200">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl font-bold text-neutral-900 tracking-tight hover:text-amber-600 transition-colors"
          >
            The Trend Seller
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${getLinkClasses(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
            <CartBadge />
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <CartBadge />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm md:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <div
              className="fixed inset-x-0 top-16 bg-white border-t border-neutral-200 shadow-lg md:hidden z-50 animate-in slide-in-from-top duration-200"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${isActive(link.href)
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Cart Link */}
                <Link
                  href="/cart"
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                  {itemCount > 0 && (
                    <span className="ml-auto bg-amber-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}