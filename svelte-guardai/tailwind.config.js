/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite/**/*.js'],
	theme: {
		extend: {
			colors: {
				'primary': '#13b9a5',
				'primary-dark': '#0f9685',
				'background-light': '#f6f8f8',
				'background-dark': '#11211f',
				'glass-border': 'rgba(255, 255, 255, 0.5)',
			},
			fontFamily: {
				display: ['Inter', 'sans-serif'],
			},
			borderRadius: {
				DEFAULT: '0.5rem',
				lg: '1rem',
				xl: '1.5rem',
				'2xl': '2rem',
				full: '9999px',
			},
			boxShadow: {
				soft: '0 10px 40px -10px rgba(0,0,0,0.05)',
				glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
			},
			backdropBlur: {
				xs: '2px',
			},
		},
	},
	plugins: [],
};
