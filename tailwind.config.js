/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        page: 'url(assets/images/bg.svg)',
      },
      colors: {
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fdced3',
          300: '#fca5af',
          400: '#f97385',
          500: '#f2415d',
          600: '#df1f47',
          700: '#bc143c',
          800: '#9d1439',
          900: '#8a1538',
          DEFAULT: '#8a1538',
          950: '#4b0618',
        },
      },
    },
  },
  plugins: [],
}
