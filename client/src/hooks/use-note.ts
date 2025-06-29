import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import { getNoteById } from "@/services/notes.api";
import { useNotesStore } from "@/store/notesStore";

dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.extend(timezone);

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
