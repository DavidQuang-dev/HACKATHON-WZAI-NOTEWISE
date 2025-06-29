import { create } from 'zustand';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  hint: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

interface QuizState {
  // Quiz data
  questions: Question[];
  quizTitle: string;
  
  // Current state
  currentQuestionIndex: number;
  selectedAnswer: string;
  showHint: boolean;
  isComplete: boolean;
  
  // Results
  answers: QuizAnswer[];
  score: number;
  
  // Actions
  setQuestions: (questions: Question[]) => void;
  setQuizTitle: (title: string) => void;
  setSelectedAnswer: (answer: string) => void;
  toggleHint: () => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  retakeQuiz: () => void;
  completeQuiz: () => void;
  
  // Getters
  getCurrentQuestion: () => Question | null;
  getProgress: () => number;
  getScorePercentage: () => number;
  getTotalQuestions: () => number;
  getCorrectAnswers: () => number;
  getIncorrectAnswers: () => number;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  questions: [
    {
      id: '1',
      question: "What is the main topic of this chapter?",
      options: [
        "Introduction to Calculus",
        "Limits and Continuity", 
        "Derivatives and Applications",
        "Integrals and Techniques",
      ],
      correct: 0,
      hint: "Think about what the chapter title suggests",
    },
  ],
  quizTitle: "Lecture 1: Introduction to Psychology",
  currentQuestionIndex: 0,
  selectedAnswer: "",
  showHint: false,
  isComplete: false,
  answers: [],
  score: 0,
  
  // Actions
  setQuestions: (questions) => set({ questions }),
  
  setQuizTitle: (title) => set({ quizTitle: title }),
  
  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
  
  toggleHint: () => set((state) => ({ showHint: !state.showHint })),
  
  submitAnswer: () => {
    const state = get();
    const currentQuestion = state.getCurrentQuestion();
    
    if (!currentQuestion || !state.selectedAnswer) return;
    
    const selectedOptionIndex = parseInt(state.selectedAnswer);
    const isCorrect = selectedOptionIndex === currentQuestion.correct;
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOption: selectedOptionIndex,
      isCorrect,
    };
    
    const updatedAnswers = [...state.answers, newAnswer];
    const newScore = updatedAnswers.filter(answer => answer.isCorrect).length;
    
    set({
      answers: updatedAnswers,
      score: newScore,
      selectedAnswer: "",
      showHint: false,
    });
    
    // Auto advance to next question or complete quiz
    if (state.currentQuestionIndex < state.questions.length - 1) {
      state.nextQuestion();
    } else {
      state.completeQuiz();
    }
  },
  
  nextQuestion: () => set((state) => ({
    currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
    selectedAnswer: "",
    showHint: false,
  })),
  
  previousQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    selectedAnswer: "",
    showHint: false,
  })),
  
  retakeQuiz: () => set({
    currentQuestionIndex: 0,
    selectedAnswer: "",
    showHint: false,
    isComplete: false,
    answers: [],
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
    return ((state.currentQuestionIndex + 1) / state.questions.length) * 100;
  },
  
  getScorePercentage: () => {
    const state = get();
    return state.questions.length > 0 ? Math.round((state.score / state.questions.length) * 100) : 0;
  },
  
  getTotalQuestions: () => get().questions.length,
  
  getCorrectAnswers: () => get().score,
  
  getIncorrectAnswers: () => {
    const state = get();
    return state.questions.length - state.score;
  },
}));
