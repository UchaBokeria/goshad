/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'web/**/*.templ',
  ],
  theme: {
    fontFamily: {
      nino: ["Nino", "sans-serif"],
      deja: ["Deja", "sans-serif"],
      arial: ["Arial", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        mobile: "2rem",
        tablet: "4rem",
        desktop: "5rem",
      },
    },
    extend: {
      screens: {
        'mob':  {'min': '1px', 'max': '1280px'},
      },
      colors: {
        primary: "#21569e",
        secondary: "#fecc00",
        white: "#FFFFFF",
        black: "#333333",
      }
    },
    daisyui: {
      themes: ["light", "dark", "cupcake"],
    },
  },
  plugins: [
    require('tailwindcss-opentype'),
    require('daisyui')
  ]
}