import * as z from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().max(20000).default(""),
});

export const updateNoteSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().max(20000),
});

export const listNotesQuerySchema = z.object({
  search: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateNoteSchemaType = z.infer<typeof createNoteSchema>;
export type UpdateNoteSchemaType = z.infer<typeof updateNoteSchema>;
export type ListNotesQuerySchemaType = z.infer<typeof listNotesQuerySchema>;
