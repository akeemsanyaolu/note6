import { createRoute } from "@hono/zod-openapi";
import { createNoteRepository } from "@note6/database/repositories";

import prisma from "@/lib/db/prisma";
import type { OpenAPIHonoWithAuth } from "@/helpers/app";
import { responses } from "@/helpers/openapi";
import { created } from "@/helpers/responses";
import {
  createNoteBodySchema,
  noteSchema,
  noteSecurity,
  toNoteResponse,
} from "@/schemas/note.schema";

const noteRepository = createNoteRepository(prisma);

const route = createRoute({
  method: "post",
  path: "/",
  tags: ["Notes"],
  summary: "Create a note",
  security: noteSecurity,
  request: {
    body: {
      content: {
        "application/json": {
          schema: createNoteBodySchema,
        },
      },
    },
  },
  responses: {
    ...responses.created(noteSchema),
    ...responses.badRequest,
    ...responses.unauthorized,
  },
});

export const mount = (app: OpenAPIHonoWithAuth) => {
  app.openapi(route, async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");

    const note = await noteRepository.createForUser(userId, body);

    return created(c, toNoteResponse(note));
  });
};
