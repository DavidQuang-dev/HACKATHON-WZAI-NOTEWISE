export class SearchResponseConversationDto {
  conversation: ChatConversationResponse;
  messages: ChatMessageResponse[];
}

export interface ChatConversationResponse {
  _id: string;
  conversationTitle: string;
}

export interface ChatbotResponse {
  answer: string;
  conversation: ChatConversationResponse;
}

export interface ChatMessageResponse {
  _id: string,
  content: string;
  sender: string;
  createdAt: string;
}
