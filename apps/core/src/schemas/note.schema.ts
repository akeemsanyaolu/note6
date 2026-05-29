import { z } from "@hono/zod-openapi";

export type NoteRecord = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteResponse = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export const noteSchema = z
  .object({
    id: z.uuid(),
    title: z.string(),
    content: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi("Note");

export const notesSchema = z.array(noteSchema).openapi("NotesList");

export const noteIdParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: { name: "id", in: "path" },
      example: "00000000-0000-0000-0000-000000000000",
    }),
});

export const createNoteBodySchema = z
  .object({
    title: z.string().min(1).max(200),
    content: z.string().max(20000).default(""),
  })
  .openapi("CreateNoteBody");

export const updateNoteBodySchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().max(20000).optional(),
  })
  .refine((value) => value.title !== undefined || value.content !== undefined, {
    message: "At least one field must be provided.",
  })
  .openapi("UpdateNoteBody");

export const deleteNoteResponseSchema = z
  .object({
    success: z.literal(true),
  })
  .openapi("DeleteNoteResponse");

export const noteSecurity: Array<Record<string, string[]>> = [
  { bearerAuth: [] },
  { cookieAuth: [] },
];

export const toNoteResponse = (note: NoteRecord): NoteResponse => ({
  id: note.id,
  title: note.title,
  content: note.content,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
});
