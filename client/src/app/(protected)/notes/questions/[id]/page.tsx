"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NoteLayout } from "@/components/note-layout";
import { useNotesStore } from "@/store/notesStore";

export default function QuestionsPage() {
  const { note } = useNotesStore();

  return (
    <NoteLayout>
      <div className="space-y-8">
        <div className="text-center lg:text-left">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Practice Quiz
          </h3>
          <p className="text-gray-600 text-sm lg:text-base">
            Test your understanding with interactive questions
          </p>
        </div>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {note?.quiz?.name_vi}
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed text-sm lg:text-base">
                  {note?.quiz?.description_vi}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {note?.quiz?.totalQuestion}
                  </div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {note?.quiz?.estimatedTime}m
                  </div>
                  <div className="text-xs text-gray-600">Time Limit</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    80%
                  </div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    MCQ
                  </div>
                  <div className="text-xs text-gray-600">Type</div>
                </div>
              </div>

              <Link href={`/quiz/${note?.quiz?.id}`} className="block">
                <Button className="w-full h-12 lg:h-14 text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                  Start Quiz Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </NoteLayout>
  );
}
