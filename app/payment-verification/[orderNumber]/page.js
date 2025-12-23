'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Upload, AlertCircle, Copy, Check, X } from 'lucide-react';
import { compressImage, formatFileSize } from '@/lib/imageCompression';

export default function PaymentVerificationPage({ params }) {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { orderNumber } = params;
    const redirectTimeoutRef = useRef(null);

    // Allowed payment methods
    const allowedMethods = ['jazzcash', 'easypaisa', 'bank'];
    const selectedMethod = searchParams.get('paymentMethod');
    const initialPaymentMethod = allowedMethods.includes(selectedMethod) ? selectedMethod : 'jazzcash';

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accountLoading, setAccountLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Progress tracking
    const [compressing, setCompressing] = useState(false); // Compression state
    const [screenshot, setScreenshot] = useState(null);
    const [originalSize, setOriginalSize] = useState(0); // Original file size
    const [compressedSize, setCompressedSize] = useState(0); // Compressed file size
    const [previewUrl, setPreviewUrl] = useState(null);
    const [copiedName, setCopiedName] = useState(false);
    const [copiedNumber, setCopiedNumber] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
    const [accountDetails, setAccountDetails] = useState(null);

    // Allowed file types
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Payment method to API mapping
    const METHOD_MAPPING = {
        'bank': 'bank-transfer',
        'jazzcash': 'jazzcash',
        'easypaisa': 'easypaisa'
    };

    // Fetch order data
    useEffect(() => {
        fetchOrder();
    }, [orderNumber]);

    // Fetch account details when payment method changes
    useEffect(() => {
        fetchAccountDetails();
    }, [paymentMethod]);

    // Check if screenshot already uploaded
    useEffect(() => {
        if (order?.paymentScreenshot && !uploadSuccess) {
            toast({
                title: 'Already Submitted',
                description: 'Payment screenshot has already been uploaded for this order.',
                variant: 'destructive',
            });
            // Hard redirect
            window.location.replace(`/orders/${orderNumber}`);
        }
    }, [order]);

    // Cleanup preview URL and timeout
    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, [previewUrl]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/orders/${orderNumber}?t=${Date.now()}`, {
                cache: 'no-store'
            });
            const data = await response.json();

            if (!data.success) {
                toast({
                    title: 'Error',
                    description: 'Order not found',
                    variant: 'destructive',
                });
                window.location.replace('/');
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

    const fetchAccountDetails = async () => {
        setAccountLoading(true);
        try {
            const response = await fetch(`/api/payment-accounts?method=${paymentMethod}`);
            const data = await response.json();

            if (data.success) {
                setAccountDetails(data.account);
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to load payment account details',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error fetching account details:', error);
            toast({
                title: 'Error',
                description: 'Failed to load payment account details',
                variant: 'destructive',
            });
        } finally {
            setAccountLoading(false);
        }
    };

    // Handle file selection with compression
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast({
                title: 'Invalid File Type',
                description: 'Please upload JPEG, PNG, or WebP images only',
                variant: 'destructive'
            });
            e.target.value = '';
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            toast({
                title: 'File Too Large',
                description: 'Please upload an image smaller than 5MB',
                variant: 'destructive'
            });
            e.target.value = '';
            return;
        }

        setOriginalSize(file.size);

        // Compress image if larger than 1MB
        if (file.size > 1024 * 1024) {
            setCompressing(true);
            toast({
                title: 'Optimizing Image',
                description: 'Compressing image for faster upload...',
            });

            try {
                const compressedFile = await compressImage(file, {
                    maxSizeMB: 0.8,
                    maxWidthOrHeight: 1920,
                    quality: 0.85,
                    fileType: file.type
                });

                setCompressedSize(compressedFile.size);
                setScreenshot(compressedFile);

                // Show compression results
                const savedBytes = file.size - compressedFile.size;
                const savedPercent = Math.round((savedBytes / file.size) * 100);

                toast({
                    title: '✨ Image Optimized',
                    description: `Reduced by ${savedPercent}% (${formatFileSize(savedBytes)} saved)`,
                });

                // Cleanup previous preview URL
                if (previewUrl?.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl);
                }

                // Use compressed image for preview
                const objectUrl = URL.createObjectURL(compressedFile);
                setPreviewUrl(objectUrl);
            } catch (error) {
                console.error('Compression error:', error);
                toast({
                    title: 'Compression Failed',
                    description: 'Using original image instead',
                    variant: 'destructive'
                });

                // Fall back to original file
                setScreenshot(file);
                setCompressedSize(file.size);
                const objectUrl = URL.createObjectURL(file);
                setPreviewUrl(objectUrl);
            } finally {
                setCompressing(false);
            }
        } else {
            // Small file, no compression needed
            setCompressedSize(file.size);
            setScreenshot(file);

            // Cleanup previous preview URL
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // Handle removing screenshot
    const handleRemoveScreenshot = () => {
        if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setScreenshot(null);
        setPreviewUrl(null);

        // Reset file input
        const fileInput = document.getElementById('screenshot');
        if (fileInput) fileInput.value = '';
    };

    // Handle form submit with progress tracking
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!screenshot) {
            toast({
                title: 'No Screenshot',
                description: 'Please upload a payment screenshot',
                variant: 'destructive'
            });
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('screenshot', screenshot);
            formData.append('orderNumber', orderNumber);
            formData.append('paymentMethod', METHOD_MAPPING[paymentMethod]);

            // Simulate upload progress (since FormData doesn't support real progress easily)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await fetch('/api/payment-verification', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const data = await response.json();

            if (!data.success) {
                toast({
                    title: 'Upload Failed',
                    description: data.error || 'Failed to upload screenshot',
                    variant: 'destructive'
                });
                setUploading(false);
                setUploadProgress(0);
                return;
            }

            // Set success state to show success UI
            setUploadSuccess(true);

            toast({
                title: '✨ Success!',
                description: 'Payment screenshot uploaded successfully. Redirecting...'
            });

            // Clear the screenshot after successful upload
            handleRemoveScreenshot();

            // Use window.location.replace for HARD redirect (no back button)
            redirectTimeoutRef.current = setTimeout(() => {
                window.location.replace(`/orders/${orderNumber}?uploaded=true&t=${Date.now()}`);
            }, 1500);

        } catch (error) {
            console.error('Upload Error:', error);
            toast({
                title: 'Error',
                description: 'Failed to upload screenshot. Please try again.',
                variant: 'destructive'
            });
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'name') {
                setCopiedName(true);
                setTimeout(() => setCopiedName(false), 2000);
            } else {
                setCopiedNumber(true);
                setTimeout(() => setCopiedNumber(false), 2000);
            }

            toast({
                title: 'Copied!',
                description: `${type === 'name' ? 'Account name' : 'Account number'} copied to clipboard`,
            });
        } catch (error) {
            toast({
                title: 'Copy Failed',
                description: 'Failed to copy to clipboard',
                variant: 'destructive'
            });
        }
    };

    // Calculate total amount including delivery
    const calculateTotal = () => {
        if (!order) return 0;
        return order.totalAmount || 0;
    };

    // Calculate subtotal without delivery
    const calculateSubtotal = () => {
        if (!order) return 0;
        return (order.totalAmount || 0) - (order.deliveryCharges || 0);
    };

    // ✅ Show success screen while redirecting
    if (uploadSuccess) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-800 mb-2">Upload Successful!</h2>
                        <p className="text-green-700 mb-4">
                            Your payment screenshot has been uploaded successfully.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-green-600">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Redirecting to order status...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

    if (!order) return null;

    const totalAmount = calculateTotal();

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
                            {order.items.map((item, index) => (
                                <div key={item.productId || index} className="flex justify-between text-sm">
                                    <span className="text-neutral-600">{item.name} × {item.quantity}</span>
                                    <span className="text-neutral-900 font-medium">
                                        ₨{(item.price * item.quantity).toLocaleString('en-PK')}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-neutral-200 mt-4 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Subtotal</span>
                                <span className="text-neutral-900">₨{calculateSubtotal().toLocaleString('en-PK')}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Delivery Charges</span>
                                <span className={order.deliveryCharges === 0 ? 'text-green-600 font-medium' : 'text-neutral-900'}>
                                    {order.deliveryCharges === 0
                                        ? 'FREE'
                                        : `₨${(order.deliveryCharges ?? 0).toLocaleString('en-PK')}`}
                                </span>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-neutral-900 pt-2 border-t">
                                <span>Total Amount</span>
                                <span>₨{totalAmount.toLocaleString('en-PK')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <label htmlFor="payment-method" className="block text-sm font-medium text-neutral-700 mb-2">
                            Select Payment Method
                        </label>
                        <select
                            id="payment-method"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        >
                            <option value="jazzcash">JazzCash</option>
                            <option value="easypaisa">EasyPaisa</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>

                    {/* Payment Instructions */}
                    {accountDetails && (
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
                    )}

                    {/* Account Details Card */}
                    {accountLoading ? (
                        <div className="bg-white border border-neutral-200 rounded-lg p-6">
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                                <span className="ml-2 text-neutral-600">Loading account details...</span>
                            </div>
                        </div>
                    ) : accountDetails ? (
                        <div className="bg-white border border-neutral-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                <span>{accountDetails.icon}</span>
                                {accountDetails.title}
                            </h2>

                            <div className="space-y-4">
                                {accountDetails.bankName && (
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
                                            type="button"
                                            onClick={() => copyToClipboard(accountDetails.accountName, 'name')}
                                            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                        >
                                            {copiedName ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-neutral-600" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        {paymentMethod === 'bank' ? 'Account Number' : 'Phone Number'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={accountDetails.accountNumber}
                                            readOnly
                                            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900 font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(accountDetails.accountNumber, 'number')}
                                            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                        >
                                            {copiedNumber ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-neutral-600" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Amount to Send</label>
                                    <div className="px-4 py-2 border-2 border-neutral-400 rounded-lg bg-yellow-50 text-neutral-900 font-bold text-lg">
                                        ₨{totalAmount.toLocaleString('en-PK')}
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Please send exactly this amount including delivery charges
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Screenshot Upload */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
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
                                        accept={ALLOWED_TYPES.join(',')}
                                        onChange={handleFileChange}
                                        className="sr-only"
                                        disabled={uploading}
                                    />
                                    <label
                                        htmlFor="screenshot"
                                        className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        <div className="text-center">
                                            <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-neutral-700">Click to upload or drag and drop</p>
                                            <p className="text-xs text-neutral-500 mt-1">PNG, JPG, WebP up to 5MB</p>
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
                                            onClick={handleRemoveScreenshot}
                                            disabled={uploading}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Important:</strong> Please ensure the screenshot clearly shows:
                                </p>
                                <ul className="text-sm text-blue-800 mt-2 ml-4 list-disc space-y-1">
                                    <li>Transaction ID or Reference Number</li>
                                    <li>Amount sent (₨{totalAmount.toLocaleString('en-PK')})</li>
                                    <li>Recipient account details</li>
                                    <li>Date and time of transaction</li>
                                </ul>
                            </div>

                            {/* Progress Bar */}
                            {uploading && uploadProgress > 0 && (
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-neutral-700">
                                            {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                                        </span>
                                        <span className="text-sm font-bold text-neutral-900">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Compression Indicator */}
                            {compressing && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">Optimizing Image</p>
                                        <p className="text-xs text-blue-700">Compressing for faster upload...</p>
                                    </div>
                                </div>
                            )}

                            {/* File Size Info */}
                            {screenshot && compressedSize > 0 && !uploading && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-800">
                                        <strong>Ready to upload:</strong> {formatFileSize(compressedSize)}
                                        {originalSize !== compressedSize && (
                                            <span className="ml-2 text-xs">
                                                (Saved {Math.round((1 - compressedSize / originalSize) * 100)}%)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={uploading || !screenshot || compressing}
                                className="w-full bg-neutral-900 text-white px-6 py-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        {uploadProgress < 100 ? `Uploading ${uploadProgress}%` : 'Processing...'}
                                    </>
                                ) : compressing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Compressing Image...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-5 w-5" />
                                        Submit Payment Proof
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                        <h3 className="font-semibold text-neutral-900 mb-3">Need Help?</h3>
                        <p className="text-sm text-neutral-600 mb-3">
                            If you have any issues with the payment process, please contact our support team:
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm">
                                <strong className="text-neutral-900">Email:</strong>{' '}
                                <a href="mailto:thetrendseller0@gmail.com" className="text-blue-600 hover:underline">
                                    thetrendseller0@gmail.com
                                </a>
                            </p>
                            <p className="text-sm">
                                <strong className="text-neutral-900">Phone:</strong>{' '}
                                <a href="tel:+923234653567" className="text-blue-600 hover:underline">
                                    0323-4653567
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}