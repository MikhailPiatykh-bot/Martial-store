"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  path: string;
  title: string;
  price: number;
  image: string;
  variant: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (path: string, variant: string, qty: number) => void;
  remove: (path: string, variant: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "martial-store-cart";

function sameLine(item: CartItem, path: string, variant: string) {
  return item.path === path && item.variant === variant;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return {
      items,
      count,
      total,
      ready,
      open,
      setOpen,
      add: (item) => {
        setItems((current) => {
          const index = current.findIndex((entry) => sameLine(entry, item.path, item.variant));
          if (index === -1) return [...current, { ...item, qty: 1 }];
          return current.map((entry, entryIndex) =>
            entryIndex === index ? { ...entry, qty: Math.min(99, entry.qty + 1) } : entry,
          );
        });
        setOpen(true);
      },
      setQty: (path, variant, qty) => {
        setItems((current) => {
          if (qty < 1) return current.filter((item) => !sameLine(item, path, variant));
          return current.map((item) =>
            sameLine(item, path, variant) ? { ...item, qty: Math.min(99, qty) } : item,
          );
        });
      },
      remove: (path, variant) => {
        setItems((current) => current.filter((item) => !sameLine(item, path, variant)));
      },
      clear: () => setItems([]),
    };
  }, [items, open, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is missing");
  return context;
}
