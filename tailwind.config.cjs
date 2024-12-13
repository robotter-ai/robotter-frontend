/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ubuntumono: ['Ubuntu Mono', 'sans-serif'],
      },
      boxShadow: {
        custom: '0px 16px 32px 0px #16253533',
      },
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
        'blue-500': '#3E00FF',
        'blue-600': '#5620FF',
        'chart-100': '#4AB6C4',
        'chart-200': '#1F609C',
        'chart-300': '#3AA8F0',
        'chart-400': '#2788B2',
        'chart-500': '#FFDDD3',
        'chart-600': '#D7CEE3',
        'chart-700': '#D4E6FC',
        'chart-800': '#F7D7E6',
        'green-100': '#218358',
        'red-100': '#CE2C31',
        'light-20': '#F6F8FB',
        'light-200': '#F1FAFD',
        'light-250': '#F5F5F5',
        'dark-20': '#91989C',
        'dark-40': '#5C6569',
        'dark-100': '#84828E',
        'dark-200': '#65636D',
        'dark-300': '#211F26',
        'dark-400': '#113264F2',
        'dark-500': '#220BA4',
        'dark-600': '#240CAD',
        'light-blue': '#EDF2FA',
        'light-300': '#F2F0F7',
        'light-400': '#DBD8E0',
        'dark-50': '#223038',
        'text-dark': '#244141',
        'form-bg': '#F6FAFB',
        states: '#EFB621',
        'yellow-200': '#F6E2AC',
        turkish: '#80FFED',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
