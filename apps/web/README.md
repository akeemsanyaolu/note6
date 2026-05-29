# Note6 Web App

`apps/web` is the Note6 Next.js app. It provides auth screens, a signed-in notes dashboard, server actions for note mutations, and a generated API client for the Hono core API.

## Responsibilities

- Render the public auth flow and protected dashboard
- Manage local note create, read, update, delete interactions
- Use Better Auth for email/password and Google sign-in
- Read and validate runtime environment variables with Zod
- Generate typed core API client code from `apps/core` OpenAPI

## Requirements

- Node.js 24.x is recommended
- pnpm 10.33.0
- The core API running at `NEXT_PUBLIC_CORE_API_URL`
- PostgreSQL database URL for Better Auth and server-side data access

## Environment

Create `apps/web/.env.local`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_CORE_API_URL="http://localhost:8787"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="at-least-16-characters"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

`NEXT_PUBLIC_CORE_API_URL` defaults to `http://localhost:8787` when omitted.

## Development

From the repository root:

```bash
pnpm web:dev
```

Or from this app directory:

```bash
pnpm dev
```

Open http://localhost:3000.

For the full local stack, run the core API and web app together from the repository root:

```bash
pnpm dev
```

## App Structure

```text
src/app/(auth)/       Sign-in, sign-up, and auth layout routes
src/app/(app)/        Protected app shell and notes dashboard
src/app/api/auth/     Better Auth Next route handler
src/components/       Shared UI and app chrome
src/lib/auth/         Better Auth client/server helpers
src/lib/services/     Server-side note service
src/lib/clients/      Generated core API client
src/config/           Environment validation
```

## Scripts

```bash
pnpm dev            # Start Next.js in development
pnpm build          # Build the production app
pnpm start          # Start the production server
pnpm lint           # Run ESLint
pnpm generate:core  # Regenerate the typed core API client
```

## Regenerate the Core API Client

Start the core API first so the OpenAPI schema is available:

```bash
pnpm --filter core dev
```

Then generate the client:

```bash
pnpm generate:core
```

The generated files are written to `src/lib/clients/generated/core`.
