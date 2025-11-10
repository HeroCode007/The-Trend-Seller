import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
});

const CartSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        items: [CartItemSchema],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate total price
CartSchema.virtual('total').get(function () {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
});

CartSchema.set('toJSON', { virtuals: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

export default Cart;


