'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, Package, ArrowLeft, Mail, Phone, Printer, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderStatusPage() {
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [params.orderNumber]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${params.orderNumber}`);
            const data = await res.json();
            if (data.success) setOrder(data.order);
        } catch (err) {
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => window.print();

    const getEstimatedDelivery = () => {
        if (!order) return '';
        const date = new Date(order.createdAt || Date.now());
        date.setDate(date.getDate() + 5);
        return date.toLocaleDateString('en-PK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const paymentMethodDisplay = {
        cod: 'Cash on Delivery',
        card: 'Credit/Debit Card',
        jazzcash: 'JazzCash',
        easypaisa: 'EasyPaisa',
        'bank-transfer': 'Bank Transfer',
        payfast: 'PayFast'
    };

    if (loading) return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        </div>
    );

    if (!order) return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto text-center py-20">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
                <p className="text-neutral-600 mb-6">We couldn't find an order with this number.</p>
                <Link href="/" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
            </div>
        </div>
    );

    return (
        <div className="py-8 px-4 print:py-4">
            <div className="max-w-4xl mx-auto">

                {/* SUCCESS BANNER */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 text-center mb-6 print:border-2">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-lg text-neutral-600 mb-6">
                        Thank you for your order. We've received it and will begin processing right away.
                    </p>
                    <div className="bg-white rounded-lg p-4 inline-block shadow-sm">
                        <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                        <p className="text-2xl font-bold">{order.orderNumber}</p>
                    </div>
                </div>

                {/* PAYMENT VERIFICATION BANNER */}
                {order.paymentStatus === 'awaiting_verification' && (
                    <div className={`border rounded-lg p-6 mb-6 print:hidden
                        ${order.paymentMethod === 'bank-transfer' ? 'bg-blue-50 border-blue-200' :
                            order.paymentMethod === 'jazzcash' ? 'bg-red-50 border-red-200' :
                                order.paymentMethod === 'easypaisa' ? 'bg-green-50 border-green-200' : 'bg-neutral-100'}`}>

                        <div className="flex gap-3">
                            <Clock className={`h-6 w-6 flex-shrink-0 mt-0.5
                                ${order.paymentMethod === 'bank-transfer' ? 'text-blue-600' :
                                    order.paymentMethod === 'jazzcash' ? 'text-red-600' :
                                        order.paymentMethod === 'easypaisa' ? 'text-green-600' : 'text-neutral-600'}`} />
                            <div className="flex-1">
                                <h3 className={`font-semibold mb-2
                                    ${order.paymentMethod === 'bank-transfer' ? 'text-blue-900' :
                                        order.paymentMethod === 'jazzcash' ? 'text-red-900' :
                                            order.paymentMethod === 'easypaisa' ? 'text-green-900' : 'text-neutral-900'}`}>
                                    Next Steps: Complete Your Payment
                                </h3>
                                <p className={`text-sm mb-3
                                    ${order.paymentMethod === 'bank-transfer' ? 'text-blue-800' :
                                        order.paymentMethod === 'jazzcash' ? 'text-red-800' :
                                            order.paymentMethod === 'easypaisa' ? 'text-green-800' : 'text-neutral-700'}`}>
                                    Please complete your payment within 24 hours to confirm your order. Once verified, we'll start processing immediately.
                                </p>
                                {(order.paymentMethod === 'bank-transfer') && (
                                    <div className="bg-white rounded p-3 text-sm text-neutral-700">
                                        <p className="font-semibold mb-1">Bank Details:</p>
                                        <p>Account Title: The Trend Seller</p>
                                        <p>Account Number: [Your Account Number]</p>
                                        <p>Bank: [Your Bank Name]</p>
                                        <p className="mt-2 text-xs text-neutral-600">
                                            Include your order number ({order.orderNumber}) in transfer notes.
                                        </p>
                                    </div>
                                )}
                                {(order.paymentMethod === 'jazzcash' || order.paymentMethod === 'easypaisa') && (
                                    <div>
                                        <div className="bg-white rounded p-3 text-sm text-neutral-700 mb-3">
                                            <p className="font-semibold mb-2">{order.paymentMethod === 'jazzcash' ? 'JazzCash Details:' : 'EasyPaisa Details:'}</p>
                                            <p className="mb-1">Account Title: The Trend Seller</p>
                                            <p className="mb-1">Mobile Number: 0323-4653567</p>
                                            <p className="mb-1">Amount: ₨{order.totalAmount.toLocaleString()}</p>
                                            <p className="mt-2 text-xs text-neutral-600">
                                                Include order number <span className="font-semibold">{order.orderNumber}</span> in payment message.
                                            </p>
                                        </div>
                                        <a
                                            href={`https://wa.me/923234653567?text=Hi,%20I%20have%20completed%20${order.paymentMethod}%20payment%20for%20order%20${order.orderNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                        >
                                            <Phone className="h-4 w-4" />
                                            Send Payment Screenshot on WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDER SUMMARY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* LEFT CARD */}
                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5" /> Order Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Status</span>
                                <span className="font-semibold capitalize">{order.status}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Total Amount</span>
                                <span className="font-bold text-lg">₨{order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Items</span>
                                <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Payment Method</span>
                                <span>{paymentMethodDisplay[order.paymentMethod] || order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Payment Status</span>
                                <span className={`capitalize px-3 py-1 rounded-full text-sm ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                        order.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                                                order.paymentStatus === 'awaiting_verification' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-neutral-100 text-neutral-700'}`}>
                                    {order.paymentStatus === 'awaiting_verification' ? 'Awaiting Verification' : order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD */}
                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <p className="font-semibold">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <div className="pt-3 mt-3 border-t border-neutral-200 space-y-2">
                            <p className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-neutral-500" />
                                <span className="text-neutral-600">Email:</span> <span className="font-medium">{order.shippingAddress.email}</span>
                            </p>
                            <p className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-neutral-500" />
                                <span className="text-neutral-600">Phone:</span> <span className="font-medium">{order.shippingAddress.phone}</span>
                            </p>
                        </div>
                    </div>

                </div> {/* END GRID */}

                {/* ESTIMATED DELIVERY */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <Package className="h-5 w-5 text-amber-600" />
                    <div>
                        <p className="text-sm font-semibold text-amber-900">Estimated Delivery</p>
                        <p className="text-sm text-amber-800">{getEstimatedDelivery()}</p>
                    </div>
                </div>

                {/* PRINT & CONTINUE SHOPPING */}
                <div className="flex flex-wrap gap-3 justify-end mb-6 print:hidden">
                    <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-neutral-700 hover:bg-neutral-50">
                        <Printer className="h-4 w-4" /> Print Receipt
                    </button>
                    <Link href="/" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800">
                        <ArrowLeft className="h-5 w-5" /> Continue Shopping
                    </Link>
                </div>

            </div>

            {/* PRINT STYLES */}
            <style jsx global>{`
                @media print {
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    .print\\:py-4 { padding-top: 1rem; padding-bottom: 1rem; }
                    .print\\:border-2 { border-width: 2px; }
                }
            `}</style>
        </div>
    );
}
