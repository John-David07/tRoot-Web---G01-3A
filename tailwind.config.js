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
        primary: '#4CAF50',
        'primary-light': '#E8F5E9',
        warning: '#FF9800',
        danger: '#F44336',
      },
      backgroundColor: {
        app: '#f5f7fa',
      },
    },
  },
  plugins: [],
}