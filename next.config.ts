import { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: [path.resolve(__dirname, "src/pages")],
      use: "babel-loader",
    });

    return config;
  },
};

export default nextConfig;
