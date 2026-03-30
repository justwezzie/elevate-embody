import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: [
    'react-admin',
    'ra-core',
    'ra-ui-materialui',
    'ra-data-simple-rest',
    'ra-i18n-polyglot',
    'ra-language-english',
  ],
};

export default nextConfig;
