'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export default function AddToCartButton({ product, className = '' }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = async () => {
        setLoading(true);
        setSuccess(false);

        const result = await addToCart(product);

        if (result.success) {
            setSuccess(true);
            toast({
                title: 'Added to Cart',
                description: `${product.name} has been added to your cart.`,
            });
            setTimeout(() => setSuccess(false), 2000);
        } else {
            toast({
                title: 'Error',
                description: result.message || 'Failed to add item to cart',
                variant: 'destructive',
            });
        }

        setLoading(false);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading || success}
            className={`w-full bg-neutral-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        >
            {loading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding...
                </>
            ) : success ? (
                <>
                    <Check className="h-5 w-5" />
                    Added!
                </>
            ) : (
                <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                </>
            )}
        </button>
    );
}


