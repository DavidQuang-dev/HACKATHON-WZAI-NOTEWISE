"use client";

import {
  BookOpen,
  GraduationCap,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { NoteSidebar } from "./note-sidebar";
import { useChatStore } from "@/store/chatStore";
import { useNoteLogic } from "@/hooks/use-note";
import { useNotesStore } from "@/store/notesStore";
import { MainLayout } from "./main-layout";

const navItems = [
  { title: "Home", url: "/dashboard" },
  { title: "Notes", url: "/notes" },
  { title: "Record", url: "/record" },
  { title: "Upload", url: "/upload" },
];

interface MainLayoutProps {
  children: ReactNode;
}

export function NoteLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setCurrentNoteId } = useChatStore();
  const { fetchNoteById } = useNoteLogic();
  const { setNote } = useNotesStore();
  const params = useParams();
  const id = params?.id as string;

  // Set current note id when id changes, avoiding state updates during render
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof fetchNoteById === "function") {
          const note = await fetchNoteById(id);
          if (note && typeof setCurrentNoteId === "function") {
            setCurrentNoteId(note.id);
            if (typeof setNote === "function") {
              setNote(note); // Store the note in the notes store
            }
          } else if (!note) {
            console.error("Note not found");
          }
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchData();
  }, [id, setCurrentNoteId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50">
      <MainLayout>
        {/* Main Content */}
        <div className="flex max-w-7xl mx-auto relative">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <NoteSidebar
            currentId={id}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Content Area */}
          <div className="flex-1 p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 lg:p-8">{children}</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
