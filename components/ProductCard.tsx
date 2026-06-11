"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Eye, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, MouseEvent } from "react";
import type { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickView?: boolean;
  index?: number;
}

export default function ProductCard({
  product,
  className,
  showQuickView = true,
  index = 0,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const badgeColors = {
    Bestseller: "bg-coral text-white",
    "New Drop": "bg-mint text-foreground",
    Trending: "bg-violet text-white",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("group", className)}
    >
      <div className="glass-card relative overflow-hidden p-4">
        {product.badge && (
          <span
            className={cn(
              "absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-bold",
              badgeColors[product.badge]
            )}
          >
            {product.badge}
          </span>
        )}

        <Link href={`/products/${product.id}`} className="block">
          <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gradient-mesh">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              unoptimized={true}
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop'; }}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {showQuickView && (
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-sm">
                  <Eye className="h-4 w-4" />
                  Quick View
                </span>
              </motion.div>
            )}
          </div>

          <h3 className="mb-1 font-heading text-lg font-semibold leading-tight group-hover:text-hot-pink transition-colors">
            {product.name}
          </h3>

          <div className="mb-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < Math.floor(product.rating)
                    ? "fill-coral text-coral"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
            <span className="ml-1 text-xs text-foreground/50">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          <p className="font-heading text-xl font-bold text-hot-pink">
            {formatPrice(product.price)}
          </p>
        </Link>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.preventDefault();
            addItem(product.id);
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-2.5 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-glow"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
