/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["m.media-amazon.com", "utfs.io"],
  },
  async headers() {
    return [
      {
        source: "/api/public/obsidian-sync",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "app://obsidian.md",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
      {
        source: "/api/public/get-daily",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "app://obsidian.md",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
