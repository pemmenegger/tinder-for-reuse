/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      "head-400": ["henrietta-400", "ui-sans-serif", "system-ui", "Arial"],
      "body-400": ["graphik-400", "ui-sans-serif", "system-ui", "Arial"],
      "body-500": ["graphik-500", "ui-sans-serif", "system-ui", "Arial"],
      "body-600": ["graphik-600", "ui-sans-serif", "system-ui", "Arial"],
    },
    screens: {
      md: "770px",
      lg: "990px",
      xl: "1265px",
    },
    extend: {
      colors: {
        bg: "#F9F8F8",
        lgray: "#C2C2C2",
        dgray: "#939393",
        red: "#FF0000",
        "rondas-beige": "#f9f6f0",
        "rondas-beige-v2": "#FEFCFB",
        "rondas-border-beige": "#D2D2D2",
        "rondas-beige-dark": "rgb(44, 35, 17)",
        "rondas-black": "#2f2f2f",
        "rondas-orange": "#FA5E40",
        "rondas-orange2": "#FF6723",
        "rondas-dark-green": "#145E4B",
        "rondas-violet": "#9743FF",
        "rondas-yellow": "#F5DD4D",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-in-out",
      },
    },
  },
};
