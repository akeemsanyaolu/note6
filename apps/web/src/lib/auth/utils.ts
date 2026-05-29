import "server-only";

import { auth } from "./auth";

export type Session = typeof auth.$Infer.Session;

export async function getSession(): Promise<Session | null> {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  return session;
}

