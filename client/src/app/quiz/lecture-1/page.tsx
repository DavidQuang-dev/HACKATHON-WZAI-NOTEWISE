"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Lightbulb } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { SidebarInset } from "@/components/ui/sidebar"

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
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestion].correct.toString()) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setShowHint(false)
    } else {
      setIsComplete(true)
    }
  }

  if (isComplete) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Quiz Results</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="text-6xl font-bold text-blue-600">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg">
                      Score: {score}/{questions.length}
                    </div>
                    <div className="flex justify-center gap-8">
                      <div className="text-green-600">
                        <div className="text-2xl font-bold">{score}</div>
                        <div className="text-sm">Correct Answers</div>
                      </div>
                      <div className="text-red-600">
                        <div className="text-2xl font-bold">{questions.length - score}</div>
                        <div className="text-sm">Incorrect Answers</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline">Retake Quiz</Button>
                    <Button>Back to Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </>
    )
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Lecture 1: Introduction to Psychology</h1>
              <p className="text-gray-600">Multiple Choice Questions</p>
              <p className="text-sm text-gray-500 mt-2">Choose the best answer for each question.</p>
            </div>

            <div className="mb-4">
              <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{questions[currentQuestion].question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {showHint && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Lightbulb className="h-4 w-4" />
                      <span className="font-medium">Hint</span>
                    </div>
                    <p className="text-yellow-700 mt-1">{questions[currentQuestion].hint}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setShowHint(!showHint)} className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Hint
                  </Button>
                  <Button onClick={handleSubmit} disabled={!selectedAnswer} className="bg-blue-600 hover:bg-blue-700">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
