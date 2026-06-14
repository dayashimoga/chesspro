/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#06060b',
          secondary: '#0c0c14',
          tertiary: '#12121e',
          card: '#16162a',
        },
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(16, 185, 129, 0.15)',
        glowAmber: '0 0 20px rgba(245, 158, 11, 0.15)',
      }
    },
  },
  plugins: [],
}
