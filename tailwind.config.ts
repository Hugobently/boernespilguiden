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
        // Soft Pastel Palette - Child-friendly and inviting
        coral: {
          DEFAULT: "#FFB5A7",
          light: "#FCD5CE",
          dark: "#F8A99B",
        },
        mint: {
          DEFAULT: "#B8E0D2",
          light: "#D8F3DC",
          dark: "#95D5B2",
        },
        sky: {
          DEFAULT: "#A2D2FF",
          light: "#CAF0F8",
          dark: "#72B4E8",
        },
        sunflower: {
          DEFAULT: "#FFE66D",
          light: "#FFF3B0",
          dark: "#FFD93D",
        },
        lavender: {
          DEFAULT: "#CDB4DB",
          light: "#E2D1F0",
          dark: "#B392C9",
        },

        // Background colors
        cream: "#FFF9F0",
        paper: "#FFFCF7",
        peach: "#FFF0E8",
        mist: "#F5F9FC",

        // Text colors
        text: {
          primary: "#4A4A4A",
          secondary: "#7A7A7A",
          muted: "#9CA3AF",
        },

        // Age group colors
        age: {
          baby: "#FFD1DC",
          toddler: "#BAFFC9",
          child: "#BAE1FF",
          tween: "#E2C2FF",
        },

        // Semantic colors
        success: "#77DD77",
        warning: "#FFD97D",
        error: "#FF9AA2",
        info: "#A0D2DB",

        // Legacy candy colors (backwards compatibility)
        candy: {
          pink: "#FFB5A7",
          purple: "#CDB4DB",
          blue: "#A2D2FF",
          cyan: "#CAF0F8",
          green: "#B8E0D2",
          yellow: "#FFE66D",
          orange: "#F8A99B",
          red: "#FF9AA2",
        },

        // Legacy neutral tones
        charcoal: "#4A4A4A",
        slate: "#7A7A7A",
      },

      fontFamily: {
        display: ["var(--font-display)", "Nunito", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Nunito", "system-ui", "sans-serif"],
      },

      borderRadius: {
        "blob": "30% 70% 70% 30% / 30% 30% 70% 70%",
        "blob-2": "60% 40% 30% 70% / 60% 30% 70% 40%",
        "blob-3": "40% 60% 60% 40% / 70% 30% 70% 30%",
        "playful": "1rem",
        "playful-lg": "1.5rem",
        "playful-xl": "2rem",
      },

      animation: {
        "bounce-slow": "bounce 3s infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pop": "pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fade-in 0.3s ease-out",
        "shimmer": "shimmer 1.5s infinite",
      },

      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "70%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      boxShadow: {
        // Soft, diffused shadows
        "soft": "0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 4px 24px -4px rgba(0, 0, 0, 0.04)",
        "medium": "0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 8px 32px -8px rgba(0, 0, 0, 0.06)",
        "lifted": "0 8px 24px -4px rgba(0, 0, 0, 0.1), 0 16px 48px -8px rgba(0, 0, 0, 0.06)",

        // Button shadows (3D press effect)
        "button": "0 4px 0 0 rgba(0, 0, 0, 0.08), 0 6px 16px -4px rgba(0, 0, 0, 0.12)",
        "button-hover": "0 6px 0 0 rgba(0, 0, 0, 0.1), 0 10px 24px -6px rgba(0, 0, 0, 0.15)",
        "button-pressed": "0 2px 0 0 rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.1)",

        // Card shadows
        "card": "0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 4px 24px -4px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 24px -4px rgba(0, 0, 0, 0.1), 0 16px 48px -8px rgba(0, 0, 0, 0.06)",

        // Colored shadows
        "coral": "0 8px 24px -8px rgba(255, 181, 167, 0.4)",
        "mint": "0 8px 24px -8px rgba(184, 224, 210, 0.4)",
        "sky": "0 8px 24px -8px rgba(162, 210, 255, 0.4)",
        "sunflower": "0 8px 24px -8px rgba(255, 230, 109, 0.4)",
        "lavender": "0 8px 24px -8px rgba(205, 180, 219, 0.4)",

        // Glow effects
        "glow-coral": "0 0 20px rgba(255, 181, 167, 0.4)",
        "glow-mint": "0 0 20px rgba(184, 224, 210, 0.4)",
        "glow-sky": "0 0 20px rgba(162, 210, 255, 0.4)",

        // Legacy shadows
        "playful": "0 4px 0 0 rgba(0, 0, 0, 0.08), 0 8px 20px -4px rgba(0, 0, 0, 0.12)",
        "playful-lg": "0 6px 0 0 rgba(0, 0, 0, 0.1), 0 12px 30px -6px rgba(0, 0, 0, 0.15)",
      },

      transitionTimingFunction: {
        "bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "elastic": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;
