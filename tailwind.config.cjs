/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#fff',
        primary: { DEFAULT: '#1DC3CF', strong: '#0192A7' },
        dark: '#172025',
        success: '#00C667',
        danger: '#FF3B30',
        navy: '#3E00FF',
        blue: '#0D74CE',
        'blue-100': '#E6F4FE',
        'blue-200': '#60B3D7',
        'blue-300': '#0D74CE',
        'blue-400': '#113264',
        'chart-100': '#4AB6C4',
        'chart-200': '#1F609C',
        'chart-300': '#3AA8F0',
        'green-100': '#218358',
        'red-100': '#CE2C31',
        'light-20': '#F6F8FB',
        'light-200': '#F1FAFD',
        'dark-20': '#91989C',
        'dark-40': '#5C6569',
        'dark-100': '#84828E',
        'dark-200': '#65636D',
        'dark-300': '#211F26',
        'light-blue': '#EDF2FA',
        'light-300': '#F2F0F7',
        'light-400': '#DBD8E0',
        'dark-50': '#223038',
        'text-dark': '#244141',
        'form-bg': '#F6FAFB',
        states: '#EFB621',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
