'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [params.orderNumber]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/orders/${params.orderNumber}`);
            const data = await response.json();
            if (data.success) {
                setOrder(data.order);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Order not found</h2>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center mb-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-lg text-neutral-600 mb-6">
                        Thank you for your order. We've received your order and will begin processing it right away.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 inline-block">
                        <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                        <p className="text-2xl font-bold text-neutral-900">{order.orderNumber}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-neutral-600">Status</span>
                                <span className="font-semibold text-neutral-900 capitalize">{order.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600">Total Amount</span>
                                <span className="font-semibold text-neutral-900">
                                    ₨{order.totalAmount.toLocaleString('en-PK')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600">Items</span>
                                <span className="font-semibold text-neutral-900">
                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                            </div>
                            {order.paymentMethod && (
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">Payment Method</span>
                                    <span className="font-semibold text-neutral-900 capitalize">
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                                            order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                                                order.paymentMethod === 'jazzcash' ? 'JazzCash' :
                                                    order.paymentMethod === 'easypaisa' ? 'EasyPaisa' :
                                                        order.paymentMethod === 'bank-transfer' ? 'Bank Transfer' :
                                                            order.paymentMethod === 'payfast' ? 'PayFast' :
                                                                order.paymentMethod}
                                    </span>
                                </div>
                            )}
                            {order.paymentStatus && (
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">Payment Status</span>
                                    <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' :
                                        order.paymentStatus === 'pending' ? 'text-amber-600' :
                                            order.paymentStatus === 'failed' ? 'text-red-600' :
                                                'text-neutral-900'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Shipping Address</h2>
                        <div className="space-y-2 text-neutral-700">
                            <p className="font-semibold">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                            <p className="mt-4">
                                <span className="text-neutral-600">Email:</span> {order.shippingAddress.email}
                            </p>
                            <p>
                                <span className="text-neutral-600">Phone:</span> {order.shippingAddress.phone}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-3 border-b border-neutral-200 last:border-0">
                                <div>
                                    <p className="font-semibold text-neutral-900">{item.name}</p>
                                    <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-neutral-900">
                                    ₨{(item.price * item.quantity).toLocaleString('en-PK')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

