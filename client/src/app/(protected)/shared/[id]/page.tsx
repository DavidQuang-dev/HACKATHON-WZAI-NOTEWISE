"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNoteById } from "@/services/notes.api";
import { useAuthStore } from "@/store/authStore";
import { useNotesStore } from "@/store/notesStore";
import { Note } from "@/types/notes";
import { toast } from "sonner";
import { Loader2, FileText, ArrowLeft, Lock } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SharedNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // Get notes store state and actions
  const notes = useNotesStore((state) => state.notes);
  const setNote = useNotesStore((state) => state.setNote);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setIsVerified] = useState(false);
  const [noteData, setNoteData] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to find note in store by ID
  const findNoteInStore = (id: string): Note | null => {
    return notes.find((note) => note.id === id) || null;
  };

  // Tự động xác thực khi user đã đăng nhập
  useEffect(() => {
    if (hasHydrated && user?.email) {
      handleAutoVerify();
    }
  }, [hasHydrated, user]);

  const handleAutoVerify = async () => {
    if (!user?.email) return;

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      // First, try to get the note from the store
      const note = findNoteInStore(noteId);

      if (note) {
        // Note found in store, use it directly
        console.log("Note found in store:", note);
        setNoteData(note);
        setNote?.(note); // Update the store's current note
        toast.success("Note loaded successfully from memory!");
      } else {
        // Note not in store, fetch from API
        const apiResponse = await getNoteById(noteId);
        console.log("API response:", apiResponse);
        // API response has nested structure: { data: Note }
        const actualNote = apiResponse.data || apiResponse;
        console.log("Processed note data:", actualNote);
        setNoteData(actualNote);
        setNote?.(actualNote); // Update the store's current note
        toast.success("Note loaded successfully!");
      }

      setIsVerified(true);
    } catch (error) {
      console.error("Load shared note error:", error);
      toast.error(
        "Unable to load this note. Link may have expired or been deleted."
      );
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/notes");
  };

  // Show loading while hydrating
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login requirement if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Login Required
              </CardTitle>
              <p className="text-gray-600 mt-2">
                You need to log in to view this shared note
              </p>
            </div>
          </CardHeader>

          <CardContent className="text-center">
            <Button
              onClick={() => router.push("/auth")}
              className="w-full h-12"
            >
              Login
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You need to have an account and log in to
                the system to view shared note content.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading when authenticating or loading data
  if (isSubmitting || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </div>

        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {noteData?.name_vi || "Shared Note"}
                </CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    Created on:{" "}
                    {noteData?.created_at
                      ? new Date(noteData.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Unknown"}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Authenticated
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {noteData?.description_vi && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Notes Summary:
                </h3>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {noteData?.summarizedTranscript?.description_vi}
                </Markdown>
              </div>
            )}

            <div className="prose max-w-none">
              {noteData?.summarizedTranscript?.description_vi ? (
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">
                    Nội dung note
                  </h4>

                  <Markdown remarkPlugins={[remarkGfm]}>
                    {noteData?.transcript?.description_vi}
                  </Markdown>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Note content will be displayed here</p>
                  <p className="text-sm mt-2">
                    This note may not have summarized content yet.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-800">
                This note is shared from <strong>NoteWise</strong> - Smart Note
                Management Platform
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Accessed by: {user?.email || "User"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
