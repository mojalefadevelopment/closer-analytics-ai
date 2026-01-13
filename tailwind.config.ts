import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#f5f7fb',
          accent: '#eef2f7',
        },
        text: {
          DEFAULT: '#0f172a',
          muted: '#475569',
        },
        accent: {
          DEFAULT: '#0ea5e9',
          strong: '#0284c7',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '22px',
        '4xl': '26px',
      },
      boxShadow: {
        glass: '0 18px 45px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
        card: '0 14px 30px rgba(15, 23, 42, 0.08)',
        button: '0 10px 24px rgba(14, 165, 233, 0.35)',
        'button-hover': '0 14px 28px rgba(14, 165, 233, 0.35)',
      },
      animation: {
        float: 'float 14s ease-in-out infinite',
        rise: 'rise 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(22px)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.glass-bg': {
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.45))',
          'backdrop-filter': 'blur(30px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(30px) saturate(180%)',
        },
        '.glass-border': {
          border: '1px solid rgba(148, 163, 184, 0.35)',
        },
        '.glass-panel': {
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.45))',
          border: '1px solid rgba(148, 163, 184, 0.35)',
          'backdrop-filter': 'blur(30px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(30px) saturate(180%)',
          'box-shadow':
            '0 18px 45px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
        },
        '.priority-card': {
          'border-left': '3px solid rgba(14, 165, 233, 0.8)',
          background:
            'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(255, 255, 255, 0.85))',
        },
        '.btn-gradient': {
          background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        },
      })
    }),
  ],
} satisfies Config
