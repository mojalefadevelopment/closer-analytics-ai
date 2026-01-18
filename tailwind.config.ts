import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core colors
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
        },
        // Background surfaces
        background: {
          DEFAULT: '#0a0b0d',
          elevated: 'rgba(32, 34, 42, 0.7)',
        },
        surface: {
          DEFAULT: 'rgba(28, 30, 38, 0.45)',
          glass: 'rgba(28, 30, 38, 0.45)',
        },
        // Text colors
        text: {
          DEFAULT: '#f8fafc',
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        // Semantic colors
        positive: {
          DEFAULT: '#22c55e',
          muted: 'rgba(34, 197, 94, 0.15)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          muted: 'rgba(245, 158, 11, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', '"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        // Glass shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
        // Glow shadows
        'glow-blue': '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
        'glow-cyan': '0 10px 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-green': '0 10px 25px -5px rgba(34, 197, 94, 0.3)',
        // Button shadows
        'button': '0 4px 14px rgba(59, 130, 246, 0.25)',
        'button-hover': '0 6px 20px rgba(59, 130, 246, 0.35)',
      },
      backdropBlur: {
        'glass': '40px',
        'nav': '50px',
        'card': '30px',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(15px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        // Hero Glass Panel (Level 1 - strongest)
        '.hero-glass': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          'backdrop-filter': 'blur(40px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.1)',
          'box-shadow': '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
        },
        // Navigation Glass (Level 2)
        '.nav-glass': {
          background: 'rgba(20, 22, 28, 0.65)',
          'backdrop-filter': 'blur(50px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(50px) saturate(180%)',
          'box-shadow': '0 4px 24px rgba(0,0,0,0.12)',
        },
        // Interactive Glass (Level 3 - cards, tabs)
        '.liquid-glass': {
          background: 'rgba(28, 30, 38, 0.45)',
          'backdrop-filter': 'blur(30px) saturate(150%)',
          '-webkit-backdrop-filter': 'blur(30px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.08)',
          'box-shadow': '0 4px 16px rgba(0,0,0,0.08)',
        },
        // Badge Glass (Level 4 - nested/pill)
        '.badge-glass': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
          'backdrop-filter': 'blur(30px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(30px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.15)',
          'box-shadow': '0 4px 16px rgba(0,0,0,0.08)',
        },
        // Glass Card
        '.glass-card': {
          background: 'rgba(28, 30, 38, 0.45)',
          'backdrop-filter': 'blur(30px) saturate(150%)',
          '-webkit-backdrop-filter': 'blur(30px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.08)',
          'box-shadow': '0 4px 16px rgba(0,0,0,0.08)',
        },
        // Elevated Glass Card
        '.glass-card-elevated': {
          background: 'rgba(32, 34, 42, 0.7)',
          'backdrop-filter': 'blur(40px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.1)',
          'box-shadow': '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
        },
        // Frosted CTA
        '.frosted-cta': {
          background: 'rgba(28, 30, 38, 0.45)',
          'backdrop-filter': 'blur(40px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(40px) saturate(180%)',
          'box-shadow': '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
        },
        // Gradient buttons
        '.gradient-closer': {
          background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
          color: 'white',
          'font-weight': '600',
        },
        '.gradient-closer:hover': {
          background: 'linear-gradient(to right, #2563eb, #0891b2)',
        },
        // Icon backgrounds
        '.icon-closer': {
          background: 'rgba(59, 130, 246, 0.15)',
        },
        '.icon-positive': {
          background: 'rgba(34, 197, 94, 0.15)',
        },
        '.icon-neutral': {
          background: 'rgba(255, 255, 255, 0.08)',
        },
        // Gradient icon with glow
        '.icon-gradient-closer': {
          background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
          'box-shadow': '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
        },
        '.icon-gradient-positive': {
          background: 'linear-gradient(to bottom right, #22c55e, #10b981)',
          'box-shadow': '0 10px 25px -5px rgba(34, 197, 94, 0.3)',
        },
        // Status pill badges
        '.pill-positive': {
          background: 'rgba(34, 197, 94, 0.2)',
          color: '#4ade80',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        },
        '.pill-warning': {
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        },
        '.pill-neutral': {
          background: 'rgba(148, 163, 184, 0.2)',
          color: '#94a3b8',
          border: '1px solid rgba(148, 163, 184, 0.3)',
        },
        // Text gradient
        '.text-gradient-primary': {
          background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      })
    }),
  ],
} satisfies Config
