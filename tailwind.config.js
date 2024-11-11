/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        page: 'url(assets/images/bg.svg)',
      },
      colors: {
        primary: 'var(--app-primary-color)',
        secondary: 'var(--app-secondary-color)',
      },
    },
  },
  plugins: [],
}
