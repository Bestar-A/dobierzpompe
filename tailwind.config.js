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
			keyframes: {
				loading: {
					"0%": { top: "36px", left: "36px", width: 0, height: 0, opacity: 1 },
					"100%": { top: "0px", left: "0px", width: "72px", height: "72px", opacity: 0 },
				},
			},
			animation: {
				loading: "loading 1s cubic-bezier(0, 0.2, 0.8, 1) infinite",
			},
		},
	},
	plugins: [],
};
