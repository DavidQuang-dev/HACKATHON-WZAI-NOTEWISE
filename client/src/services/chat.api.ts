import api from "../lib/api";
import { ChatPayload, ChatResponse } from "@/types/chat";

export const chatCreate = async (data: ChatPayload) => {
  const res = await api.post("/chat", data);
  return res.data as ChatResponse;
};

export const fetchChatHistory = async () => {
  const res = await api.get("/chat-conversations/me");
  return res.data;
}

export const getAllChatOfConversation = async (noteId: string) => {
  const res = await api.get(`/chat/${noteId}`);
  return res.data;
}