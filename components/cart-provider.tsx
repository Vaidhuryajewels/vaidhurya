"use client";

import {
  type CartItem,
  type StoredOrder,
  sampleOrders,
} from "@/lib/commerce-data";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type CartContextValue = {
  items: CartItem[];
  orders: StoredOrder[];
  wishlist: string[];
  hydrated: boolean;
  cartCount: number;
  addItem: (variantId: string, quantity?: number, giftWrap?: boolean) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  toggleGiftWrap: (variantId: string, giftWrap: boolean) => void;
  toggleWishlist: (productSlug: string) => void;
  isWishlisted: (productSlug: string) => boolean;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  recordPlacedOrder: (order: StoredOrder) => void;
};

const CART_STORAGE_KEY = "vaidhurya-cart-v1";
const ORDER_STORAGE_KEY = "vaidhurya-orders-v1";
const WISHLIST_STORAGE_KEY = "vaidhurya-wishlist-v1";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<StoredOrder[]>(sampleOrders);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const storedOrders = window.localStorage.getItem(ORDER_STORAGE_KEY);
      const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

      if (storedCart) {
        // This effect restores client-only localStorage state after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(storedCart) as CartItem[]);
      }

      if (storedOrders) {
        // This effect restores client-only order history after hydration.
        setOrders([...sampleOrders, ...(JSON.parse(storedOrders) as StoredOrder[])]);
      }

      if (storedWishlist) {
        // This effect restores client-only wishlist state after hydration.
        setWishlist(JSON.parse(storedWishlist) as string[]);
      }
    } catch {
      setItems([]);
      setOrders(sampleOrders);
      setWishlist([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const customOrders = orders.filter(
      (order) => !sampleOrders.some((sample) => sample.orderNumber === order.orderNumber),
    );

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(customOrders));
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [hydrated, items, orders, wishlist]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextValue = {
    items,
    orders,
    wishlist,
    hydrated,
    cartCount,
    addItem: (variantId, quantity = 1, giftWrap = false) => {
      setItems((current) => {
        const match = current.find((item) => item.variantId === variantId);

        if (!match) {
          return [...current, { variantId, quantity, giftWrap }];
        }

        return current.map((item) =>
          item.variantId === variantId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                giftWrap: item.giftWrap || giftWrap,
              }
            : item,
        );
      });
    },
    updateQuantity: (variantId, quantity) => {
      setItems((current) =>
        current
          .map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    toggleGiftWrap: (variantId, giftWrap) => {
      setItems((current) =>
        current.map((item) =>
          item.variantId === variantId ? { ...item, giftWrap } : item,
        ),
      );
    },
    toggleWishlist: (productSlug) => {
      setWishlist((current) =>
        current.includes(productSlug)
          ? current.filter((slug) => slug !== productSlug)
          : [...current, productSlug],
      );
    },
    isWishlisted: (productSlug) => wishlist.includes(productSlug),
    removeItem: (variantId) => {
      setItems((current) => current.filter((item) => item.variantId !== variantId));
    },
    clearCart: () => setItems([]),
    recordPlacedOrder: (order) => {
      setOrders((current) => [
        order,
        ...current.filter((entry) => entry.orderNumber !== order.orderNumber),
      ]);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
