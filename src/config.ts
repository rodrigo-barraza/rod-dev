// ============================================================
// rod.dev Client — Runtime Configuration
// ============================================================

const IS_BROWSER = typeof window !== "undefined";

export const IS_PRODUCTION =
  IS_BROWSER && window.location.hostname.endsWith(".dev");

export const IS_LOCALHOST = !IS_PRODUCTION;

export const PROJECT_NAME = IS_PRODUCTION ? "rod-dev-client" : "rod-dev-client-dev";

const RAW_SERVICE_URL =
  process.env.NEXT_PUBLIC_SESSIONS_SERVICE_URL || process.env.SESSIONS_SERVICE_URL;

const PUBLIC_SERVICE_URL =
  process.env.NEXT_PUBLIC_SESSIONS_SERVICE_PUBLIC_URL || process.env.SESSIONS_SERVICE_PUBLIC_URL;

function resolveServiceUrl() {
  if (!IS_BROWSER) return RAW_SERVICE_URL;
  if (IS_PRODUCTION && PUBLIC_SERVICE_URL) return PUBLIC_SERVICE_URL;
  return RAW_SERVICE_URL;
}

export const SESSIONS_SERVICE_URL = resolveServiceUrl();
