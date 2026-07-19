import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The committed data/ snapshot must ship with any server function (the 404
  // path renders the layout, which reads the workspace at request time).
  outputFileTracingIncludes: {
    "/**": ["./data/**"],
  },
};

export default nextConfig;
