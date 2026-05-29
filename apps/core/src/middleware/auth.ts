import { createMiddleware } from "hono/factory";
import { auth } from "../lib/auth.js";

export const authMiddleware = createMiddleware(async (c, next) => {
  const headers = new Headers(c.req.raw.headers);
  const authorization = headers.get("authorization");

  const session = await auth.api.getSession({
    headers,
  });

  if (!session && authorization) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid bearer token.",
        },
      },
      401
    );
  }

  if (!session) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        },
      },
      401
    );
  }

  c.set("userId", session.user.id);
  await next();
});
