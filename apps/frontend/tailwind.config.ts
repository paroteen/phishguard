import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#00bcd4"
      }
    }
  },
  darkMode: "class",
  plugins: []
};

export default config;
