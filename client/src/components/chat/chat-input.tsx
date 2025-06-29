import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { useChatStore } from "@/store/chatStore";
import { useChatLogic } from "@/hooks/use-chat";

export function ChatInput() {
  const { input, isLoading } = useChatStore();
  const { handleInputChange, handleSubmit } = useChatLogic();

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder={
            "Hỏi về tài liệu ..."
          }
          className="border-0 bg-transparent focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-500 text-base py-3 px-4 rounded-2xl resize-none w-full"
          disabled={isLoading}
          rows={1}
          style={{ minHeight: "48px", maxHeight: "200px" }}
          onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const target = e.target;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                handleSubmit(e);
              }
            }
          }}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        className={`rounded-2xl w-10 h-10 p-0 transition-all duration-200 ${
          input.trim() && !isLoading
            ? "bg-gradient-to-r bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl scale-100"
            : "bg-slate-200 text-slate-400 cursor-not-allowed scale-95"
        }`}
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
