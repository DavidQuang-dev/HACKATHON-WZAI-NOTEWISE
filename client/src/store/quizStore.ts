import { submitQuiz } from "@/services/quiz.api";
import { create } from "zustand";

export interface Answer {
  id: string;
  name_vi: string;
  name_en: string;
  questionId: string;
}

export interface Question {
  id: string;
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  ordering: number;
  hint: string;
  answers: Answer[];
}

export interface QuizAnswer {
  questionId: string;
  answerId: string;
  selectedOption: number;
}

export interface QuizResult {
  id: number;
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  quizAuditId: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
}

interface QuizState {
  // Quiz data
  questions: Question[];
  quizTitle: string;
  quizId?: string; // Optional, if you need to track the quiz ID
  // Current state
  currentQuestionIndex: number;
  selectedAnswer: string;
  showHint: boolean;
  isComplete: boolean;
  isSubmitting: boolean;

  // Results
  answers: QuizAnswer[];
  results: QuizResult[];
  score: number;

  // Actions
  setQuestions: (questions: Question[]) => void;
  setQuizTitle: (title: string) => void;
  setQuizId: (id: string) => void; // Optional setter for quiz ID

  setSelectedAnswer: (answer: string) => void;
  toggleHint: () => void;
  saveAnswer: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => Promise<void>;
  retakeQuiz: () => void;
  completeQuiz: () => void;

  // Getters
  getCurrentQuestion: () => Question | null;
  getProgress: () => number;
  getScorePercentage: () => number;
  getTotalQuestions: () => number;
  getCorrectAnswers: () => number;
  getIncorrectAnswers: () => number;
  isLastQuestion: () => boolean;
  hasAnsweredCurrentQuestion: () => boolean;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  questions: [],
  quizTitle: "",
  quizId: "", // Optional quiz ID
  currentQuestionIndex: 0,
  selectedAnswer: "",
  showHint: false,
  isComplete: false,
  isSubmitting: false,
  answers: [],
  results: [],
  score: 0,

  // Actions
  setQuestions: (questions) => set({ questions }),

  setQuizTitle: (title) => set({ quizTitle: title }),

  setQuizId: (id) => set({ quizId: id }), // Optional setter for quiz ID

  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),

  toggleHint: () => set((state) => ({ showHint: !state.showHint })),

  saveAnswer: () => {
    const state = get();
    const currentQuestion = state.getCurrentQuestion();

    if (!currentQuestion || !state.selectedAnswer) return;

    const selectedOptionIndex = parseInt(state.selectedAnswer);
    const selectedAnswerId = currentQuestion.answers[selectedOptionIndex]?.id;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answerId: selectedAnswerId,
      selectedOption: selectedOptionIndex,
    };

    // Remove existing answer for this question if any
    const filteredAnswers = state.answers.filter(
      (answer) => answer.questionId !== currentQuestion.id
    );

    set({
      answers: [...filteredAnswers, newAnswer],
      selectedAnswer: "",
      showHint: false,
    });

    // Auto advance to next question
    if (!state.isLastQuestion()) {
      state.nextQuestion();
    }
  },

  submitQuiz: async () => {
    const state = get();

    if (state.answers.length !== state.questions.length) {
      console.error("Not all questions answered");
      return;
    }

    set({ isSubmitting: true });

    try {
      // Import your service at the top: import { submitQuiz } from 'path/to/service';
      // Prepare payload for the service
      const payload = {
        quizId: "", // Set quizId if available in your state or props
        questions: state.answers.map((a) => ({
          questionId: a.questionId,
          answerId: a.answerId,
        })),
      };

      const result = await submitQuiz(payload);
      const quizResults: QuizResult[] = result.results;
      const score = quizResults.filter((r) => r.isCorrect).length;

      set({
        results: quizResults,
        score,
        isSubmitting: false,
        isComplete: true,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      set({ isSubmitting: false });
      // Handle error appropriately - could show toast or error message
    }
  },

  nextQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex < state.questions.length - 1) {
      const nextIndex = state.currentQuestionIndex + 1;
      const existingAnswer = state.answers.find(
        (answer) => answer.questionId === state.questions[nextIndex].id
      );

      set({
        currentQuestionIndex: nextIndex,
        selectedAnswer: existingAnswer
          ? existingAnswer.selectedOption.toString()
          : "",
        showHint: false,
      });
    }
  },

  previousQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex > 0) {
      const prevIndex = state.currentQuestionIndex - 1;
      const existingAnswer = state.answers.find(
        (answer) => answer.questionId === state.questions[prevIndex].id
      );

      set({
        currentQuestionIndex: prevIndex,
        selectedAnswer: existingAnswer
          ? existingAnswer.selectedOption.toString()
          : "",
        showHint: false,
      });
    }
  },

  retakeQuiz: () =>
    set({
      currentQuestionIndex: 0,
      selectedAnswer: "",
      showHint: false,
      isComplete: false,
      answers: [],
      results: [],
      score: 0,
    }),

  completeQuiz: () => set({ isComplete: true }),

  // Getters
  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.currentQuestionIndex] || null;
  },

  getProgress: () => {
    const state = get();
    return state.questions.length > 0
      ? (state.answers.length / state.questions.length) * 100
      : 0;
  },

  getScorePercentage: () => {
    const state = get();
    return state.questions.length > 0
      ? Math.round((state.score / state.questions.length) * 100)
      : 0;
  },

  getTotalQuestions: () => get().questions.length,

  getCorrectAnswers: () => get().score,

  getIncorrectAnswers: () => {
    const state = get();
    return state.questions.length - state.score;
  },

  isLastQuestion: () => {
    const state = get();
    return state.currentQuestionIndex === state.questions.length - 1;
  },

  hasAnsweredCurrentQuestion: () => {
    const state = get();
    const currentQuestion = state.getCurrentQuestion();
    return currentQuestion
      ? state.answers.some((answer) => answer.questionId === currentQuestion.id)
      : false;
  },
}));
