/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold:    '#d4a017',
        'gold-soft': '#e8b84b',
        green:   '#4a7c59',
        'green-bright': '#5aad6f',
        bg:      '#0d1a10',
        surface: '#1a2e1f',
      },
      fontFamily: {
        // These names match the CSS variables in index.css
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['DM Mono', 'Fira Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
