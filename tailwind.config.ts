import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#94EC40",
          50: "#F5FDF0",
          100: "#EAFBD9",
          200: "#D4F7B0",
          300: "#B8F27D",
          400: "#94EC40",
          500: "#7ED428",
          600: "#60B01A",
          700: "#478516",
          800: "#376815",
          900: "#2F5615",
        },
        paper: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#EBEBEB",
          300: "#E4E4E7",
          400: "#D4D4D8",
          500: "#A1A1AA",
        },
        charcoal: {
          50: "#F4F4F5",
          100: "#E4E4E7",
          200: "#D4D4D8",
          300: "#A1A1AA",
          400: "#71717A",
          500: "#52525B",
          600: "#3F3F46",
          700: "#27272A",
          800: "#1E1E21",
          900: "#121212",
          950: "#0A0A0A",
        },
      },
      fontFamily: {
        sans: [
          "satoshi",
          '"satoshi Fallback"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        satoshi: [
          "satoshi",
          '"satoshi Fallback"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        saans: [
          "saans",
          '"saans Fallback"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        "tactile-sm": "0 1px 2px rgba(20, 20, 22, 0.04), 0 0 0 1px rgba(20, 20, 22, 0.04)",
        "tactile-md": "0 4px 12px -2px rgba(20, 20, 22, 0.05), 0 0 0 1px rgba(20, 20, 22, 0.05)",
        "tactile-lg": "0 12px 32px -4px rgba(20, 20, 22, 0.07), 0 0 0 1px rgba(20, 20, 22, 0.04)",
        "tactile-card": "0 10px 30px -5px rgba(24, 24, 27, 0.04), 0 1px 3px 0 rgba(24, 24, 27, 0.02), 0 0 0 1px rgba(228, 223, 211, 0.6)",
        "tactile-input": "inset 0 1px 2px rgba(20, 20, 22, 0.03)",
        "tactile-button": "0 1px 2px rgba(20, 20, 22, 0.12), inset 0 1px 0.5px rgba(255, 255, 255, 0.12)",
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-line": {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scan-line": "scan-line 2.5s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
