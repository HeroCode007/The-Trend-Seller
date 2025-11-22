'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Upload, AlertCircle, Copy, Check } from 'lucide-react';

export default function PaymentVerificationPage({ params }) {
    const router = useRouter();
    const { toast } = useToast();
    const { orderNumber } = params;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [copiedName, setCopiedName] = useState(false);
    const [copiedNumber, setCopiedNumber] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('jazzcash');

    // Payment account details
    const paymentAccounts = {
        jazzcash: {
            accountName: 'Syed Saif Ali',
            accountNumber: '0323-4653567',
            title: 'JazzCash Account',
            icon: '📱',
            color: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-800',
        },
        easypaisa: {
            accountName: 'Syed Irfan Shah',
            accountNumber: '0315-1787031',
            title: 'EasyPaisa Account',
            icon: '💳',
            color: 'bg-green-50 border-green-200',
            textColor: 'text-green-800',
        },
        bank: {
            accountName: 'Syed Khizar Hasnain',
            accountNumber: '3651301000000670',
            bankName: 'Faysal Bank',
            title: 'Bank Transfer',
            icon: '🏦',
            color: 'bg-yellow-50 border-yellow-200',
            textColor: 'text-yellow-800',
        },
    };

    const accountDetails = paymentAccounts[paymentMethod];

    useEffect(() => {
        fetchOrder();
    }, [orderNumber]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/orders/${orderNumber}`);
            const data = await response.json();

            if (!data.success) {
                toast({
                    title: 'Error',
                    description: 'Order not found',
                    variant: 'destructive',
                });
                router.push('/');
                return;
            }

            setOrder(data.order);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast({
                title: 'Error',
                description: 'Failed to load order details',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Invalid File',
                description: 'Please upload an image file',
                variant: 'destructive',
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File Too Large',
                description: 'Please upload an image smaller than 5MB',
                variant: 'destructive',
            });
            return;
        }

        setScreenshot(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!screenshot) {
            toast({
                title: 'No Screenshot',
                description: 'Please upload a payment screenshot',
                variant: 'destructive',
            });
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('screenshot', screenshot);
            formData.append('orderNumber', orderNumber);
            formData.append('paymentMethod', paymentMethod);

            const response = await fetch('/api/payment-verification', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!data.success) {
                toast({
                    title: 'Upload Failed',
                    description: data.error || 'Failed to upload screenshot',
                    variant: 'destructive',
                });
                return;
            }

            toast({
                title: 'Success!',
                description: 'Payment screenshot uploaded successfully. We will verify and confirm your order shortly.',
            });

            setTimeout(() => {
                router.push(`/orders/${orderNumber}`);
            }, 2000);
        } catch (error) {
            console.error('Upload Error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to upload screenshot',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'name') {
            setCopiedName(true);
            setTimeout(() => setCopiedName(false), 2000);
        } else {
            setCopiedNumber(true);
            setTimeout(() => setCopiedNumber(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading order details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">Payment Verification</h1>
                    <p className="text-neutral-600">Order #{orderNumber}</p>
                </div>

                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.productId} className="flex justify-between text-sm">
                                    <span className="text-neutral-600">{item.name} × {item.quantity}</span>
                                    <span className="text-neutral-900 font-medium">₨{(item.price * item.quantity).toLocaleString('en-PK')}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-neutral-200 mt-4 pt-4">
                            <div className="flex justify-between text-lg font-bold text-neutral-900">
                                <span>Total Amount</span>
                                <span>₨{order.totalAmount.toLocaleString('en-PK')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Select Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900"
                        >
                            <option value="jazzcash">JazzCash</option>
                            <option value="easypaisa">EasyPaisa</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>

                    {/* Payment Instructions */}
                    <div className={`border-2 rounded-lg p-6 ${accountDetails.color}`}>
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className={`h-6 w-6 flex-shrink-0 ${accountDetails.textColor}`} />
                            <div>
                                <h3 className={`font-semibold ${accountDetails.textColor}`}>Payment Instructions</h3>
                                <p className={`text-sm ${accountDetails.textColor} mt-1`}>
                                    Please send the payment to the account details below using {accountDetails.title}, then upload a screenshot of the transaction.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Details Card */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>{accountDetails.icon}</span>
                            {accountDetails.title}
                        </h2>

                        <div className="space-y-4">
                            {paymentMethod === 'bank' && (
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Bank Name</label>
                                    <div className="px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900">
                                        {accountDetails.bankName}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Account Name</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={accountDetails.accountName}
                                        readOnly
                                        className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(accountDetails.accountName, 'name')}
                                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        {copiedName ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-neutral-600" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Account Number / Phone</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={accountDetails.accountNumber}
                                        readOnly
                                        className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900 font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(accountDetails.accountNumber, 'number')}
                                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        {copiedNumber ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-neutral-600" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Amount to Send</label>
                                <div className="px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900 font-semibold">
                                    ₨{order.totalAmount.toLocaleString('en-PK')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Screenshot Upload Form */}
                    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Upload Payment Screenshot</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="screenshot" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Payment Screenshot *
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="screenshot"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="sr-only"
                                        required
                                    />
                                    <label
                                        htmlFor="screenshot"
                                        className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
                                    >
                                        <div className="text-center">
                                            <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-neutral-700">Click to upload or drag and drop</p>
                                            <p className="text-xs text-neutral-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {previewUrl && (
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Preview</label>
                                    <div className="relative w-full max-w-sm mx-auto">
                                        <img
                                            src={previewUrl}
                                            alt="Payment screenshot preview"
                                            className="w-full h-auto rounded-lg border border-neutral-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setScreenshot(null);
                                                setPreviewUrl(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Important:</strong> Please ensure the screenshot clearly shows:
                                </p>
                                <ul className="text-sm text-blue-800 mt-2 ml-4 list-disc">
                                    <li>Transaction ID or Reference Number</li>
                                    <li>Amount sent (₨{order.totalAmount.toLocaleString('en-PK')})</li>
                                    <li>Recipient account details</li>
                                    <li>Date and time of transaction</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || !screenshot}
                                className="w-full bg-neutral-900 text-white px-6 py-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-5 w-5" />
                                        Submit Payment Proof
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Help Section */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                        <h3 className="font-semibold text-neutral-900 mb-3">Need Help?</h3>
                        <p className="text-sm text-neutral-600 mb-2">
                            If you have any issues with the payment process, please contact our support team:
                        </p>
                        <p className="text-sm">
                            <strong>Email:</strong>{' '}
                            <a href="mailto:thetrendseller0@gmail.com" className="text-blue-600 hover:underline">
                                thetrendseller0@gmail.com
                            </a>
                        </p>
                        <p className="text-sm">
                            <strong>Phone:</strong>{' '}
                            <a href="tel:0323-4653567" className="text-blue-600 hover:underline">
                                0323-4653567
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
