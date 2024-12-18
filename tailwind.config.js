/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./**/*.{html, js}"],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
			},
			colors: {
				primary: "#2A6AB6",
				disable: "#888888",
				secondary: "#95979D",
				dark: "#222325",
			},
			boxShadow: {
				card: "0px 2px 2px 1px #9595951A",
			},
		},
	},
	plugins: [],
};
