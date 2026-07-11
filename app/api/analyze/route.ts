import { NextRequest, NextResponse } from "next/server";
import { runAnalysis } from "@/lib/ai/analysis";
import { RateLimitError } from "@/lib/ai/groq";

export const maxDuration = 60;

const MAX_CHARS = 30_000;

export async function POST(req: NextRequest) {
  let body: { resumeText?: string; jobDescription?: string; language?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const resumeText = body.resumeText?.trim() ?? "";
  const jobDescription = body.jobDescription?.trim() ?? "";
  const language = body.language === "sv" ? "sv" : "en";

  if (!resumeText || !jobDescription) {
    return NextResponse.json(
      { error: "Both a resume and a job description are required." },
      { status: 400 }
    );
  }

  try {
    const results = await runAnalysis(
      resumeText.slice(0, MAX_CHARS),
      jobDescription.slice(0, MAX_CHARS),
      language
    );
    return NextResponse.json(results);
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: "The AI service is busy right now — please try again in a minute." },
        { status: 503 }
      );
    }
    console.error("Analysis failed:", err);
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again in a few minutes." },
      { status: 503 }
    );
  }
}
