"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

interface Recommendation {
  name: string;
  reason: string;
  price: number;
  category: string;
}

interface AIRecommendationsProps {
  productName: string;
  category: string;
}

function ShimmerCard() {
  return (
    <div className="glass-card min-w-[260px] animate-pulse p-4">
      <div className="mb-3 h-40 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
      <div className="mb-2 h-3 w-full rounded bg-gray-100" />
      <div className="h-4 w-1/4 rounded bg-gray-200" />
    </div>
  );
}

export default function AIRecommendations({ productName, category }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecommendations() {
      setLoading(true);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName, category }),
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        if (!cancelled && data.recommendations?.length) {
          setRecommendations(data.recommendations);
          setUsedFallback(false);
        } else {
          throw new Error("Empty response");
        }
      } catch {
        if (!cancelled) {
          setUsedFallback(true);
          setRecommendations(
            products
              .filter((p) => p.category === category)
              .slice(0, 3)
              .map((p) => ({
                name: p.name,
                reason: "Popular pick in this category — customers love it!",
                price: p.price,
                category: p.category,
              }))
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRecommendations();
    return () => {
      cancelled = true;
    };
  }, [productName, category]);

  const findProduct = (name: string) =>
    products.find((p) => p.name.toLowerCase() === name.toLowerCase());

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="h-6 w-6 text-hot-pink" />
        </motion.div>
        <h2 className="font-heading text-2xl font-bold">
          {usedFallback ? "Popular Picks" : "You might also love..."}
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <ShimmerCard key={i} />)
          : recommendations.map((rec, i) => {
              const matched = findProduct(rec.name);
              const CardWrapper = matched
                ? ({ children }: { children: React.ReactNode }) => (
                    <Link href={`/products/${matched.id}`}>{children}</Link>
                  )
                : ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

              return (
                <motion.div
                  key={rec.name + i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="min-w-[260px]"
                >
                  <CardWrapper>
                    <div className="glass-card group cursor-pointer p-4 transition-all hover:shadow-glow">
                      <div className="relative mb-3 h-40 overflow-hidden rounded-xl bg-gradient-mesh">
                        {matched ? (
                          <Image
                            src={matched.images[0]}
                            alt={rec.name}
                            fill
                            unoptimized={true}
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop'; }}
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-brand opacity-20">
                            <Sparkles className="h-12 w-12 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="mb-1 inline-block rounded-full bg-violet/10 px-2 py-0.5 text-xs font-medium text-violet">
                        {rec.category}
                      </span>
                      <h3 className="mb-1 font-heading font-semibold group-hover:text-hot-pink">
                        {rec.name}
                      </h3>
                      <p className="mb-2 line-clamp-2 text-xs text-foreground/60">{rec.reason}</p>
                      <p className="font-heading font-bold text-hot-pink">
                        {formatPrice(rec.price)}
                      </p>
                    </div>
                  </CardWrapper>
                </motion.div>
              );
            })}
      </div>
    </section>
  );
}
