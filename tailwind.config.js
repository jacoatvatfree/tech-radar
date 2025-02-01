module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./client/**/*.{js,jsx,ts,tsx}",
    "./server/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a67c52',
        secondary: '#d7c49e',
        background: '#3c2f2f',
        surface: '#2e2323'
      }
    }
  },
  plugins: []
}
