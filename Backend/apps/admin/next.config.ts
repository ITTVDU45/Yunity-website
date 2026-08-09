import path from "node:path";
import type { NextConfig } from "next";

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:4000";

// cms/-Workspace als Root: verhindert, dass Next das aeussere Frontend-Repo
// als Workspace-Root erkennt (dessen src/proxy.ts sonst mitkompiliert wuerde).
const workspaceRoot = path.join(__dirname, "..", "..");

const nextConfig: NextConfig = {
  turbopack: { root: workspaceRoot },
  outputFileTracingRoot: workspaceRoot,
  transpilePackages: ["@yunity/contracts", "@yunity/permissions"],
  async rewrites() {
    // Browser-Requests laufen same-origin ueber /api/* — Cookies bleiben
    // first-party (in Produktion uebernimmt der Reverse Proxy dieses Routing).
    return [
      {
        source: "/api/:path*",
        destination: `${CMS_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
