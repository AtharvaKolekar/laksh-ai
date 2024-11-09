/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/internship/*.{js,ts,jsx,tsx}", 
    "./src/app/virtual/*.{js,ts,jsx,tsx}",       // Adjusted to look inside `src/app` directory
    "./src/components/virtualInternship/*.{js,ts,jsx,tsx}", // Adjusted for `src/components` as well
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

