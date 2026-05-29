import { OpenAPIHono } from "@hono/zod-openapi";

import { authMiddleware } from "@/middleware/auth";

/**
 * OpenAPIHono router pre-configured with the auth middleware applied to all
 * routes. Use this for any router that exposes protected endpoints so each
 * handler can rely on `c.get("userId")` being set.
 */

export type AppBindings = {
  Variables: {
    userId: string;
  };
};

export class OpenAPIHonoWithAuth extends OpenAPIHono<AppBindings> {
  constructor() {
    super();
    this.use("*", authMiddleware);
  }
}
