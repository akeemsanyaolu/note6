import { resolveCorsAllowOrigin } from "@/config/cors-allow-origin";
import { TIME } from "@/config/constants";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import noteRouter from "./notes/index";
import type { AppBindings } from "@/helpers/app";

const app = new OpenAPIHono<AppBindings>();

app.openAPIRegistry.registerComponent("securitySchemes", "sessionCookie", {
  type: "apiKey",
  in: "cookie",
  // Better Auth: typically "<cookiePrefix>.session_token"; prefix is env-specific
  // (e.g. from resolveBetterAuthCookiePrefix in @note6/utils).
  name: "note6.session_token",
  description:
    "Better Auth session cookie. Send with requests (e.g. browser credentials: include). Cookie name varies by environment.",
});

app.use(
  "*",
  cors({
    origin: (origin) => resolveCorsAllowOrigin(origin),
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: TIME.CORS_MAX_AGE,
    credentials: true,
  }),
);

app.doc31("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "Notes6 API",
    version: "1.0.0",
  },
  tags: [{ name: "Health" }, { name: "Auth" }, { name: "Notes" }],
  servers: [
    {
      url: "/v1",
      description: "Local Notes6 API server",
    },
  ],
  security: [{sessionCookie: []}]
});

app.route("/notes", noteRouter)

export default app;