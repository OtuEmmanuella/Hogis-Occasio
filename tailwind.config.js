/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        neon: {
          cyan:  '#00f5ff',
          teal:  '#00ffc8',
          gold:  '#ffd700',
          pink:  '#ff00aa',
          green: '#00ff88',
        },
        dark: {
          950: '#010409',
          900: '#0d1117',
          800: '#161b22',
          700: '#21262d',
          600: '#30363d',
          500: '#484f58',
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)",
        'glow-conic': 'conic-gradient(from 180deg at 50% 50%, #00f5ff 0deg, #00ffc8 55deg, #0d9488 120deg, #00f5ff 360deg)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'matrix': 'matrix 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00f5ff, 0 0 10px #00f5ff' },
          '100%': { boxShadow: '0 0 20px #00f5ff, 0 0 40px #00f5ff, 0 0 80px #00f5ff' },
        },
      },
      boxShadow: {
        'neon-cyan':  '0 0 10px #00f5ff, 0 0 30px rgba(0,245,255,0.3)',
        'neon-teal':  '0 0 10px #00ffc8, 0 0 30px rgba(0,255,200,0.3)',
        'neon-gold':  '0 0 10px #ffd700, 0 0 30px rgba(255,215,0,0.3)',
        'neon-pink':  '0 0 10px #ff00aa, 0 0 30px rgba(255,0,170,0.3)',
        'glass':      '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card':       '0 0 0 1px rgba(0,245,255,0.1), 0 20px 50px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
