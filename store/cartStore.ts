"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SkinType } from "@/data/products";
import { getProductById } from "@/data/products";

export interface CartItem {
  productId: string;
  quantity: number;
  skinType?: SkinType;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (productId: string, skinType?: SkinType, quantity?: number) => void;
  removeItem: (productId: string, skinType?: SkinType) => void;
  updateQuantity: (productId: string, quantity: number, skinType?: SkinType) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const itemKey = (productId: string, skinType?: SkinType) =>
  `${productId}-${skinType ?? "default"}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

      addItem: (productId, skinType, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.skinType) === itemKey(productId, skinType)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.skinType) === itemKey(productId, skinType)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isDrawerOpen: true,
            };
          }
          return {
            items: [...state.items, { productId, quantity, skinType }],
            isDrawerOpen: true,
          };
        });
      },

      removeItem: (productId, skinType) => {
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.productId, i.skinType) !== itemKey(productId, skinType)
          ),
        }));
      },

      updateQuantity: (productId, quantity, skinType) => {
        if (quantity <= 0) {
          get().removeItem(productId, skinType);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.skinType) === itemKey(productId, skinType)
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => {
          const product = getProductById(item.productId);
          return sum + (product?.price ?? 0) * item.quantity;
        }, 0),
    }),
    { name: "glow-cart" }
  )
);
