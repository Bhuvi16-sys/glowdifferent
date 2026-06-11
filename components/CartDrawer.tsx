"use client";

import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Minus, Plus, Sparkles, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useLoyaltyStore } from "@/store/loyaltyStore";
import { cn, formatPrice } from "@/lib/utils";

function AnimatedPrice({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (v) => formatPrice(v));
  return <motion.span>{display}</motion.span>;
}

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getSubtotal } =
    useCartStore();
  const getPointsForOrder = useLoyaltyStore((s) => s.getPointsForOrder);
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => setMounted(true), []);

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal - discount + shipping;
  const glowPoints = getPointsForOrder(subtotal);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "GLOW20") {
      setDiscount(subtotal * 0.2);
      setPromoError(false);
    } else {
      setPromoError(true);
      setDiscount(0);
      setTimeout(() => setPromoError(false), 600);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="font-heading text-xl font-bold">Your Bag</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeDrawer}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="mb-4 text-foreground/50">Your bag is empty</p>
                  <Link href="/products" onClick={closeDrawer} className="btn-primary">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    return (
                      <motion.li
                        key={`${item.productId}-${item.skinType ?? "default"}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 rounded-xl border border-gray-100 p-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            unoptimized={true}
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop'; }}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <h4 className="font-heading text-sm font-semibold">{product.name}</h4>
                          {item.skinType && (
                            <span className="text-xs text-foreground/50">{item.skinType} skin</span>
                          )}
                          <p className="text-sm font-bold text-hot-pink">
                            {formatPrice(product.price)}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 px-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity - 1, item.skinType)
                                }
                                className="rounded-full p-1 hover:bg-gray-100"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity + 1, item.skinType)
                                }
                                className="rounded-full p-1 hover:bg-gray-100"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.skinType)}
                              className="rounded-full p-1.5 text-red-400 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet/10 to-hot-pink/10 px-4 py-3"
                >
                  <Sparkles className="h-5 w-5 text-hot-pink" />
                  <span className="text-sm">
                    You&apos;ll earn <strong>{glowPoints} GlowPoints</strong> with this order
                  </span>
                </motion.div>

                <motion.div
                  animate={promoError ? { x: [-8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="mb-4 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Promo code (try GLOW20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-2 text-sm outline-none transition-colors focus:border-violet",
                      promoError && "border-red-400 bg-red-50"
                    )}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={applyPromo}
                    className="rounded-xl bg-violet px-4 py-2 text-sm font-semibold text-white"
                  >
                    Apply
                  </motion.button>
                </motion.div>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Subtotal</span>
                    <AnimatedPrice value={subtotal} />
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-mint">
                      <span>Discount (GLOW20)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-heading text-lg font-bold">
                    <span>Total</span>
                    <AnimatedPrice value={total} />
                  </div>
                </div>

                <Link href="/cart" onClick={closeDrawer}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full"
                  >
                    Checkout
                  </motion.button>
                </Link>
                <button
                  onClick={closeDrawer}
                  className="mt-3 w-full text-center text-sm text-foreground/50 hover:text-hot-pink"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
