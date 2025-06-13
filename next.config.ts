import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import("next").NextConfig} */
const nextConfig = {
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withPWAInit(nextConfig));
