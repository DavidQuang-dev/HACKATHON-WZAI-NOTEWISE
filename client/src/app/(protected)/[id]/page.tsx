"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  shareNote,
  getNoteById,
  getSharedNoteById,
} from "@/services/notes.api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Loader2, FileText, User, ArrowLeft, Lock } from "lucide-react";

export default function PublicSharedNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [noteData, setNoteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto verify when user is logged in
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

      // Only fetch note data, no need to call shareNote API
      // because the link has already been created and shared
      const note = await getNoteById(noteId);
      setNoteData(note);
      setIsVerified(true);

      toast.success("Note loaded successfully!");
    } catch (error) {
      console.error("Load note error:", error);
      toast.error(
        "Unable to load this note. The link may have expired or been deleted."
      );
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setIsVerified(false);
    setNoteData(null);
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

  // Show login required if not logged in
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
                Login required
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
              Log in
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You need to have an account and be logged
                in to view the content of the shared note.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading when verifying or fetching data
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
            Back
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
                    Created at:{" "}
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
                Verified
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {noteData?.description_vi && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description:
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {noteData.description_vi}
                </p>
              </div>
            )}

            <div className="prose max-w-none">
              {noteData?.content ? (
                <div
                  className="bg-white p-6 rounded-lg border"
                  dangerouslySetInnerHTML={{ __html: noteData.content }}
                />
              ) : (
                <div className="bg-white p-6 rounded-lg border text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>The note content will be displayed here</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-800">
                This note is shared from <strong>NoteWise</strong> - Smart note
                management platform
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
