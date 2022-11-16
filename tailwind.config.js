const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{handlebars,js}'],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      black: colors.black,
      white: colors.white,
      'light-green': '#4AB087',
      'dark-green': '#3F8963',
      'primary-yellow': '#FED031',
      'primary-red': '#AC2626',
    },
  },
  plugins: [],
};
