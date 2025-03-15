/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}",
	],
	darkMode: 'class',
	theme: {
	  extend: {
		colors: {
		  
		},
		keyframes: {
			shine: {
				"0%": { backgroundPosition: "200%" },
				"100%": { backgroundPosition: "-100%" },
			  },
		},
		animation: {
		  shine: 'shine 2s linear infinite',
		},
	  },
	},
	plugins: [
	  require("tailwindcss-animate"),
	  require('daisyui')
	],
  };
  