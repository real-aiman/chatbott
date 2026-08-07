/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        aura: {
          indigo: '#6366F1',
          violet: '#8B5CF6',
          cyan: '#22D3EE',
          pink: '#F472B6',
          bg: '#08080D',
          bgLight: '#FAFAFC',
          surface: 'rgba(255,255,255,0.04)',
          surfaceLight: 'rgba(10,10,20,0.04)',
        },
      },
      backgroundImage: {
        'aura-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 45%, #22D3EE 100%)',
        'aura-radial': 'radial-gradient(circle at 30% 20%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(circle at 80% 60%, rgba(34,211,238,0.25), transparent 45%), radial-gradient(circle at 50% 90%, rgba(244,114,182,0.2), transparent 40%)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'float-slow': 'float 14s ease-in-out infinite',
        'float-delay': 'float 10s ease-in-out infinite 2s',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        blink: 'blink 1s step-start infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
          '33%': { transform: 'translateY(-24px) translateX(14px) scale(1.04)' },
          '66%': { transform: 'translateY(14px) translateX(-10px) scale(0.98)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.06)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blink: {
          '50%': { opacity: 0 },
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(139,92,246,0.55)',
        'glow-cyan': '0 0 40px -8px rgba(34,211,238,0.5)',
      },
    },
  },
  plugins: [],
}
