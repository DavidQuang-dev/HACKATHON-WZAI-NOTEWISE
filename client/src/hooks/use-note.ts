import { getNoteById } from "@/services/notes.api";

export function useNoteLogic() {
  const fetchNoteById = async (id: string) => {
    try {
      const data = await getNoteById(id);
      return data.data;
    } catch (err) {
      console.error("Fetch note by ID failed", err);
      return null;
    }
  };

  return {
    fetchNoteById,
  };
}
