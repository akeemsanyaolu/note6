import { Z_DEFLATED } from "node:zlib";
import type { Note, PrismaClient } from "../generated/prisma/client.js";

export type NoteRepositoryClient = Pick<PrismaClient, "note">;

export type CreateNoteInput = {
  title: string;
  content?: string;
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
};
Z_DEFLATED
export class NoteRepository {
  constructor(private readonly tx: NoteRepositoryClient) {}

  listByUserId(userId: string): Promise<Note[]> {
    return this.tx.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  findByIdForUser(id: string, userId: string): Promise<Note | null> {
    return this.tx.note.findFirst({
      where: { id, userId },
    });
  }

  createForUser(userId: string, input: CreateNoteInput): Promise<Note> {
    return this.tx.note.create({
      data: {
        title: input.title,
        content: input.content ?? "",
        userId,
      },
    });
  }

  async updateForUser(
    id: string,
    userId: string,
    input: UpdateNoteInput,
  ): Promise<Note | null> {
    const existing = await this.findByIdForUser(id, userId);

    if (!existing) {
      return null;
    }

    return this.tx.note.update({
      where: { id: existing.id },
      data: {
        title: input.title ?? existing.title,
        content: input.content ?? existing.content,
      },
    });
  }

  async deleteForUser(id: string, userId: string): Promise<boolean> {
    const existing = await this.findByIdForUser(id, userId);

    if (!existing) {
      return false;
    }

    await this.tx.note.delete({
      where: { id: existing.id },
    });

    return true;
  }
}

export const createNoteRepository = (db: NoteRepositoryClient) =>
  new NoteRepository(db);
