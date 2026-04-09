/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void:    '#0a0a0f',
        'neon-purple': '#a855f7',
        'neon-violet': '#8b5cf6',
        'neon-cyan':   '#22d3ee',
        'neon-green':  '#10b981',
        'neon-red':    '#ef4444',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        'glow-purple':   '0 0 24px rgba(168,85,247,0.45), 0 0 60px rgba(168,85,247,0.15)',
        'glow-cyan':     '0 0 24px rgba(34,211,238,0.45), 0 0 60px rgba(34,211,238,0.15)',
        'glow-green':    '0 0 20px rgba(16,185,129,0.5)',
        'glow-red':      '0 0 20px rgba(239,68,68,0.5)',
        'glow-purple-sm':'0 0 10px rgba(168,85,247,0.35)',
        'glow-cyan-sm':  '0 0 10px rgba(34,211,238,0.35)',
      },
      animation: {
        'pulse-dot':     'pulseDot 1.8s ease-in-out infinite',
        'pulse-dot-slow':'pulseDot 2.4s ease-in-out infinite',
        'spin-fast':     'spin 0.7s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'fade-slide-in': 'fadeSlideIn 0.45s ease both',
        'shimmer':       'shimmer 3s linear infinite',
        'orb-float':     'orbFloat 20s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { opacity: '1',  transform: 'scale(1)'   },
          '50%':      { opacity: '0.3', transform: 'scale(0.65)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        fadeSlideIn: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        orbFloat: {
          '0%,100%': { transform: 'translateY(0) scale(1)' },
          '33%':     { transform: 'translateY(-30px) scale(1.05)' },
          '66%':     { transform: 'translateY(20px) scale(0.97)' },
        },
      },
    },
  },
  plugins: [],
}
