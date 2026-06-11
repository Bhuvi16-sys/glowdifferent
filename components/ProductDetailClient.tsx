"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Minus, Plus, ShoppingBag, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AIRecommendations from "@/components/AIRecommendations";
import PageTransition from "@/components/PageTransition";
import Product3DViewer from "@/components/Product3DViewer";
import type { Product, SkinType } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { cn, formatPrice } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
}

const tabs = ["Ingredients", "How To Use", "Reviews"] as const;
type Tab = (typeof tabs)[number];

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSkin, setSelectedSkin] = useState<SkinType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("Ingredients");
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(product.id, selectedSkin ?? undefined, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const badgeColors = {
    Bestseller: "bg-coral text-white",
    "New Drop": "bg-mint text-foreground",
    Trending: "bg-violet text-white",
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-mesh"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group relative h-full w-full"
                >
                  <Product3DViewer
                    imageUrl={product.images[selectedImage]}
                    productName={product.name}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar">
              {product.images.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                    selectedImage === i
                      ? "border-hot-pink shadow-glow"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt="" fill unoptimized={true} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop'; }} className="object-cover" />
                </motion.button>
              ))}
            </div>

            {product.badge && (
              <span
                className={cn(
                  "mb-3 inline-block rounded-full px-4 py-1 text-sm font-bold",
                  badgeColors[product.badge]
                )}
              >
                {product.badge}
              </span>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 font-heading text-3xl font-bold sm:text-4xl"
            >
              {product.name}
            </motion.h1>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "fill-coral text-coral"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-foreground/50">
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            <p className="mb-6 font-heading text-3xl font-bold text-hot-pink">
              {formatPrice(product.price)}
            </p>

            <p className="mb-6 leading-relaxed text-foreground/70">{product.description}</p>

            <div className="mb-6">
              <h3 className="mb-3 font-heading font-semibold">Your Skin Type</h3>
              <div className="flex flex-wrap gap-2">
                {product.skinType.map((st) => (
                  <motion.button
                    key={st}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSkin(selectedSkin === st ? null : st)}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm font-medium transition-all",
                      selectedSkin === st
                        ? "bg-gradient-brand text-white shadow-glow"
                        : "bg-white/80 text-foreground/70 ring-1 ring-violet/20 hover:ring-hot-pink/40"
                    )}
                  >
                    {st}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <h3 className="font-heading font-semibold">Quantity</h3>
              <div className="flex items-center gap-3 rounded-full border border-violet/20 bg-white/80 px-2 py-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {product.stock <= 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-red-500"
              >
                <span className="inline-block h-2 w-2 animate-pulse-dot rounded-full bg-red-500" />
                Only {product.stock} left!
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Added!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="mt-10">
              <div className="mb-4 flex gap-1 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === tab ? "text-hot-pink" : "text-foreground/50 hover:text-foreground"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-brand"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm leading-relaxed text-foreground/70"
                >
                  {activeTab === "Ingredients" && <p>{product.ingredients}</p>}
                  {activeTab === "How To Use" && <p>{product.howToUse}</p>}
                  {activeTab === "Reviews" && (
                    <div className="space-y-4">
                      {product.reviews.length === 0 ? (
                        <p>No reviews yet. Be the first!</p>
                      ) : (
                        product.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="rounded-xl border border-gray-100 p-4"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{review.author}</span>
                                {review.verified && (
                                  <span className="flex items-center gap-1 rounded-full bg-mint/20 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                    <CheckCircle className="h-3 w-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-foreground/40">{review.date}</span>
                            </div>
                            <div className="mb-2 flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    i < review.rating
                                      ? "fill-coral text-coral"
                                      : "fill-gray-200 text-gray-200"
                                  )}
                                />
                              ))}
                            </div>
                            <p className="mb-2">{review.comment}</p>
                            <button className="flex items-center gap-1 text-xs text-foreground/40 hover:text-hot-pink">
                              <ThumbsUp className="h-3 w-3" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AIRecommendations productName={product.name} category={product.category} />
      </div>
    </PageTransition>
  );
}
