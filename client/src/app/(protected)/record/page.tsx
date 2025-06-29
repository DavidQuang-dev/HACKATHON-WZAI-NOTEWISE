"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Square,
  Pause,
  Play,
  Settings,
  Volume2,
  Clock,
  FileAudio,
  Lightbulb,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { uploadFile } from "@/services/upload.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunks = useRef<Blob[]>([]);
  const audioStream = useRef<MediaStream | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Audio Level Visual (Optional)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused && audioStream.current) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(audioStream.current);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      interval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(avg);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Start Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStream.current = stream;

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    audioChunks.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      console.log("� Audio URL:", url);

      // Convert blob to file and navigate to processing immediately
      try {
        setIsUploading(true);

        // Navigate to processing page immediately
        toast.success("Đang xử lý recording...");
        router.push("/processing");

        const audioFile = new File(
          [audioBlob],
          `recording-${Date.now()}.webm`,
          {
            type: "audio/webm",
          }
        );

        console.log("Uploading recorded audio...", audioFile);
        const response = await uploadFile(audioFile);
        console.log("Upload response:", response);

        // Store processed data for processing page to access
        localStorage.setItem("processedData", JSON.stringify(response.data));
        localStorage.setItem("processingComplete", "true");
      } catch (error) {
        console.error("Upload error:", error);
        localStorage.setItem(
          "processingError",
          JSON.stringify({
            message: "Lỗi upload recording",
            error: error,
          })
        );
        setIsUploading(false);
      }
    };

    recorder.start();
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
  };

  // Pause or Resume
  const pauseRecording = () => {
    if (!mediaRecorder) return;
    if (isPaused) {
      mediaRecorder.resume();
    } else {
      mediaRecorder.pause();
    }
    setIsPaused(!isPaused);
  };

  // Stop
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (audioStream.current) {
      audioStream.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    // setTimeout(() => {
    //   window.location.href = "/processing";
    // }, 1000);
  };

  const recordingTips = [
    "Speak clearly and at a moderate pace",
    "Minimize background noise",
    "Keep your device close to the speaker",
    "Take breaks for better transcription",
  ];

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className=" gap-8">
          {/* Main Recording Area */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-6">
            {/* Recording Status */}
            <Card className="bg-white/60 backdrop-blur-sm w-full max-w-xl">
              <CardContent className="p-8 text-center ">
                {!isRecording ? (
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Ready to Record
                      </h2>
                      <p className="text-gray-600">
                        Click the button below to start recording your lecture
                      </p>
                    </div>
                    <Button
                      onClick={startRecording}
                      size="lg"
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                          isPaused
                            ? "bg-yellow-500"
                            : "bg-red-500 animate-pulse"
                        }`}
                      >
                        {isPaused ? (
                          <Pause className="w-12 h-12 text-white" />
                        ) : (
                          <Mic className="w-12 h-12 text-white" />
                        )}
                      </div>
                      {!isPaused && (
                        <div className="absolute -inset-4 border-4 border-red-300 rounded-full animate-ping"></div>
                      )}
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatTime(recordingTime)}
                      </div>
                      <Badge
                        variant={isPaused ? "secondary" : "destructive"}
                        className="mb-4"
                      >
                        {isPaused ? "Paused" : "Recording"}
                      </Badge>
                    </div>

                    {/* Audio Level Indicator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <Volume2 className="w-4 h-4 text-gray-500" />
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-100"
                            style={{ width: `${audioLevel}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Audio Level</p>
                    </div>

                    {/* Recording Controls */}
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={pauseRecording}
                        variant="outline"
                        size="lg"
                        className="bg-white/80"
                      >
                        {isPaused ? (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            Pause
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={stopRecording}
                        variant="destructive"
                        size="lg"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Square className="w-5 h-5 mr-2" />
                            Stop & Process
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recording Tips */}
            <Card className="bg-white/60 backdrop-blur-sm w-full max-w-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Recording Tips
                </CardTitle>
                <CardDescription>
                  Follow these tips for better transcription quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recordingTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
