/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true
      },
      colors: {
        primary: {
          DEFAULT: '#23272f'
        },
        secondary: {
          DEFAULT: '#404756'
        },
        card: {
          DEFAULT: '#f6f7f9'
        },
        link: {
          DEFAULT: '#087ea4'
        },
        highlight: {
          DEFAULT: '#e6f7ff'
        }
      },
      boxShadow: {
        card: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
      }
    },
  },
  plugins: [
    function ({addVariant, addUtilities}) {
      addVariant('child', '& > *');
      addUtilities({
        '.contain-strict': {
          'contain': 'strict',
        },
        '.contain-content': {
          'contain': 'content',
        },
        '.contain-none': {
          'contain': 'none',
        },
      })
    },
    require('@tailwindcss/line-clamp'),
  ],
};
