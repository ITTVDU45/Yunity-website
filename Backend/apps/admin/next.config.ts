import path from "node:path";
import type { NextConfig } from "next";

// cms/-Workspace als Root: verhindert, dass Next das aeussere Frontend-Repo
// als Workspace-Root erkennt (dessen src/proxy.ts sonst mitkompiliert wuerde).
const workspaceRoot = path.join(__dirname, "..", "..");

const nextConfig: NextConfig = {
  turbopack: { root: workspaceRoot },
  outputFileTracingRoot: workspaceRoot,
  transpilePackages: ["@yunity/contracts", "@yunity/permissions"],
  /*
   * Der frühere Rewrite von /api/* auf die separate NestJS-API entfällt: die
   * API läuft jetzt als Route Handler in dieser App. Bliebe er stehen, würde
   * er sämtliche Handler überschatten.
   */
};

export default nextConfig;
