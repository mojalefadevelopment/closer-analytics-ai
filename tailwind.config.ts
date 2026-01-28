import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core colors - matching Closer Analytics
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#eff6ff',
        },
        // Semantic colors
        success: {
          DEFAULT: '#22c55e',
          light: '#dcfce7',
          border: '#bbf7d0',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
        },
        // Neutrals - matching Closer Analytics
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        // Clean card shadows - matching Closer Analytics
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'header': '0 1px 3px rgba(0, 0, 0, 0.05)',
        // Button shadows
        'button': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'button-primary': '0 1px 3px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        // Clean card styles - matching Closer Analytics
        '.card': {
          'background': 'white',
          'border': '1px solid #e2e8f0',
          'border-radius': '20px',
          'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        },
        '.card-hover': {
          'transition': 'box-shadow 0.2s ease, border-color 0.2s ease',
        },
        '.card-hover:hover': {
          'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.06)',
          'border-color': '#cbd5e1',
        },
        // Icon containers - matching Closer Analytics style
        '.icon-box': {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'border-radius': '12px',
        },
        '.icon-box-sm': {
          'width': '32px',
          'height': '32px',
        },
        '.icon-box-md': {
          'width': '40px',
          'height': '40px',
        },
        '.icon-box-lg': {
          'width': '48px',
          'height': '48px',
        },
        // Icon background colors
        '.icon-blue': {
          'background': '#eff6ff',
          'color': '#3b82f6',
        },
        '.icon-green': {
          'background': '#dcfce7',
          'color': '#22c55e',
        },
        '.icon-amber': {
          'background': '#fef3c7',
          'color': '#f59e0b',
        },
        '.icon-purple': {
          'background': '#f3e8ff',
          'color': '#a855f7',
        },
        '.icon-slate': {
          'background': '#f1f5f9',
          'color': '#64748b',
        },
        // Status badges - matching Closer Analytics
        '.badge': {
          'display': 'inline-flex',
          'align-items': 'center',
          'gap': '4px',
          'padding': '4px 10px',
          'border-radius': '9999px',
          'font-size': '12px',
          'font-weight': '500',
        },
        '.badge-success': {
          'background': '#dcfce7',
          'color': '#16a34a',
        },
        '.badge-warning': {
          'background': '#fef3c7',
          'color': '#d97706',
        },
        '.badge-info': {
          'background': '#eff6ff',
          'color': '#3b82f6',
        },
        '.badge-neutral': {
          'background': '#f1f5f9',
          'color': '#64748b',
        },
        // Primary button gradient
        '.btn-primary': {
          'background': '#3b82f6',
          'color': 'white',
          'font-weight': '500',
          'border-radius': '12px',
          'padding': '10px 20px',
          'transition': 'background 0.2s ease',
        },
        '.btn-primary:hover': {
          'background': '#2563eb',
        },
        // Ghost button
        '.btn-ghost': {
          'background': 'transparent',
          'color': '#64748b',
          'font-weight': '500',
          'border-radius': '12px',
          'padding': '10px 20px',
          'transition': 'background 0.2s ease, color 0.2s ease',
        },
        '.btn-ghost:hover': {
          'background': '#f1f5f9',
          'color': '#334155',
        },
        // Outlined button
        '.btn-outline': {
          'background': 'white',
          'color': '#334155',
          'font-weight': '500',
          'border': '1px solid #e2e8f0',
          'border-radius': '12px',
          'padding': '10px 20px',
          'transition': 'border-color 0.2s ease, background 0.2s ease',
        },
        '.btn-outline:hover': {
          'border-color': '#cbd5e1',
          'background': '#f8fafc',
        },
        // Stat card styles
        '.stat-card': {
          'background': 'white',
          'border': '1px solid #e2e8f0',
          'border-radius': '16px',
          'padding': '20px',
        },
        '.stat-value': {
          'font-size': '24px',
          'font-weight': '700',
          'color': '#1e293b',
          'line-height': '1.2',
        },
        '.stat-label': {
          'font-size': '13px',
          'color': '#64748b',
        },
      })
    }),
  ],
} satisfies Config
