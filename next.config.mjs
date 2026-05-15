// ============================================================
// rod.dev — Next.js Configuration
// ============================================================
// Bootstraps secrets from Vault (or .env fallback) at startup
// and injects them into process.env for the app.
// ============================================================

import { createVaultClient } from "@rodrigo-barraza/utilities-library/node";

// ── Bootstrap secrets at build/dev time ────────────────────────
const vault = createVaultClient({
  localEnvFile: "./.env",
  fallbackEnvFile: "../vault-service/.env",
});

const secrets = await vault.fetch();

// Inject into process.env so the app can read them
Object.assign(process.env, secrets);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {},
  transpilePackages: ["@rodrigo-barraza/utilities-library", "@rodrigo-barraza/components-library"],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.rod.dev",
      },
      {
        protocol: "https",
        hostname: "api.prism.rod.dev",
      },
    ],
  },

  env: {
    NEXT_PUBLIC_RODRIGO_SERVICE: secrets.NEXT_PUBLIC_RODRIGO_SERVICE,
    NEXT_PUBLIC_PRISM_SERVICE: secrets.NEXT_PUBLIC_PRISM_SERVICE,
    ROD_DEV_MINIO_BUCKET_NAME: secrets.ROD_DEV_MINIO_BUCKET_NAME,
    ROD_DEV_ASSETS_MINIO_BUCKET_NAME: secrets.ROD_DEV_ASSETS_MINIO_BUCKET_NAME,
    RENDER_API: secrets.RENDER_API,
    SESSIONS_SERVICE_URL: secrets.SESSIONS_SERVICE_URL,
    SESSIONS_SERVICE_PUBLIC_URL: secrets.SESSIONS_SERVICE_PUBLIC_URL,
  },
};

export default nextConfig;
