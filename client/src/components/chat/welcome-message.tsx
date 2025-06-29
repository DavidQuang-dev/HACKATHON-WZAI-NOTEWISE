import { useChatStore } from "@/store/chatStore";

export function WelcomeMessage() {
  const { messages } = useChatStore();

  if (messages.length > 0) return null;
  return (
    <div className="flex justify-center items-center h-full py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Xin chào! Mình là NoteWise 👋
        </h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Mình có thể hỗ trợ ban bất cứ câu hỏi gì để liên quan đến bài giảng, tài
          liệu của bạn.
        </p>
      </div>
    </div>
  );
}
