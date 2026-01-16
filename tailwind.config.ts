import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#fafbfc',
          accent: '#f1f5f9',
        },
        text: {
          DEFAULT: '#1e293b',
          muted: '#64748b',
        },
        accent: {
          DEFAULT: '#3b82f6',
          strong: '#2563eb',
          subtle: '#eff6ff',
        },
      },
      fontFamily: {
        sans: ['Inter', '"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        glass: '0 1px 3px rgba(0, 0, 0, 0.05), 0 20px 40px rgba(0, 0, 0, 0.04)',
        card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 1px 2px rgba(0, 0, 0, 0.04), 0 12px 32px rgba(0, 0, 0, 0.08)',
        button: '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(59, 130, 246, 0.15)',
        'button-hover': '0 1px 2px rgba(0, 0, 0, 0.05), 0 8px 20px rgba(59, 130, 246, 0.2)',
      },
      animation: {
        float: 'float 20s ease-in-out infinite',
        rise: 'rise 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.glass-bg': {
          background: 'rgba(255, 255, 255, 0.85)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
        },
        '.glass-border': {
          border: '1px solid rgba(226, 232, 240, 0.8)',
        },
        '.glass-panel': {
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.05), 0 20px 40px rgba(0, 0, 0, 0.04)',
        },
        '.priority-card': {
          'border-left': '3px solid #3b82f6',
          background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.8), rgba(255, 255, 255, 0.95))',
        },
        '.btn-gradient': {
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        },
      })
    }),
  ],
} satisfies Config
