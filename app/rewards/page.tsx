"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Copy, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import { TIER_THRESHOLDS, useLoyaltyStore, type Tier } from "@/store/loyaltyStore";
import { cn } from "@/lib/utils";

const tierIcons: Record<Tier, string> = {
  "Glow Starter": "🌱",
  "Glow Star": "⭐",
  "Glow Icon": "👑",
};

const tierColors: Record<Tier, string> = {
  "Glow Starter": "from-mint/30 to-mint/10",
  "Glow Star": "from-violet/30 to-hot-pink/10",
  "Glow Icon": "from-coral/30 to-violet/10",
};

const rewards = [
  { id: "r1", name: "$5 Off Next Order", cost: 100, emoji: "💸" },
  { id: "r2", name: "Free Sheet Mask", cost: 250, emoji: "🎭" },
  { id: "r3", name: "Exclusive Mini Set", cost: 500, emoji: "🎁" },
  { id: "r4", name: "VIP Early Access", cost: 1000, emoji: "🔑" },
];

function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
  return <motion.span className="font-heading text-5xl font-bold">{display}</motion.span>;
}

export default function RewardsPage() {
  const { points, history, referralCode, redeemPoints, getTier, getTierProgress } =
    useLoyaltyStore();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState("");

  useEffect(() => setMounted(true), []);

  const tier = getTier();
  const { next, progress } = getTierProgress();
  const referralLink = `https://glow.beauty/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = (cost: number, name: string) => {
    const success = redeemPoints(cost, `Redeemed: ${name}`);
    setRedeemMsg(success ? `Redeemed ${name}! 🎉` : "Not enough points 😢");
    setTimeout(() => setRedeemMsg(""), 3000);
  };

  if (!mounted) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-heading text-4xl font-bold"
        >
          Glow<span className="gradient-text">Rewards</span>
        </motion.h1>

        {/* Points Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "glass-card mb-8 bg-gradient-to-br p-8 text-center",
            tierColors[tier]
          )}
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-hot-pink" />
            <span className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/60">
              Your GlowPoints
            </span>
          </div>
          <AnimatedCounter value={points} />
          <p className="mt-2 text-foreground/60">points available</p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm">
            <span className="text-xl">{tierIcons[tier]}</span>
            {tier}
          </div>
        </motion.div>

        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card mb-8 p-6"
        >
          <h2 className="mb-4 font-heading text-lg font-bold">Tier Progress</h2>
          <div className="mb-2 flex justify-between text-sm">
            {(Object.keys(TIER_THRESHOLDS) as Tier[]).map((t) => (
              <span
                key={t}
                className={cn(
                  "font-medium",
                  tier === t ? "text-hot-pink" : "text-foreground/40"
                )}
              >
                {tierIcons[t]} {t.replace("Glow ", "")}
              </span>
            ))}
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-brand"
            />
          </div>
          {next && (
            <p className="mt-2 text-sm text-foreground/50">
              {TIER_THRESHOLDS[next] - points} points to {next}
            </p>
          )}
        </motion.div>

        {/* Redeem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="mb-4 font-heading text-lg font-bold">Redeem Rewards</h2>
          {redeemMsg && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-sm font-medium text-hot-pink"
            >
              {redeemMsg}
            </motion.p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rewards.map((reward, i) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -4 }}
                className="glass-card flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.emoji}</span>
                  <div>
                    <p className="font-heading font-semibold">{reward.name}</p>
                    <p className="text-sm text-foreground/50">{reward.cost} pts</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRedeem(reward.cost, reward.name)}
                  disabled={points < reward.cost}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                    points >= reward.cost
                      ? "bg-gradient-brand text-white"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                  )}
                >
                  Redeem
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Referral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card mb-8 bg-gradient-to-r from-violet/5 to-hot-pink/5 p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-violet" />
            <h2 className="font-heading text-lg font-bold">Refer a Friend</h2>
          </div>
          <p className="mb-4 text-sm text-foreground/60">
            Share your link, earn <strong>500 points</strong> when they make their first purchase.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 rounded-xl border border-violet/20 bg-white/80 px-4 py-2 text-sm"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-xl bg-violet px-4 py-2 text-sm font-semibold text-white"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </motion.button>
          </div>
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 font-heading text-lg font-bold">Points History</h2>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-white/50">
                  <th className="px-4 py-3 text-left font-heading font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold">Description</th>
                  <th className="px-4 py-3 text-right font-heading font-semibold">Points</th>
                  <th className="hidden px-4 py-3 text-right font-heading font-semibold sm:table-cell">
                    Expiry
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 text-foreground/60">{entry.date}</td>
                    <td className="px-4 py-3">{entry.description}</td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right font-semibold",
                        entry.type === "earned" ? "text-mint" : "text-coral"
                      )}
                    >
                      {entry.type === "earned" ? "+" : "-"}
                      {entry.amount}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-foreground/40 sm:table-cell">
                      {entry.expiry ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
