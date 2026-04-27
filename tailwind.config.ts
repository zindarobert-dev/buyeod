import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          DEFAULT: "#1d1d1f",
          muted: "#6e6e73",
          line: "#d2d2d7",
          surface: "#f5f5f7",
        },
        crab: "#a8431d",
      },
      letterSpacing: {
        tightest: "-0.025em",
        ultra: "-0.04em",
      },
    },
  },
  plugins: [],
} satisfies Config;
