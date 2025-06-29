"use client";

import { NoteLayout } from "@/components/note-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useNotesStore } from "@/store/notesStore";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SummaryPage() {

  const {note} = useNotesStore();

  return (
    <NoteLayout>
      <div className="space-y-8">
        <div className="text-center lg:text-left">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Summarized Notes
          </h3>
          <p className="text-gray-600 text-sm lg:text-base">
            Essential takeaways from today&apos;s lecture
          </p>
        </div>
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50/30">
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <h4 className="text-lg font-semibold mb-2">
                {note?.summarizedTranscript?.name_vi}
              </h4>
              <Markdown remarkPlugins={[remarkGfm]}>{note?.summarizedTranscript?.description_vi}</Markdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </NoteLayout>
  );
}
