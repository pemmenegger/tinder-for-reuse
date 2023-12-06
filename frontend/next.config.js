/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    domains: ["c.tutti.ch", "can01.anibis.ch", "img.ricardostatic.ch"],
  },
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/building-elements/collectors",
      },
    ];
  },
};

module.exports = nextConfig;
