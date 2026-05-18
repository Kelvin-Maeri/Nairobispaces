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
        brand: {
          DEFAULT: "#E35336",
          dark: "#C03D24",
          deeper: "#9E2F19",
          light: "#F9DDD7",
          pale: "#FDF1EE",
        },
        dark: {
          DEFAULT: "#222222",
          2: "#333333",
          3: "#555555",
          4: "#777777",
          5: "#AAAAAA",
          6: "#CCCCCC",
          7: "#E5E5E5",
          8: "#F2F2F2",
        },
        page: "#F5F4F2",
        success: {
          bg: "#E8F5E9",
          ink: "#2E7D32",
          border: "#A5D6A7",
        },
        pending: {
          bg: "#FFF8E1",
          ink: "#A05C00",
          border: "#FFE082",
        },
        error: {
          bg: "#FDEAEA",
          ink: "#C62828",
          border: "#EF9A9A",
        },
        info: {
          bg: "#E3F2FD",
          ink: "#1565C0",
          border: "#90CAF9",
        },
      },
      fontFamily: {
        display: ["Quicksand", "sans-serif"],
        body: ["Raleway", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        full: "999px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,.08)",
        md: "0 4px 14px rgba(0,0,0,.10)",
        lg: "0 12px 36px rgba(0,0,0,.12)",
      },
    },
  },
  plugins: [],
};
export default config;