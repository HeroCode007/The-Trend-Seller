'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import {
    Loader2,
    CheckCircle,
    Banknote,
    Smartphone,
    Wallet,
    ShieldCheck,
    Truck,
    Package,
    CreditCard,
    MapPin,
    User,
    Mail,
    Phone,
    Home,
    Building2,
    Globe,
    ChevronRight,
    Lock,
    Sparkles,
    Gift
} from 'lucide-react';

export default function CheckoutPage() {
    const { cart, loading, fetchCart } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan',
        paymentMethod: 'bank-transfer',
    });

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (!loading && cart.items.length === 0) {
            router.push('/cart');
        }
    }, [loading, cart.items.length, router]);

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

            toast({
                title: 'Order Placed Successfully!',
                description: 'Redirecting to payment...',
            });

            router.push(`/payment-verification/${orderNumber}?method=${formData.paymentMethod}`);

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
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-amber-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
                        <Sparkles className="w-6 h-6 text-amber-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-4 text-neutral-600 font-medium">Preparing your checkout...</p>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) return null;

    const shippingCost = cart.total >= 7000 ? 0 : 250;
    const total = cart.total + shippingCost;

    const paymentMethods = [
        {
            id: 'bank-transfer',
            name: 'Bank Transfer',
            description: 'Direct bank transfer',
            icon: Banknote,
            color: 'amber',
            gradient: 'from-amber-500 to-orange-600',
            bgLight: 'bg-amber-50',
            borderActive: 'border-amber-500',
            textColor: 'text-amber-700'
        },
        {
            id: 'jazzcash',
            name: 'JazzCash',
            description: 'Mobile wallet',
            icon: Smartphone,
            color: 'red',
            gradient: 'from-red-500 to-rose-600',
            bgLight: 'bg-red-50',
            borderActive: 'border-red-500',
            textColor: 'text-red-700'
        },
        {
            id: 'easypaisa',
            name: 'EasyPaisa',
            description: 'Mobile wallet',
            icon: Wallet,
            color: 'green',
            gradient: 'from-green-500 to-emerald-600',
            bgLight: 'bg-green-50',
            borderActive: 'border-green-500',
            textColor: 'text-green-700'
        }
    ];

    const selectedPayment = paymentMethods.find(m => m.id === formData.paymentMethod);

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-amber-50/30">
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-stone-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-amber-100/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 py-8 md:py-12 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-200/50 mb-4">
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-neutral-600">Secure Checkout</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
                            Complete Your Order
                        </h1>
                        <p className="mt-3 text-neutral-500 max-w-md mx-auto">
                            You're just a few steps away from your premium accessories
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <div className="flex items-center justify-center gap-4">
                            {[
                                { num: 1, label: 'Shipping', icon: MapPin },
                                { num: 2, label: 'Payment', icon: CreditCard },
                                { num: 3, label: 'Confirm', icon: CheckCircle }
                            ].map((step, idx) => (
                                <div key={step.num} className="flex items-center">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${activeStep >= step.num
                                            ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/20'
                                            : 'bg-white text-neutral-400 border border-neutral-200'
                                        }`}>
                                        <step.icon className="w-4 h-4" />
                                        <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                                    </div>
                                    {idx < 2 && (
                                        <ChevronRight className={`w-5 h-5 mx-2 ${activeStep > step.num ? 'text-neutral-900' : 'text-neutral-300'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Main Form */}
                        <div className="lg:col-span-7 xl:col-span-8">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Shipping Information Card */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 shadow-xl shadow-neutral-200/20 overflow-hidden">
                                    <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                                <Truck className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-white">Shipping Information</h2>
                                                <p className="text-sm text-neutral-400">Where should we deliver?</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        {/* Full Name */}
                                        <div className="group">
                                            <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                                <User className="w-4 h-4 text-neutral-400" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                name="fullName"
                                                required
                                                placeholder="Enter your full name"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                onFocus={() => setActiveStep(1)}
                                                className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 placeholder:text-neutral-400"
                                            />
                                        </div>

                                        {/* Email & Phone */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="group">
                                                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                                    <Mail className="w-4 h-4 text-neutral-400" />
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    placeholder="your@email.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onFocus={() => setActiveStep(1)}
                                                    className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 placeholder:text-neutral-400"
                                                />
                                            </div>
                                            <div className="group">
                                                <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                                    <Phone className="w-4 h-4 text-neutral-400" />
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    required
                                                    placeholder="03XX-XXXXXXX"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    onFocus={() => setActiveStep(1)}
                                                    className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 placeholder:text-neutral-400"
                                                />
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="group">
                                            <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                                <Home className="w-4 h-4 text-neutral-400" />
                                                Street Address
                                            </label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                required
                                                rows={3}
                                                placeholder="House/Flat number, Street name, Area"
                                                value={formData.address}
                                                onChange={handleChange}
                                                onFocus={() => setActiveStep(1)}
                                                className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 placeholder:text-neutral-400 resize-none"
                                            />
                                        </div>

                                        {/* City, Postal Code, Country */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div className="group">
                                                <label htmlFor="city" className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                                    <Building2 className="w-4 h-4 text-neutral-400" />
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    required
                                                    placeholder="Lahore"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    onFocus={() => setActiveStep(1)}
                                                    className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 placeholder:text-neutral-400"
                                                />
                                            </div>
                                            <div className="group">
                                                <label htmlFor="postalCode" className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                                    <MapPin className="w-4 h-4 text-neutral-400" />
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    name="postalCode"
                                                    required
                                                    placeholder="54000"
                                                    value={formData.postalCode}
                                                    onChange={handleChange}
                                                    onFocus={() => setActiveStep(1)}
                                                    className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 placeholder:text-neutral-400"
                                                />
                                            </div>
                                            <div className="group">
                                                <label htmlFor="country" className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                                    <Globe className="w-4 h-4 text-neutral-400" />
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    name="country"
                                                    required
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    onFocus={() => setActiveStep(1)}
                                                    className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 placeholder:text-neutral-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Card */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 shadow-xl shadow-neutral-200/20 overflow-hidden">
                                    <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                                                <p className="text-sm text-neutral-400">Choose how you'd like to pay</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {paymentMethods.map((method) => {
                                                const isSelected = formData.paymentMethod === method.id;
                                                return (
                                                    <label
                                                        key={method.id}
                                                        className={`relative cursor-pointer group transition-all duration-300 ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                                                            }`}
                                                        onClick={() => setActiveStep(2)}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value={method.id}
                                                            checked={isSelected}
                                                            onChange={handleChange}
                                                            className="sr-only"
                                                        />
                                                        <div className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${isSelected
                                                                ? `${method.borderActive} ${method.bgLight} shadow-lg`
                                                                : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-white'
                                                            }`}>
                                                            {/* Selected Indicator */}
                                                            {isSelected && (
                                                                <div className={`absolute top-2 right-2 w-6 h-6 bg-gradient-to-br ${method.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                                </div>
                                                            )}

                                                            <div className="flex flex-col items-center text-center">
                                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${isSelected
                                                                        ? `bg-gradient-to-br ${method.gradient} shadow-lg`
                                                                        : 'bg-neutral-200/50 group-hover:bg-neutral-200'
                                                                    }`}>
                                                                    <method.icon className={`w-7 h-7 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-neutral-500'
                                                                        }`} />
                                                                </div>
                                                                <h3 className={`font-semibold transition-colors duration-300 ${isSelected ? method.textColor : 'text-neutral-700'
                                                                    }`}>
                                                                    {method.name}
                                                                </h3>
                                                                <p className="text-xs text-neutral-500 mt-1">{method.description}</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>

                                        {/* Payment Info Box */}
                                        <div className={`mt-5 p-4 rounded-xl border transition-all duration-300 ${selectedPayment?.bgLight
                                            } border-${selectedPayment?.color}-200`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedPayment?.gradient} flex items-center justify-center flex-shrink-0`}>
                                                    <ShieldCheck className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${selectedPayment?.textColor}`}>
                                                        {formData.paymentMethod === 'bank-transfer' && 'Secure Bank Transfer'}
                                                        {formData.paymentMethod === 'jazzcash' && 'JazzCash Mobile Payment'}
                                                        {formData.paymentMethod === 'easypaisa' && 'EasyPaisa Mobile Payment'}
                                                    </p>
                                                    <p className="text-sm text-neutral-600 mt-1">
                                                        {formData.paymentMethod === 'bank-transfer' && 'Account details will be shown after placing order. Complete transfer within 24 hours.'}
                                                        {formData.paymentMethod === 'jazzcash' && 'You\'ll receive payment instructions on the next page.'}
                                                        {formData.paymentMethod === 'easypaisa' && 'You\'ll receive payment instructions on the next page.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    onClick={() => setActiveStep(3)}
                                    className="w-full relative overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white px-8 py-5 rounded-xl font-semibold text-lg shadow-2xl shadow-neutral-900/30 hover:shadow-neutral-900/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <div className="relative flex items-center justify-center gap-3">
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Processing Order...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                <span>Place Order</span>
                                                <span className="text-amber-400 font-bold">₨{total.toLocaleString('en-PK')}</span>
                                            </>
                                        )}
                                    </div>
                                </button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                                    {[
                                        { icon: ShieldCheck, text: '100% Secure' },
                                        { icon: Truck, text: 'Fast Delivery' },
                                        { icon: Package, text: 'Quality Assured' }
                                    ].map((badge, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-neutral-500">
                                            <badge.icon className="w-4 h-4" />
                                            <span className="text-sm">{badge.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-5 xl:col-span-4">
                            <div className="sticky top-24 space-y-6">

                                {/* Order Summary Card */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 shadow-xl shadow-neutral-200/20 overflow-hidden">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                                <Package className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-white">Order Summary</h2>
                                                <p className="text-sm text-amber-100">{cart.items.length} item{cart.items.length > 1 ? 's' : ''} in cart</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Cart Items */}
                                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                            {cart.items.map((item, idx) => (
                                                <div
                                                    key={item.productId}
                                                    className="flex gap-4 p-3 bg-neutral-50/80 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors"
                                                >
                                                    <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                                                        {item.image ? (
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                                                <Package className="w-8 h-8 text-neutral-300" />
                                                            </div>
                                                        )}
                                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-neutral-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                                            {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-neutral-900 truncate">{item.name}</h3>
                                                        <p className="text-sm text-neutral-500 mt-1">Qty: {item.quantity}</p>
                                                        <p className="text-amber-600 font-semibold mt-1">
                                                            ₨{(item.price * item.quantity).toLocaleString('en-PK')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Divider */}
                                        <div className="my-5 border-t border-dashed border-neutral-200"></div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-neutral-600">
                                                <span>Subtotal</span>
                                                <span className="font-medium">₨{cart.total.toLocaleString('en-PK')}</span>
                                            </div>
                                            <div className="flex justify-between text-neutral-600">
                                                <span className="flex items-center gap-2">
                                                    <Truck className="w-4 h-4" />
                                                    Shipping
                                                </span>
                                                {shippingCost === 0 ? (
                                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                                        <Gift className="w-4 h-4" />
                                                        FREE
                                                    </span>
                                                ) : (
                                                    <span className="font-medium">₨{shippingCost.toLocaleString('en-PK')}</span>
                                                )}
                                            </div>

                                            {shippingCost > 0 && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                                                    <p className="text-xs text-amber-700">
                                                        <Sparkles className="w-3 h-3 inline mr-1" />
                                                        Add ₨{(7000 - cart.total).toLocaleString('en-PK')} more for FREE shipping!
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Total */}
                                        <div className="mt-5 pt-5 border-t-2 border-neutral-900">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-semibold text-neutral-900">Total</span>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-neutral-900">
                                                        ₨{total.toLocaleString('en-PK')}
                                                    </span>
                                                    <p className="text-xs text-neutral-500">Including all taxes</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo Box */}
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                            <ShieldCheck className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-neutral-900">Shop with Confidence</h3>
                                            <p className="text-xs text-neutral-600">Your satisfaction is guaranteed</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2">
                                        {[
                                            '100% Authentic Products',
                                            'Secure Payment Methods',
                                            'Fast Nationwide Delivery',
                                            'Easy Returns & Exchange'
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}