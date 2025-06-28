"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, MessageSquare, HelpCircle, BookOpen, Home, Mic, Upload, Search, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function LectureNotesPage() {
  const [messages, setMessages] = useState([
    {
      type: "user",
      content: "Can you explain the concept of 'cognitive dissonance' in psychology?",
    },
    {
      type: "ai",
      content:
        "Cognitive dissonance refers to the mental discomfort experienced when a person holds conflicting beliefs, ideas, or values. This discomfort often leads to an alteration in one of the attitudes, beliefs, or behaviors to reduce the dissonance and restore balance. For example, a person who smokes (behavior) knows that smoking is harmful (belief), causing dissonance. They might reduce this dissonance by quitting smoking, justifying their behavior, or changing their belief about the harmful effects of smoking.",
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const summarizedNotes = [
    "Psychology is the scientific study of the mind and behavior.",
    "It encompasses a wide range of topics, from brain function to social interactions.",
    "Major perspectives include cognitive, behavioral, psychodynamic, and humanistic.",
    "Research methods involve experiments, surveys, and case studies.",
    "Ethical considerations are crucial in psychological research.",
    "Applications of psychology include clinical practice, education, and organizational settings.",
  ]

  const fullTranscript = `Today, we'll begin our journey into the fascinating world of quantum physics. This branch of physics deals with the behavior of matter and energy at the atomic and subatomic levels. One of the fundamental concepts we'll explore is wave-particle duality, which suggests that particles can exhibit wave-like properties and vice versa. Another key concept is superposition, where a quantum system can exist in multiple states simultaneously. We'll also delve into quantum entanglement, a phenomenon where two or more particles become linked in such a way that they share the same fate, no matter how far apart they are. The applications of quantum physics are vast and have revolutionized various fields. For instance, lasers, transistors, and medical imaging techniques like MRI all rely on quantum principles. The field is constantly evolving, with ongoing research into areas like quantum computing and quantum cryptography, which hold the potential to transform technology as we know it.`

  const menuItems = [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "Notes", url: "/notes", icon: FileText },
    { title: "Record", url: "/record", icon: Mic },
    { title: "Upload", url: "/upload", icon: Upload },
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Main Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">NoteWise</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Lecture Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Lecture {i}: Introduction to Psychology</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    <span>Summarized Notes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    <span>Full Transcript</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    <span>Key Concepts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    <HelpCircle className="h-4 w-4" />
                    <span>Practice Questions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search" className="pl-10 bg-gray-50 border-gray-200" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Settings className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Lecture 1: Introduction to Psychology</h1>
            </div>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Summarized Notes
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Full Transcript
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Practice Questions
                </TabsTrigger>
                <TabsTrigger value="qa" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />Q & A
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Summarized Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {summarizedNotes.map((note, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{note}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcript" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Full Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{fullTranscript}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Questions</CardTitle>
                    <p className="text-gray-600">
                      This quiz covers the key concepts from Lecture 3 on Advanced Calculus. It includes problems on
                      differentiation, integration, and applications of derivatives. Please ensure you have reviewed the
                      lecture notes and practice problems before attempting this quiz. Good luck!
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">Quiz Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Number of Questions</span>
                          <Badge variant="secondary">10</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Time</span>
                          <Badge variant="secondary">30 minutes</Badge>
                        </div>
                      </div>
                    </div>
                    <Link href="/quiz/1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12">Start Quiz</Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qa" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Q & A</CardTitle>
                    <p className="text-gray-600">Hi there! How can I help you today?</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700">Send</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
