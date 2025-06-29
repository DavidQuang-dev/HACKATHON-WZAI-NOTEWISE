"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, FileAudio, FileText, Sparkles } from "lucide-react";
import { MainLayout } from "@/components/main-layout";
import Link from "next/link";
import { FileUpload } from "@/components/upload";
import { uploadFile } from "@/services/upload.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(75);
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<any>(null);
  const router = useRouter();

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(selectedFile);
      console.log("Upload response:", response);

      // Store the processed data instead of URL
      setProcessedData(response.data);

      // Store in localStorage for processing page to access
      localStorage.setItem("processedData", JSON.stringify(response.data));

      toast.success("File processed successfully!");

      // Automatically navigate to processing page after successful upload
      setTimeout(() => {
        router.push("/processing");
      }, 1000); // Small delay to show success message
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload failed");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadText = async () => {
    if (!textContent.trim()) return;

    setIsUploading(true);
    try {
      // Create a Blob from text content to send as file
      const textBlob = new Blob([textContent], { type: "text/plain" });
      const textFile = new File([textBlob], "text-content.txt", {
        type: "text/plain",
      });

      const response = await uploadFile(textFile);
      console.log("Text upload response:", response);

      // Store the processed data
      setProcessedData(response.data);

      // Store in localStorage for processing page to access
      localStorage.setItem("processedData", JSON.stringify(response.data));

      toast.success("Text processed successfully!");

      // Automatically navigate to processing page after successful upload
      setTimeout(() => {
        router.push("/processing");
      }, 1000); // Small delay to show success message
    } catch (error) {
      console.error("Text upload error:", error);
      toast.error("Text processing failed");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (selectedFile && !processedData) {
      // Upload and process file
      try {
        await handleUploadFile();
        // Navigation happens automatically in handleUploadFile
      } catch (error) {
        // Error already handled in handleUploadFile
        return;
      }
    } else if (processedData) {
      // File already processed
      router.push("/processing");
    } else if (textContent.trim()) {
      // Upload and process text content
      try {
        await handleUploadText();
        // Navigation happens automatically in handleUploadText
      } catch (error) {
        // Error already handled in handleUploadText
        return;
      }
    } else {
      toast.error("Please select a file or enter content");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Header */}

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

              <TabsContent
                value="file"
                className="space-y-6 mt-8 min-h-[500px]"
              >
                <FileUpload
                  label="Upload Audio"
                  value=""
                  onChange={() => {}} // No need to handle onChange for processed data
                  resetOnDelete={true}
                  accept="audio/mpeg,audio/wav,audio/x-m4a"
                  selectedFile={selectedFile}
                  onFileSelect={(file) => {
                    setSelectedFile(file);
                    if (!file) setProcessedData(null); // Reset processed data when file is removed
                  }}
                  onUpload={handleUploadFile}
                  isProcessed={!!processedData}
                />
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
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={handleGenerate}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Smart Notes
                  </>
                )}
              </Button>
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
              <h3 className="font-semibold text-gray-900 mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Advanced AI extracts key concepts and creates structured
                summaries
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Notes</h3>
              <p className="text-sm text-gray-600">
                Automatically generated notes with key points and summaries
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileAudio className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Multiple Formats
              </h3>
              <p className="text-sm text-gray-600">
                Support for audio files, text content, and various file formats
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
