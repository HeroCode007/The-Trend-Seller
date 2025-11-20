# Admin Payment Verification Guide

## Overview
This guide explains how to verify JazzCash and EasyPaisa payments and update order statuses in the database.

## Payment Verification Process

### Step 1: Receive Notification Email
When a customer uploads a payment screenshot, you will receive an email with:
- Order number
- Customer details
- Payment amount
- Order items
- Link to verify payment

### Step 2: Review Payment Screenshot
The payment screenshot is stored in the database. To access it:

1. **Via MongoDB Compass or CLI:**
   ```bash
   # Connect to your MongoDB database
   db.orders.findOne({ orderNumber: "ORD-000001" })
   ```

2. **Check the following fields:**
   - `paymentScreenshot`: Base64-encoded image data
   - `paymentScreenshotUploadedAt`: Timestamp of upload
   - `paymentStatus`: Current status (should be "awaiting_verification")

### Step 3: Verify Payment Details
When reviewing the screenshot, ensure:
- ✅ Transaction ID/Reference number is visible
- ✅ Amount matches the order total
- ✅ Recipient account matches your account details
- ✅ Date and time are recent
- ✅ Transaction status shows "successful" or "completed"

### Step 4: Update Order Status

#### Option A: Using MongoDB Compass
1. Open MongoDB Compass
2. Navigate to your database → orders collection
3. Find the order by orderNumber
4. Edit the document:
   ```json
   {
       "paymentStatus": "paid",
       "status": "processing"
   }
   ```
5. Save changes

#### Option B: Using MongoDB CLI
```bash
db.orders.updateOne(
    { orderNumber: "ORD-000001" },
    {
        $set: {
            paymentStatus: "paid",
            status: "processing",
            updatedAt: new Date()
        }
    }
)
```

#### Option C: Create Admin API Endpoint (Recommended)
Create a new API endpoint for payment verification:

**File:** `/app/api/admin/verify-payment/route.js`

```javascript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
    try {
        // Add authentication check here
        const { orderNumber, verified } = await request.json();

        await connectDB();

        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        if (verified) {
            // Update order status
            order.paymentStatus = 'paid';
            order.status = 'processing';
            await order.save();

            // Send confirmation email to customer
            await sendEmail({
                to: order.shippingAddress.email,
                subject: `Payment Verified: ${orderNumber}`,
                html: `
                    <h2>Payment Verified!</h2>
                    <p>Your payment for order <strong>${orderNumber}</strong> has been verified.</p>
                    <p>Amount: <strong>₨${order.totalAmount}</strong></p>
                    <p>Your order is now being processed and will be shipped soon.</p>
                    <p>Thank you for your purchase!</p>
                `,
            });

            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully',
            });
        } else {
            // Mark as failed
            order.paymentStatus = 'failed';
            await order.save();

            // Send rejection email to customer
            await sendEmail({
                to: order.shippingAddress.email,
                subject: `Payment Verification Failed: ${orderNumber}`,
                html: `
                    <h2>Payment Verification Failed</h2>
                    <p>We were unable to verify your payment for order <strong>${orderNumber}</strong>.</p>
                    <p>Please contact our support team for assistance.</p>
                    <p>Email: support@thetrendseller.com</p>
                `,
            });

            return NextResponse.json({
                success: true,
                message: 'Payment marked as failed',
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
```

## Payment Status Values

| Status | Meaning | Action |
|--------|---------|--------|
| `pending` | Order placed, awaiting payment | Wait for payment |
| `awaiting_verification` | Payment screenshot received | Review and verify |
| `paid` | Payment verified | Process order |
| `failed` | Payment verification failed | Contact customer |

## Order Status Values

| Status | Meaning |
|--------|---------|
| `pending` | Order created, awaiting payment |
| `processing` | Payment verified, preparing shipment |
| `shipped` | Order shipped to customer |
| `delivered` | Order delivered |
| `cancelled` | Order cancelled |

## Email Templates for Admin

### When Sending Verification Email to Customer

**Subject:** Payment Verified: [ORDER_NUMBER]

```html
<h2>Payment Verified!</h2>
<p>Your payment for order <strong>[ORDER_NUMBER]</strong> has been verified.</p>
<p>Amount: <strong>₨[AMOUNT]</strong></p>
<p>Your order is now being processed and will be shipped soon.</p>
<p>Thank you for your purchase!</p>
```

### When Rejecting Payment

**Subject:** Payment Verification Failed: [ORDER_NUMBER]

```html
<h2>Payment Verification Failed</h2>
<p>We were unable to verify your payment for order <strong>[ORDER_NUMBER]</strong>.</p>
<p>Please contact our support team for assistance.</p>
<p>Email: support@thetrendseller.com</p>
<p>Phone: +92 300 1234567</p>
```

## Common Issues & Solutions

### Issue: Screenshot is blurry or unclear
**Solution:** 
- Request customer to resubmit a clearer screenshot
- Send email asking for better quality image

### Issue: Amount doesn't match
**Solution:**
- Check if customer sent correct amount
- Verify your account details are correct
- Contact customer to clarify

### Issue: Transaction ID not visible
**Solution:**
- Request customer to provide transaction ID separately
- Ask for additional proof of payment

### Issue: Payment sent to wrong account
**Solution:**
- Mark payment as failed
- Contact customer to resend payment to correct account
- Provide correct account details

## Bulk Verification

To verify multiple payments at once using MongoDB:

```bash
db.orders.updateMany(
    { 
        paymentStatus: "awaiting_verification",
        paymentMethod: { $in: ["jazzcash", "easypaisa"] }
    },
    {
        $set: {
            paymentStatus: "paid",
            status: "processing",
            updatedAt: new Date()
        }
    }
)
```

## Reporting

### Get Pending Payments
```bash
db.orders.find({ paymentStatus: "awaiting_verification" }).count()
```

### Get Verified Payments
```bash
db.orders.find({ paymentStatus: "paid" }).count()
```

### Get Failed Payments
```bash
db.orders.find({ paymentStatus: "failed" }).count()
```

### Get All JazzCash Orders
```bash
db.orders.find({ paymentMethod: "jazzcash" })
```

### Get All EasyPaisa Orders
```bash
db.orders.find({ paymentMethod: "easypaisa" })
```

## Best Practices

1. **Verify Promptly**
   - Review and verify payments within 24 hours
   - Send confirmation emails quickly

2. **Keep Records**
   - Document verification date and time
   - Keep screenshots for audit trail

3. **Communicate**
   - Send confirmation emails to customers
   - Provide clear rejection reasons if needed

4. **Security**
   - Use secure connection when accessing database
   - Don't share payment screenshots publicly
   - Keep customer data confidential

5. **Follow Up**
   - Track pending payments
   - Send reminders for unverified payments
   - Follow up with customers on failed payments

## Automation Ideas

1. **Auto-verify after 24 hours**
   - Automatically mark as paid if no issues found
   - Send confirmation email

2. **Reminder emails**
   - Send reminder to admin if payment pending for 12 hours
   - Send reminder to customer if payment not verified for 24 hours

3. **Scheduled reports**
   - Daily report of pending payments
   - Weekly summary of verified payments

4. **Integration with shipping**
   - Automatically generate shipping label when payment verified
   - Send shipping notification to customer

---

**Last Updated:** January 2024
**Version:** 1.0
