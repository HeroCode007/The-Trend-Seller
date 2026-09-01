'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { watchCategories } from '@/lib/watchCategories';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileWatchesOpen, setMobileWatchesOpen] = useState(false);
  const [watchesOpen, setWatchesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getItemCount } = useCart();
  const pathname = usePathname();
  const watchesNavRef = useRef(null);

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

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileWatchesOpen(false);
    setWatchesOpen(false);
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

  // Close the Watches dropdown on outside click or Escape
  useEffect(() => {
    if (!watchesOpen) return;

    const handleClickOutside = (e) => {
      if (watchesNavRef.current && !watchesNavRef.current.contains(e.target)) {
        setWatchesOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setWatchesOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [watchesOpen]);

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
        <div className="flex h-20 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex-shrink-0 flex items-center" aria-label="The Trend Seller — Home">
            <Image
              src="/logo-lockup.png"
              alt="The Trend Seller"
              width={492}
              height={256}
              priority
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Watches — mega dropdown */}
            <div ref={watchesNavRef} className="relative" onMouseEnter={() => setWatchesOpen(true)} onMouseLeave={() => setWatchesOpen(false)}>
              <button
                type="button"
                onClick={() => setWatchesOpen((o) => !o)}
                aria-expanded={watchesOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 text-sm transition-colors ${getLinkClasses('/watches')}`}
              >
                Watches
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${watchesOpen ? 'rotate-180' : ''}`} />
              </button>

              {watchesOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 w-80 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl border border-neutral-100 shadow-xl p-2 overflow-hidden">
                    {watchCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/watches/${cat.slug}`}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-neutral-50 transition-colors"
                      >
                        <span className="text-xl leading-none mt-0.5">{cat.emoji}</span>
                        <span>
                          <span className="block text-sm font-medium text-neutral-900">{cat.name} Watches</span>
                          <span className="block text-xs text-neutral-500 mt-0.5">{cat.description}</span>
                        </span>
                      </Link>
                    ))}
                    <div className="border-t border-neutral-100 mt-1 pt-1">
                      <Link
                        href="/watches"
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        View All Watches
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
              className="fixed inset-0 top-20 bg-black/20 backdrop-blur-sm md:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <div
              className="fixed inset-x-0 top-20 bg-white border-t border-neutral-200 shadow-lg md:hidden z-50 animate-in slide-in-from-top duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-6 space-y-1">
                {/* Watches — expandable section */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileWatchesOpen((o) => !o)}
                    aria-expanded={mobileWatchesOpen}
                    className={`flex w-full items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors ${isActive('/watches')
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                      }`}
                  >
                    Watches
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileWatchesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileWatchesOpen && (
                    <div className="mt-1 ml-2 pl-3 border-l-2 border-neutral-100 space-y-1">
                      <Link
                        href="/watches"
                        className="block px-3 py-2.5 text-sm font-semibold text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        View All Watches
                      </Link>
                      {watchCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/watches/${cat.slug}`}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="text-base leading-none">{cat.emoji}</span>
                          {cat.name} Watches
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

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
