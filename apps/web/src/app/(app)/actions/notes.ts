"use server";

import { createNoteSchema, updateNoteSchema } from "@/lib/schemas/note";
import { getSession } from "@/lib/auth/utils";
import { noteService } from "@/lib/services/note.service";
import type {
  CreateNoteInput,
  UpdateNoteInput,
} from "@/lib/services/note.types";

async function getCurrentUserId() {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function listNotesAction() {
  const userId = await getCurrentUserId();
  return noteService.listNotes(userId);
}

export async function createNoteAction(input: CreateNoteInput) {
  const userId = await getCurrentUserId();
  const payload = createNoteSchema.parse(input);

  return noteService.createNote(userId, payload);
}

export async function updateNoteAction(id: string, input: UpdateNoteInput) {
  const userId = await getCurrentUserId();
  const payload = updateNoteSchema.parse({ id, ...input });
  const note = await noteService.updateNote(userId, payload.id, {
    title: payload.title,
    content: payload.content,
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
}

export async function deleteNoteAction(id: string) {
  const userId = await getCurrentUserId();
  const deleted = await noteService.deleteNote(userId, id);

  if (!deleted) {
    throw new Error("Note not found");
  }

  return { success: true as const };
}
