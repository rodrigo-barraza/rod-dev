import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Catch-all API proxy route for sessions-service.
 *
 * All requests to /api/sessions/* are forwarded to the sessions-service
 * backend. This keeps the sessions-service internal (no public domain)
 * while allowing the client to reach it through the Next.js server.
 *
 * The proxy also forwards the client's IP address via x-forwarded-for
 * so the sessions-service can perform accurate IP geolocation.
 */

import { SESSIONS_SERVICE_URL } from "@/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { path } = req.query;
    const segments = Array.isArray(path) ? path.join("/") : path || "";
    const queryString = new URLSearchParams(
      req.query as Record<string, string>,
    );
    // Remove the path param used by Next.js routing
    queryString.delete("path");
    const qs = queryString.toString();
    const url = `${SESSIONS_SERVICE_URL}/${segments}${qs ? `?${qs}` : ""}`;

    // Forward the client's real IP
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (clientIp) {
      headers["x-forwarded-for"] = clientIp;
      headers["x-real-ip"] = clientIp;
    }

    // Forward user-agent so sessions-service can parse browser/OS/device
    const userAgent = req.headers["user-agent"] as string;
    if (userAgent) {
      headers["user-agent"] = userAgent;
    }

    // Forward session ID header if present
    const sessionId = req.headers["x-session-id"] as string;
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    // Forward accept-language for locale detection
    const acceptLanguage = req.headers["accept-language"] as string;
    if (acceptLanguage) {
      headers["accept-language"] = acceptLanguage;
    }

    const fetchOptions: RequestInit = {
      method: req.method || "GET",
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Proxy error";
    res.status(502).json({ error: true, message });
  }
}
