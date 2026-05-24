import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f9f6',
          100: '#d9f0ea',
          200: '#b3e1d5',
          300: '#7fcaba',
          400: '#6FAF9B',
          500: '#4d9483',
          600: '#3b786a',
          700: '#316157',
          800: '#2a4e47',
          900: '#26413c',
        },
        surface: '#F8FAF9',
        ink:    '#0F172A',
        muted:  '#64748B',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl:  '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card:  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        modal: '0 25px 50px -12px rgb(0 0 0 / 0.12)',
        glow:  '0 0 0 3px rgb(111 175 155 / 0.25)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                     to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
