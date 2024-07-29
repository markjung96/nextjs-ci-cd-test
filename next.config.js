const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: [path.resolve(__dirname, "src/pages")],
      use: "babel-loader",
    });
    return config;
  },
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

module.exports = nextConfig;
