import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
  language: "vi" | "en";
  setLanguage: (lang: "vi" | "en") => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "vi", // default
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "language-storage", // key trong localStorage
    }
  )
);
