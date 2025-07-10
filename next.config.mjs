import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  images: {
    remotePatterns: [ 
      {
        protocol: "https",
        hostname: "cdn.genmo.ai",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
