import type {
  AnalysisResult,
  AtsResult,
  Lang,
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
  withLanguage,
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

// spreads the persona launches so their first attempts (and any rate-limit
// retries) don't hit the tokens-per-minute window at the same instant
const STAGGER_MS = 400;

/**
 * Runs all 5 persona analyses in parallel. A failed persona yields null so
 * the UI can render partial results — only when EVERY call failed is an
 * error surfaced (as RateLimitError if any failure was a rate limit).
 */
export async function runAnalysis(
  resumeText: string,
  jobDescription: string,
  language: Lang = "en"
): Promise<AnalysisResult> {
  const userPrompt = buildUserPrompt(resumeText, jobDescription);
  const sys = (systemPrompt: string) => withLanguage(systemPrompt, language);

  const [recruiter, ats, hiringManager, interviewer, salaryProbability] =
    await Promise.allSettled([
      completeJson<RecruiterResult>(sys(RECRUITER_SYSTEM), userPrompt, 0 * STAGGER_MS),
      completeJson<AtsResult>(sys(ATS_SYSTEM), userPrompt, 1 * STAGGER_MS),
      completeJson<HiringManagerResult>(sys(HIRING_MANAGER_SYSTEM), userPrompt, 2 * STAGGER_MS),
      completeJson<InterviewerResult>(sys(INTERVIEWER_SYSTEM), userPrompt, 3 * STAGGER_MS),
      completeJson<SalaryProbabilityResult>(
        sys(SALARY_PROBABILITY_SYSTEM),
        userPrompt,
        4 * STAGGER_MS
      ),
    ]);

  const settled = [recruiter, ats, hiringManager, interviewer, salaryProbability];

  if (settled.every((s) => s.status === "rejected")) {
    if (settled.some((s) => (s as PromiseRejectedResult).reason instanceof RateLimitError)) {
      throw new RateLimitError();
    }
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
