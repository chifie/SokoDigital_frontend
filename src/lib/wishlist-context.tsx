import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "soko-digital-wishlist";

interface WishlistItem {
  productId: string;
  addedAt: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  itemCount: number;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function loadFromStorage(): WishlistItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // corrupted — ignore
  }
  return [];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    const stored = loadFromStorage();
    // Seed with a few demo items so the page isn't empty
    if (stored.length === 0) {
      return [
        { productId: "p1", addedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { productId: "p3", addedAt: new Date(Date.now() - 86400000).toISOString() },
        { productId: "p5", addedAt: new Date().toISOString() },
      ];
    }
    return stored;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = items.length;

  const isWishlisted = useCallback((productId: string) => {
    return items.some((i) => i.productId === productId);
  }, [items]);

  const add = useCallback((productId: string) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === productId)) return prev;
      return [...prev, { productId, addedAt: new Date().toISOString() }];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const toggle = useCallback((productId: string) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.productId === productId);
      if (exists) return prev.filter((i) => i.productId !== productId);
      return [...prev, { productId, addedAt: new Date().toISOString() }];
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider value={{ items, itemCount, isWishlisted, toggle, add, remove, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
