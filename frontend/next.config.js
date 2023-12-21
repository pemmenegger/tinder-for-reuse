/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/building-elements/items",
      },
    ];
  },
};

module.exports = nextConfig;
