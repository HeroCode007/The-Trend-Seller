'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Phone, Mail, MapPin, Package, Truck, CheckCircle, Clock, Loader2, AlertCircle, Calendar, XCircle, Bookmark } from 'lucide-react';

export default function CustomerOrderDetailPage({ params }) {
    const { orderNumber } = params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchOrder(); }, [orderNumber]);

    const fetchOrder = async () => {
        try {
            // Customer view - use public API
            const res = await fetch(`/api/orders/${orderNumber}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
            } else {
                setMessage({ type: 'error', text: 'Order not found' });
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            setMessage({ type: 'error', text: 'Failed to load order' });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`;

    const getStatusColor = (status) => {
        const colors = { pending: 'bg-yellow-100 text-yellow-700 border-yellow-200', processing: 'bg-blue-100 text-blue-700 border-blue-200', shipped: 'bg-purple-100 text-purple-700 border-purple-200', delivered: 'bg-green-100 text-green-700 border-green-200', cancelled: 'bg-red-100 text-red-700 border-red-200' };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getPaymentMethodLabel = (method) => {
        const labels = { 'cod': 'Cash on Delivery', 'jazzcash': 'JazzCash', 'easypaisa': 'EasyPaisa', 'bank-transfer': 'Bank Transfer' };
        return labels[method] || method;
    };

    const statusSteps = [
        { key: 'pending', label: 'Pending', icon: Clock },
        { key: 'processing', label: 'Processing', icon: Package },
        { key: 'shipped', label: 'Shipped', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const getCurrentStepIndex = () => {
        if (order?.status === 'cancelled') return -1;
        return statusSteps.findIndex(s => s.key === order?.status);
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

    if (!order) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-neutral-900">Order not found</h2>
                <Link href="/" className="text-amber-600 hover:text-amber-700 mt-2 inline-block">← Back to Home</Link>
            </div>
        );
    }

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-neutral-600" /></Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Order {order.orderNumber}</h1>
                        <p className="text-neutral-500 flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>
                <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium capitalize border ${getStatusColor(order.status)}`}>{order.status}</span>
            </div>

            {/* Save Page Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bookmark className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-amber-800">Save This Page</h3>
                    <p className="text-amber-700 text-sm mt-1">
                        Please bookmark or save this page URL until your payment is verified and order is confirmed.
                        You will need this link to track your order status.
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>{message.text}</div>
            )}

            {order.status !== 'cancelled' && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-6">Order Progress</h2>
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200">
                            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                        </div>
                        {statusSteps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            return (
                                <div key={step.key} className="flex flex-col items-center relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white' : 'bg-neutral-200 text-neutral-400'} ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <p className={`mt-2 text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-neutral-400'}`}>{step.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {order.status === 'cancelled' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
                    <XCircle className="w-8 h-8 text-red-500" />
                    <div>
                        <h3 className="font-semibold text-red-700">Order Cancelled</h3>
                        <p className="text-red-600 text-sm">This order has been cancelled.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                        <div className="p-6 border-b border-neutral-200"><h2 className="text-lg font-semibold text-neutral-900">Order Items</h2></div>
                        <div className="divide-y divide-neutral-100">
                            {order.items?.map((item, index) => (
                                <div key={index} className="p-6 flex gap-4">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                                        {item.image ? <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-neutral-300" /></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-neutral-900">{item.name}</h3>
                                        <p className="text-sm text-neutral-500 mt-1">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                                    </div>
                                    <div className="text-right"><p className="font-semibold text-neutral-900">{formatCurrency(item.price * item.quantity)}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-neutral-600">Subtotal</span><span className="text-neutral-900">{formatCurrency((order.totalAmount || 0) - (order.deliveryCharges || 0))}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-neutral-600">Delivery</span><span className={order.deliveryCharges === 0 ? 'text-green-600 font-medium' : 'text-neutral-900'}>{order.deliveryCharges === 0 ? 'FREE' : formatCurrency(order.deliveryCharges)}</span></div>
                            <div className="flex justify-between text-lg font-bold pt-3 border-t border-neutral-200"><span className="text-neutral-900">Total</span><span className="text-amber-600">{formatCurrency(order.totalAmount)}</span></div>
                        </div>
                    </div>

                    {order.paymentScreenshot && (
                        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                            <div className="p-6 border-b border-neutral-200">
                                <h2 className="text-lg font-semibold text-neutral-900">Payment Screenshot</h2>
                                {order.paymentScreenshotUploadedAt && <p className="text-sm text-neutral-500 mt-1">Uploaded: {new Date(order.paymentScreenshotUploadedAt).toLocaleString('en-PK')}</p>}
                            </div>
                            <div className="p-6"><img src={order.paymentScreenshot} alt="Payment Screenshot" className="max-w-full max-h-96 rounded-xl border border-neutral-200 mx-auto" /></div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Admin Update Section Removed - This is customer view */}

                    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Customer</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3"><User className="w-5 h-5 text-neutral-400 mt-0.5" /><p className="font-medium text-neutral-900">{order.shippingAddress?.fullName}</p></div>
                            <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-neutral-400 mt-0.5" /><a href={`tel:${order.shippingAddress?.phone}`} className="text-amber-600 hover:text-amber-700">{order.shippingAddress?.phone}</a></div>
                            <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-neutral-400 mt-0.5" /><a href={`mailto:${order.shippingAddress?.email}`} className="text-amber-600 hover:text-amber-700 break-all">{order.shippingAddress?.email}</a></div>
                            <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-neutral-400 mt-0.5" /><div><p className="text-neutral-700">{order.shippingAddress?.address}</p><p className="text-neutral-500">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p><p className="text-neutral-500">{order.shippingAddress?.country || 'Pakistan'}</p></div></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between"><span className="text-neutral-600">Method</span><span className="font-medium text-neutral-900">{getPaymentMethodLabel(order.paymentMethod)}</span></div>
                            <div className="flex items-center justify-between"><span className="text-neutral-600">Status</span>
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'awaiting_verification' ? 'bg-blue-100 text-blue-700' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.paymentStatus?.replace('_', ' ')}
                                </span>
                            </div>
                            {order.paymentVerifiedAt && <div className="flex items-center justify-between"><span className="text-neutral-600">Verified At</span><span className="text-sm text-neutral-900">{new Date(order.paymentVerifiedAt).toLocaleString('en-PK')}</span></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
