import "dotenv/config";

import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono'
import type { RequestIdVariables } from "hono/request-id";
import authRouter from '@/routes/auth/index';
import apiV1 from '@/routes/v1/index';
import { getBetterAuthPublicBaseUrl, validateEnv } from '@/config/env';

validateEnv();

const faviconUrl = `${getBetterAuthPublicBaseUrl()}/favicon.ico`;

const mainApp = new Hono()

const app = new OpenAPIHono<{
  Variables: RequestIdVariables;
}>();

app.route("/auth", authRouter);
app.route("/v1", apiV1);

app.get(
  "/",
  Scalar({
    pageTitle: "Note6 API Documentation",
    favicon: faviconUrl,
    sources: [
      { url: "/v1/openapi.json", title: "v1" },
      { url: "/auth/open-api/generate-schema", title: "Better Auth" },
    ],
    persistAuth: true,
    hideClientButton: true,
    defaultOpenAllTags: true,
    layout: "modern",
    theme: "saturn",
  }),
);

mainApp.route("/", app);

serve({
  fetch: mainApp.fetch,
  port: 8787
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
