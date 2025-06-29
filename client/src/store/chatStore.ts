import { create } from "zustand";
import { ChatHistoryItem, Message } from "@/types/chat";

interface ChatState {
  // State
  messages: Message[];
  input: string;
  isLoading: boolean;
  isLoadingNavigation?: boolean;
  chatHistory: ChatHistoryItem[];
  currentChatId: string | null;
  currentNoteId?: string | null; // Optional for future use
  selectedTopic: string | null;
  chatStatus: "bot" | "advisor" | "completed";
  advisorInfo: any;
  searchQuery: string;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  showAdvisorNotice: boolean;
  displayedText?: string;
  isTyping?: boolean;

  // Actions
  setMessages: (messages: Message[]) => void;
  setInput: (input: string) => void;
  setIsLoading: (loading: boolean) => void;
  setIsLoadingNavigation?: (loading: boolean) => void;
  setChatHistory: (history: ChatHistoryItem[]) => void;
  setCurrentChatId: (id: string | null) => void;
  setCurrentNoteId?: (id: string | null) => void; // Optional for future use
  setSelectedTopic: (topic: string | null) => void;
  setChatStatus: (status: "bot" | "advisor" | "completed") => void;
  setAdvisorInfo: (info: any) => void;
  setSearchQuery: (query: string) => void;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setShowAdvisorNotice: (show: boolean) => void;
  setDisplayedText?: (text: string) => void;
  setIsTyping?: (typing: boolean) => void;
  updateMessage: (
    id: string,
    updater: Partial<Message> | ((prev: Message) => Partial<Message>)
  ) => void;

  // Complex actions
  addMessage: (message: Message) => void;
  updateChatHistory: (
    chatId: string,
    updates: Partial<ChatHistoryItem>
  ) => void;
  startNewChat: () => void;
  loadChat: (chatItem: ChatHistoryItem) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Initial state
  messages: [],
  input: "",
  isLoading: false,
  isLoadingNavigation: false,
  chatHistory: [],
  currentChatId: null,
  currentNoteId: null, // Optional for future use
  selectedTopic: null,
  chatStatus: "bot",
  advisorInfo: null,
  searchQuery: "",
  isSidebarCollapsed: false,
  isMobileMenuOpen: false,
  showAdvisorNotice: false,
  displayedText: "",
  isTyping: false,

  // Simple setters
  setMessages: (messages) => set({ messages }),
  setInput: (input) => set({ input }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsLoadingNavigation: (isLoadingNavigation) => set({ isLoadingNavigation }),
  setChatHistory: (chatHistory) => set({ chatHistory }),
  setCurrentChatId: (currentChatId) => set({ currentChatId }),
  setCurrentNoteId: (currentNoteId) => set({ currentNoteId }),
  setSelectedTopic: (selectedTopic) => set({ selectedTopic }),
  setChatStatus: (chatStatus) => set({ chatStatus }),
  setAdvisorInfo: (advisorInfo) => set({ advisorInfo }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
  setIsMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setShowAdvisorNotice: (showAdvisorNotice) => set({ showAdvisorNotice }),
  setDisplayedText: (displayedText) => set({ displayedText }),
  setIsTyping: (isTyping) => set({ isTyping }),
  updateMessage: (
    id: string,
    updater: Partial<Message> | ((prev: Message) => Partial<Message>)
  ) =>
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id !== id) return msg;
        const update = typeof updater === "function" ? updater(msg) : updater;
        return { ...msg, ...update };
      }),
    })),

  // Complex actions
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateChatHistory: (chatId, updates) =>
    set((state) => ({
      chatHistory: state.chatHistory.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      ),
    })),

  startNewChat: () =>
    set({
      currentChatId: null,
      selectedTopic: null,
      chatStatus: "bot",
      advisorInfo: null,
      messages: [],
      input: "",
      showAdvisorNotice: false,
    }),

  loadChat: (chatItem) =>
    set({
      currentChatId: chatItem.id,
      // messages: chatItem.messages,
      chatStatus: chatItem.status,
      showAdvisorNotice: chatItem.status === "advisor",
      isMobileMenuOpen: false,
    }),

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
