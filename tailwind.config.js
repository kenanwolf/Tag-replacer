/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          400: '#94a3b8',
          600: '#475569',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        yellow: {
          400: '#fbbf24',
        },
        green: {
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
        },
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}