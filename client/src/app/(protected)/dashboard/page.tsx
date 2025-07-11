"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Eye, Mic, Share2 } from "lucide-react";
import { MainLayout } from "@/components/main-layout";
import Link from "next/link";
import { useNotesStore } from "@/store/notesStore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { ShareDialog } from "@/components/share-dialog";
import { toast } from "sonner";

export default function DashboardPage() {
  const notes = useNotesStore((state) => state.notes);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const isLoading = useNotesStore((state) => state.isLoading);

  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const recentNotes = [...notes]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const handleShare = (note: any) => {
    // Create share link pointing to protected shared route
    const url = `${window.location.origin}/shared/${note.id}`;
    setShareUrl(url);
    setShareOpen(true);
    toast.success("Share link has been created!");
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Welcome back!
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Hello, {user?.name}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to dive into your studies? Upload your lecture files or start
            recording live to create smart notes with AI.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Lecture Card */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden relative group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 relative">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Upload Lecture</h3>
                  <p className="text-blue-100 text-base">
                    Upload audio files, documents, or paste text content to
                    generate smart notes
                  </p>
                </div>
                <Link href="/upload">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold w-full"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Files
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Start Recording Card */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden relative group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 relative">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Start Recording</h3>
                  <p className="text-red-100 text-base">
                    Record live lectures or study sessions and convert them to
                    structured notes
                  </p>
                </div>
                <Link href="/record">
                  <Button
                    size="lg"
                    className="bg-white text-red-600 hover:bg-red-50 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold w-full"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notes */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Recent Notes
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Continue where you left off
                </p>
              </div>
              <Link href="/notes">
                <Button
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  View All Notes
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100 bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 w-2/5">
                      Title
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-1/5 text-center">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-2/5">
                      Summary
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-1/6 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, idx) => (
                        <TableRow key={idx} className="border-gray-100">
                          <TableCell className="py-4 w-2/5">
                            <Skeleton className="h-4 w-3/4 rounded" />
                          </TableCell>
                          <TableCell className="w-1/5 text-center">
                            <Skeleton className="h-4 w-1/2 mx-auto rounded" />
                          </TableCell>
                          <TableCell className="w-2/5">
                            <Skeleton className="h-4 w-full rounded" />
                          </TableCell>
                          <TableCell className="w-32 text-center">
                            <Skeleton className="h-9 w-20 mx-auto rounded-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    : recentNotes.map((note) => (
                        <TableRow
                          key={note.id}
                          className="border-gray-100 hover:bg-blue-50/30 transition-colors duration-200"
                        >
                          <TableCell className="py-4 w-2/5">
                            <Link
                              href={`/notes/${note.id}`}
                              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                            >
                              {note.name_vi}
                            </Link>
                          </TableCell>
                          <TableCell className="text-gray-600 font-medium w-1/5 text-center">
                            {note.created_at
                              ? new Date(note.created_at)
                                  .toLocaleString("en-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    timeZone: "Asia/Ho_Chi_Minh",
                                  })
                                  .replace(",", "")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-600 w-2/5">
                            <div className="break-words whitespace-pre-line max-w-full">
                              {note.description_vi}
                            </div>
                          </TableCell>
                          <TableCell className="w-1/6 align-middle">
                            <div className="flex items-center gap-2">
                              <Link href={`/notes/${note.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 px-3 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 font-medium"
                                >
                                  <Eye className="mr-1 h-4 w-4" />
                                  View
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(note)}
                                className="h-9 px-3 hover:bg-green-100 hover:text-green-700 transition-all duration-200 font-medium"
                              >
                                <Share2 className="mr-1 h-4 w-4" />
                                Share
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareUrl={shareUrl}
      />
    </MainLayout>
  );
}
