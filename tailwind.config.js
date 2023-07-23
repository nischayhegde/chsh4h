/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#2ECC71',
        'dark-green': '#27AE60',
        'light-green': '#A3CB38',
        'white': '#FFFFFF',
        'dark-grey': '#2C3E50',
        'dark-gray': '#2C3E50',
      }
    },
  },
  variants: {},
  plugins: [],
}
