"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf, Rabbit, Shield, Truck } from "lucide-react";
import Link from "next/link";
import MarqueeBanner from "@/components/MarqueeBanner";
import PageTransition from "@/components/PageTransition";
import ProductCard from "@/components/ProductCard";
import SkinQuiz from "@/components/SkinQuiz";
import { type Product } from "@/data/products";
import { useEffect, useState } from "react";

const whyUsItems = [
  {
    icon: Leaf,
    title: "100% Vegan",
    description: "Plant-powered formulas, zero animal derivatives. Period.",
    color: "from-mint/20 to-mint/5",
  },
  {
    icon: Rabbit,
    title: "Cruelty-Free",
    description: "Never tested on animals. Leaping Bunny certified.",
    color: "from-hot-pink/20 to-hot-pink/5",
  },
  {
    icon: Shield,
    title: "Derm Tested",
    description: "Clinically tested and approved by board-certified derms.",
    color: "from-violet/20 to-violet/5",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free shipping over $50. 2-day delivery nationwide.",
    color: "from-coral/20 to-coral/5",
  },
];

export default function HomePage() {
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          // Simplified mock logic: just take first 8 for trending, next 3 for bestsellers
          setTrending(data.slice(0, 8));
          setBestsellers(data.slice(0, 3).sort((a, b) => b.rating - a.rating));
        } else {
          console.error("Expected array but got:", data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-hot-pink/30 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet/30 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 font-heading text-sm font-semibold uppercase tracking-[0.3em] text-white/80"
          >
            Beauty reimagined
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 font-heading text-5xl font-bold leading-tight text-white sm:text-7xl md:text-8xl"
          >
            Glow Different.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mb-10 max-w-xl text-lg text-white/90 sm:text-xl"
          >
            Clean, cruelty-free skincare that hits different. Your skin deserves the main character energy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-white px-8 py-4 font-heading font-bold text-hot-pink shadow-xl transition-shadow hover:shadow-glow"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("skin-quiz")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border-2 border-white/50 bg-white/10 px-8 py-4 font-heading font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Take Skin Quiz
            </motion.button>
          </motion.div>
        </div>
      </section>

      <MarqueeBanner />

      {/* Trending */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-end justify-between"
          >
            <div>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Trending <span className="gradient-text">Now</span>
              </h2>
              <p className="mt-2 text-foreground/60">What everyone&apos;s adding to cart RN</p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 font-heading text-sm font-semibold text-hot-pink hover:underline sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
            {trending.map((product, i) => (
              <div key={product.id} className="w-72 shrink-0">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skin-quiz" className="px-4 py-16 sm:px-6 lg:px-8">
        <SkinQuiz />
      </section>

      {/* Bestsellers */}
      <section className="bg-gradient-mesh px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl"
          >
            Our <span className="gradient-text">Bestsellers</span>
          </motion.h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bestsellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl"
          >
            Why <span className="gradient-text">Glow?</span>
          </motion.h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUsItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`glass-card bg-gradient-to-br ${item.color} p-6 text-center`}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md"
                >
                  <item.icon className="h-7 w-7 text-hot-pink" />
                </motion.div>
                <h3 className="mb-2 font-heading text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-foreground/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card mx-auto max-w-2xl bg-gradient-to-br from-hot-pink/5 via-violet/5 to-coral/5 p-8 text-center sm:p-12"
        >
          <h2 className="mb-3 font-heading text-2xl font-bold sm:text-3xl">
            Join the Glow Club ✨
          </h2>
          <p className="mb-6 text-foreground/60">
            Get 15% off your first order + exclusive drops before anyone else.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full border border-violet/20 bg-white/80 px-6 py-3 text-sm outline-none transition-colors focus:border-hot-pink"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </section>
    </PageTransition>
  );
}
