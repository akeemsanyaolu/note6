import "server-only";

import { createNoteRepository } from "@note6/database/repositories";
import type { Note } from "@note6/database";

import prisma from "@/lib/db/prisma";
import type {
  CreateNoteInput,
  NoteView,
  UpdateNoteInput,
} from "@/lib/services/note.types";

const noteRepository = createNoteRepository(prisma);

function toNoteView(note: Note): NoteView {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export class NoteService {
  async listNotes(userId: string): Promise<NoteView[]> {
    const notes = await noteRepository.listByUserId(userId);
    return notes.map(toNoteView);
  }

  async createNote(
    userId: string,
    input: CreateNoteInput,
  ): Promise<NoteView> {
    const note = await noteRepository.createForUser(userId, input);
    return toNoteView(note);
  }

  async updateNote(
    userId: string,
    id: string,
    input: UpdateNoteInput,
  ): Promise<NoteView | null> {
    const note = await noteRepository.updateForUser(id, userId, input);
    return note ? toNoteView(note) : null;
  }

  async deleteNote(userId: string, id: string): Promise<boolean> {
    return noteRepository.deleteForUser(id, userId);
  }
}

export const noteService = new NoteService();
