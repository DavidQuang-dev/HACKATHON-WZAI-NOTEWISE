"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Eye, Clock, FileText, TrendingUp, Mic } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import Link from "next/link"

const recentNotes = [
  {
    title: "Introduction to Quantum Physics",
    uploadDate: "2024-07-26",
    summary: "Introduction to the course and key concepts.",
    link: "/notes/lecture-1",
    readTime: "5 min read",
  },
  {
    title: "Organic Chemistry Basics",
    uploadDate: "2024-07-25",
    summary: "Basic principles and molecular structures.",
    link: "/notes/lecture-2",
    readTime: "8 min read",
  },
  {
    title: "Calculus II - Advanced Integration",
    uploadDate: "2024-07-24",
    summary: "Advanced integration techniques and applications.",
    link: "/notes/lecture-3",
    readTime: "12 min read",
  },
  {
    title: "Linear Algebra and Matrix Operations",
    uploadDate: "2024-07-23",
    summary: "Matrix operations and linear transformations.",
    link: "/notes/lecture-4",
    readTime: "10 min read",
  },
  {
    title: "Differential Equations - First Order",
    uploadDate: "2024-07-22",
    summary: "First order differential equations and solutions.",
    link: "/notes/lecture-5",
    readTime: "7 min read",
  },
]

const stats = [
  { label: "Total Notes", value: "24", icon: FileText, color: "blue" },
  { label: "Study Hours", value: "127", icon: Clock, color: "green" },
  { label: "Progress", value: "89%", icon: TrendingUp, color: "purple" },
]

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Welcome back!
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Hello, Sarah! 👋
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to dive into your studies? Upload your lecture files or start recording live to create smart notes
            with AI.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    {stat.icon && <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Lecture Card */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden relative group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-700/5"></div>
            <CardContent className="p-8 relative">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Upload Lecture</h3>
                  <p className="text-blue-100 text-base">
                    Upload audio files, documents, or paste text content to generate smart notes
                  </p>
                </div>
                <Link href="/upload">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold w-full"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Files
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Start Recording Card */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden relative group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-700/5"></div>
            <CardContent className="p-8 relative">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Start Recording</h3>
                  <p className="text-red-100 text-base">
                    Record live lectures or study sessions and convert them to structured notes
                  </p>
                </div>
                <Link href="/record">
                  <Button
                    size="lg"
                    className="bg-white text-red-600 hover:bg-red-50 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold w-full"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notes */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Recent Notes</CardTitle>
                <p className="text-gray-600 mt-1">Continue where you left off</p>
              </div>
              <Link href="/notes">
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                  View All Notes
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100 bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Title</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Summary</TableHead>
                    <TableHead className="font-semibold text-gray-700">Read Time</TableHead>
                    <TableHead className="font-semibold text-gray-700">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentNotes.map((note, index) => (
                    <TableRow
                      key={index}
                      className="border-gray-100 hover:bg-blue-50/30 transition-colors duration-200"
                    >
                      <TableCell className="py-4">
                        <Link
                          href={note.link}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                        >
                          {note.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">{note.uploadDate}</TableCell>
                      <TableCell className="text-gray-600 max-w-xs">
                        <div className="truncate">{note.summary}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          <Clock className="h-3 w-3" />
                          {note.readTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link href={note.link}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 font-medium"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
