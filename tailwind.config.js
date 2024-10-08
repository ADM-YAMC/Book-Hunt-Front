/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/preline/dist/*.js',
    "./src/**/*.{html,ts}",
     "./node_modules/flowbite/**/*.js",

  ],
  theme: {
    extend: {},
    colors:{
      'cyprus': {
        '50': '#effefd',
        '100': '#c8fffb',
        '200': '#90fff7',
        '300': '#51f7f2',
        '400': '#1de4e4',
        '500': '#05c3c7',
        '600': '#009ba1',
        '700': '#057a80',
        '800': '#0a5f65',
        '900': '#0e4e53',
        '950': '#003c43',
    }
    }
  },
  plugins: [
    require('flowbite/plugin'),
    require('preline/plugin'),
  ],
}

