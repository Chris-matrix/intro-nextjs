/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
<<<<<<< HEAD
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};
=======
  reactStrictMode: true,
  swcMinify: true,
}
>>>>>>> 3a285dee90da412a71326a90439d625170d3023d
=======
  reactStrictMode: true,
  swcMinify: true,
}
>>>>>>> eb6e63ca551e556c552ea5db59ac8c030a68aea7

module.exports = nextConfig
