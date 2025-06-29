import { useChatStore } from "@/store/chatStore";
import { useChatLogic } from "@/hooks/use-chat";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect } from "react";
import { BookOpen } from "lucide-react";

export function ChatMessages() {
  const { messages, isLoading, updateMessage } = useChatStore();
  const { messagesEndRef } = useChatLogic();

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.sender !== "bot") return;

    if (lastMessage.displayedText === "" && !lastMessage.isTyping) return;

    const typingLength = 80; // số ký tự gõ từ từ
    let index = 0;

    const typingPart = lastMessage.content.slice(0, typingLength);
    const restPart = lastMessage.content.slice(typingLength);

    updateMessage(lastMessage.id, { displayedText: "", isTyping: true });

    const typeNext = () => {
      if (index >= typingPart.length) {
        // Khi gõ xong phần đầu thì append phần còn lại ngay
        updateMessage(lastMessage.id, {
          displayedText: typingPart + restPart,
          isTyping: false,
        });
        return;
      }

      updateMessage(lastMessage.id, (prev) => ({
        displayedText: (prev.displayedText || "") + typingPart.charAt(index),
      }));

      index++;

      const baseDelay = 5;
      const variableDelay = index < 5 ? 30 : index < 20 ? 15 : 5;
      setTimeout(typeNext, baseDelay + Math.random() * variableDelay);
    };

    typeNext();
  }, [messages.length]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="flex space-x-3">
            {message.sender === "bot" && (
              <div className="w-9 h-10 flex-shrink-0">
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-md">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
            )}

            <div
              className={`rounded-2xl p-4 ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-900 shadow-sm"
              }`}
            >
              {message.sender === "bot" && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    NoteWise
                  </span>
                  <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <span className="text-xs text-slate-500">
                    {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              <div className="prose prose-sm max-w-lg whitespace-pre-wrap leading-relaxed">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {message.sender === "bot" && message.isTyping
                    ? (message.displayedText || "") + "▍"
                    : message.content}
                </Markdown>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex space-x-3">
            <div className="w-9 h-10 flex-shrink-0">
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-sm text-slate-500">
                  bạn đợi mình chút xíu nha...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
