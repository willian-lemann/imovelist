/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    remotePatterns: [
      { hostname: "imobiliariajefersonealba.com.br" },
      { hostname: "imgs1.cdn-imobibrasil.com.br" },
      { hostname: "digdpilwqusbkpnnbejk.supabase.co" },
      { hostname: "img.youtube.com" },
      { hostname: "img.auxiliadorapredial.com.br" },
    ],
  },
};

export default nextConfig;
