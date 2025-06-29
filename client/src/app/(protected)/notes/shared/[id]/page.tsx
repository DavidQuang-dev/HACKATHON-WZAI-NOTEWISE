"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { shareNote, getNoteById } from "@/services/notes.api";
import { toast } from "sonner";
import { Loader2, FileText, User } from "lucide-react";

export default function SharedNotePage() {
  const params = useParams();
  const noteId = params.id as string;

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [noteData, setNoteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsSubmitting(true);
      // Call API to authenticate email and get note access
      await shareNote(noteId, email);
      setIsVerified(true);

      // After successful authentication, get note data
      setIsLoading(true);
      const note = await getNoteById(noteId);
      setNoteData(note);

      toast.success("Authentication successful! Loading note...");
    } catch (error) {
      toast.error("Unable to authenticate email. Please check and try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Access Shared Note
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Please enter your email to view this note content
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Access Note"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your email will be used to authenticate
                access to this note. Email information will be kept secure and
                will not be shared.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
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
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {noteData?.name_vi || "Shared Note"}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Shared on{" "}
                  {noteData?.created_at
                    ? new Date(noteData.created_at).toLocaleDateString("en-US")
                    : ""}
                </p>
              </div>
              <div className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                Authenticated: {email}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {noteData?.description_vi && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description:
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {noteData.description_vi}
                </p>
              </div>
            )}

            {/* Display other note content if available */}
            <div className="prose max-w-none">
              {/* Can display markdown content or other information from noteData */}
              {noteData?.content && (
                <div dangerouslySetInnerHTML={{ __html: noteData.content }} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
