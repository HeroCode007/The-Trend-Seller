'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Banknote, Smartphone, Wallet } from 'lucide-react';

export default function CheckoutPage() {
    const { cart, loading, fetchCart } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan',
        paymentMethod: 'bank-transfer', // Default to Bank Transfer
    });

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (!loading && cart.items.length === 0) {
            router.push('/cart');
        }
    }, [loading]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (!['bank-transfer', 'jazzcash', 'easypaisa'].includes(formData.paymentMethod)) {
                toast({
                    title: 'Invalid Payment Method',
                    description: 'Please select a valid payment method.',
                    variant: 'destructive',
                });
                setSubmitting(false);
                return;
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingAddress: {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                    },
                    paymentMethod: formData.paymentMethod,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                toast({
                    title: 'Error',
                    description: data.error || 'Order failed to process',
                    variant: 'destructive',
                });
                setSubmitting(false);
                return;
            }

            const { orderNumber } = data.order;

            // For JazzCash or EasyPaisa, redirect to payment verification page
            if (formData.paymentMethod === 'jazzcash' || formData.paymentMethod === 'easypaisa' || formData.paymentMethod === 'bank-transfer') {
                toast({
                    title: 'Redirecting...',
                    description: `Proceeding to ${formData.paymentMethod} payment verification`,
                });
                router.push(`/payment-verification/${orderNumber}?method=${formData.paymentMethod}`);
                return;
            }

        } catch (error) {
            console.error('Order Error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Something went wrong while placing order',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        Loading your cart...
                    </div>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) return null;

    const shippingCost = cart.total >= 7000 ? 0 : 250;
    const total = cart.total + shippingCost;

    return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Shipping Information</h2>

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Address *
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        required
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                />
                            </div>

                            {/* Payment Method Selection */}
                            <div>
                                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Payment Method</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Bank Transfer */}
                                    <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'bank-transfer'
                                        ? 'border-amber-600 bg-amber-50'
                                        : 'border-neutral-300 hover:border-neutral-400'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="bank-transfer"
                                            checked={formData.paymentMethod === 'bank-transfer'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-3">
                                            <Banknote className="h-6 w-6 text-neutral-700" />
                                            <div>
                                                <div className="font-semibold text-neutral-900">Bank Transfer</div>
                                                <div className="text-sm text-neutral-600">Direct bank transfer</div>
                                            </div>
                                        </div>
                                    </label>

                                    {/* JazzCash */}
                                    <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'jazzcash'
                                        ? 'border-green-600 bg-green-50'
                                        : 'border-neutral-300 hover:border-neutral-400'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="jazzcash"
                                            checked={formData.paymentMethod === 'jazzcash'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="h-6 w-6 text-neutral-700" />
                                            <div>
                                                <div className="font-semibold text-neutral-900">JazzCash</div>
                                                <div className="text-sm text-neutral-600">Mobile Wallet</div>
                                            </div>
                                        </div>
                                    </label>

                                    {/* EasyPaisa */}
                                    <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'easypaisa'
                                        ? 'border-green-600 bg-green-50'
                                        : 'border-neutral-300 hover:border-neutral-400'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="easypaisa"
                                            checked={formData.paymentMethod === 'easypaisa'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-3">
                                            <Wallet className="h-6 w-6 text-neutral-700" />
                                            <div>
                                                <div className="font-semibold text-neutral-900">EasyPaisa</div>
                                                <div className="text-sm text-neutral-600">Mobile Wallet</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {/* Payment Method Info */}
                                {formData.paymentMethod === 'bank-transfer' && (
                                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                        <p className="text-sm text-purple-800">
                                            Bank account details will be sent to your email after order confirmation.
                                            Please complete the transfer within 24 hours.
                                        </p>
                                    </div>
                                )}
                                {formData.paymentMethod === 'jazzcash' && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-800">
                                            Payment instructions will be sent to your phone number after order confirmation.
                                        </p>
                                    </div>
                                )}
                                {formData.paymentMethod === 'easypaisa' && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-800">
                                            Payment instructions will be sent to your phone number after order confirmation.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-neutral-900 text-white px-6 py-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-5 w-5" />
                                        Place Order
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-neutral-200 rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                {cart.items.map((item) => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-neutral-600">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="text-neutral-900 font-medium">
                                            ₨{(item.price * item.quantity).toLocaleString('en-PK')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-neutral-200 pt-4 space-y-3 mb-6">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>₨{cart.total.toLocaleString('en-PK')}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                                        {shippingCost === 0 ? 'Free' : `₨${shippingCost.toLocaleString('en-PK')}`}
                                    </span>
                                </div>
                                <div className="border-t border-neutral-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-neutral-900">
                                        <span>Total</span>
                                        <span>₨{total.toLocaleString('en-PK')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
