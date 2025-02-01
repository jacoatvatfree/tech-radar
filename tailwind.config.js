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
        primary: '#7aa2f7',
        secondary: '#bb9af7',
        background: '#1a1b26',
        surface: '#24283b'
      }
    }
  },
  plugins: []
}
