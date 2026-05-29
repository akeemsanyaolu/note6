import { createRoute } from "@hono/zod-openapi";
import { createNoteRepository } from "@note6/database/repositories";

import prisma from "@/lib/db/prisma";
import type { OpenAPIHonoWithAuth } from "@/helpers/app";
import { notFound } from "@/helpers/errors";
import { responses } from "@/helpers/openapi";
import { ok } from "@/helpers/responses";
import {
  noteIdParamsSchema,
  noteSchema,
  noteSecurity,
  toNoteResponse,
} from "@/schemas/note.schema";

const noteRepository = createNoteRepository(prisma);

const route = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Notes"],
  summary: "Get a note by id",
  security: noteSecurity,
  request: {
    params: noteIdParamsSchema,
  },
  responses: {
    ...responses.ok(noteSchema),
    ...responses.unauthorized,
    ...responses.notFound,
  },
});

export const mount = (app: OpenAPIHonoWithAuth) => {
  app.openapi(route, async (c) => {
    const userId = c.get("userId");
    const { id } = c.req.valid("param");

    const note = await noteRepository.findByIdForUser(id, userId);

    if (!note) {
      throw notFound("Note not found.");
    }

    return ok(c, toNoteResponse(note));
  });
};
