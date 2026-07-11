import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnalysisResult, AppState, Lang } from "./types";

interface AppStore {
  appState: AppState;
  resumeText: string;
  resumeFileName: string;
  jobDescription: string;
  results: AnalysisResult | null;
  errorMessage: string;
  language: Lang;

  setResume: (text: string, fileName: string) => void;
  clearResume: () => void;
  setJobDescription: (text: string) => void;
  startAnalysis: () => void;
  setResults: (results: AnalysisResult) => void;
  setError: (message: string) => void;
  setLanguage: (language: Lang) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      appState: "idle",
      resumeText: "",
      resumeFileName: "",
      jobDescription: "",
      results: null,
      errorMessage: "",
      language: "en",

      setResume: (text, fileName) => set({ resumeText: text, resumeFileName: fileName }),
      clearResume: () => set({ resumeText: "", resumeFileName: "" }),
      setJobDescription: (text) => set({ jobDescription: text }),
      startAnalysis: () => set({ appState: "analyzing", errorMessage: "" }),
      setResults: (results) => set({ appState: "results", results }),
      setError: (message) => set({ appState: "error", errorMessage: message }),
      setLanguage: (language) => set({ language }),
      reset: () =>
        set({
          appState: "idle",
          resumeText: "",
          resumeFileName: "",
          jobDescription: "",
          results: null,
          errorMessage: "",
        }),
    }),
    {
      name: "rie-language",
      // only the language survives reloads — resume/results are never stored
      partialize: (s) => ({ language: s.language }),
      // rehydrated manually after mount (LanguageToggle) to avoid SSR mismatch
      skipHydration: true,
    }
  )
);
