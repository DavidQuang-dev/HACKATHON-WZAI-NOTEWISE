import { ChatHistoryItem, Message, MessageApi, QuickTopic } from "@/types/chat";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import {
  chatCreate,
  fetchChatHistory,
  getAllChatOfConversation,
} from "@/services/chat.api";
import { useRouter } from "next/navigation";
import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.extend(timezone);

export function useChatLogic() {
  const store = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // API call function
  const sendMessageToAPI = async (message: string) => {
    try {
      const response = await chatCreate({
        question: message,
        conversationId: store.currentChatId || "",
        noteId: store.currentNoteId || "",
      });

      if (!response) {
        throw new Error("Invalid response from API");
      }

      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store.input.trim() || store.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: store.input.trim(),
      timestamp: new Date(),
    };

    store.addMessage(userMessage);
    store.setInput("");
    store.setIsLoading(true);

    try {
      const data = await sendMessageToAPI(userMessage.content);
      const dataAnswer = data.data?.data;

      // Create new chat if this is the first message
      if (store.messages.length === 0 && !store.currentChatId) {
        const conversationID = dataAnswer?.conversation?._id;
        const conversationTitle =
          dataAnswer?.conversation?.conversationTitle || "Cuộc trò chuyện mới";

        store.setCurrentChatId(conversationID ?? null);

        const newChatHistory: ChatHistoryItem = {
          id: conversationID ?? "",
          conversationTitle:
            conversationTitle.trim().length > 50
              ? conversationTitle.trim().substring(0, 50) + "..."
              : conversationTitle.trim(),
          messages: [userMessage],
          timestamp: dayjs(data.timestamp)
            .tz("Asia/Ho_Chi_Minh")
            .format("HH:mm"),
          status: "bot",
        };

        store.setChatHistory([newChatHistory, ...store.chatHistory]);

      } else if (store.currentChatId) {
        store.updateChatHistory(store.currentChatId, {
          messages: [...store.messages, userMessage],
          timestamp: dayjs().tz("Asia/Ho_Chi_Minh").format("HH:mm"),
        });
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content:
          dataAnswer?.answer || "Xin lỗi, tôi không hiểu câu hỏi của bạn.",
        timestamp: new Date(),
      };

      store.addMessage(botMessage);

      if (store.currentChatId) {
        store.updateChatHistory(store.currentChatId, {
          messages: [...store.messages, botMessage],
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      store.addMessage(errorMessage);

      if (store.currentChatId) {
        store.updateChatHistory(store.currentChatId, {
          messages: [...store.messages, errorMessage],
          timestamp: new Date().toISOString(),
        });
      }

      console.error("Error in handleSubmit:", error);
    } finally {
      store.setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    store.setInput(e.target.value);
  };

  const handleTopicSelect = (topic: QuickTopic) => {
    store.setSelectedTopic(topic.id);
    store.setInput(
      `Tôi muốn tìm hiểu về ${topic.label.toLowerCase()}. ${topic.description}.`
    );
  };

  const handleNewChat = async () => {
    store.startNewChat();
    await router.push("/chat");
  };

  const loadChatHistory = async () => {
    try {
      const res = await fetchChatHistory();

      const rawData = res.data;

      const chatList: ChatHistoryItem[] = Object.values(rawData).map(
        (item: any) => ({
          id: item.id || item._id,
          conversationTitle: item.conversationTitle || "Cuộc trò chuyện mới",
          messages: item.messages || [],
          timestamp: item.createdAt || "",
          status: item.status || "bot",
        })
      );

      store.setChatHistory(chatList);
    } catch (err) {
      console.error("Lỗi khi load chat history:", err);
    }
  };

  const loadChatInConversation = async (noteId: string) => {
    try {
      const res = await getAllChatOfConversation(noteId);
      const messagesFromAPI = res.data?.messages || [];

      const formattedMessages = messagesFromAPI.map((msg : MessageApi) => ({
        id: msg._id,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.createdAt,
        isTyping: false,
        displayedText: msg.sender === "bot" ? "" : msg.content,
      }));

      store.setMessages(formattedMessages);
      // store.setCurrentChatId(conversationId);
      if (typeof store.setIsLoadingNavigation === "function") {
        store.setIsLoadingNavigation(false);
      }
    } catch (error) {
      console.error("Failed to load chat in conversation:", error);
    }
  };

  const filteredHistory = Array.isArray(store.chatHistory)
    ? store.chatHistory.filter((chat) =>
        chat.conversationTitle
          ?.toLowerCase()
          .includes(store.searchQuery.toLowerCase())
      )
    : [];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store.messages]);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        store.setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [store]);

  return {
    // State from store
    messagesEndRef,
    filteredHistory,

    // Functions
    sendMessageToAPI,
    handleSubmit,
    handleInputChange,
    handleTopicSelect,
    handleNewChat,
    loadChatHistory,
    loadChatInConversation,
  };
}
