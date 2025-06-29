"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mic,
  FileText,
  Brain,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "processing" | "completed";
  progress: number;
}

export default function ProcessingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [transcriptText, setTranscriptText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);

  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: "upload",
      title: "Audio Upload",
      description: "Uploading and validating audio file",
      status: "completed",
      progress: 100,
    },
    {
      id: "transcription",
      title: "Speech to Text",
      description: "Converting audio to text using AI",
      status: "processing",
      progress: 0,
    },
    {
      id: "analysis",
      title: "Content Analysis",
      description: "Analyzing content and extracting key points",
      status: "pending",
      progress: 0,
    },
    {
      id: "generation",
      title: "Notes Generation",
      description: "Creating structured notes and summaries",
      status: "pending",
      progress: 0,
    },
  ]);

  //   // Simulate real-time transcription
  //   const sampleTranscript = `Welcome to today's lecture on Introduction to Machine Learning. Machine Learning is a fascinating field that's a subset of Artificial Intelligence, focusing on algorithms that can learn and make decisions from data.

  // There are three main types of machine learning approaches. First, we have Supervised Learning, where we train our models using labeled data - essentially showing the algorithm examples of inputs and their correct outputs. This is like teaching a student with a textbook that has all the answers.

  // Second, there's Unsupervised Learning, where we give the algorithm data without labels and ask it to find patterns or structures on its own. Think of this as giving someone a puzzle without showing them the final picture.

  // Finally, we have Reinforcement Learning, where an agent learns through trial and error by receiving rewards or penalties for its actions. This is similar to how we might train a pet with treats and corrections.

  // Some common supervised learning algorithms include Linear Regression for predicting continuous values, Decision Trees for classification problems, and Neural Networks which can handle complex patterns in data.

  // Data preprocessing is absolutely crucial for good model performance. This includes cleaning the data, handling missing values, and scaling features appropriately.

  // One important concept to understand is overfitting. This occurs when our model becomes too complex and essentially memorizes the training data rather than learning generalizable patterns. To combat this, we use techniques like cross-validation to assess how well our model will perform on new, unseen data.`;

  useEffect(() => {
    // Get processed data from localStorage
    const storedData = localStorage.getItem("processedData");
    console.log("Raw stored data:", storedData);

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        console.log("Parsed processed data:", parsed);
        setProcessedData(parsed);
      } catch (error) {
        console.error("Error parsing stored data:", error);
      }
    }
  }, []);

  // Separate useEffect to start processing when processedData is ready
  useEffect(() => {
    if (processedData !== null) {
      const processSteps = async () => {
        // Step 1: Transcription (already completed - upload)

        // Step 2: Speech to Text
        await simulateTranscription();

        // Step 3: Content Analysis
        await simulateAnalysis();

        // Step 4: Notes Generation
        await simulateGeneration();

        setIsComplete(true);
      };

      processSteps();
    }
  }, [processedData]); // Trigger when processedData changes

  const simulateTranscription = () => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      let textIndex = 0;

      console.log(
        "Current processedData in simulateTranscription:",
        processedData
      );

      // Use real transcript data if available, with proper fallback
      let fullText = "Không có dữ liệu transcript"; // Default text

      if (processedData?.data?.fullTranscription?.description_vi) {
        fullText = processedData.data.fullTranscription.description_vi;
        console.log("Using data.fullTranscription.description_vi");
      } else if (processedData?.fullTranscription?.description_vi) {
        fullText = processedData.fullTranscription.description_vi;
        console.log("Using fullTranscription.description_vi");
      } else {
        console.log("No transcript data found, using default text");
        console.log(
          "Available keys in processedData:",
          processedData ? Object.keys(processedData) : "processedData is null"
        );
        if (processedData?.data) {
          console.log(
            "Available keys in processedData.data:",
            Object.keys(processedData.data)
          );
        }
      }

      console.log("Final fullText:", fullText.substring(0, 100) + "...");

      const words = fullText.split(" ");

      const interval = setInterval(() => {
        progress += 2;

        // Add words gradually to simulate real-time transcription
        if (textIndex < words.length && progress % 8 === 0) {
          const newText = words.slice(0, textIndex + 5).join(" ");
          setTranscriptText(newText);
          textIndex += 5;
        }

        setSteps((prev) =>
          prev.map((step) =>
            step.id === "transcription"
              ? {
                  ...step,
                  progress,
                  status: progress < 100 ? "processing" : "completed",
                }
              : step
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          setTranscriptText(fullText);
          setCurrentStep(2);
          resolve();
        }
      }, 100);
    });
  };

  const simulateAnalysis = () => {
    return new Promise<void>((resolve) => {
      setSteps((prev) =>
        prev.map((step) =>
          step.id === "analysis" ? { ...step, status: "processing" } : step
        )
      );

      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;

        setSteps((prev) =>
          prev.map((step) =>
            step.id === "analysis"
              ? {
                  ...step,
                  progress,
                  status: progress < 100 ? "processing" : "completed",
                }
              : step
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          setCurrentStep(3);
          resolve();
        }
      }, 150);
    });
  };

  const simulateGeneration = () => {
    return new Promise<void>((resolve) => {
      setSteps((prev) =>
        prev.map((step) =>
          step.id === "generation" ? { ...step, status: "processing" } : step
        )
      );

      let progress = 0;
      const interval = setInterval(() => {
        progress += 8;

        setSteps((prev) =>
          prev.map((step) =>
            step.id === "generation"
              ? {
                  ...step,
                  progress,
                  status: progress < 100 ? "processing" : "completed",
                }
              : step
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.id) {
      case "upload":
        return <Mic className="w-5 h-5" />;
      case "transcription":
        return <FileText className="w-5 h-5" />;
      case "analysis":
      case "generation":
        return <Brain className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStepColor = (step: ProcessingStep) => {
    switch (step.status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-400 bg-gray-100";
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Processing Steps */}
          <Card className="mb-8 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Processing Progress</CardTitle>
              <CardDescription>
                AI is analyzing your lecture and generating smart notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(
                        step
                      )}`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : step.status === "processing" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        getStepIcon(step)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {step.title}
                        </h3>
                        <Badge
                          variant={
                            step.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {step.status === "completed"
                            ? "Completed"
                            : step.status === "processing"
                            ? "Processing..."
                            : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                      <Progress value={step.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Real-time Transcription */}
            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Live Transcription
                </CardTitle>
                <CardDescription>
                  Real-time speech-to-text conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                  {transcriptText ? (
                    <div className="space-y-2">
                      {transcriptText.split("\n\n").map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-sm text-gray-800 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {steps[1].status === "processing" && (
                        <div className="flex items-center space-x-2 mt-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-blue-600">
                            Transcribing...
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p>Waiting for transcription to start...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Preview */}
            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AI Analysis
                </CardTitle>
                <CardDescription>
                  Key insights and structure detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 h-96 overflow-y-auto">
                  {steps[2].status !== "pending" && (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-1">
                          Topic Detected
                        </h4>
                        <p className="text-sm text-blue-700">
                          {processedData?.data?.summary?.name_vi ||
                            processedData?.summary?.name_vi ||
                            "Đang phân tích chủ đề..."}
                        </p>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-1">
                          Summary Analysis
                        </h4>
                        <p className="text-sm text-green-700">
                          {processedData?.data?.summary?.description_vi ||
                            processedData?.summary?.description_vi ||
                            "Đang tạo tóm tắt..."}
                        </p>
                      </div>

                      {steps[2].status === "completed" &&
                        (processedData?.data?.quiz || processedData?.quiz) && (
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <h4 className="font-medium text-purple-900 mb-1">
                              Quiz Preparation
                            </h4>
                            <ul className="text-sm text-purple-700 space-y-1">
                              <li>
                                •{" "}
                                {(
                                  processedData?.data?.quiz ||
                                  processedData?.quiz
                                )?.totalQuestion || 0}{" "}
                                câu hỏi được tạo
                              </li>
                              <li>
                                • Thời gian ước tính:{" "}
                                {(
                                  processedData?.data?.quiz ||
                                  processedData?.quiz
                                )?.estimatedTime || 0}{" "}
                                phút
                              </li>
                              <li>• Đã sẵn sàng tạo ghi chú</li>
                            </ul>
                          </div>
                        )}
                    </div>
                  )}

                  {steps[2].status === "pending" && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Waiting for content analysis...</p>
                      </div>
                    </div>
                  )}

                  {steps[2].status === "processing" && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
                        <p>Analyzing content structure...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completion Message */}
          {isComplete && (
            <Card className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Processing Complete!
                </h3>
                <p className="text-lg opacity-90 mb-4">
                  {processedData?.data?.summary?.name_vi ||
                  processedData?.summary?.name_vi
                    ? `"${
                        processedData?.data?.summary?.name_vi ||
                        processedData?.summary?.name_vi
                      }" đã được xử lý thành công với ghi chú thông minh, tóm tắt và ${
                        (processedData?.data?.quiz || processedData?.quiz)
                          ?.totalQuestion || 0
                      } câu hỏi thực hành.`
                    : "Your content has been successfully converted into smart notes with key points, summaries, and practice questions."}
                </p>
                <Link href="/notes">
                  <Button size="lg" variant="secondary">
                    View Your Notes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </MainLayout>
  );
}
