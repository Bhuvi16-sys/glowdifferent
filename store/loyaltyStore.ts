"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Tier = "Glow Starter" | "Glow Star" | "Glow Icon";

export interface PointsHistoryEntry {
  id: string;
  type: "earned" | "redeemed";
  amount: number;
  description: string;
  date: string;
  expiry?: string;
}

interface LoyaltyState {
  points: number;
  history: PointsHistoryEntry[];
  referralCode: string;
  earnPoints: (amount: number, description: string) => void;
  redeemPoints: (amount: number, description: string) => boolean;
  getTier: () => Tier;
  getTierProgress: () => { current: Tier; next: Tier | null; progress: number };
  getPointsForOrder: (subtotal: number) => number;
}

export const TIER_THRESHOLDS = {
  "Glow Starter": 0,
  "Glow Star": 500,
  "Glow Icon": 2000,
} as const;

function generateReferralCode(): string {
  return `GLOW${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      points: 250,
      history: [
        {
          id: "h1",
          type: "earned",
          amount: 150,
          description: "Welcome bonus",
          date: "2026-05-01",
        },
        {
          id: "h2",
          type: "earned",
          amount: 100,
          description: "First purchase reward",
          date: "2026-05-15",
        },
      ],
      referralCode: generateReferralCode(),

      earnPoints: (amount, description) => {
        set((state) => ({
          points: state.points + amount,
          history: [
            {
              id: `h-${Date.now()}`,
              type: "earned",
              amount,
              description,
              date: new Date().toISOString().split("T")[0],
              expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            },
            ...state.history,
          ],
        }));
      },

      redeemPoints: (amount, description) => {
        const { points } = get();
        if (points < amount) return false;
        set((state) => ({
          points: state.points - amount,
          history: [
            {
              id: `h-${Date.now()}`,
              type: "redeemed",
              amount,
              description,
              date: new Date().toISOString().split("T")[0],
            },
            ...state.history,
          ],
        }));
        return true;
      },

      getTier: () => {
        const { points } = get();
        if (points >= TIER_THRESHOLDS["Glow Icon"]) return "Glow Icon";
        if (points >= TIER_THRESHOLDS["Glow Star"]) return "Glow Star";
        return "Glow Starter";
      },

      getTierProgress: () => {
        const { points } = get();
        const current = get().getTier();
        if (current === "Glow Icon") {
          return { current, next: null, progress: 100 };
        }
        if (current === "Glow Star") {
          const progress =
            ((points - TIER_THRESHOLDS["Glow Star"]) /
              (TIER_THRESHOLDS["Glow Icon"] - TIER_THRESHOLDS["Glow Star"])) *
            100;
          return { current, next: "Glow Icon" as Tier, progress: Math.min(progress, 100) };
        }
        const progress = (points / TIER_THRESHOLDS["Glow Star"]) * 100;
        return { current, next: "Glow Star" as Tier, progress: Math.min(progress, 100) };
      },

      getPointsForOrder: (subtotal) => Math.floor(subtotal * 10),
    }),
    { name: "glow-loyalty" }
  )
);
