import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        foreground: "#1a1a2e",
        "hot-pink": "#FF2D8A",
        violet: "#8B2BFF",
        coral: "#FF6B35",
        mint: "#00E5A0",
        "off-white": "#FAFAFA",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #FF2D8A 0%, #8B2BFF 50%, #FF6B35 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #FF2D8A 0%, #8B2BFF 40%, #FF6B35 80%, #00E5A0 100%)",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, #FF2D8A33 0px, transparent 50%), radial-gradient(at 80% 0%, #8B2BFF33 0px, transparent 50%), radial-gradient(at 0% 50%, #FF6B3533 0px, transparent 50%), radial-gradient(at 80% 50%, #00E5A033 0px, transparent 50%)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 45, 138, 0.3)",
        "glow-violet": "0 0 20px rgba(139, 43, 255, 0.3)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
