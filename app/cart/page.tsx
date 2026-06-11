"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useLoyaltyStore } from "@/store/loyaltyStore";
import { cn, formatPrice } from "@/lib/utils";

function AnimatedPrice({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (v) => formatPrice(v));
  return <motion.span>{display}</motion.span>;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
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
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-heading text-4xl font-bold"
        >
          Your <span className="gradient-text">Bag</span>
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card py-20 text-center"
          >
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-foreground/20" />
            <p className="mb-6 text-lg text-foreground/50">Your bag is empty — time to glow up!</p>
            <Link href="/products" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <motion.div
                    key={`${item.productId}-${item.skinType ?? "default"}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card flex gap-4 p-4"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image src={product.images[0]} alt={product.name} fill unoptimized={true} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop'; }} className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3 className="font-heading font-semibold">{product.name}</h3>
                      {item.skinType && (
                        <span className="text-xs text-foreground/50">{item.skinType} skin</span>
                      )}
                      <p className="font-bold text-hot-pink">{formatPrice(product.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-gray-200 px-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.skinType)
                            }
                            className="rounded-full p-1.5 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.skinType)
                            }
                            className="rounded-full p-1.5 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.skinType)}
                          className="rounded-full p-2 text-red-400 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <button
                onClick={clearCart}
                className="text-sm text-foreground/40 hover:text-red-400"
              >
                Clear cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="glass-card sticky top-24 p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet/10 to-hot-pink/10 px-4 py-3"
                >
                  <Sparkles className="h-5 w-5 text-hot-pink" />
                  <span className="text-sm">
                    Earn <strong>{glowPoints} GlowPoints</strong> with this order
                  </span>
                </motion.div>

                <motion.div
                  animate={promoError ? { x: [-8, 8, -8, 8, 0] } : {}}
                  className="mb-6 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Promo code (GLOW20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-2 text-sm outline-none focus:border-violet",
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

                <div className="mb-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Subtotal</span>
                    <AnimatedPrice value={subtotal} />
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-mint">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-heading text-xl font-bold">
                    <span>Total</span>
                    <AnimatedPrice value={total} />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full"
                >
                  Checkout
                </motion.button>
                <Link
                  href="/products"
                  className="mt-4 block text-center text-sm text-foreground/50 hover:text-hot-pink"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
