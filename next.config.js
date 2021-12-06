const withPWA = require("next-pwa");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pwa: {
    dest: "public",
  },
};

module.exports = withPWA(config);
