import { getQuizById } from "@/services/quiz.api";


export function useNoteLogic() {
  const fetchQuizById = async (id: string) => {
    try {
      const data = await getQuizById(id);
      return data.data;
    } catch (err) {
      console.error("Fetch note by ID failed", err);
      return null;
    }
  };

  return {
    fetchQuizById,
  };
}
