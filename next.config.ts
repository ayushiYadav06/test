import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  api: {
    bodyParser: false, // disable bodyParser to handle raw payload
  },
};

export default nextConfig;
