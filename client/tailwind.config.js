/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        backimg: "url(./image/hostelimg.avif)",
        carimg: "url(./image/car2.png)",
        train: "url(./image/train2.png)",
        studentimg: "url(./image/student.png)",
        logoimg: "url(./image/logo.png)",
        sbgImg: "url('./image/sbg3.png')",
        mbgImg: "url('./image/mbg2.png')",
        bbgImg: "url('./image/bbg2.png')",
      },
    },
  },
  plugins: [],
};
