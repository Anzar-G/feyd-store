import { useEffect, useMemo, useState } from 'react';

export type CartItem = { slug: string; title: string; cover: string; qty: number };
const CART_KEY = 'cart_items_v1';

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(CART_KEY) || '[]';
    const parsed = JSON.parse(s) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readCart());

  const totalQty = useMemo(() => items.reduce((s, it) => s + (Number(it.qty) || 0), 0), [items]);

  const add = (item: CartItem) => {
    setItems((prev) => {
      const next = [...prev];
      const idx = next.findIndex((i) => i.slug === item.slug);
      if (idx >= 0) next[idx] = { ...next[idx], qty: Math.min(999, (next[idx].qty || 0) + item.qty) };
      else next.push({ ...item, qty: Math.min(999, item.qty) });
      writeCart(next);
      return next;
    });
  };

  const setQty = (slug: string, qty: number) => {
    setItems((prev) => {
      const next = prev
        .map((i) => (i.slug === slug ? { ...i, qty: Math.max(0, Math.min(999, qty)) } : i))
        .filter((i) => i.qty > 0);
      writeCart(next);
      return next;
    });
  };

  const remove = (slug: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.slug !== slug);
      writeCart(next);
      return next;
    });
  };

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(readCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { items, totalQty, add, setQty, remove } as const;
}
