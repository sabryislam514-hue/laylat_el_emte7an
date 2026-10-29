/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      colors: {
        neon: {
          cyan: '#22d3ee',
          violet: '#a78bfa',
          fuchsia: '#e879f9',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(34, 211, 238, 0.18)',
        'glow-lg': '0 0 80px rgba(167, 139, 250, 0.25)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34, 211, 238, 0.18), transparent), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(168, 85, 247, 0.16), transparent), radial-gradient(ellipse 40% 30% at 10% 40%, rgba(232, 121, 249, 0.12), transparent)',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'glow-pulse': 'glowPulse 3.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.65s ease-out both',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
