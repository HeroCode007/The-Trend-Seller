'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowLeft, Mail, Phone, Printer, Clock, AlertCircle, Truck, MapPin } from 'lucide-react';

export default function OrderStatusPage({ params }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (params?.orderNumber) {
            fetchOrder(params.orderNumber);
        }
    }, [params]);

    // Auto-trigger payment verification when screenshot is uploaded
    useEffect(() => {
        if (order && order.paymentStatus === 'awaiting_verification' && !verifying) {
            triggerPaymentVerification();
        }
    }, [order]);

    const fetchOrder = async (orderNumber) => {
        try {
            const res = await fetch(`/api/orders/${orderNumber}`);
            const data = await res.json();
            if (data.success && data.order) {
                setOrder(data.order);
            } else {
                setOrder(null);
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const triggerPaymentVerification = async () => {
        setVerifying(true);
        try {
            const res = await fetch(`/api/orders/${order.orderNumber}/verify-payment`, {
                method: 'POST',
            });
            const data = await res.json();

            if (data.success) {
                // Refresh order data to show verified status
                await fetchOrder(order.orderNumber);
            }
        } catch (err) {
            console.error('Error verifying payment:', err);
        } finally {
            setVerifying(false);
        }
    };

    const handlePrint = () => window.print();

    const getEstimatedDelivery = () => {
        if (!order) return '';
        const date = new Date(order.createdAt);
        date.setDate(date.getDate() + 5);
        return date.toLocaleDateString('en-PK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const paymentMethodDisplay = {
        cod: 'Cash on Delivery',
        jazzcash: 'JazzCash',
        easypaisa: 'EasyPaisa',
        'bank-transfer': 'Bank Transfer'
    };

    const statusDisplay = {
        pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
        shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
        delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
        cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
    };

    const paymentStatusDisplay = {
        pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        awaiting_verification: { label: 'Awaiting Verification', color: 'bg-blue-100 text-blue-800' },
        paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
        failed: { label: 'Failed', color: 'bg-red-100 text-red-800' }
    };

    if (loading) return (
        <div className="py-12 px-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
    );

    if (!order) return (
        <div className="py-12 px-4 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
            <p className="text-neutral-600 mb-4">We couldn't find an order with this number.</p>
            <a href="/" className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Home
            </a>
        </div>
    );

    const currentStatus = order.status || 'pending';
    const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = statusSteps.indexOf(currentStatus);

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto">
            {/* Confirmation Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-lg text-neutral-600 mb-6">
                    Thank you for your order. We've received it and will begin processing right away.
                </p>
                <div className="bg-white rounded-lg p-4 inline-block shadow-sm">
                    <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                    <p className="text-2xl font-bold">{order.orderNumber}</p>
                </div>
            </div>

            {/* Print & Continue Shopping */}
            <div className="flex gap-3 justify-end mb-6 print:hidden">
                <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-neutral-700 hover:bg-neutral-50">
                    <Printer className="h-4 w-4" /> Print Receipt
                </button>
                <a href="/" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800">
                    <ArrowLeft className="h-5 w-5" /> Continue Shopping
                </a>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Order Status
                </h2>
                <div className="flex items-center justify-between">
                    {/* Pending */}
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStepIndex >= 0 ? 'bg-green-500 text-white' : 'bg-neutral-200'
                            }`}>
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <p className={`text-sm font-medium ${currentStepIndex >= 0 ? '' : 'text-neutral-500'}`}>
                            Order Placed
                        </p>
                        <p className="text-xs text-neutral-500">
                            {currentStepIndex >= 0 ? 'Confirmed' : 'Pending'}
                        </p>
                    </div>
                    <div className={`h-0.5 flex-1 mx-2 ${currentStepIndex >= 1 ? 'bg-green-500' : 'bg-neutral-200'}`}></div>

                    {/* Processing */}
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStepIndex >= 1 ? 'bg-green-500 text-white' : 'bg-neutral-200'
                            }`}>
                            <Package className={`h-6 w-6 ${currentStepIndex >= 1 ? '' : 'text-neutral-400'}`} />
                        </div>
                        <p className={`text-sm font-medium ${currentStepIndex >= 1 ? '' : 'text-neutral-500'}`}>
                            Processing
                        </p>
                        <p className="text-xs text-neutral-400">
                            {currentStepIndex >= 1 ? 'In Progress' : 'Pending'}
                        </p>
                    </div>
                    <div className={`h-0.5 flex-1 mx-2 ${currentStepIndex >= 2 ? 'bg-green-500' : 'bg-neutral-200'}`}></div>

                    {/* Shipped */}
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStepIndex >= 2 ? 'bg-green-500 text-white' : 'bg-neutral-200'
                            }`}>
                            <Truck className={`h-6 w-6 ${currentStepIndex >= 2 ? '' : 'text-neutral-400'}`} />
                        </div>
                        <p className={`text-sm font-medium ${currentStepIndex >= 2 ? '' : 'text-neutral-500'}`}>
                            Shipped
                        </p>
                        <p className="text-xs text-neutral-400">
                            {currentStepIndex >= 2 ? 'On the way' : 'Pending'}
                        </p>
                    </div>
                    <div className={`h-0.5 flex-1 mx-2 ${currentStepIndex >= 3 ? 'bg-green-500' : 'bg-neutral-200'}`}></div>

                    {/* Delivered */}
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStepIndex >= 3 ? 'bg-green-500 text-white' : 'bg-neutral-200'
                            }`}>
                            <CheckCircle className={`h-6 w-6 ${currentStepIndex >= 3 ? '' : 'text-neutral-400'}`} />
                        </div>
                        <p className={`text-sm font-medium ${currentStepIndex >= 3 ? '' : 'text-neutral-500'}`}>
                            Delivered
                        </p>
                        <p className="text-xs text-neutral-400">
                            {currentStepIndex >= 3 ? 'Complete' : 'Pending'}
                        </p>
                    </div>
                </div>
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm">
                        <span className="font-medium">Estimated Delivery:</span> {getEstimatedDelivery()}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Customer Information */}
                <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-neutral-600">Name</p>
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-neutral-400 mt-1" />
                            <div>
                                <p className="text-sm text-neutral-600">Email</p>
                                <p className="font-medium">{order.shippingAddress.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 text-neutral-400 mt-1" />
                            <div>
                                <p className="text-sm text-neutral-600">Phone</p>
                                <p className="font-medium">{order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-amber-600" />
                        Shipping Address
                    </h2>
                    <div className="space-y-1">
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        {order.shippingAddress.province && <p>{order.shippingAddress.province}</p>}
                        {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                            )}
                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                                <p className="text-sm text-neutral-600">Price: Rs. {item.price.toLocaleString()}</p>
                            </div>
                            <p className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span>Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600">Payment Method</p>
                            <p className="font-medium">{paymentMethodDisplay[order.paymentMethod] || order.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-neutral-600 mb-1">Payment Status</p>
                            <div className="flex items-center gap-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${paymentStatusDisplay[order.paymentStatus]?.color || 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {paymentStatusDisplay[order.paymentStatus]?.label || order.paymentStatus}
                                </span>
                                {verifying && (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Verification Message */}
                    {order.paymentStatus === 'awaiting_verification' && verifying && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                🔄 Verifying your payment... This will take 10-30 seconds.
                            </p>
                        </div>
                    )}

                    {/* Verified Message */}
                    {order.paymentStatus === 'paid' && order.paymentVerifiedAt && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                                ✅ Payment verified successfully on {new Date(order.paymentVerifiedAt).toLocaleString('en-PK')}
                            </p>
                        </div>
                    )}

                    {/* Payment Note */}
                    {order.paymentNote && (
                        <div className="pt-4 border-t">
                            <p className="text-sm text-neutral-600 mb-1">Payment Note</p>
                            <p className="text-sm">{order.paymentNote}</p>
                        </div>
                    )}

                    {/* Payment Screenshot */}
                    {order.paymentScreenshot && (
                        <div className="pt-4 border-t">
                            <p className="text-sm text-neutral-600 mb-2">Payment Screenshot</p>
                            <img
                                src={order.paymentScreenshot}
                                alt="Payment Screenshot"
                                className="max-w-xs rounded-lg border"
                            />
                            {order.paymentScreenshotUploadedAt && (
                                <p className="text-xs text-neutral-500 mt-1">
                                    Uploaded: {new Date(order.paymentScreenshotUploadedAt).toLocaleString('en-PK')}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Status Badge */}
            <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600">Order Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${statusDisplay[order.status]?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                            {statusDisplay[order.status]?.label || order.status}
                        </span>
                    </div>
                    <div className="text-right text-sm text-neutral-600">
                        <p>Order placed on</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-PK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-neutral-600 text-sm print:hidden">
                <p>Questions about your order? Contact us at support@thetrendseller.com or Whatsapp at 0323-4653567</p>
            </div>
        </div>
    );
}