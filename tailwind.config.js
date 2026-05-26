/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-lake': '#0A2342',
        'moss': '#3E5622',
        'amber': '#D8973C',
        'cream': '#F4F1DE',
        'earth': '#2B2D42',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
