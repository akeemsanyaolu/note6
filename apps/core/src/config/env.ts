import { z } from "@hono/zod-openapi";
import {resolveBetterAuthPublicBaseUrl} from "@note6/utils"

const envSchema = z.object({
  DATABASE_URL: z.url(),

   // Vercel (optional; Better Auth base URL on Preview)
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  VERCEL_URL: z
    .string()
    .transform((val: string) =>
      val.startsWith("https://") ? val : `https://${val}`,
    )
    .pipe(z.url())
    .optional(),
  VERCEL_BRANCH_URL: z
    .string()
    .transform((val: string) =>
      val.startsWith("https://") ? val : `https://${val}`,
    )
    .pipe(z.url())
    .optional(),
  VERCEL_GIT_COMMIT_REF: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z
    .string()
    .transform((val: string) =>
      val.startsWith("https://") ? val : `https://${val}`,
    )
    .pipe(z.url())
    .optional(),

  //Better Auth
  BETTER_AUTH_SECRET: z.string().min(16),
  BETTER_AUTH_URL: z.url(),
  /** When set, session cookies are shared across subdomains (e.g. `.note6.com`). */
  
  BETTER_AUTH_COOKIE_DOMAIN: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "staging"]).default("development"),
});

export type EnvConfig = z.infer<typeof envSchema>;

let envConfig: EnvConfig | null = null;

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(result.error.format(), null, 2),
    );
    process.exit(1);
  }

  return result.data;
}

export function getEnv(): EnvConfig {
  if (!envConfig) {
    envConfig = validateEnv();
  }
  return envConfig;
}

export function getBetterAuthPublicBaseUrl(): string {
  const env = getEnv();

  return resolveBetterAuthPublicBaseUrl({
    vercelEnv: env.VERCEL_ENV,
    vercelUrl: env.VERCEL_URL,
    vercelBranchUrl: env.VERCEL_BRANCH_URL,
    vercelProductionUrl: env.VERCEL_PROJECT_PRODUCTION_URL,
    fallbackUrl: env.BETTER_AUTH_URL,
  });
}


