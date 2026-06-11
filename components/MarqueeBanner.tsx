"use client";

const values = [
  "✨ Vegan",
  "🐰 Cruelty-Free",
  "🧪 Dermatologist Tested",
  "🚀 Fast Delivery",
  "💜 Clean Ingredients",
  "🌿 Sustainable Packaging",
  "⭐ 4.9 Avg Rating",
  "💎 Glow Guaranteed",
];

export default function MarqueeBanner() {
  const items = [...values, ...values];

  return (
    <div className="overflow-hidden border-y border-white/20 bg-gradient-brand py-3">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((value, i) => (
          <span
            key={i}
            className="mx-8 font-heading text-sm font-semibold uppercase tracking-wider text-white"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
