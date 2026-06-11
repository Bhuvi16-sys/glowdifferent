"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageTransition from "@/components/PageTransition";
import ProductCard from "@/components/ProductCard";
import {
  categories,
  products,
  skinTypes,
  type Category,
  type Product,
  type SkinType,
} from "@/data/products";
import { cn } from "@/lib/utils";

type SortOption = "popular" | "price-asc" | "price-desc" | "newest" | "rating";

function ProductSkeleton() {
  return (
    <div className="glass-card animate-pulse p-4">
      <div className="mb-4 aspect-square rounded-xl bg-gray-200 shimmer" />
      <div className="mb-2 h-5 w-3/4 rounded bg-gray-200" />
      <div className="mb-2 h-4 w-1/2 rounded bg-gray-100" />
      <div className="h-6 w-1/4 rounded bg-gray-200" />
    </div>
  );
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<SkinType[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOption>("popular");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSkinType = (st: SkinType) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedSkinTypes.length) {
      result = result.filter((p) =>
        p.skinType.some((st) => selectedSkinTypes.includes(st))
      );
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) =>
          a.badge === "New Drop" ? -1 : b.badge === "New Drop" ? 1 : 0
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [selectedCategories, selectedSkinTypes, priceRange, minRating, sort]);

  const FilterSidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("space-y-6", mobile && "p-4")}>
      <div>
        <h3 className="mb-3 font-heading font-semibold">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                selectedCategories.includes(cat)
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "bg-white/80 text-foreground/70 hover:bg-hot-pink/10"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-heading font-semibold">Skin Type</h3>
        <div className="flex flex-wrap gap-2">
          {skinTypes.map((st) => (
            <motion.button
              key={st}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSkinType(st)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                selectedSkinTypes.includes(st)
                  ? "bg-violet text-white"
                  : "bg-white/80 text-foreground/70 hover:bg-violet/10"
              )}
            >
              {st}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-heading font-semibold">
          Price Range: ${priceRange[0]} – ${priceRange[1]}
        </h3>
        <input
          type="range"
          min={0}
          max={60}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-hot-pink"
        />
      </div>

      <div>
        <h3 className="mb-3 font-heading font-semibold">Minimum Rating</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMinRating(star === minRating ? 0 : star)}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  star <= minRating ? "fill-coral text-coral" : "fill-gray-200 text-gray-200"
                )}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl font-bold">
            Shop <span className="gradient-text">All</span>
          </h1>
          <p className="mt-2 text-foreground/60">
            {filteredProducts.length} products found
          </p>
        </motion.div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 rounded-full border border-violet/20 bg-white/80 px-4 py-2 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </motion.button>

          <div className="relative ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none rounded-full border border-violet/20 bg-white/80 py-2 pl-4 pr-10 text-sm font-medium outline-none focus:border-hot-pink"
            >
              <option value="popular">Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="glass-card sticky top-24 p-6">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product: Product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-foreground/50">No products match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="font-heading font-bold">Filters</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterSidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
