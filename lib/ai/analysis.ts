import type {
  AnalysisResult,
  AtsResult,
  HiringManagerResult,
  InterviewerResult,
  RecruiterResult,
  SalaryProbabilityResult,
} from "../types";
import { completeJson, RateLimitError } from "./groq";
import {
  ATS_SYSTEM,
  HIRING_MANAGER_SYSTEM,
  INTERVIEWER_SYSTEM,
  RECRUITER_SYSTEM,
  SALARY_PROBABILITY_SYSTEM,
  buildUserPrompt,
} from "./prompts";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function validateRecruiter(r: RecruiterResult): RecruiterResult {
  return {
    first_impression: String(r.first_impression ?? ""),
    strengths: (r.strengths ?? []).map(String),
    red_flags: (r.red_flags ?? []).map(String),
    overall_fit: clamp(Number(r.overall_fit) || 0),
  };
}

function validateAts(r: AtsResult): AtsResult {
  return {
    score: clamp(Number(r.score) || 0),
    missing_keywords: (r.missing_keywords ?? []).slice(0, 5).map((k) => ({
      keyword: String(k.keyword ?? ""),
      importance: k.importance === "critical" ? "critical" : "important",
      suggestion: String(k.suggestion ?? ""),
    })),
    detected_level: String(r.detected_level ?? "Unknown"),
    detected_industry: String(r.detected_industry ?? "Unknown"),
  };
}

function validateHiringManager(r: HiringManagerResult): HiringManagerResult {
  return {
    weak_sections: (r.weak_sections ?? []).slice(0, 3).map((s) => ({
      section: String(s.section ?? ""),
      issue: String(s.issue ?? ""),
      fix: String(s.fix ?? ""),
    })),
  };
}

function validateInterviewer(r: InterviewerResult): InterviewerResult {
  return {
    technical: (r.technical ?? []).slice(0, 2).map(String),
    behavioral: (r.behavioral ?? []).slice(0, 2).map(String),
    system_design: (r.system_design ?? []).slice(0, 1).map(String),
  };
}

function validateSalaryProbability(r: SalaryProbabilityResult): SalaryProbabilityResult {
  return {
    salary_low: Math.max(0, Number(r.salary_low) || 0),
    salary_high: Math.max(0, Number(r.salary_high) || 0),
    salary_currency: String(r.salary_currency ?? "USD"),
    probability: clamp(Number(r.probability) || 0),
    probability_factors: {
      positive: (r.probability_factors?.positive ?? []).slice(0, 3).map(String),
      negative: (r.probability_factors?.negative ?? []).slice(0, 3).map(String),
    },
  };
}

/**
 * Runs all 5 persona analyses in parallel. A failed persona yields null so
 * the UI can render partial results — unless EVERY call failed, or we hit a
 * rate limit, which are surfaced as errors.
 */
export async function runAnalysis(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const userPrompt = buildUserPrompt(resumeText, jobDescription);

  const [recruiter, ats, hiringManager, interviewer, salaryProbability] =
    await Promise.allSettled([
      completeJson<RecruiterResult>(RECRUITER_SYSTEM, userPrompt),
      completeJson<AtsResult>(ATS_SYSTEM, userPrompt),
      completeJson<HiringManagerResult>(HIRING_MANAGER_SYSTEM, userPrompt),
      completeJson<InterviewerResult>(INTERVIEWER_SYSTEM, userPrompt),
      completeJson<SalaryProbabilityResult>(SALARY_PROBABILITY_SYSTEM, userPrompt),
    ]);

  const settled = [recruiter, ats, hiringManager, interviewer, salaryProbability];

  if (settled.some((s) => s.status === "rejected" && s.reason instanceof RateLimitError)) {
    throw new RateLimitError();
  }
  if (settled.every((s) => s.status === "rejected")) {
    throw (settled[0] as PromiseRejectedResult).reason;
  }

  return {
    recruiter: recruiter.status === "fulfilled" ? validateRecruiter(recruiter.value) : null,
    ats: ats.status === "fulfilled" ? validateAts(ats.value) : null,
    hiringManager:
      hiringManager.status === "fulfilled"
        ? validateHiringManager(hiringManager.value)
        : null,
    interviewer:
      interviewer.status === "fulfilled" ? validateInterviewer(interviewer.value) : null,
    salaryProbability:
      salaryProbability.status === "fulfilled"
        ? validateSalaryProbability(salaryProbability.value)
        : null,
  };
}
