/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
   headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
} = nextConfig;

