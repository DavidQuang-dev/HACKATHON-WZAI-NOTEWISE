"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  Check,
  X,
  ArrowLeft,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const questions = [
  {
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
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(8);
  const [totalQuestions] = useState(10);

  const handleSubmit = () => {
    setIsComplete(true);
  };

  if (isComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const correctAnswers = score;
    const incorrectAnswers = totalQuestions - score;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Quiz Results Content */}
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Quiz Results
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Lecture 1: Introduction to Psychology
                </p>
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
                      Correct Answers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      {incorrectAnswers}/{totalQuestions}
                    </div>
                    <div className="text-sm text-red-600 font-medium">
                      Incorrect Answers
                    </div>
                  </div>
                </div>

                <Card className="text-left border-0 shadow-lg shadow-gray-200/50">
                  <CardHeader>
                    <CardTitle className="text-xl">Review Answers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.from({ length: totalQuestions }, (_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-sm font-medium">
                          Question {i + 1}: What is the main function of the
                          cell membrane?
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            Correct: {String.fromCharCode(65 + (i % 4))}
                          </span>
                          {i < score ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <X className="h-5 w-5 text-red-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="h-12 px-8 bg-transparent border-gray-200 hover:bg-gray-50"
                  >
                    Retake Quiz
                  </Button>
                  <Link href="/notes/lecture-1">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                      Back to Notes
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Quiz Content */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lecture 1: Introduction to Psychology
            </h1>
            <p className="text-gray-600 text-lg">Multiple Choice Questions</p>
            <p className="text-sm text-gray-500 mt-1">
              Choose the best answer for each question.
            </p>
          </div>

          <div className="space-y-4">
            <Progress
              value={((currentQuestion + 1) / questions.length) * 100}
              className="w-full h-3 bg-gray-200"
            />
            <p className="text-sm text-gray-600 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <Card className="border-0 shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      className="text-blue-600"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base font-medium text-gray-700"
                    >
                      {option}
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
                      Hint for question: What is the main topic of this chapter?
                    </span>
                  </div>
                  <p className="text-yellow-700 font-medium">
                    {questions[currentQuestion].hint}
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 h-12 px-6 bg-transparent border-gray-200 hover:bg-yellow-50 hover:border-yellow-300"
                >
                  <Lightbulb className="h-4 w-4" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
