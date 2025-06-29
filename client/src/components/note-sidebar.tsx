"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, HelpCircle, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNotesStore } from "@/store/notesStore";

const sidebarItems = [
  { id: "summary", title: "Summarized Notes", icon: BookOpen },
  { id: "transcript", title: "Full Transcript", icon: FileText },
  { id: "questions", title: "Practice Questions", icon: HelpCircle },
  { id: "qa", title: "Q & A", icon: MessageSquare },
];

export function NoteSidebar({
  currentId,
  sidebarOpen,
  setSidebarOpen,
}: {
  currentId: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {note} = useNotesStore();
  const [activeTab, setActiveTab] = useState<string>(
    pathname.split("/")[2] === undefined ? "summary" : pathname.split("/")[2]
  );

  const handleOnClick = (id: string) => {
    if (id === "summary") {
      router.push(`/notes/${currentId}`);
    } else {
      router.push(`/notes/${id}/${currentId}`);
    }
    setSidebarOpen(true);
  };

  useEffect(() => {
    const isNotesSummary =
      pathname.startsWith("/notes/") && pathname.split("/").length === 3;
    const pathTab = isNotesSummary
      ? "summary"
      : pathname.split("/")[2] ?? "summary";
    setActiveTab(pathTab);
  }, [pathname]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 border-r border-gray-200/50 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="sticky top-20 p-4 lg:p-6">
          <h2 className="text-lg font-bold mb-4">{note?.name_vi}</h2>
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleOnClick(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-white/70"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
