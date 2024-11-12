/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        page: 'url(assets/images/bg.svg)',
      },
      colors: {
        primary: ({ opacityValue }) => {
          return opacityValue
            ? `rgb(from var(--app-primary-color) r g b / ${opacityValue})`
            : `rgb(from var(--app-primary-color) r g b)`
        },
        secondary: ({ opacityValue }) => {
          return opacityValue
            ? `rgb(from var(--app-secondary-color) r g b / ${opacityValue})`
            : `rgb(from var(--app-secondary-color) r g b)`
        },
      },
    },
  },
  plugins: [],
}
