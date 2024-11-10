/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // old
    "./src/app/internship/*.{js,ts,jsx,tsx}", 
    "./src/app/virtual/*.{js,ts,jsx,tsx}",

    // new
    "./src/app/(protected)/Dashboard/Virtual-Internship/**/*.{js,ts,jsx,tsx}", 
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

