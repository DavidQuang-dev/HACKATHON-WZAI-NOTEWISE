"use client";

import { NoteLayout } from "@/components/note-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useNotesStore } from "@/store/notesStore";

export default function TranscriptPage() {

  const { note } = useNotesStore();

  return (
    <NoteLayout>
      <div className="space-y-8">
        <div className="text-center lg:text-left">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Full Transcript
          </h3>
          <p className="text-gray-600 text-sm lg:text-base">
            Full recording transcription
          </p>
        </div>
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50/30">
          <CardContent className="p-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              {note?.transcript}
            </p>
          </CardContent>
        </Card>
      </div>
    </NoteLayout>
  );
}
