/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        swiggy: {
          orange: '#FC8019',
          light: '#F0F0F5',
          dark: '#3D4152',
          text: '#282C3F',
          muted: '#93959F',
          gray: '#7E808C',
          border: '#E8E8E8',
          surface: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'swiggy': '0 2px 12px 0 rgba(0,0,0,0.04)',
        'swiggy-hover': '0 4px 14px 0 rgba(0,0,0,0.08)',
        'swiggy-orange': '0 4px 14px 0 rgba(252,128,25,0.25)',
      }
    },
  },
  plugins: [],
}
