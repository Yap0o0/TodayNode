/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          purple: '#E9D5FF', // purple-200
          pink: '#FBCFE8',   // pink-200
          blue: '#BFDBFE',   // blue-200
          green: '#BBF7D0',  // green-200
          yellow: '#FEF08A', // yellow-200
        },
        primary: {
          DEFAULT: '#C084FC', // purple-400 (조금 더 진한 파스텔)
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F472B6', // pink-400
          foreground: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
