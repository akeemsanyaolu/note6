import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { jwt, oAuthProxy, openAPI } from "better-auth/plugins";

import prisma from "@/lib/db/prisma";
import { getEnv } from "@/config/env.js";

const betterAuthCookiePrefix = "note6";

const env = getEnv();

export const auth = betterAuth({
  appName: "Note6",
  advanced: {
    database: {
      generateId: "uuid",
    },
    cookiePrefix: betterAuthCookiePrefix,
    ...(env.BETTER_AUTH_COOKIE_DOMAIN
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: env.BETTER_AUTH_COOKIE_DOMAIN,
          },
        }
      : {}),
    ipAddress: {
      ipAddressHeaders: ["x-vercel-forwarded-for", "x-forwarded-for"],
    },
  },
  experimental: {
    joins: true,
  },
  session: {
    storeSessionInDatabase: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/auth",
  rateLimit: {
    storage: "database",
  },
  trustedOrigins: [
    ...(env.NODE_ENV === "development" ? ["http://localhost:*"] : []),
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    openAPI(),
    oAuthProxy({
      productionURL: env.BETTER_AUTH_URL,
    }),
  ],
});
