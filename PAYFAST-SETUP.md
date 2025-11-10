# PayFast API Integration Setup Guide

This guide will help you set up PayFast payment gateway integration for your e-commerce website.

## Prerequisites

1. **PayFast Account**: Sign up at https://www.payfast.co.za/
2. **Merchant Credentials**: Get your Merchant ID and Merchant Key from PayFast dashboard
3. **Passphrase** (Optional): Set a passphrase in PayFast settings for additional security

## Setup Instructions

### 1. Get PayFast Credentials

1. Log in to your PayFast account
2. Go to Settings → Integration
3. Copy your:
   - **Merchant ID**
   - **Merchant Key**
   - **Passphrase** (if set)

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=your_merchant_id_here
PAYFAST_MERCHANT_KEY=your_merchant_key_here
PAYFAST_PASSPHRASE=your_passphrase_here
PAYFAST_MODE=sandbox  # Use 'sandbox' for testing, 'live' for production

# Base URL for return/cancel URLs (required for webhooks)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Change to your production URL
```

### 3. Testing with Sandbox

PayFast provides a sandbox environment for testing:

- **Sandbox URL**: https://sandbox.payfast.co.za
- **Test Cards**: Use PayFast's test card numbers from their documentation
- **Test Mode**: Set `PAYFAST_MODE=sandbox` in `.env.local`

### 4. Webhook Configuration

PayFast will send ITN (Instant Transaction Notification) to your webhook endpoint:

- **Webhook URL**: `https://yourdomain.com/api/payfast/webhook`
- Configure this in your PayFast dashboard under Settings → Integration

### 5. Currency Note

⚠️ **Important**: PayFast uses **ZAR (South African Rand)** as its currency. 

If your store uses a different currency (like PKR), you'll need to:
1. Convert amounts to ZAR before sending to PayFast
2. Or use PayFast's multi-currency feature if available
3. Update the amount conversion in `lib/payfast.js` if needed

## How It Works

### Payment Flow

1. **Customer selects PayFast** at checkout
2. **Order is created** with payment status "pending"
3. **Payment is initiated** - customer is redirected to PayFast
4. **Customer completes payment** on PayFast's secure gateway
5. **PayFast sends ITN** to your webhook endpoint
6. **Order is updated** - payment status changes to "paid"
7. **Customer is redirected** back to order confirmation page

### API Endpoints

- **`/api/payfast/initiate`** - Initiates PayFast payment and returns payment data
- **`/api/payfast/webhook`** - Receives ITN notifications from PayFast

## Features Implemented

✅ PayFast payment option in checkout  
✅ Secure payment data generation with signature  
✅ Automatic redirect to PayFast gateway  
✅ Webhook handling for payment notifications  
✅ Order status updates based on payment  
✅ Payment ID tracking  

## Testing

### Test Card Numbers

Use PayFast's test cards for sandbox testing:
- **Visa**: 4000000000000002
- **Mastercard**: 5200000000000007

### Test Scenarios

1. **Successful Payment**: Complete payment with test card
2. **Failed Payment**: Use invalid card or cancel payment
3. **Webhook Testing**: Use PayFast's ITN simulator

## Production Checklist

Before going live:

- [ ] Change `PAYFAST_MODE` to `live`
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production URL
- [ ] Configure webhook URL in PayFast dashboard
- [ ] Test with real payment (small amount)
- [ ] Verify ITN webhook is working
- [ ] Set up proper error handling and logging
- [ ] Configure SSL certificate (required for production)

## Troubleshooting

### Payment Not Redirecting

- Check browser console for errors
- Verify PayFast credentials are correct
- Ensure `NEXT_PUBLIC_BASE_URL` is set correctly

### Webhook Not Receiving Notifications

- Verify webhook URL is accessible from internet
- Check PayFast dashboard for webhook status
- Review server logs for webhook errors
- Ensure signature validation is working

### Invalid Signature Error

- Verify passphrase matches PayFast settings
- Check that all required fields are included
- Ensure data is properly URL encoded

## Security Notes

- Never expose your Merchant Key or Passphrase in client-side code
- Always validate ITN signatures before processing
- Use HTTPS in production
- Implement proper error handling
- Log payment events for auditing

## Support

- PayFast Documentation: https://developers.payfast.co.za/
- PayFast Support: support@payfast.co.za
- PayFast Status: https://status.payfast.co.za/

## Additional Resources

- [PayFast API Documentation](https://developers.payfast.co.za/docs)
- [PayFast Integration Guide](https://developers.payfast.co.za/docs#tag/Integration)
- [PayFast Sandbox Testing](https://sandbox.payfast.co.za/)


