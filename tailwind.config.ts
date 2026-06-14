import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        subtle: "#6e6e73",
        hairline: "#d2d2d7",
        accent: "#0071e3",
        accentSoft: "#e8f1fe",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["SF Mono", "ui-monospace", "Menlo", "Monaco", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
