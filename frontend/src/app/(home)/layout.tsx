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
        "bgray-900": "rgb(26 32 44 / 1)",
        'success-300': 'rgb(34 197 94 / 1)',
        'bgray-300': 'rgb(226 232 240 / 1)',
        "bgray-800": "rgb(45 55 72 / 1)",
        "bgray-600": "rgb(107 114 128 / 1)",
        "bgray-200": "rgb(237 242 247 / 1)",
        "bgray-700": "rgb(74 85 104 / 1)",
        "bgray-100": "rgb(247 250 252 / 1)",
        "bgray-500": "rgb(156 163 175 / 1)",
        "success-400": "rgb(22 163 74 / 1)",
        "darkblack-400": "#2A313C",
        "white-light": "rgb(224 230 237 / 1)",
        border: 'hsl(var(--border))',
        input: 'hsl(214.3 31.8% 91.4%',
        ring: 'hsl(var(--ring))',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(var(--foreground))',
        "success": "rgb(0 171 85 / 1)",
        "warning": "rgb(216 160 63 / 1)",
        "white-dark": "rgb(136 142 168 / 1)",
        "white-dark/10": "#888ea81a",
        primary: {
          DEFAULT: 'rgb(67 97 238 / 1)',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    },
  },
  plugins: [],
} satisfies Config;
