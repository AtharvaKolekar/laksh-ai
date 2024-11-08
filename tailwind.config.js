/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",       // Adjusted to look inside `src/app` directory
    "./src/components/**/*.{js,ts,jsx,tsx}", // Adjusted for `src/components` as well
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

