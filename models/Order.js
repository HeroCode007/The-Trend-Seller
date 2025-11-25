import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        sessionId: {
            type: String,
            required: true,
        },
        items: [
            {
                productId: { type: Number, required: true }, // ✅ using Number for consistency with Cart
                slug: { type: String },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                image: { type: String },
                quantity: { type: Number, required: true },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
        },
        totalAmount: { type: Number, required: true },

        // 🧾 Payment fields
        paymentMethod: {
            type: String,
            required: true,
            enum: ['cod', 'jazzcash', 'easypaisa', 'bank-transfer'],

        },
        paymentNote: {
            type: String,
            default: '',
        },
        paymentUrl: {
            type: String,
            default: '',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'awaiting_verification', 'paid', 'failed'],
            default: 'pending',
        },

        // 📸 Payment screenshot for manual verification
        paymentScreenshot: {
            type: String,
            default: '',
        },
        paymentScreenshotUploadedAt: {
            type: Date,
            default: null,
        },

        // 🚚 Order processing status
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// 🧠 Generate an auto-incremented order number before saving
OrderSchema.pre('validate', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.models.Order.countDocuments();
        this.orderNumber = `ORD-${(count + 1).toString().padStart(6, '0')}`;
    }
    next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
