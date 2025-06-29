export interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date | string; // Use Date for local time, string for API response
  displayedText?: string; // For typing effect
  isTyping?: boolean; // For typing effect completion
}

export interface MessageApiResponse {
  data: {
    data?: MessageApi[];
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface MessageApi {
  _id: string;
  content: string;
  sender: "user" | "bot";
  createdAt: string;
}


export interface ChatPayload {
  question: string;
  conversationId?: string;
  noteId?: string; // Optional for future use
}

export interface ChatResponse {
  data: {
    data?: {
      answer: string;
      conversation?: {
        _id: string;
        conversationTitle?: string;
      };
    };
  };
  timestamp: string;
}

export interface ChatHistoryItem {
  id: string;
  conversationTitle: string;
  // createdBy: string;
  messages?: Message[];
  timestamp?: string;
  status: "bot" | "advisor" | "completed";
}

export interface ChatHistoryApiResponse {
  data: Record<string, ChatHistoryItem>;
  statusCode: number;
  message: string;
  timestamp: string;
}

export type ChatPageProps = {
  params: Promise<{ id: string }>;
};

export interface QuickTopic {
  id: string;
  label: string;
  description: string;
  emoji: string;
}
