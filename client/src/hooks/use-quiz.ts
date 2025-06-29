import {
  getQuizById,
  submitQuiz as submitQuizService,
} from "@/services/quiz.api";
import { QuizResult, useQuizStore } from "@/store/quizStore";

export function useQuizLogic() {
  const { setQuestions, setQuizTitle } = useQuizStore();

  const fetchQuizById = async (id: string) => {
    try {
      const data = await getQuizById(id);

      setQuestions(data.data?.questions);
      setQuizTitle(data.data?.name_vi);
    } catch (err) {
      console.error("Fetch note by ID failed", err);
      return null;
    }
  };

  const submitQuiz = async () => {
    const state = useQuizStore.getState();

    if (state.answers.length !== state.questions.length) {
      console.error("Not all questions answered");
      return;
    }

    useQuizStore.setState({ isSubmitting: true });

    try {
      // Import your service at the top: import { submitQuiz as submitQuizService } from '@/services/quiz.api';
      const payload: {
        quizId: string;
        questions: { questionId: string; answerId: string }[];
      } = {
        quizId: state.quizId ?? "",
        questions: state.answers.map((a) => ({
          questionId: a.questionId,
          answerId: a.answerId,
        })),
      };

      const result = await submitQuizService(payload);

      const quizResults: QuizResult[] = result.data.questionAudits;
      const score = result.data?.score;

      useQuizStore.setState({
        results: quizResults,
        score,
        isSubmitting: false,
        isComplete: true,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      useQuizStore.setState({ isSubmitting: false });
    }
  };

  return {
    fetchQuizById,
    submitQuiz,
  };
}
