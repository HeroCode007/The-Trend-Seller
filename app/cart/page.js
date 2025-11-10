'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, loading, updateQuantity, removeFromCart, fetchCart } = useCart();
    const router = useRouter();
    const [updating, setUpdating] = useState({});

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdating({ ...updating, [productId]: true });
        await updateQuantity(productId, newQuantity);
        setUpdating({ ...updating, [productId]: false });
    };

    const handleRemove = async (productId) => {
        setUpdating({ ...updating, [productId]: true });
        await removeFromCart(productId);
        setUpdating({ ...updating, [productId]: false });
    };

    const getProductUrl = (item) => {
        if (item.slug.includes('watch') || item.slug.includes('hublot') || item.slug.includes('patek') || item.slug.includes('pierre') || item.slug.includes('universe') || item.slug.includes('sveston')) {
            return `/watches/${item.slug}`;
        }
        return `/${item.slug.includes('belt') ? 'belts' : 'wallets'}/${item.slug}`;
    };

    if (loading) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">Loading cart...</div>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>
                    <div className="text-center py-20">
                        <ShoppingCart className="h-24 w-24 text-neutral-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Your cart is empty</h2>
                        <p className="text-neutral-600 mb-8">Start adding items to your cart to see them here.</p>
                        <Link
                            href="/watches"
                            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
                        >
                            Continue Shopping
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.productId}
                                className="bg-white border border-neutral-200 rounded-lg p-6 flex flex-col sm:flex-row gap-6"
                            >
                                <Link href={getProductUrl(item)} className="flex-shrink-0">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-neutral-100">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="128px"
                                            className="object-cover"
                                        />
                                    </div>
                                </Link>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <Link href={getProductUrl(item)}>
                                            <h3 className="text-lg font-semibold text-neutral-900 mb-2 hover:text-amber-600 transition-colors">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xl font-bold text-neutral-900 mb-4">
                                            ₨{item.price.toLocaleString('en-PK')}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                disabled={updating[item.productId] || item.quantity <= 1}
                                                className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                disabled={updating[item.productId]}
                                                className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(item.productId)}
                                            disabled={updating[item.productId]}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold text-neutral-900">
                                        ₨{(item.price * item.quantity).toLocaleString('en-PK')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-neutral-200 rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>₨{cart.total.toLocaleString('en-PK')}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Shipping</span>
                                    <span className={cart.total >= 10000 ? 'text-green-600' : ''}>
                                        {cart.total >= 10000 ? 'Free' : '₨500'}
                                    </span>
                                </div>
                                <div className="border-t border-neutral-200 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-neutral-900">
                                        <span>Total</span>
                                        <span>₨{(cart.total + (cart.total >= 10000 ? 0 : 500)).toLocaleString('en-PK')}</span>
                                    </div>
                                </div>
                            </div>

                            {cart.total < 10000 && (
                                <p className="text-sm text-amber-600 mb-6">
                                    Add ₨{(10000 - cart.total).toLocaleString('en-PK')} more for free shipping!
                                </p>
                            )}

                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full bg-neutral-900 text-white px-6 py-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-5 w-5" />
                            </button>

                            <Link
                                href="/watches"
                                className="block text-center text-neutral-600 hover:text-neutral-900 mt-4 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


