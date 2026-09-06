// Sends a WhatsApp notification via Green API (console.green-api.com) whenever
// an order is placed. Mirrors lib/email.js's pattern: if credentials aren't
// configured yet, it logs a warning and no-ops instead of throwing — this
// must never break checkout.

const GREEN_API_BASE_URL = process.env.GREEN_API_BASE_URL || 'https://api.green-api.com';

function toChatId(phone) {
  // Green API expects digits only (country code, no +, no spaces) + "@c.us"
  const digits = String(phone).replace(/[^\d]/g, '');
  return `${digits}@c.us`;
}

export async function sendWhatsAppNotification(message) {
  const idInstance = process.env.GREEN_API_ID_INSTANCE;
  const apiTokenInstance = process.env.GREEN_API_TOKEN_INSTANCE;
  const notifyPhone = process.env.ORDER_NOTIFY_WHATSAPP;

  if (!idInstance || !apiTokenInstance || !notifyPhone) {
    console.warn('⚠️ Green API credentials not configured. Skipping WhatsApp notification.');
    return { success: false, error: 'Green API not configured' };
  }

  try {
    const url = `${GREEN_API_BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: toChatId(notifyPhone),
        message,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }

    console.log('✅ WhatsApp notification sent:', data.idMessage);
    return { success: true, idMessage: data.idMessage };
  } catch (error) {
    console.error('❌ WhatsApp notification error:', error.message);
    return { success: false, error: error.message };
  }
}

export function newOrderWhatsAppMessage(order, shippingAddress) {
  const itemsList = order.items
    .map((item) => `• ${item.name} x${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString('en-PK')}`)
    .join('\n');

  return [
    `🛒 *New Order — ${order.orderNumber}*`,
    ``,
    itemsList,
    ``,
    `Total: Rs. ${order.totalAmount.toLocaleString('en-PK')} (${order.deliveryCharges === 0 ? 'free delivery' : `+ Rs. ${order.deliveryCharges} delivery`})`,
    `Payment: ${order.paymentMethod.toUpperCase()}`,
    `Customer: ${shippingAddress.fullName} — ${shippingAddress.phone}`,
    `${shippingAddress.address}, ${shippingAddress.city}`,
  ].join('\n');
}
