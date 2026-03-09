/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          main: '#ff7eb6',   // ちゅるっとした青みピンク
          50: '#fff4f9',
          100: '#ffe9f3',
          200: '#ffd3e8',
          300: '#ffbddc',
          400: '#ffa7d1',
          500: '#ff7eb6',
          600: '#f85a9e',
          700: '#e83b86',
          800: '#c9266d',
          900: '#9e1a55',
        },

        orange: {
          main: '#ffb38a',   // ミルキーオレンジ
          50: '#fff8f4',
          100: '#fff0e8',
          200: '#ffe1d1',
          300: '#ffd2ba',
          400: '#ffc3a3',
          500: '#ffb38a',
          600: '#ff9a63',
          700: '#f27d3d',
          800: '#d66527',
          900: '#b3521f',
        },

        aqua: {
          main: '#7dd3c7',   // 雨粒みたいなエメラルド
          50: '#f2fbf9',
          100: '#e6f7f4',
          200: '#ccefe9',
          300: '#b3e7de',
          400: '#99dfd3',
          500: '#7dd3c7',
          600: '#5fbfb2',
          700: '#3fa89b',
          800: '#2f8077',
          900: '#235f58',
        },

        lavender: {
          main: '#d8b6ff',   // 少しだけ白を足す
          50: '#fbf7ff',
          100: '#f6eeff',
          200: '#ecd9ff',
          300: '#e2c4ff',
          400: '#d8b6ff',
          500: '#d8b6ff',
          600: '#c595ff',
          700: '#b274ff',
          800: '#9a55f2',
          900: '#7c3bd1',
        },

        yellow: {
          main: '#ffe38a',   // ミルキーレモン
          50: '#fffdf4',
          100: '#fff9e8',
          200: '#fff3d1',
          300: '#ffedba',
          400: '#ffe7a3',
          500: '#ffe38a',
          600: '#ffd45f',
          700: '#f2bf3d',
          800: '#d6a827',
          900: '#9c7616',   // ← 文字用アンバー寄り
        },

        red: {
          50: '#fff0f0',
          100: '#ffd6d6',
          200: '#ffbaba',
          300: '#ff9d9d',
          400: '#ff8181',
          500: '#ff6f6f', // main
          600: '#ff5757',
          700: '#f23d3d',
          800: '#d62727',
          900: '#a71c1c'
        },

        blue: {
          50: '#f2f7ff',
          100: '#d9e7ff',
          200: '#b8d4ff',
          300: '#94c0ff',
          400: '#78adff',
          500: '#7aaeff', // main
          600: '#6398ff',
          700: '#4a81f2',
          800: '#3666d6',
          900: '#274da3'
        },

        cyan: {
          50: '#f4fbff',
          100: '#d9f0ff',
          200: '#b6e4ff',
          300: '#91d8ff',
          400: '#70ccff',
          500: '#a3d8f4', // main
          600: '#5dbfff',
          700: '#3da8e6',
          800: '#2a81b3',
          900: '#1c5c80'
        },

      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
