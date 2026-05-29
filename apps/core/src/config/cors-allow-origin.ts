import { getEnv } from "@/config/env";

/**
 * Echo value for `Access-Control-Allow-Origin` when the browser `Origin` is allowed,
 * or `null` to omit the header (disallowed).
 *
 * - Production/staging: `https:` origins whose host is `note6-web.vercel.app`.
 * - Development (`NODE_ENV=development`): also allows `http:` / `https:` `localhost` (any port).
 */
export function resolveCorsAllowOrigin(requestOrigin: string): string | null {
  if (!requestOrigin) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(requestOrigin);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();

  if (host === "note6-web.vercel.app") {
    if (url.protocol !== "https:") {
      return null;
    }
    return requestOrigin;
  }

  if (getEnv().NODE_ENV === "development" && host === "localhost") {
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return requestOrigin;
  }

  return null;
}
