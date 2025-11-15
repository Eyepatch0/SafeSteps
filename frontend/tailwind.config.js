/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#05040d',
          800: '#090b1f',
          700: '#111433',
        },
        twilight: '#6b5bff',
        ember: '#f8c552',
        mist: '#c7d2fe',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px rgba(248, 197, 82, 0.45)',
        card: '0 20px 60px rgba(5, 4, 13, 0.45)',
      },
      backgroundImage: {
        'night-gradient':
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 45%), radial-gradient(circle at 80% 0%, rgba(107,91,255,0.35), transparent 40%), radial-gradient(circle at 50% 50%, rgba(248,197,82,0.08), transparent 70%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
}
