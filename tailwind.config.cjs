/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: {
          DEFAULT: '#23272f',
        },
        secondary: {
          DEFAULT: '#404756',
        },
        card: {
          DEFAULT: '#f6f7f9',
        },
        link: {
          50: '#ecfdff',
          100: '#cff8fe',
          200: '#a5effc',
          300: '#68e1f8',
          400: '#23c8ed',
          500: '#07abd3',
          DEFAULT: '#087ea4',
          700: '#0e6e90',
          800: '#155975',
          900: '#164a63',
          950: '#083044',
        },
        highlight: {
          DEFAULT: '#e6f7ff',
        },
      },
      boxShadow: {
        card: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px !important',
      },

      data: {
        open: 'open~="true"',
        active: 'active~="true"',
      },
    },
  },
  plugins: [
    function ({ addVariant, addUtilities }) {
      addVariant('child', '& > *');
      addUtilities({
        '.contain-strict': {
          contain: 'strict',
        },
        '.contain-content': {
          contain: 'content',
        },
        '.contain-none': {
          contain: 'none',
        },
      });
    },
  ],
};
