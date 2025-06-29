// hooks/useAuth.ts
"use client";
import { useStore } from "zustand";
import { useAuthStore } from "@/store/authStore";

export const useAuth = () => useStore(useAuthStore);
