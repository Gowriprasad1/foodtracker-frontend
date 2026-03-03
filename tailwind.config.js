/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        zomato: {
          red: '#3d0112',
          dark: '#CB202D',
          light: '#F8F8F8',
          border: '#E8E8E8',
          text: '#1C1C1C',
        }
      }
    },
  },
  plugins: [],
}

