'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            const data = await response.json();
            if (data.success) {
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product) => {
        try {
            // Use _id for MongoDB products or id for static products
            const productId = product._id || product.id;

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: String(productId),
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setCart(data.cart);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error };
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            return { success: false, message: 'Failed to add item to cart' };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: String(productId), quantity }),
            });

            const data = await response.json();
            if (data.success) {
                setCart(data.cart);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error };
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            return { success: false, message: 'Failed to update cart' };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`/api/cart?productId=${String(productId)}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                setCart(data.cart);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error };
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { success: false, message: 'Failed to remove item from cart' };
        }
    };

    const clearCart = async () => {
        try {
            const response = await fetch('/api/cart/clear', {
                method: 'POST',
            });

            const data = await response.json();
            if (data.success) {
                setCart(data.cart);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error };
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            return { success: false, message: 'Failed to clear cart' };
        }
    };

    const getItemCount = () => {
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                fetchCart,
                getItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

