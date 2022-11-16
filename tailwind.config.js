const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{handlebars,js}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#3F8963',
        'dark-primary-green': '#27543D',
        'primary-red': '#AC2626',
      },
      minHeight: {
        16: '4rem',
      },
      screens: {
        mmd: '375px',
        mlg: '425px',
        '2xs': '500px',
        xs: '575px',
      },
    },
  },
  plugins: [],
};
