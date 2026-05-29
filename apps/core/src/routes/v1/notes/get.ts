import { createRoute } from "@hono/zod-openapi";
import { createNoteRepository } from "@note6/database/repositories";

import prisma from "@/lib/db/prisma";
import type { OpenAPIHonoWithAuth } from "@/helpers/app";
import { responses } from "@/helpers/openapi";
import { ok } from "@/helpers/responses";
import {
  noteSecurity,
  notesSchema,
  toNoteResponse,
} from "@/schemas/note.schema";

const noteRepository = createNoteRepository(prisma);

const route = createRoute({
  method: "get",
  path: "/",
  tags: ["Notes"],
  summary: "List current user notes",
  security: noteSecurity,
  responses: {
    ...responses.ok(notesSchema),
    ...responses.unauthorized,
  },
});

export const mount = (app: OpenAPIHonoWithAuth) => {
  app.openapi(route, async (c) => {
    const userId = c.get("userId");
    const notes = await noteRepository.listByUserId(userId);
    return ok(c, notes.map(toNoteResponse));
  });
};
