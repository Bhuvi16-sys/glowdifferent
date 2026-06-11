"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLoyaltyStore } from "@/store/loyaltyStore";
import { cn } from "@/lib/utils";

interface LoyaltyBadgeProps {
  className?: string;
  showLink?: boolean;
}

export default function LoyaltyBadge({ className, showLink = true }: LoyaltyBadgeProps) {
  const points = useLoyaltyStore((s) => s.points);

  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet/10 to-hot-pink/10 px-3 py-1.5 text-sm font-semibold text-violet backdrop-blur-sm",
        className
      )}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Sparkles className="h-4 w-4 text-hot-pink" />
      </motion.div>
      <motion.span
        key={points}
        initial={{ scale: 1.3, color: "#FF2D8A" }}
        animate={{ scale: 1, color: "#8B2BFF" }}
        transition={{ duration: 0.4 }}
      >
        {points.toLocaleString()}
      </motion.span>
      <span className="text-xs text-violet/70">pts</span>
    </motion.div>
  );

  if (showLink) {
    return <Link href="/rewards">{content}</Link>;
  }

  return content;
}
