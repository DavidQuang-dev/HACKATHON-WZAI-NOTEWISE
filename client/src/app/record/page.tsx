"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, Pause, Square, Check } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import Link from "next/link"

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(65)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const tips = [
    "Speak clearly and at a moderate pace",
    "Minimize background noise",
    "Keep your device close to the speaker",
    "Take breaks for better transcription",
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {!isRecording ? (
          <>
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Ready to Record</h1>
              <p className="text-gray-600 text-lg">Click the button below to start recording your lecture</p>

              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 rounded-full h-20 w-20 p-0"
                onClick={() => setIsRecording(true)}
              >
                <Mic className="h-10 w-10" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-red-600">Recording</div>
              <div className="text-6xl font-mono font-bold">{formatTime(recordingTime)}</div>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Audio Level</div>
                  <Progress value={audioLevel} className="w-full h-3" />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" size="lg" className="h-12 px-6 bg-transparent">
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </Button>
              <Link href="/processing">
                <Button variant="destructive" size="lg" className="h-12 px-6">
                  <Square className="mr-2 h-5 w-5" />
                  Stop & Process
                </Button>
              </Link>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recording Tips</CardTitle>
            <p className="text-gray-600">Follow these tips for better transcription quality</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
