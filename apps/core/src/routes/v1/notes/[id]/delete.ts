import { createRoute } from "@hono/zod-openapi";
import { createNoteRepository } from "@note6/database/repositories";

import prisma from "@/lib/db/prisma";
import type { OpenAPIHonoWithAuth } from "@/helpers/app";
import { notFound } from "@/helpers/errors";
import { responses } from "@/helpers/openapi";
import { ok } from "@/helpers/responses";
import {
  deleteNoteResponseSchema,
  noteIdParamsSchema,
  noteSecurity,
} from "@/schemas/note.schema";

const noteRepository = createNoteRepository(prisma);

const route = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Notes"],
  summary: "Delete a note by id",
  security: noteSecurity,
  request: {
    params: noteIdParamsSchema,
  },
  responses: {
    ...responses.ok(deleteNoteResponseSchema),
    ...responses.unauthorized,
    ...responses.notFound,
  },
});

export const mount = (app: OpenAPIHonoWithAuth) => {
  app.openapi(route, async (c) => {
    const userId = c.get("userId");
    const { id } = c.req.valid("param");

    const deleted = await noteRepository.deleteForUser(id, userId);

    if (!deleted) {
      throw notFound("Note not found.");
    }

    return ok(c, { success: true as const });
  });
};
