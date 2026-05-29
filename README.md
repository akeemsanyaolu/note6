# Note6

Note6 is a pnpm workspace for a small authenticated notes product. It includes a Hono API, a Next.js web app, and shared workspace packages for Prisma/Postgres data access and cross-app utilities.

## Workspace

```text
apps/
  core/       Hono API, Better Auth, OpenAPI docs, notes endpoints
  web/        Next.js app, auth pages, notes dashboard
packages/
  database/   Prisma schema, generated client, note repository
  utils/      Shared helpers used by apps
```

## Tech Stack

- pnpm workspaces
- TypeScript and ESM
- Hono with `@hono/zod-openapi`
- Next.js App Router
- Better Auth with email/password and Google sign-in
- Prisma 7 with PostgreSQL
- Hey API OpenAPI client generation

## Requirements

- Node.js 24.x is recommended for the workspace packages
- pnpm 10.33.0
- PostgreSQL database URL
- Google OAuth credentials if Google sign-in is enabled

## Setup

Install dependencies from the repository root:

```bash
pnpm install
```

Create environment files for the apps. Both apps read the same database and auth credentials during local development.

`apps/core/.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
BETTER_AUTH_SECRET="at-least-16-characters"
BETTER_AUTH_URL="http://localhost:8787"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NODE_ENV="development"
```

`apps/web/.env.local`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_CORE_API_URL="http://localhost:8787"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="at-least-16-characters"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Generate the Prisma client after changing the schema or setting up a fresh checkout:

```bash
pnpm prisma:generate
```

Run migrations against your configured database:

```bash
pnpm prisma:migrate:dev
```

## Development

Start both apps:

```bash
pnpm dev
```

Or run them separately:

```bash
pnpm core:dev
pnpm web:dev
```

Default local URLs:

- API and API reference: http://localhost:8787
- Web app: http://localhost:3000
- API OpenAPI JSON: http://localhost:8787/v1/openapi.json

## Common Scripts

```bash
pnpm dev                    # Run every workspace dev script
pnpm core:dev               # Run the Hono API
pnpm web:dev                # Run the Next.js app
pnpm database:build         # Build the database package
pnpm prisma:generate        # Generate Prisma client code
pnpm prisma:migrate:dev     # Create/apply local Prisma migrations
pnpm prisma:migrate:deploy  # Apply migrations in deploy environments
pnpm prisma:studio          # Open Prisma Studio
pnpm generate:core          # Regenerate the web OpenAPI client from core
```

## API Client Generation

The web app has a generated client under `apps/web/src/lib/clients/generated/core`. To refresh it, start the API first so `http://localhost:8787/v1/openapi.json` is available, then run:

```bash
pnpm generate:core
```

## App READMEs

- [Core API](apps/core/README.md)
- [Web App](apps/web/README.md)
- [Database Package](packages/database/README.md)
