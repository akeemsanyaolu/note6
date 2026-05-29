# Note6 Core API

`apps/core` is the Note6 API service. It runs on Hono, serves Better Auth under `/auth`, exposes notes routes under `/v1/notes`, and publishes OpenAPI documentation through Scalar at the API root.

## Responsibilities

- Validate required runtime environment variables on startup
- Mount Better Auth routes at `/auth`
- Serve versioned API routes at `/v1`
- Generate OpenAPI 3.1 docs at `/v1/openapi.json`
- Protect note CRUD endpoints with the Better Auth session cookie
- Use the shared `@note6/database` Prisma repository layer

## Requirements

- Node.js 24.x is recommended
- pnpm 10.33.0
- PostgreSQL database URL
- Better Auth secret and URL
- Google OAuth client credentials

## Environment

Create `apps/core/.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
BETTER_AUTH_SECRET="at-least-16-characters"
BETTER_AUTH_URL="http://localhost:8787"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NODE_ENV="development"
```

Optional deployment-related variables:

```bash
BETTER_AUTH_COOKIE_DOMAIN=".example.com"
VERCEL_ENV="preview"
VERCEL_URL="..."
VERCEL_BRANCH_URL="..."
VERCEL_GIT_COMMIT_REF="..."
VERCEL_PROJECT_PRODUCTION_URL="..."
```

## Development

From the repository root:

```bash
pnpm core:dev
```

Or from this app directory:

```bash
pnpm dev
```

The API starts on http://localhost:8787.

## Endpoints

- `GET /` - Scalar API reference
- `GET /v1/openapi.json` - OpenAPI schema for v1 routes
- `/auth/*` - Better Auth handlers and auth OpenAPI schema
- `GET /v1/notes` - list the current user's notes
- `POST /v1/notes` - create a note
- `GET /v1/notes/:id` - get one note
- `PATCH /v1/notes/:id` - update a note
- `DELETE /v1/notes/:id` - delete a note

## Scripts

```bash
pnpm dev      # Run the API with tsx watch
pnpm build    # Compile TypeScript to dist
pnpm start    # Run the compiled server
```

## Notes

The service depends on the generated Prisma client from `packages/database`. If Prisma schema or generated client files are missing or stale, run this from the repository root:

```bash
pnpm prisma:generate
```
