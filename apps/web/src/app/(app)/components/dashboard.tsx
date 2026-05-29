"use client";

import { FileText, Loader2, Plus, Save, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NoteView } from "@/lib/services/note.types";
import { cn } from "@/lib/utils";
import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "../actions/notes";

type Draft = {
  id?: string;
  title: string;
  content: string;
};

const emptyDraft: Draft = {
  title: "",
  content: "",
};

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getPreview(content: string) {
  const preview = content.trim().replace(/\s+/g, " ");
  return preview || "No content yet.";
}

type DashboardProps = {
  initialNotes: NoteView[];
};

export function Dashboard({ initialNotes }: DashboardProps) {
  const [notes, setNotes] = useState<NoteView[]>(initialNotes);
  const [draft, setDraft] = useState<Draft>(initialNotes[0] ?? emptyDraft);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return notes;
    }

    return notes.filter((note) => {
      return `${note.title} ${note.content}`.toLowerCase().includes(normalizedQuery);
    });
  }, [notes, query]);

  const selectedNote = draft.id
    ? notes.find((note) => note.id === draft.id)
    : undefined;

  function selectNote(note: NoteView) {
    setDraft({
      id: note.id,
      title: note.title,
      content: note.content,
    });
  }

  function createDraft() {
    setDraft(emptyDraft);
  }

  async function saveDraft() {
    const title = draft.title.trim();
    const content = draft.content.trim();

    if (!title) {
      setError("Add a title before saving.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      if (draft.id) {
        const updatedNote = await updateNoteAction(draft.id, {
          title,
          content,
        });

        setNotes((currentNotes) =>
          currentNotes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note,
          ),
        );
        setDraft({
          id: updatedNote.id,
          title: updatedNote.title,
          content: updatedNote.content,
        });
        return;
      }

      const createdNote = await createNoteAction({
        title,
        content,
      });

      setNotes((currentNotes) => [createdNote, ...currentNotes]);
      setDraft({
        id: createdNote.id,
        title: createdNote.title,
        content: createdNote.content,
      });
    } catch {
      setError("Unable to save note.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteDraft() {
    if (!draft.id) {
      setDraft(emptyDraft);
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await deleteNoteAction(draft.id);

      setNotes((currentNotes) => {
        const nextNotes = currentNotes.filter((note) => note.id !== draft.id);
        const nextDraft = nextNotes[0] ?? emptyDraft;
        setDraft(nextDraft);
        return nextNotes;
      });
    } catch {
      setError("Unable to delete note.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="border border-white/15 bg-black">
        <div className="border-b border-white/15 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
              <p className="mt-1 text-sm text-zinc-500">{notes.length} notes</p>
            </div>
            <Button onClick={createDraft} type="button">
              <Plus className="size-4" />
              New
            </Button>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              className="pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              value={query}
            />
          </div>
        </div>

        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-sm text-zinc-500">
              {query ? "No matching notes." : "No notes yet."}
            </div>
          ) : null}

          {filteredNotes.map((note) => (
            <button
              className={cn(
                "block w-full border-b border-white/10 p-4 text-left transition-colors hover:bg-white/[0.04]",
                draft.id === note.id && "bg-white/[0.08]",
              )}
              key={note.id}
              onClick={() => selectNote(note)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="line-clamp-1 text-sm font-medium text-white">
                  {note.title}
                </h2>
                <span className="shrink-0 text-xs text-zinc-500">
                  {formatDate(note.updatedAt)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                {getPreview(note.content)}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <section className="relative overflow-hidden border border-white/15 bg-black shadow-[0_24px_80px_rgba(255,255,255,0.04)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.07),transparent_42%)]" />
        <div className="relative flex min-h-full flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 p-4">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <FileText className="size-4" />
              {selectedNote ? `Updated ${formatDate(selectedNote.updatedAt)}` : "New note"}
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={isDeleting}
                onClick={deleteDraft}
                type="button"
                variant="secondary"
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Delete
              </Button>
              <Button disabled={isSaving} onClick={saveDraft} type="button">
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save
              </Button>
            </div>
          </div>

          {error ? (
            <p className="relative border-b border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <div className="relative flex flex-1 flex-col gap-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    title: event.target.value,
                  }))
                }
                placeholder="Untitled note"
                value={draft.title}
              />
            </div>

            <div className="flex flex-1 flex-col space-y-2">
              <Label htmlFor="note-content">Content</Label>
              <textarea
                className="min-h-[420px] flex-1 resize-none border border-white/25 bg-black p-3 text-base leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-white"
                id="note-content"
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    content: event.target.value,
                  }))
                }
                placeholder="Write something..."
                value={draft.content}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
