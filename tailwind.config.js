/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist-Regular', 'sans-serif'],
        'geist-bold': ['Geist-Bold', 'sans-serif'],
        'geist-medium': ['Geist-Medium', 'sans-serif'],
        'geist-semibold': ['Geist-SemiBold', 'sans-serif'],
        'geist-black': ['Geist-Black', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
