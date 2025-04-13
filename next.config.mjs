/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.auxiliadorapredial.com.br",
      },
      {
        hostname: "imobiliariajefersonealba.com.br",
      },
    ],
  },
};

export default nextConfig;
