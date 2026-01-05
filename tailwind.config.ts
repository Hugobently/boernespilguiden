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
        // Playful, vibrant color palette for kids
        candy: {
          pink: "#FF6B9D",
          purple: "#9B59B6",
          blue: "#3498DB",
          cyan: "#00D9FF",
          green: "#2ECC71",
          yellow: "#F1C40F",
          orange: "#FF8C42",
          red: "#E74C3C",
        },
        // Background colors
        cream: "#FFF8E7",
        sky: "#E8F4FD",
        mint: "#E8F8F5",
        lavender: "#F3E8FF",
        // Neutral tones
        charcoal: "#2D3436",
        slate: "#636E72",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "blob": "30% 70% 70% 30% / 30% 30% 70% 70%",
        "blob-2": "60% 40% 30% 70% / 60% 30% 70% 40%",
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pop": "pop 0.3s ease-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      boxShadow: {
        "playful": "0 4px 0 0 rgba(0, 0, 0, 0.1), 0 8px 20px -4px rgba(0, 0, 0, 0.15)",
        "playful-lg": "0 6px 0 0 rgba(0, 0, 0, 0.1), 0 12px 30px -6px rgba(0, 0, 0, 0.2)",
        "card": "0 2px 0 0 rgba(0, 0, 0, 0.05), 0 4px 15px -2px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 4px 0 0 rgba(0, 0, 0, 0.08), 0 8px 25px -4px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
