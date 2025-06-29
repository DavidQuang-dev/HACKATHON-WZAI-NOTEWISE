"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Check, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useQuizStore } from "@/store/quizStore";
import { useChatStore } from "@/store/chatStore";
import { useParams } from "next/navigation";
import { useQuizLogic } from "@/hooks/use-quiz";

export default function QuizPage() {
  const {
    // State
    selectedAnswer,
    showHint,
    isComplete,
    quizTitle,
    isSubmitting,
    currentQuestionIndex,

    // Actions
    setSelectedAnswer,
    toggleHint,
    saveAnswer,
    previousQuestion,
    retakeQuiz,

    // Getters
    getCurrentQuestion,
    getProgress,
    getScorePercentage,
    getTotalQuestions,
    getCorrectAnswers,
    getIncorrectAnswers,
    isLastQuestion,
  } = useQuizStore();

  const { submitQuiz, fetchQuizById } = useQuizLogic();

  const params = useParams();
  const quizId = params?.id as string;
  const { currentNoteId } = useChatStore();
  const { setQuizId } = useQuizStore();

  const currentQuestion = getCurrentQuestion();
  const percentage = getScorePercentage();
  const totalQuestions = getTotalQuestions();
  const correctAnswers = getCorrectAnswers();
  const incorrectAnswers = getIncorrectAnswers();

  useEffect(() => {
    // Fetch quiz data when component mounts
    fetchQuizById(quizId);
    setQuizId(quizId); // Set the quiz ID in the store
  }, [quizId]);

  const handleSubmitQuiz = async () => {
    // Ensure saveAnswer completes before submitting the quiz
    await saveAnswer();
    await submitQuiz();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Kết quả bài kiểm tra
                </CardTitle>
                <p className="text-gray-600 mt-2">{quizTitle}</p>
              </CardHeader>
              <CardContent className="text-center space-y-8 pb-8">
                <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {percentage}%
                </div>
                <div className="flex justify-center gap-12">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {correctAnswers}/{totalQuestions}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Đúng
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      {incorrectAnswers}/{totalQuestions}
                    </div>
                    <div className="text-sm text-red-600 font-medium">Sai</div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={retakeQuiz}
                    className="h-12 px-8 bg-transparent border-gray-200 hover:bg-gray-50"
                  >
                    Làm lại
                  </Button>
                  <Link href={`/notes/${currentNoteId}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                      Quay lại ghi chú
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Quiz Content */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/notes/lecture-1">
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10 px-4 bg-transparent border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Notes
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <Progress
                value={getProgress()}
                className="w-32"
                style={{
                  background: "#2563eb",
                  height: "8px",
                  borderRadius: "9999px",
                }}
              />
              <span className="text-sm font-medium text-gray-900">
                {Math.round(getProgress())}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {quizTitle}
            </h1>
            <p className="text-gray-600 text-lg">Câu hỏi trắc nghiệm</p>
            <p className="text-sm text-gray-500 mt-1">
              Hãy chọn đáp án đúng nhất cho mỗi câu hỏi.
            </p>
          </div>

          <Card className="border-0 shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                {currentQuestion.name_vi}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                disabled={isSubmitting}
              >
                {currentQuestion.answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-colors cursor-pointer ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-50/50"
                    }`}
                    onClick={() =>
                      !isSubmitting && setSelectedAnswer(index.toString())
                    }
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      className="text-blue-600"
                      disabled={isSubmitting}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className={`flex-1 text-base font-medium text-gray-700 ${
                        isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {answer.name_vi}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {showHint && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 text-yellow-800 mb-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">
                      Hint for question: {currentQuestion.hint}
                    </span>
                  </div>
                  <p className="text-yellow-700 font-medium">
                    {currentQuestion.hint}
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={toggleHint}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 h-12 px-6 bg-transparent border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 disabled:opacity-50"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>

                  {currentQuestionIndex > 0 && (
                    <Button
                      variant="outline"
                      onClick={previousQuestion}
                      disabled={isSubmitting}
                      className="h-12 px-6 bg-transparent border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex gap-4">
                  {!isLastQuestion() ? (
                    <Button
                      onClick={saveAnswer}
                      disabled={!selectedAnswer || isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubmitQuiz()}
                      disabled={!selectedAnswer || isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting Quiz..." : "Submit Quiz"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
