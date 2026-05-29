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
  updateNoteBodySchema,
} from "@/schemas/note.schema";

const noteRepository = createNoteRepository(prisma);

const route = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Notes"],
  summary: "Update a note by id",
  security: noteSecurity,
  request: {
    params: noteIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateNoteBodySchema,
        },
      },
    },
  },
  responses: {
    ...responses.ok(noteSchema),
    ...responses.badRequest,
    ...responses.unauthorized,
    ...responses.notFound,
  },
});

export const mount = (app: OpenAPIHonoWithAuth) => {
  app.openapi(route, async (c) => {
    const userId = c.get("userId");
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const updated = await noteRepository.updateForUser(id, userId, body);

    if (!updated) {
      throw notFound("Note not found.");
    }

    return ok(c, toNoteResponse(updated));
  });
};
