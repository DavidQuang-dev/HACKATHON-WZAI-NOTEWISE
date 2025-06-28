"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Star, BookOpen, Clock, Eye, FileText, Share2 } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import Link from "next/link"

const notes = [
  {
    title: "Lecture 1: Introduction to Psychology",
    uploadDate: "2024-07-26",
    summary: "Introduction to the course and key concepts in psychology.",
    link: "/notes/lecture-1",
    readTime: "5 min read",
    category: "Psychology",
    status: "Completed",
  },
  {
    title: "Lecture 2: Organic Chemistry Basics",
    uploadDate: "2024-07-25",
    summary: "Basic principles and molecular structures in organic chemistry.",
    link: "/lecture/2",
    readTime: "8 min read",
    category: "Chemistry",
    status: "Completed",
  },
  {
    title: "Lecture 3: Advanced Calculus",
    uploadDate: "2024-07-24",
    summary: "Advanced integration techniques and applications.",
    link: "/lecture/3",
    readTime: "12 min read",
    category: "Mathematics",
    status: "Completed",
  },
  {
    title: "Lecture 4: Linear Algebra",
    uploadDate: "2024-07-23",
    summary: "Matrix operations and linear transformations.",
    link: "/lecture/4",
    readTime: "10 min read",
    category: "Mathematics",
    status: "Processing",
  },
  {
    title: "Lecture 5: Quantum Physics",
    uploadDate: "2024-07-22",
    summary: "Introduction to quantum mechanics and wave functions.",
    link: "/lecture/5",
    readTime: "15 min read",
    category: "Physics",
    status: "Completed",
  },
  {
    title: "Assignment 1: Research Paper",
    uploadDate: "2024-07-20",
    summary: "Guidelines and requirements for the first assignment.",
    link: "/lecture/6",
    readTime: "3 min read",
    category: "Assignment",
    status: "Completed",
  },
  {
    title: "Study Guide - Midterm Exam",
    uploadDate: "2024-07-15",
    summary: "Comprehensive study guide for the midterm examination.",
    link: "/lecture/7",
    readTime: "20 min read",
    category: "Study Guide",
    status: "Completed",
  },
  {
    title: "Project Proposal Guidelines",
    uploadDate: "2024-07-10",
    summary: "Proposal guidelines for the final project with objectives.",
    link: "/lecture/8",
    readTime: "6 min read",
    category: "Project",
    status: "Completed",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700"
    case "Processing":
      return "bg-yellow-100 text-yellow-700"
    case "Draft":
      return "bg-gray-100 text-gray-700"
    default:
      return "bg-blue-100 text-blue-700"
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Psychology":
      return "bg-purple-100 text-purple-700"
    case "Chemistry":
      return "bg-green-100 text-green-700"
    case "Mathematics":
      return "bg-blue-100 text-blue-700"
    case "Physics":
      return "bg-red-100 text-red-700"
    case "Assignment":
      return "bg-orange-100 text-orange-700"
    case "Study Guide":
      return "bg-indigo-100 text-indigo-700"
    case "Project":
      return "bg-pink-100 text-pink-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const handleShare = (note: any) => {
  if (navigator.share) {
    navigator.share({
      title: note.title,
      text: note.summary,
      url: window.location.origin + note.link,
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.origin + note.link)
    // You could show a toast notification here
  }
}

export default function NotesPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <FileText className="h-4 w-4" />
            Study Materials
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            My Notes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your uploaded documents and notes. Search, filter, and organize your learning materials.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search your notes..."
                    className="pl-12 h-12 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select defaultValue="date">
                  <SelectTrigger className="w-48 h-12 border-gray-200 bg-white/80">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Sort by Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="title">Sort by Title</SelectItem>
                    <SelectItem value="category">Sort by Category</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-52 h-12 border-gray-200 bg-white/80">
                    <Star className="mr-2 h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-52 h-12 border-gray-200 bg-white/80">
                    <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="psychology">Psychology</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Table */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">All Notes</CardTitle>
                <p className="text-gray-600 mt-1">
                  {notes.length} notes • {notes.filter((n) => n.status === "Completed").length} completed
                </p>
              </div>
              <Link href="/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                  <FileText className="mr-2 h-4 w-4" />
                  Add New Note
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
                    <TableHead className="font-semibold text-gray-700">Category</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Summary</TableHead>
                    <TableHead className="font-semibold text-gray-700">Read Time</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note, index) => (
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
                      <TableCell>
                        <Badge className={`${getCategoryColor(note.category)} border-0 font-medium`}>
                          {note.category}
                        </Badge>
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
                        <Badge className={`${getStatusColor(note.status)} border-0 font-medium`}>{note.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={note.link}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 px-3 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 font-medium"
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(note)}
                            className="h-9 px-3 hover:bg-green-100 hover:text-green-700 transition-all duration-200 font-medium"
                          >
                            <Share2 className="mr-1 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="border-gray-200 hover:bg-gray-50 px-8 bg-transparent">
            Load More Notes
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
