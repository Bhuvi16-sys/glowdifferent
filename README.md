# Glow — Beauty & Skincare Ecommerce

A vibrant, Gen-Z beauty ecommerce experience built with Next.js 14, Tailwind CSS, Framer Motion, Three.js, and Zustand.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI Recommendations

Copy `.env.example` to `.env.local` and add your Anthropic API key:

```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Without the key, product pages fall back to a "Popular Picks" section.

## Promo Code

Use `GLOW20` at checkout for 20% off.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (cart + loyalty, persisted to localStorage)
- Three.js (3D product preview)
- Google Gemini API (AI recommendations)
