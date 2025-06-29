"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Calendar, Eye, FileText, Share2 } from "lucide-react";
import { MainLayout } from "@/components/main-layout";
import Link from "next/link";
import { useNotesStore } from "@/store/notesStore";
import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareDialog } from "@/components/share-dialog";
import { shareNote } from "@/services/notes.api";
import { toast } from "sonner";
import { Note } from "@/types/notes";

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function NotesPage() {
  const notes = useNotesStore((state) => state.notes);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const isLoading = useNotesStore((state) => state.isLoading);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Filter and sort notes based on search query and sort option
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Filter by search query (using debounced value)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = notes.filter(
        (note: Note) =>
          note.name_vi.toLowerCase().includes(query) ||
          note.description_vi.toLowerCase().includes(query) ||
          (note.name_en && note.name_en.toLowerCase().includes(query)) ||
          (note.description_en &&
            note.description_en.toLowerCase().includes(query))
      );
    }

    // Sort notes
    filtered.sort((a: Note, b: Note) => {
      switch (sortOption) {
        case "date-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "date-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "title-asc":
          return a.name_vi.localeCompare(b.name_vi);
        case "title-desc":
          return b.name_vi.localeCompare(a.name_vi);
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    return filtered;
  }, [notes, debouncedSearchQuery, sortOption]);

  const handleShare = (note: Note) => {
    // Create share link pointing to protected shared route
    const url = `${window.location.origin}/shared/${note.id}`;
    setShareUrl(url);
    setShareOpen(true);
    toast.success("Share link has been created!");
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <FileText className="h-4 w-4" />
            Study Materials
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            My Notes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your uploaded documents and notes. Search, filter, and
            organize your learning materials.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search your notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-48 h-12 border-gray-200 bg-white/80">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Table */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  All Notes
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {isLoading
                    ? "Loading notes..."
                    : `${filteredAndSortedNotes.length} notes${
                        debouncedSearchQuery
                          ? ` (filtered from ${notes.length})`
                          : ""
                      }`}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100 bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4 w-1/4">
                      Title
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-1/6">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-1/3">
                      Summary
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-1/6 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-40 rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24 rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-64 rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-9 w-32 rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredAndSortedNotes.length === 0 && !isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">
                            {debouncedSearchQuery
                              ? "No notes found matching your search"
                              : "No notes available"}
                          </p>
                          {debouncedSearchQuery && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearchQuery("")}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedNotes.map((note, index) => (
                      <TableRow
                        key={index}
                        className="border-gray-100 hover:bg-blue-50/30 transition-colors duration-200"
                      >
                        <TableCell className="py-4 w-1/4 align-middle">
                          <Link
                            href={`/notes/${note.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                          >
                            {note.name_vi}
                          </Link>
                        </TableCell>
                        <TableCell className="text-gray-600 font-medium w-1/6 align-middle">
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
                        <TableCell className="text-gray-600 max-w-xs w-1/3 align-middle">
                          <div className="truncate">{note.description_vi}</div>
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
                    ))
                  )}
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
