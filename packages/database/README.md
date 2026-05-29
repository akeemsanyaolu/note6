# Note6 Database Package

`@note6/database` owns the Note6 Prisma schema, generated Prisma client, and shared repository code. Apps use this package instead of duplicating database access logic.

## Responsibilities

- Define the PostgreSQL Prisma schema for auth and notes data
- Generate the Prisma client into `src/generated/prisma`
- Export Prisma model/client types from the package root
- Provide a `createPrismaClient` factory for PostgreSQL connections
- Provide repository helpers, including the note repository used by both apps

## Requirements

- Node.js 24.x
- pnpm 10.33.0
- PostgreSQL database URL

## Environment

Prisma reads `DATABASE_URL` from the package environment:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

When running commands from the repository root, the root scripts filter into this package and use the same Prisma config.

## Schema

The schema lives at:

```text
prisma/schema.prisma
```

Current models:

- `User`
- `Session`
- `Account`
- `Verification`
- `Note`

The auth models support Better Auth. `Note` records belong to a user and are indexed by `userId`.

## Package Exports

```ts
import type { Note, PrismaClient } from "@note6/database";
import { createPrismaClient } from "@note6/database/client";
import { createNoteRepository } from "@note6/database/repositories";
```

Available exports:

- `@note6/database` - generated Prisma client types plus repositories
- `@note6/database/client` - `createPrismaClient(databaseUrl)`
- `@note6/database/repositories` - repository factories

## Repository Usage

```ts
import { createNoteRepository } from "@note6/database/repositories";

const noteRepository = createNoteRepository(prisma);

const notes = await noteRepository.listByUserId(userId);
const note = await noteRepository.createForUser(userId, {
  title: "Meeting notes",
  content: "Follow up next week.",
});
```

The note repository scopes reads and writes by `userId` so callers can enforce per-user data access.

## Scripts

From this package directory:

```bash
pnpm build             # Compile TypeScript to dist
pnpm prisma:generate   # Generate Prisma client code
pnpm test              # Placeholder test script
```

From the repository root:

```bash
pnpm database:build         # Build this package
pnpm prisma:generate        # Generate Prisma client code
pnpm prisma:migrate:dev     # Create/apply local migrations
pnpm prisma:migrate:deploy  # Apply migrations in deploy environments
pnpm prisma:migrate:reset   # Reset the configured database
pnpm prisma:studio          # Open Prisma Studio
```

## Development Notes

After editing `prisma/schema.prisma`, regenerate the Prisma client:

```bash
pnpm prisma:generate
```

If the schema change needs a migration, create and apply it locally:

```bash
pnpm prisma:migrate:dev
```

Build this package before relying on `dist` exports in compiled app builds:

```bash
pnpm database:build
```
