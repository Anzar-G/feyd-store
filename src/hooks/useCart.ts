import { useState, useEffect, useCallback } from 'react';
import { readCart, writeCart, CartItem, getCartTotalQty } from '../utils/cart';

// Custom event for cross-component syncing
const CART_EVENT = 'cart-updated';

export const useCart = () => {
    const [items, setItems] = useState<CartItem[]>(readCart());
    const [totalQty, setTotalQty] = useState(getCartTotalQty());

    const refresh = useCallback(() => {
        setItems(readCart());
        setTotalQty(getCartTotalQty());
    }, []);

    useEffect(() => {
        // Initial read
        refresh();

        const handleUpdate = () => refresh();
        if (typeof window !== 'undefined') {
            window.addEventListener(CART_EVENT, handleUpdate);
            window.addEventListener('storage', handleUpdate);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener(CART_EVENT, handleUpdate);
                window.removeEventListener('storage', handleUpdate);
            }
        };
    }, [refresh]);

    const notify = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event(CART_EVENT));
        }
    };

    const add = (item: CartItem) => {
        const cart = readCart();
        const i = cart.findIndex(c => c.slug === item.slug);
        if (i >= 0) cart[i].qty = Math.min(999, (cart[i].qty || 0) + item.qty);
        else cart.push({ ...item, qty: Math.min(999, item.qty) });
        writeCart(cart);
        notify();
    };

    const setQty = (slug: string, qty: number) => {
        const cart = readCart().map(c => c.slug === slug ? { ...c, qty: Math.max(0, Math.min(999, qty)) } : c).filter(c => c.qty > 0);
        writeCart(cart);
        notify();
    };

    const remove = (slug: string) => {
        const cart = readCart().filter(c => c.slug !== slug);
        writeCart(cart);
        notify();
    };

    return { items, totalQty, add, setQty, remove };
};
