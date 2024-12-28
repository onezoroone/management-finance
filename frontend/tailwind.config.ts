import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "bgray-900": "rgb(26 32 44 / 1)",
        'success-300': 'rgb(34 197 94 / 1)',
        'bgray-300': 'rgb(226 232 240 / 1)',
        "bgray-800": "rgb(45 55 72 / 1)",
        "bgray-600": "rgb(107 114 128 / 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
