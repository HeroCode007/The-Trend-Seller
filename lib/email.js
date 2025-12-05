import nodemailer from 'nodemailer';

// ============================================
// EMAIL TRANSPORTER CONFIGURATION
// ============================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ============================================
// EMAIL TEMPLATES
// ============================================

/**
 * Generate the base email wrapper with header and footer
 */
const emailWrapper = (content, preheaderText = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>The Trend Seller</title>
    <!--[if mso]>
    <style type="text/css">
        table {border-collapse: collapse;}
        .fallback-font {font-family: Arial, sans-serif;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <!-- Preheader Text (hidden) -->
    <div style="display: none; max-height: 0; overflow: hidden;">
        ${preheaderText}
    </div>
    
    <!-- Email Container -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Email Content -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 40px; border-radius: 12px 12px 0 0; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                                THE TREND SELLER
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #d4af37; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
                                Premium Watches • Belts • Wallets
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 0;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 30px 40px; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #888888; font-size: 14px;">
                                Thank you for shopping with The Trend Seller
                            </p>
                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="padding: 0 10px;">
                                        <a href="https://thetrendseller.com" style="color: #d4af37; text-decoration: none; font-size: 13px;">Website</a>
                                    </td>
                                    <td style="color: #444444;">|</td>
                                    <td style="padding: 0 10px;">
                                        <a href="mailto:thetrendseller0@gmail.com" style="color: #d4af37; text-decoration: none; font-size: 13px;">Email</a>
                                    </td>
                                    <td style="color: #444444;">|</td>
                                    <td style="padding: 0 10px;">
                                        <a href="https://wa.me/923234653567" style="color: #d4af37; text-decoration: none; font-size: 13px;">WhatsApp</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 20px 0 0 0; color: #555555; font-size: 12px;">
                                © ${new Date().getFullYear()} The Trend Seller. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

/**
 * Format currency
 */
const formatCurrency = (amount) => {
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};

/**
 * Get payment method display name
 */
const getPaymentMethodName = (method) => {
  const methods = {
    'cod': 'Cash on Delivery',
    'jazzcash': 'JazzCash',
    'easypaisa': 'EasyPaisa',
    'bank-transfer': 'Bank Transfer'
  };
  return methods[method] || method;
};

/**
 * Get payment status badge HTML
 */
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

/**
 * Get absolute image URL for emails
 * Note: We use original image path, not Next.js optimized URLs
 * because email clients cannot process /_next/image URLs
 */
const getAbsoluteImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Get base URL from environment or use default
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.thetrendseller.com').replace(/\/$/, '');

  // If already absolute URL (Cloudinary, external, etc.), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a Next.js optimized URL, extract the original path
  if (imagePath.includes('/_next/image')) {
    try {
      const urlMatch = imagePath.match(/url=([^&]+)/);
      if (urlMatch) {
        imagePath = decodeURIComponent(urlMatch[1]);
      }
    } catch (e) {
      // Keep original path if parsing fails
    }
  }

  // Handle relative paths - construct full URL to original image
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }

  return `${baseUrl}/${imagePath}`;
};

/**
 * Generate order items table HTML
 */
const generateOrderItemsTable = (items) => {
  let itemsHtml = '';
  items.forEach(item => {
    const imageUrl = getAbsoluteImageUrl(item.image);

    itemsHtml += `
            <tr>
                <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="70" style="vertical-align: top;">
                                ${imageUrl
        ? `<img src="${imageUrl}" alt="${item.name}" width="60" height="60" style="border-radius: 8px; object-fit: cover; display: block; border: 1px solid #e5e7eb;">`
        : `<div style="width: 60px; height: 60px; background-color: #f0f0f0; border-radius: 8px; border: 1px solid #e5e7eb;"></div>`
      }
                            </td>
                            <td style="vertical-align: top; padding-left: 15px;">
                                <p style="margin: 0 0 5px 0; font-weight: 600; color: #1a1a1a; font-size: 15px;">${item.name}</p>
                                <p style="margin: 0; color: #666666; font-size: 13px;">Qty: ${item.quantity}</p>
                            </td>
                            <td style="vertical-align: top; text-align: right;">
                                <p style="margin: 0; font-weight: 600; color: #1a1a1a; font-size: 15px;">${formatCurrency(item.price * item.quantity)}</p>
                                <p style="margin: 5px 0 0 0; color: #888888; font-size: 12px;">${formatCurrency(item.price)} each</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        `;
  });
  return itemsHtml;
};

// ============================================
// NEW ORDER EMAIL - ADMIN
// ============================================
const newOrderAdminEmail = (order, shippingAddress) => {
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharges = order.deliveryCharges || 0;
  const total = order.totalAmount || (subtotal + deliveryCharges);

  const content = `
        <!-- Alert Banner -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="background-color: #fef3c7; padding: 15px 40px; border-left: 4px solid #d97706;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                        🔔 New Order Received - Action Required
                    </p>
                </td>
            </tr>
        </table>
        
        <!-- Order Header -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 30px 40px 20px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <h2 style="margin: 0 0 5px 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">
                                    Order #${order.orderNumber}
                                </h2>
                                <p style="margin: 0; color: #666666; font-size: 14px;">
                                    ${new Date(order.createdAt || Date.now()).toLocaleString('en-PK', {
    dateStyle: 'full',
    timeStyle: 'short'
  })}
                                </p>
                            </td>
                            <td style="text-align: right; vertical-align: top;">
                                ${getPaymentStatusBadge(order.paymentStatus)}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Payment & Status Info -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 10px;">
                        <tr>
                            <td width="50%" style="padding: 20px; border-right: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 5px 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</p>
                                <p style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">${getPaymentMethodName(order.paymentMethod)}</p>
                            </td>
                            <td width="50%" style="padding: 20px;">
                                <p style="margin: 0 0 5px 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Status</p>
                                <p style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; text-transform: capitalize;">${order.status || 'Pending'}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Customer Details -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0;">
                        👤 Customer Details
                    </h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="50%" style="vertical-align: top; padding-right: 15px;">
                                <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Name</p>
                                <p style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 15px; font-weight: 500;">${shippingAddress.fullName}</p>
                                
                                <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Phone</p>
                                <p style="margin: 0; color: #1a1a1a; font-size: 15px; font-weight: 500;">
                                    <a href="tel:${shippingAddress.phone}" style="color: #1a1a1a; text-decoration: none;">${shippingAddress.phone}</a>
                                </p>
                            </td>
                            <td width="50%" style="vertical-align: top;">
                                <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Email</p>
                                <p style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 15px; font-weight: 500;">
                                    <a href="mailto:${shippingAddress.email}" style="color: #d4af37; text-decoration: none;">${shippingAddress.email}</a>
                                </p>
                                
                                <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Address</p>
                                <p style="margin: 0; color: #1a1a1a; font-size: 15px; font-weight: 500; line-height: 1.5;">
                                    ${shippingAddress.address}<br>
                                    ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                                    ${shippingAddress.country || 'Pakistan'}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Order Items -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0;">
                        📦 Order Items
                    </h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${generateOrderItemsTable(order.items)}
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Order Total -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 10px;">
                        <tr>
                            <td style="padding: 20px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666666; font-size: 14px;">Subtotal</td>
                                        <td style="padding: 5px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${formatCurrency(subtotal)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666666; font-size: 14px;">Delivery Charges</td>
                                        <td style="padding: 5px 0; color: ${deliveryCharges === 0 ? '#059669' : '#1a1a1a'}; font-size: 14px; text-align: right; font-weight: ${deliveryCharges === 0 ? '600' : '400'};">
                                            ${deliveryCharges === 0 ? 'FREE' : formatCurrency(deliveryCharges)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 15px 0 0 0;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #e5e7eb;">
                                                <tr>
                                                    <td style="padding: 15px 0 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">Total Amount</td>
                                                    <td style="padding: 15px 0 0 0; color: #059669; font-size: 22px; font-weight: 700; text-align: right;">${formatCurrency(total)}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `;

  return emailWrapper(content, `New order #${order.orderNumber} received - ${formatCurrency(total)}`);
};

// ============================================
// ORDER CONFIRMATION EMAIL - CUSTOMER
// ============================================
const orderConfirmationCustomerEmail = (order, shippingAddress) => {
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharges = order.deliveryCharges || 0;
  const total = order.totalAmount || (subtotal + deliveryCharges);

  const content = `
        <!-- Success Banner -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px; text-align: center;">
                    <div style="width: 70px; height: 70px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px auto; line-height: 70px;">
                        <span style="font-size: 35px;">✓</span>
                    </div>
                    <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 26px; font-weight: 700;">
                        Order Confirmed!
                    </h2>
                    <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">
                        Thank you for your order, ${shippingAddress.fullName.split(' ')[0]}!
                    </p>
                </td>
            </tr>
        </table>
        
        <!-- Order Number Box -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 30px 40px 20px 40px; text-align: center;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #f9fafb; border-radius: 10px; border: 2px dashed #d4af37;">
                        <tr>
                            <td style="padding: 20px 40px;">
                                <p style="margin: 0 0 5px 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
                                <p style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700; letter-spacing: 1px;">${order.orderNumber}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Order Status Timeline -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 10px 40px 30px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="25%" style="text-align: center;">
                                <div style="width: 40px; height: 40px; background-color: #059669; border-radius: 50%; margin: 0 auto 10px auto; line-height: 40px; color: #ffffff; font-weight: 700;">✓</div>
                                <p style="margin: 0; color: #059669; font-size: 12px; font-weight: 600;">Confirmed</p>
                            </td>
                            <td width="25%" style="text-align: center;">
                                <div style="width: 40px; height: 40px; background-color: #e5e7eb; border-radius: 50%; margin: 0 auto 10px auto; line-height: 40px; color: #9ca3af; font-weight: 700;">2</div>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px; font-weight: 600;">Processing</p>
                            </td>
                            <td width="25%" style="text-align: center;">
                                <div style="width: 40px; height: 40px; background-color: #e5e7eb; border-radius: 50%; margin: 0 auto 10px auto; line-height: 40px; color: #9ca3af; font-weight: 700;">3</div>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px; font-weight: 600;">Shipped</p>
                            </td>
                            <td width="25%" style="text-align: center;">
                                <div style="width: 40px; height: 40px; background-color: #e5e7eb; border-radius: 50%; margin: 0 auto 10px auto; line-height: 40px; color: #9ca3af; font-weight: 700;">4</div>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px; font-weight: 600;">Delivered</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Shipping Address -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 10px;">
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin: 0 0 10px 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                                    📍 Shipping Address
                                </p>
                                <p style="margin: 0; color: #1a1a1a; font-size: 15px; line-height: 1.6;">
                                    <strong>${shippingAddress.fullName}</strong><br>
                                    ${shippingAddress.address}<br>
                                    ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                                    ${shippingAddress.country || 'Pakistan'}<br>
                                    📞 ${shippingAddress.phone}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Order Items -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0;">
                        Your Order
                    </h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${generateOrderItemsTable(order.items)}
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Order Total -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 10px;">
                        <tr>
                            <td style="padding: 25px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 5px 0; color: #a3a3a3; font-size: 14px;">Subtotal</td>
                                        <td style="padding: 5px 0; color: #ffffff; font-size: 14px; text-align: right;">${formatCurrency(subtotal)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #a3a3a3; font-size: 14px;">Delivery</td>
                                        <td style="padding: 5px 0; color: ${deliveryCharges === 0 ? '#34d399' : '#ffffff'}; font-size: 14px; text-align: right; font-weight: ${deliveryCharges === 0 ? '600' : '400'};">
                                            ${deliveryCharges === 0 ? 'FREE' : formatCurrency(deliveryCharges)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #a3a3a3; font-size: 14px;">Payment Method</td>
                                        <td style="padding: 5px 0; color: #ffffff; font-size: 14px; text-align: right;">${getPaymentMethodName(order.paymentMethod)}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 15px 0 0 0;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #333333;">
                                                <tr>
                                                    <td style="padding: 15px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 700;">Total</td>
                                                    <td style="padding: 15px 0 0 0; color: #d4af37; font-size: 24px; font-weight: 700; text-align: right;">${formatCurrency(total)}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Next Steps -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 10px; border-left: 4px solid #3b82f6;">
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 15px; font-weight: 600;">
                                    ℹ️ What's Next?
                                </p>
                                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                                    We'll notify you once your order is shipped. You can track your order status anytime by visiting our website with your order number.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `;

  return emailWrapper(content, `Order confirmed! Your order #${order.orderNumber} has been received.`);
};

// ============================================
// PAYMENT SCREENSHOT RECEIVED - ADMIN
// ============================================
const paymentScreenshotAdminEmail = (order) => {
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharges = order.deliveryCharges || 0;
  const total = order.totalAmount || (subtotal + deliveryCharges);

  const content = `
        <!-- Alert Banner -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="background-color: #dbeafe; padding: 15px 40px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                        📸 Payment Screenshot Received - Verification Required
                    </p>
                </td>
            </tr>
        </table>
        
        <!-- Order Header -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 30px 40px 20px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <h2 style="margin: 0 0 5px 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">
                                    Order #${order.orderNumber}
                                </h2>
                                <p style="margin: 0; color: #666666; font-size: 14px;">
                                    Payment Method: <strong>${getPaymentMethodName(order.paymentMethod)}</strong>
                                </p>
                            </td>
                            <td style="text-align: right; vertical-align: top;">
                                ${getPaymentStatusBadge('awaiting_verification')}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Amount to Verify -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 10px; border: 2px solid #d97706;">
                        <tr>
                            <td style="padding: 25px; text-align: center;">
                                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 600;">Amount to Verify</p>
                                <p style="margin: 0; color: #92400e; font-size: 32px; font-weight: 700;">${formatCurrency(total)}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Customer Info -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">Customer Details</h3>
                    <p style="margin: 0; color: #1a1a1a; font-size: 15px; line-height: 1.8;">
                        <strong>Name:</strong> ${order.shippingAddress?.fullName || 'N/A'}<br>
                        <strong>Email:</strong> <a href="mailto:${order.shippingAddress?.email}" style="color: #d4af37;">${order.shippingAddress?.email || 'N/A'}</a><br>
                        <strong>Phone:</strong> <a href="tel:${order.shippingAddress?.phone}" style="color: #1a1a1a; text-decoration: none;">${order.shippingAddress?.phone || 'N/A'}</a>
                    </p>
                </td>
            </tr>
        </table>
        
        <!-- Order Summary -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">Order Summary</h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${generateOrderItemsTable(order.items)}
                    </table>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px; border-top: 2px solid #f0f0f0;">
                        <tr>
                            <td style="padding: 10px 0; color: #666666;">Subtotal</td>
                            <td style="padding: 10px 0; text-align: right;">${formatCurrency(subtotal)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #666666;">Delivery</td>
                            <td style="padding: 5px 0; text-align: right; color: ${deliveryCharges === 0 ? '#059669' : '#1a1a1a'};">
                                ${deliveryCharges === 0 ? 'FREE' : formatCurrency(deliveryCharges)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 15px 0 0 0; font-size: 18px; font-weight: 700; border-top: 2px solid #1a1a1a;">Total</td>
                            <td style="padding: 15px 0 0 0; font-size: 18px; font-weight: 700; text-align: right; color: #059669; border-top: 2px solid #1a1a1a;">${formatCurrency(total)}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Payment Screenshot -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 30px 40px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">📸 Payment Screenshot</h3>
                    ${order.paymentScreenshot ? `
                        <img src="${order.paymentScreenshot}" alt="Payment Screenshot" style="max-width: 100%; border-radius: 10px; border: 2px solid #e5e7eb;">
                    ` : `
                        <p style="color: #666666; font-style: italic;">Screenshot not available</p>
                    `}
                </td>
            </tr>
        </table>
        
        <!-- Action Required -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 10px; border-left: 4px solid #dc2626;">
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                                    ⚠️ Action Required: Please verify the payment screenshot and update the order status in the admin panel.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `;

  return emailWrapper(content, `Payment verification needed for order #${order.orderNumber}`);
};

// ============================================
// PAYMENT SCREENSHOT RECEIVED - CUSTOMER
// ============================================
const paymentScreenshotCustomerEmail = (order) => {
  const total = order.totalAmount || 0;

  const content = `
        <!-- Success Banner -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
                    <div style="width: 70px; height: 70px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px auto; line-height: 70px;">
                        <span style="font-size: 35px;">📸</span>
                    </div>
                    <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                        Payment Screenshot Received!
                    </h2>
                    <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">
                        We're verifying your payment now
                    </p>
                </td>
            </tr>
        </table>
        
        <!-- Order Details -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 30px 40px; text-align: center;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                            <td style="padding: 0 30px; text-align: center; border-right: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 5px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Order Number</p>
                                <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${order.orderNumber}</p>
                            </td>
                            <td style="padding: 0 30px; text-align: center; border-right: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 5px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Amount</p>
                                <p style="margin: 0; color: #059669; font-size: 18px; font-weight: 700;">${formatCurrency(total)}</p>
                            </td>
                            <td style="padding: 0 30px; text-align: center;">
                                <p style="margin: 0 0 5px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Status</p>
                                ${getPaymentStatusBadge('awaiting_verification')}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Order Summary -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 25px 40px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0;">
                        Order Summary
                    </h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${generateOrderItemsTable(order.items)}
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- What's Next -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 10px; border-left: 4px solid #22c55e;">
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin: 0 0 10px 0; color: #166534; font-size: 15px; font-weight: 600;">
                                    ✅ What's Next?
                                </p>
                                <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.6;">
                                    Our team is now verifying your payment. You'll receive a confirmation email once your payment is verified and your order is being processed. This usually takes a few hours.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `;

  return emailWrapper(content, `Payment received for order #${order.orderNumber} - Verification in progress`);
};

// ============================================
// SEND EMAIL FUNCTION
// ============================================
export async function sendEmail({ to, subject, html }) {
  try {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials not configured. Skipping email.');
      return { success: false, error: 'SMTP not configured' };
    }

    const info = await transporter.sendMail({
      from: `"The Trend Seller" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// EXPORT EMAIL TEMPLATES
// ============================================
export {
  newOrderAdminEmail,
  orderConfirmationCustomerEmail,
  paymentScreenshotAdminEmail,
  paymentScreenshotCustomerEmail,
  formatCurrency,
  getPaymentMethodName,
  getPaymentStatusBadge
};