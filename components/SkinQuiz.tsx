"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product, products } from "@/data/products";

const skinTypeOptions = [
  { value: "Oily", label: "🌊 Oily" },
  { value: "Dry", label: "❄️ Dry" },
  { value: "Combo", label: "🌿 Combination" },
  { value: "Sensitive", label: "🌸 Sensitive" },
  { value: "Normal", label: "✨ Normal" },
];

const concernOptions = [
  "Acne & Breakouts",
  "Dark Spots",
  "Fine Lines",
  "Dullness",
  "Uneven Texture",
  "Pores",
  "Redness",
  "Dehydration",
];

const preferenceOptions = [
  "Serums",
  "Moisturizers",
  "SPF & Sunscreen",
  "Cleansers",
  "Face Masks",
  "Eye Care",
  "Toners",
  "Exfoliators",
];

const budgetOptions = [
  "Under $20",
  "$20–$50",
  "$50–$100",
  "No limit 💸",
];

type QuizAnswers = {
  skinType: string;
  concerns: string[];
  preferredTypes: string[];
  budget: string;
};

const initialAnswers: QuizAnswers = {
  skinType: "",
  concerns: [],
  preferredTypes: [],
  budget: "",
};

export default function SkinQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue =
    (step === 1 && answers.skinType !== "") ||
    (step === 2 && answers.concerns.length > 0) ||
    (step === 3 && answers.preferredTypes.length > 0) ||
    (step === 4 && answers.budget !== "");

  const selectSkinType = (value: string) => setAnswers((prev) => ({ ...prev, skinType: value }));

  const toggleConcern = (value: string) => {
    setAnswers((prev) => {
      const existing = prev.concerns.includes(value);
      const next = existing
        ? prev.concerns.filter((item) => item !== value)
        : prev.concerns.length < 3
        ? [...prev.concerns, value]
        : prev.concerns;
      return { ...prev, concerns: next };
    });
  };

  const togglePreference = (value: string) => {
    setAnswers((prev) => {
      const existing = prev.preferredTypes.includes(value);
      const next = existing
        ? prev.preferredTypes.filter((item) => item !== value)
        : [...prev.preferredTypes, value];
      return { ...prev, preferredTypes: next };
    });
  };

  const selectBudget = (value: string) => setAnswers((prev) => ({ ...prev, budget: value }));

  const handleBack = () => {
    if (step === 5) {
      setStep(4);
      setLoading(false);
      setError(null);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setStep(5);
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await fetch("/api/quiz-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinType: answers.skinType,
          concerns: answers.concerns,
          preferredTypes: answers.preferredTypes,
          budget: answers.budget,
        }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      const recommendedIds = Array.isArray(data.recommendedIds) ? data.recommendedIds : [];
      const matched = products.filter((product) => recommendedIds.includes(product.id));

      if (matched.length > 0) {
        setResults(matched.slice(0, 4));
      } else {
        throw new Error("No matched products");
      }
    } catch {
      setError("We couldn't generate custom results, so we've pulled our top bestseller routine instead.");
      setResults(products.filter((product) => product.badge === "Bestseller").slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 5 && !loading) {
      const timeout = window.setTimeout(() => {
        document.getElementById("quiz-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [step, loading]);

  const resetQuiz = () => {
    setStep(1);
    setAnswers(initialAnswers);
    setResults([]);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="rounded-[40px] border border-white/20 bg-gradient-to-br from-[#FF2D8A]/10 via-[#8B2BFF]/10 to-[#FF2D8A]/5 p-6 shadow-2xl sm:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 rounded-[32px] bg-white/10 p-6 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between text-sm text-foreground/60">
            <span>Step {Math.min(step, 4)} of 4</span>
            <span className="font-semibold">{step === 5 ? "Result" : `Quiz`}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all duration-500"
              style={{ width: `${Math.min(step, 4) * 25}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-[32px] bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          >
            {step <= 4 ? (
              <>
                <div className="mb-6">
                  <h2 className="mb-2 text-3xl font-bold text-foreground">{step === 1 && "What's your skin type?"}</h2>
                  <p className="text-sm text-foreground/60">
                    {step === 1 && "Choose the skin profile that feels most like you."}
                    {step === 2 && "Select up to three skin concerns so we can tailor your routine."}
                    {step === 3 && "Pick the products you'd love to use most."}
                    {step === 4 && "Choose the budget range you want to stay within."}
                  </p>
                </div>

                {step === 1 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {skinTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => selectSkinType(option.value)}
                        className={`rounded-3xl border px-5 py-4 text-left transition-all ${
                          answers.skinType === option.value
                            ? "border-hot-pink bg-gradient-to-r from-hot-pink/10 to-violet/10 shadow-glow"
                            : "border-white/10 bg-white/80 hover:border-hot-pink"
                        }`}
                      >
                        <span className="block text-2xl">{option.label.split(" ")[0]}</span>
                        <span className="mt-2 block text-sm font-semibold">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {concernOptions.map((option) => {
                      const selected = answers.concerns.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleConcern(option)}
                          className={`rounded-3xl border px-5 py-4 text-left transition-all ${
                            selected
                              ? "border-hot-pink bg-gradient-to-r from-hot-pink/10 to-violet/10 shadow-glow"
                              : "border-white/10 bg-white/80 hover:border-hot-pink"
                          }`}
                        >
                          <span className="block text-sm font-semibold">{option}</span>
                          <span className="mt-2 block text-xs text-foreground/50">
                            {selected ? "Selected" : "Tap to select"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {preferenceOptions.map((option) => {
                      const selected = answers.preferredTypes.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => togglePreference(option)}
                          className={`rounded-3xl border px-5 py-4 text-left transition-all ${
                            selected
                              ? "border-hot-pink bg-gradient-to-r from-hot-pink/10 to-violet/10 shadow-glow"
                              : "border-white/10 bg-white/80 hover:border-hot-pink"
                          }`}
                        >
                          <span className="block text-sm font-semibold">{option}</span>
                          <span className="mt-2 block text-xs text-foreground/50">
                            {selected ? "Included" : "Tap to include"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 4 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {budgetOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectBudget(option)}
                        className={`rounded-full border px-5 py-4 text-left transition-all ${
                          answers.budget === option
                            ? "border-hot-pink bg-gradient-to-r from-hot-pink/10 to-violet/10 shadow-glow"
                            : "border-white/10 bg-white/80 hover:border-hot-pink"
                        }`}
                      >
                        <span className="block text-sm font-semibold">{option}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:border-hot-pink disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowLeft className="inline h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canContinue}
                    className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                      canContinue
                        ? "bg-hot-pink text-white shadow-glow hover:bg-pink-600"
                        : "bg-white/10 text-foreground/50"
                    }`}
                  >
                    {step === 4 ? "Find My Matches" : "Next"}
                  </button>
                </div>
              </>
            ) : (
              <div id="quiz-results">
                <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/10 p-6 text-center shadow-glow backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-hot-pink/80">
                      Your Glow Routine, Curated ✨
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-foreground">Personalized picks just for you</h2>
                    <p className="mt-2 text-sm text-foreground/60">Based on your profile, these are the best matches from our collection.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-foreground/90 hover:border-hot-pink"
                    >
                      <RefreshCcw className="mr-2 inline h-4 w-4" /> Retake Quiz
                    </button>
                    <a href="/products" className="rounded-full bg-hot-pink px-5 py-3 text-sm font-semibold text-white shadow-glow hover:bg-pink-600">
                      Shop All
                    </a>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="animate-pulse rounded-[28px] bg-white/10 p-6 shadow-glow">
                        <div className="mb-4 h-44 rounded-xl bg-gray-200/40" />
                        <div className="h-4 w-3/4 rounded-full bg-gray-200/40" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {error && (
                      <p className="mb-6 rounded-3xl border border-hot-pink/20 bg-hot-pink/10 px-5 py-4 text-sm text-hot-pink">
                        {error}
                      </p>
                    )}
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                      {results.map((product) => (
                        <ProductCard key={product.id} product={product} showQuickView={false} />
                      ))}
                    </div>
                    <div className="mt-8 rounded-[32px] border border-white/10 bg-white/10 p-6 text-center text-sm text-foreground/70 shadow-glow">
                      <p className="font-semibold text-foreground">Need another routine?</p>
                      <p>Retake the quiz anytime to refresh your recommendations.</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
