"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, FileAudio, FileText, Sparkles } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import Link from "next/link"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(75)
  const [textContent, setTextContent] = useState("")

  const handleFileUpload = () => {
    setIsUploading(true)
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Note Generation
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Upload Lecture
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your audio files or paste text content. Our AI will automatically generate smart notes, summaries,
            and practice questions.
          </p>
        </div>

        <Card className="border-0 shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1 rounded-xl">
                <TabsTrigger
                  value="file"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <FileAudio className="mr-2 h-4 w-4" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-6 mt-8">
                {isUploading ? (
                  <div className="text-center space-y-6 py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-gray-900 mb-2">Uploading your lecture...</div>
                      <p className="text-gray-600">Please wait while we process your file</p>
                    </div>
                    <div className="max-w-md mx-auto space-y-3">
                      <Progress value={uploadProgress} className="w-full h-3 bg-gray-200" />
                      <div className="text-sm font-medium text-blue-600">{uploadProgress}% Complete</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group cursor-pointer">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FileAudio className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your files here</h3>
                      <p className="text-gray-600 mb-2">or click to browse from your device</p>
                      <p className="text-sm text-gray-500 mb-6">Supported formats: MP3, WAV, M4A (Max 100MB)</p>
                      <Button
                        onClick={handleFileUpload}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        Choose Files
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="text" className="space-y-6 mt-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Paste your lecture transcript or notes below</span>
                  </div>
                  <Textarea
                    placeholder="Paste your lecture transcript, notes, or any text content here. Our AI will analyze and create structured notes for you..."
                    className="min-h-[400px] resize-none text-base border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                  />
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{textContent.length} characters</span>
                    <span>Minimum 100 characters recommended</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <Link href="/processing">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Smart Notes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600">
                Advanced AI extracts key concepts and creates structured summaries
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Notes</h3>
              <p className="text-sm text-gray-600">Automatically generated notes with key points and summaries</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileAudio className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-sm text-gray-600">Support for audio files, text content, and various file formats</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
