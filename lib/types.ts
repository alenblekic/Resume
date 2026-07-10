export interface RecruiterResult {
  first_impression: string;
  strengths: string[];
  red_flags: string[];
  overall_fit: number; // 0-100
}

export interface MissingKeyword {
  keyword: string;
  importance: "critical" | "important";
  suggestion: string;
}

export interface AtsResult {
  score: number; // 0-100
  missing_keywords: MissingKeyword[];
  detected_level: string;
  detected_industry: string;
}

export interface WeakSection {
  section: string;
  issue: string;
  fix: string;
}

export interface HiringManagerResult {
  weak_sections: WeakSection[];
}

export interface InterviewerResult {
  technical: string[];
  behavioral: string[];
  system_design: string[];
}

export interface SalaryProbabilityResult {
  salary_low: number;
  salary_high: number;
  salary_currency: string;
  probability: number; // 0-100
  probability_factors: {
    positive: string[];
    negative: string[];
  };
}

/** Each persona is null if its AI call failed — the UI renders a per-card error. */
export interface AnalysisResult {
  recruiter: RecruiterResult | null;
  ats: AtsResult | null;
  hiringManager: HiringManagerResult | null;
  interviewer: InterviewerResult | null;
  salaryProbability: SalaryProbabilityResult | null;
}

export type AppState = "idle" | "analyzing" | "results" | "error";

export type PersonaId = "recruiter" | "ats" | "hiringManager" | "interviewer";
