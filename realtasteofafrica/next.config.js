/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/restaurants/dakar-street-food-ghost-kitchen-houston-tx",
        destination: "/restaurants/dakar-street-food-houston-tx",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

