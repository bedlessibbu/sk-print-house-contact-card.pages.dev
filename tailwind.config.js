/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4EEE4',
        'paper-light': '#FBF7F0',
        'paper-deep': '#EAE1D3',
        ink: '#0B0C0E',
        navy: '#1C2D4B',
        'navy-deep': '#111D33',
        red: '#DE1F26',
        'red-deep': '#A8141C',
        muted: '#6E675C',
        sand: '#E7DCCB',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1200px',
      },
      letterSpacing: {
        tightest: '-0.055em',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        card: '0 1px 1px rgba(17, 29, 51, 0.04), 0 18px 40px -22px rgba(17, 29, 51, 0.35), 0 50px 100px -60px rgba(17, 29, 51, 0.45)',
        lift: '0 18px 40px -24px rgba(17, 29, 51, 0.45)',
      },
      keyframes: {
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'float-soft': 'float-soft 7s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 30s linear infinite',
      },
    },
  },
  plugins: [],
}
