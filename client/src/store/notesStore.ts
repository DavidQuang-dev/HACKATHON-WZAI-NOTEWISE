// stores/notes.store.ts

import { create } from "zustand";
import { getAllNotes } from "@/services/notes.api";
import { Note} from "@/types/notes";

interface NotesState {
  // State
  note: Note | null;
  notes: Note[];
  meta: any | null; // Replace 'any' with the actual type of meta if known, e.g., NotesMeta | null
  isLoading: boolean;
  searchQuery: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;

  // Actions
  fetchNotes: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: string) => void;
  setLoading?: (loading: boolean) => void;
  setNote?: (note: Note | null) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  // Initial state
  note: null,
  notes: [],
  meta: null,
  isLoading: false,
  searchQuery: "",
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "DESC",

  // Actions
  fetchNotes: async () => {
    set({ isLoading: true });
    const { page, limit, sortBy, sortOrder, searchQuery } = get();
    try {
      const data = await getAllNotes({
        page,
        limit,
        sortBy,
        sortOrder,
        search: searchQuery,
      });
      set({ notes: data?.data?.pagination ?? [], meta: data?.data?.meta });

    } catch (err) {
      console.error("Fetch notes failed", err);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setNote: (note) => set({ note }),
}));
