import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { CartItem } from "@/types";

const STORAGE_KEY = "soko-digital-cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadCartFromStorage(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupted data — ignore
  }
  return [];
}

const demoItems: CartItem[] = [
  { productId: "p1", name: "iPhone 15 Pro Max 256GB", image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&q=100&fm=webp&fit=crop", price: 3490000, quantity: 1, sellerId: "s1", sellerName: "TechHub Tanzania", maxQuantity: 50 },
  { productId: "p4", name: "Wireless Noise-Cancelling Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=100&fm=webp&fit=crop", price: 349000, quantity: 2, sellerId: "s3", sellerName: "Soko Gadgets", maxQuantity: 200 },
  { productId: "p9", name: "Organic Skincare Bundle", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=100&fm=webp&fit=crop", price: 89000, quantity: 1, sellerId: "s6", sellerName: "Beauty & Glow TZ", maxQuantity: 200 },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = loadCartFromStorage();
    return stored.length > 0 ? stored : demoItems;
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId
            ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.maxQuantity) }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        const newQty = Math.max(1, Math.min(item.quantity + delta, item.maxQuantity));
        return { ...item, quantity: newQty };
      })
    );
  }, []);

  const setQuantity = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        return { ...item, quantity: Math.max(1, Math.min(qty, item.maxQuantity)) };
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ items, itemCount, addItem, removeItem, updateQuantity, setQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
