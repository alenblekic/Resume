import { create } from "zustand";
import type { AnalysisResult, AppState } from "./types";

interface AppStore {
  appState: AppState;
  resumeText: string;
  resumeFileName: string;
  jobDescription: string;
  results: AnalysisResult | null;
  errorMessage: string;

  setResume: (text: string, fileName: string) => void;
  clearResume: () => void;
  setJobDescription: (text: string) => void;
  startAnalysis: () => void;
  setResults: (results: AnalysisResult) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  appState: "idle",
  resumeText: "",
  resumeFileName: "",
  jobDescription: "",
  results: null,
  errorMessage: "",

  setResume: (text, fileName) => set({ resumeText: text, resumeFileName: fileName }),
  clearResume: () => set({ resumeText: "", resumeFileName: "" }),
  setJobDescription: (text) => set({ jobDescription: text }),
  startAnalysis: () => set({ appState: "analyzing", errorMessage: "" }),
  setResults: (results) => set({ appState: "results", results }),
  setError: (message) => set({ appState: "error", errorMessage: message }),
  reset: () =>
    set({
      appState: "idle",
      resumeText: "",
      resumeFileName: "",
      jobDescription: "",
      results: null,
      errorMessage: "",
    }),
}));
