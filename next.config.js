const path = require("path");

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: [path.resolve(__dirname, "src/pages")],
      use: "babel-loader",
    });
    return config;
  },
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
};
