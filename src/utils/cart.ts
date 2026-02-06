export type CartItem = { slug: string; title: string; cover: string; qty: number };

const CART_KEY = 'cart_items_v1';

const safeJsonParse = <T,>(s: string, fallback: T): T => { try { return JSON.parse(s) as T; } catch { return fallback; } };

export const readCart = (): CartItem[] => safeJsonParse<CartItem[]>(typeof window !== 'undefined' ? (localStorage.getItem(CART_KEY) || '[]') : '[]', []);

export const writeCart = (items: CartItem[]) => { if (typeof window !== 'undefined') localStorage.setItem(CART_KEY, JSON.stringify(items)); };

export const getCartTotalQty = () => readCart().reduce((sum, it) => sum + (Number(it.qty) || 0), 0);

export const addCartItem = (item: CartItem) => {
    const cart = readCart();
    const i = cart.findIndex(c => c.slug === item.slug);
    if (i >= 0) cart[i].qty = Math.min(999, (cart[i].qty || 0) + item.qty);
    else cart.push({ ...item, qty: Math.min(999, item.qty) });
    writeCart(cart);
    return cart;
};

export const setCartQty = (slug: string, qty: number) => {
    const cart = readCart().map(c => c.slug === slug ? { ...c, qty: Math.max(0, Math.min(999, qty)) } : c).filter(c => c.qty > 0);
    writeCart(cart); return cart;
};

export const removeCartItem = (slug: string) => { writeCart(readCart().filter(c => c.slug !== slug)); };
