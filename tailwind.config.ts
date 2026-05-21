import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        guinda: {
          50: '#fdf2f4', 100: '#fce7eb', 200: '#f9d0d8',
          300: '#f4a8b6', 400: '#ec7089', 500: '#e14469',
          600: '#cc2452', 700: '#ab1941', 800: '#8f163a',
          900: '#7a1636', 950: '#6b0a28',
          DEFAULT: '#7a1836',
        },
        gold: { DEFAULT: '#c9a84c', light: '#e8c96d', dark: '#a07830' },
      },
      backgroundImage: {
        'guinda-gradient': 'linear-gradient(180deg, #6b0a28 0%, #8f163a 50%, #7a1636 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
