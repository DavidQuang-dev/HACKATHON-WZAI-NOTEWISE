"use client";

import { NoteLayout } from "@/components/note-layout";
import { ChatInput } from "@/components/chat/chat-input";
import { WelcomeMessage } from "@/components/chat/welcome-message";
import { ChatMessages } from "@/components/chat/chat-messages";
import { useChatLogic } from "@/hooks/use-chat";
import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";

export default function QAPage() {
  const { currentNoteId } = useChatStore();
  const { loadChatInConversation } = useChatLogic();

  useEffect(() => {
    if (!currentNoteId) return;
    loadChatInConversation(currentNoteId);
  }, [currentNoteId]);

  return (
    <NoteLayout>
      <div className="space-y-5">
        <div className="h-64 lg:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <WelcomeMessage />
          <ChatMessages />
        </div>

        <div className="flex w-full">
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 w-full">
            <ChatInput />
          </div>
        </div>
        {/* </CardContent>
        </Card> */}
        <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <span>
              NoteWise có thể mắc lỗi. Hãy kiểm tra các thông tin quan trọng.
            </span>
          </span>
        </div>
      </div>
    </NoteLayout>
  );
}
