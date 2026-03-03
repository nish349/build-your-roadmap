/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'level-mandatory': '#10b981', // green-500
        'level-intermediate': '#3b82f6', // blue-500
        'level-advanced': '#8b5cf6', // violet-500
        'level-alternative': '#6b7280', // gray-500
      }
    },
  },
  plugins: [],
}
