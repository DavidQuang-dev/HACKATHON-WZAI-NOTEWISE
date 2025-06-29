import { getQuizById } from "@/services/quiz.api";
import { useQuizStore } from "@/store/quizStore";


export function useNoteLogic() {

  const {setQuestions, setQuizTitle} = useQuizStore();

  const fetchQuizById = async (id: string) => {
    try {
      const data = await getQuizById(id);

      setQuestions(data.data?.questions);
      setQuizTitle(data.data?.name_vi)
    } catch (err) {
      console.error("Fetch note by ID failed", err);
      return null;
    }
  };

  return {
    fetchQuizById,
  };
}
