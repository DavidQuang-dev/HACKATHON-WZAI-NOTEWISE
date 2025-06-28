"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, FileText, Brain } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import Link from "next/link"

const processingSteps = [
  { name: "Audio Upload", description: "Uploading and validating audio file", completed: true },
  { name: "Speech to Text", description: "Converting audio to text using AI", completed: true },
  { name: "Content Analysis", description: "Analyzing content and extracting key points", completed: true },
  { name: "Notes Generation", description: "Creating structured notes and summaries", completed: true },
]

export default function ProcessingPage() {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const transcript = `Welcome to today's lecture on Introduction to Machine Learning. Machine Learning is a fascinating field that's a subset of Artificial Intelligence, focusing on algorithms that can learn and make decisions from data.

There are three main types of machine learning approaches. First, we have Supervised Learning, where we train our models using labeled data essentially showing the algorithm examples of inputs and their correct outputs. This is like teaching a student with a textbook that has all the answers.

Second, there's Unsupervised Learning, where we give the algorithm data without labels and ask it to find patterns or structures on its own. Think of this as giving someone a puzzle without showing them the final picture.

Finally, we have Reinforcement Learning, where an agent learns through trial and error by receiving rewards or penalties for its actions.`

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing Progress</h1>
          <p className="text-gray-600">AI is analyzing your lecture and generating smart notes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Processing Steps */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{step.name}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                      <div className="text-xs text-green-600 font-medium mt-1">Completed</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Analysis
                </CardTitle>
                <p className="text-sm text-gray-600">Key insights and structure detection</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium text-sm mb-1">Topic Detected</div>
                  <div className="text-blue-600 font-medium">Introduction to Machine Learning</div>
                </div>
                <div>
                  <div className="font-medium text-sm mb-2">Key Concepts Found</div>
                  <div className="flex flex-wrap gap-2">
                    {["Supervised Learning", "Neural Networks", "Unsupervised Learning", "Overfitting"].map(
                      (concept) => (
                        <Badge key={concept} variant="secondary" className="bg-blue-100 text-blue-800">
                          {concept}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-sm mb-2">Structure Analysis</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 7 main concepts identified</li>
                    <li>• 3 learning types explained</li>
                    <li>• 4 algorithms mentioned</li>
                  </ul>
                </div>
                <div className="text-green-600 text-sm font-medium">Ready for note generation</div>
              </CardContent>
            </Card>
          </div>

          {/* Live Transcription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Live Transcription
              </CardTitle>
              <p className="text-sm text-gray-600">Real-time speech-to-text conversion</p>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed max-h-96 overflow-y-auto">
                {transcript}
              </div>
            </CardContent>
          </Card>
        </div>

        {isComplete && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Processing Complete!</h3>
              <p className="text-green-700 mb-6">
                Your lecture has been successfully converted into smart notes with key points, summaries, and practice
                questions.
              </p>
              <Link href="/notes/lecture-1">
                <Button className="bg-green-600 hover:bg-green-700 h-12 px-8">View Your Notes</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
