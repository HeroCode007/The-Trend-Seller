import nodemailer from 'nodemailer';

// Reusable transporter - cached at module level
let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            // Connection pooling for better performance
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            // Timeouts
            connectionTimeout: 5000,
            greetingTimeout: 5000,
            socketTimeout: 10000,
        });
    }
    return transporter;
}

/**
 * Send email synchronously (waits for result)
 */
export async function sendEmail({ to, subject, html }) {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP not configured');
            return { success: false, error: 'SMTP not configured' };
        }

        const info = await getTransporter().sendMail({
            from: `"The Trend Seller" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send email asynchronously (fire and forget)
 * Use this when you don't need to wait for the result
 */
export function sendEmailAsync({ to, subject, html }) {
    // Don't await - just fire and forget
    setImmediate(async () => {
        try {
            if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
                console.warn('⚠️ SMTP not configured');
                return;
            }

            const info = await getTransporter().sendMail({
                from: `"The Trend Seller" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });

            console.log('✅ Async email sent:', info.messageId);
        } catch (error) {
            console.error('❌ Async email error:', error.message);
            // Don't throw - this is background task
        }
    });
}

// ============================================
// EMAIL TEMPLATES (Keep your existing templates)
// ============================================

const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString('en-PK')}`;

const getPaymentMethodName = (method) => {
    const methods = {
        'cod': 'Cash on Delivery',
        'jazzcash': 'JazzCash',
        'easypaisa': 'EasyPaisa',
        'bank-transfer': 'Bank Transfer'
    };
    return methods[method] || method;
};

const getPaymentStatusBadge = (status) => {
    const styles = {
        'pending': { bg: '#fef3c7', color: '#92400e', text: 'Pending' },
        'awaiting_verification': { bg: '#dbeafe', color: '#1e40af', text: 'Awaiting Verification' },
        'paid': { bg: '#d1fae5', color: '#065f46', text: 'Paid' },
        'failed': { bg: '#fee2e2', color: '#991b1b', text: 'Failed' }
    };
    const style = styles[status] || styles.pending;
    return `<span style="display: inline-block; padding: 6px 14px; background-color: ${style.bg}; color: ${style.color}; font-size: 13px; font-weight: 600; border-radius: 20px;">${style.text}</span>`;
};

const emailWrapper = (content, preheaderText = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Trend Seller</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden;">${preheaderText}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 40px; border-radius: 12px 12px 0 0; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">THE TREND SELLER</h1>
                            <p style="margin: 8px 0 0 0; color: #d4af37; font-size: 12px; letter-spacing: 2px;">Premium Watches • Belts • Wallets</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #ffffff; padding: 0;">
                            ${content}
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 30px 40px; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0; color: #888888; font-size: 14px;">Thank you for shopping with The Trend Seller</p>
                            <p style="margin: 20px 0 0 0; color: #555555; font-size: 12px;">© ${new Date().getFullYear()} The Trend Seller</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const generateOrderItemsTable = (items) => {
    return items.map(item => `
        <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="vertical-align: top;">
                            <p style="margin: 0 0 5px 0; font-weight: 600; color: #1a1a1a;">${item.name}</p>
                            <p style="margin: 0; color: #666666; font-size: 13px;">Qty: ${item.quantity}</p>
                        </td>
                        <td style="vertical-align: top; text-align: right;">
                            <p style="margin: 0; font-weight: 600; color: #1a1a1a;">${formatCurrency(item.price * item.quantity)}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `).join('');
};

// Simplified email templates for faster generation
export const newOrderAdminEmail = (order, shippingAddress) => {
    const total = order.totalAmount || 0;
    const content = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="background-color: #fef3c7; padding: 15px 40px; border-left: 4px solid #d97706;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">🔔 New Order - Action Required</p>
                </td>
            </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 30px 40px;">
                    <h2 style="margin: 0 0 10px 0; color: #1a1a1a;">Order #${order.orderNumber}</h2>
                    <p style="margin: 0; color: #059669; font-size: 24px; font-weight: 700;">${formatCurrency(total)}</p>
                    <p style="margin: 15px 0; color: #666;">Payment: ${getPaymentMethodName(order.paymentMethod)}</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="margin: 0; color: #1a1a1a;"><strong>Customer:</strong> ${shippingAddress.fullName}</p>
                    <p style="margin: 5px 0; color: #666;">${shippingAddress.email} | ${shippingAddress.phone}</p>
                    <p style="margin: 5px 0; color: #666;">${shippingAddress.address}, ${shippingAddress.city}</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${generateOrderItemsTable(order.items)}
                    </table>
                </td>
            </tr>
        </table>
    `;
    return emailWrapper(content, `New order #${order.orderNumber} - ${formatCurrency(total)}`);
};

export const orderConfirmationCustomerEmail = (order, shippingAddress) => {
    const total = order.totalAmount || 0;
    const content = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px; text-align: center;">
                    <div style="font-size: 50px; margin-bottom: 15px;">✓</div>
                    <h2 style="margin: 0; color: #ffffff; font-size: 26px;">Order Confirmed!</h2>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9);">Thank you, ${shippingAddress.fullName.split(' ')[0]}!</p>
                </td>
            </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 30px 40px; text-align: center;">
                    <p style="margin: 0; color: #888888; font-size: 12px;">ORDER NUMBER</p>
                    <p style="margin: 5px 0 0 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">${order.orderNumber}</p>
                </td>
            </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${generateOrderItemsTable(order.items)}
                    </table>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; background-color: #1a1a1a; border-radius: 10px;">
                        <tr>
                            <td style="padding: 20px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="color: #ffffff;">Total</td>
                                        <td style="color: #d4af37; font-size: 24px; font-weight: 700; text-align: right;">${formatCurrency(total)}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `;
    return emailWrapper(content, `Order confirmed! #${order.orderNumber}`);
};

export const paymentScreenshotAdminEmail = (order) => {
    const total = order.totalAmount || 0;
    const content = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="background-color: #dbeafe; padding: 15px 40px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">📸 Payment Verification Required</p>
                </td>
            </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 30px 40px;">
                    <h2 style="margin: 0 0 10px 0; color: #1a1a1a;">Order #${order.orderNumber}</h2>
                    <p style="margin: 0; color: #059669; font-size: 24px; font-weight: 700;">${formatCurrency(total)}</p>
                    <p style="margin: 15px 0; color: #666;">Method: ${getPaymentMethodName(order.paymentMethod)}</p>
                    ${order.paymentScreenshot ? `
                        <img src="${order.paymentScreenshot}" alt="Payment Screenshot" style="max-width: 100%; border-radius: 10px; margin-top: 20px;">
                    ` : ''}
                </td>
            </tr>
        </table>
    `;
    return emailWrapper(content, `Verify payment for #${order.orderNumber}`);
};

export const paymentScreenshotCustomerEmail = (order) => {
    const content = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
                    <div style="font-size: 50px; margin-bottom: 15px;">📸</div>
                    <h2 style="margin: 0; color: #ffffff;">Payment Received!</h2>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9);">Verification in progress</p>
                </td>
            </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 30px 40px; text-align: center;">
                    <p style="margin: 0; color: #888888;">ORDER NUMBER</p>
                    <p style="margin: 5px 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">${order.orderNumber}</p>
                    ${getPaymentStatusBadge('awaiting_verification')}
                    <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">We'll notify you once your payment is verified.</p>
                </td>
            </tr>
        </table>
    `;
    return emailWrapper(content, `Payment received for #${order.orderNumber}`);
};

export {
    formatCurrency,
    getPaymentMethodName,
    getPaymentStatusBadge
};
