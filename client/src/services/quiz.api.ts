import api from "@/lib/api";

export const getQuizById = async (id: string) => {
  const res = await api.get(`/quiz/${id}`);
  return res.data;
};

export const submitQuiz = async (payload: {
  quizId: string;
  questions: { questionId: string; answerId: string }[];
}) => {
  const res = await api.post("/quiz-audit", payload);
  return res.data;
};
