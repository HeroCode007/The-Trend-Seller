import crypto from 'crypto';

/**
 * PayFast API Integration
 * Documentation: https://developers.payfast.co.za/
 */

// PayFast Configuration
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE;
const PAYFAST_MODE = process.env.PAYFAST_MODE || 'sandbox'; // 'sandbox' or 'live'

const PAYFAST_URLS = {
    sandbox: 'https://sandbox.payfast.co.za/eng/process',
    live: 'https://www.payfast.co.za/eng/process',
};

const PAYFAST_ITN_URL = PAYFAST_MODE === 'sandbox'
    ? 'https://sandbox.payfast.co.za/eng/query/validate'
    : 'https://www.payfast.co.za/eng/query/validate';

/**
 * Generate PayFast signature for payment data
 */
export function generatePayFastSignature(data) {
    // Remove empty values and signature itself
    const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== '' && key !== 'signature')
    );

    // Sort by key
    const sortedKeys = Object.keys(cleanData).sort();

    // Build query string
    const queryString = sortedKeys
        .map((key) => `${key}=${encodeURIComponent(cleanData[key]).replace(/%20/g, '+')}`)
        .join('&');

    // Add passphrase if provided
    const stringToSign = PAYFAST_PASSPHRASE
        ? `${queryString}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE).replace(/%20/g, '+')}`
        : queryString;

    // Generate MD5 hash
    return crypto.createHash('md5').update(stringToSign).digest('hex');
}

/**
 * Create PayFast payment data
 */
export function createPayFastPaymentData(order, returnUrl, cancelUrl, notifyUrl) {
    const paymentData = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        name_first: order.shippingAddress.fullName.split(' ')[0] || order.shippingAddress.fullName,
        name_last: order.shippingAddress.fullName.split(' ').slice(1).join(' ') || '',
        email_address: order.shippingAddress.email,
        cell_number: order.shippingAddress.phone,
        m_payment_id: order.orderNumber,
        // Note: PayFast uses ZAR (South African Rand). 
        // If your store uses a different currency (e.g., PKR), convert the amount.
        // Example: (order.totalAmount * 0.05).toFixed(2) // Assuming 1 PKR = 0.05 ZAR
        // Get current exchange rate from an API or set a fixed rate
        // For now, using direct amount - UPDATE THIS with proper currency conversion
        amount: order.totalAmount.toFixed(2), // Amount in ZAR (UPDATE: Add currency conversion)
        item_name: `Order ${order.orderNumber}`,
    };

    // Generate signature
    paymentData.signature = generatePayFastSignature(paymentData);

    return paymentData;
}

/**
 * Validate PayFast ITN (Instant Transaction Notification)
 */
export function validatePayFastITN(data) {
    const signature = generatePayFastSignature(data);
    return signature === data.signature;
}

/**
 * Get PayFast payment URL
 */
export function getPayFastUrl() {
    return PAYFAST_URLS[PAYFAST_MODE] || PAYFAST_URLS.sandbox;
}

/**
 * Check if PayFast is configured
 */
export function isPayFastConfigured() {
    return !!(PAYFAST_MERCHANT_ID && PAYFAST_MERCHANT_KEY);
}

