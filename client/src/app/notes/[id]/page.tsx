"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  MessageSquare,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Search,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function LectureNotesPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [messages, setMessages] = useState([
    {
      type: "user",
      content:
        "Can you explain the concept of 'cognitive dissonance' in psychology?",
    },
    {
      type: "ai",
      content:
        "Cognitive dissonance refers to the mental discomfort experienced when a person holds conflicting beliefs, ideas, or values. This discomfort often leads to an alteration in one of the attitudes, beliefs, or behaviors to reduce the dissonance and restore balance. For example, a person who smokes (behavior) knows that smoking is harmful (belief), causing dissonance. They might reduce this dissonance by quitting smoking, justifying their behavior, or changing their belief about the harmful effects of smoking.",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const summarizedNotes = [
    "Psychology is the scientific study of the mind and behavior.",
    "It encompasses a wide range of topics, from brain function to social interactions.",
    "Major perspectives include cognitive, behavioral, psychodynamic, and humanistic.",
    "Research methods involve experiments, surveys, and case studies.",
    "Ethical considerations are crucial in psychological research.",
    "Applications of psychology include clinical practice, education, and organizational settings.",
  ];

  const fullTranscript = `Today, we'll begin our journey into the fascinating world of psychology. This branch of science deals with the study of mind and behavior at both individual and group levels. One of the fundamental concepts we'll explore is cognitive psychology, which focuses on mental processes such as perception, memory, and problem-solving. Another key area is behavioral psychology, where we examine how environmental factors influence our actions and responses. We'll also delve into social psychology, a field that investigates how people interact with one another and how social situations affect behavior. The applications of psychology are vast and have revolutionized various fields. For instance, clinical psychology helps in treating mental health disorders, educational psychology improves learning processes, and organizational psychology enhances workplace productivity. The field is constantly evolving, with ongoing research into areas like neuropsychology and positive psychology, which hold the potential to transform our understanding of human nature.`;

  const navItems = [
    { title: "Home", url: "/dashboard" },
    { title: "Notes", url: "/notes" },
    { title: "Record", url: "/record" },
    { title: "Upload", url: "/upload" },
  ];

  const sidebarItems = [
    { id: "summary", title: "Summarized Notes", icon: BookOpen },
    { id: "transcript", title: "Full Transcript", icon: FileText },
    { id: "questions", title: "Practice Questions", icon: HelpCircle },
    { id: "qa", title: "Q & A", icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Summarized Notes
              </h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="space-y-4">
                {summarizedNotes.map((note, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "transcript":
        return (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Full Transcript
              </h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed text-base">
                {fullTranscript}
              </p>
            </div>
          </div>
        );
      case "questions":
        return (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Practice Quiz
              </h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <p className="text-gray-700 mb-6 leading-relaxed">
                This quiz covers the key concepts from Lecture 1 on Introduction
                to Psychology. It includes questions on fundamental principles,
                research methods, and major perspectives. Please ensure you have
                reviewed the lecture notes before attempting this quiz. Good
                luck!
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Quiz Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      10
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Limit:</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      30 minutes
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-700"
                    >
                      Beginner
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700"
                    >
                      Multiple Choice
                    </Badge>
                  </div>
                </div>
              </div>
              <Link href="/quiz/1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 mt-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Quiz
                </Button>
              </Link>
            </div>
          </div>
        );
      case "qa":
        return (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                AI Assistant
              </h3>
              <p className="text-gray-600">
                Ask questions about this lecture and get instant answers from
                our AI tutor.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-xl ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 shadow-sm border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Ask a question about this lecture..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 h-12 bg-white border-gray-200"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6">
                Send
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BookOpen className="h-6 w-6 text-white" />
                <GraduationCap className="h-3 w-3 text-blue-200 absolute -top-1 -right-1" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              NoteWise
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-10 w-64 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <Settings className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Avatar className="h-10 w-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="Sarah"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  S
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200/50 min-h-screen">
          <div className="sticky top-20 p-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Lecture 1: Introduction to Psychology
              </h2>
              <Card className="shadow-lg shadow-gray-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-all duration-200 ${
                          activeTab === item.id
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                            : "text-gray-700 hover:bg-white/80 hover:shadow-sm"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">

            <Card className="border-0 shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">{renderContent()}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
