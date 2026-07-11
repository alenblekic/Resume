# Resume Intelligence Engine

**Live demo: [resumeint-eng.vercel.app](https://resumeint-eng.vercel.app/)**

A free, AI-powered resume analyzer that simulates four different hiring perspectives at once — a recruiter, an ATS, a hiring manager, and a technical interviewer — and hands back a single, scannable verdict instead of a wall of generic advice.

Built as a portfolio piece with a deliberately over-the-top **cyberpunk HUD** presentation: a drifting smoke-ring shader backdrop, a glitching title, and a cinematic "document scan" sequence while the AI works.

## What it does

1. **You upload a resume** (PDF, DOCX, or TXT — parsed entirely in your browser, nothing is uploaded as a raw file) and **paste a job description**.
2. On submit, the app fires **five AI calls in parallel** against the same two inputs, each with a different persona and job:

   | Persona | Judges | Returns |
   |---|---|---|
   | **Recruiter** | First 30-second impression | One-line verdict, strengths, red flags, overall fit |
   | **ATS** | Keyword/requirement match | Score out of 100, missing keywords ranked critical → important, detected seniority & industry |
   | **Hiring Manager** | Weak spots in the writing | Up to 3 weak sections, each with a one-sentence fix |
   | **Technical Interviewer** | What they'd actually ask you | 2 technical, 2 behavioral, 1 system-design question, tailored to your resume |
   | **Compensation model** | Market fit | Estimated salary band + probability of landing an interview, with the factors driving that number |

3. Results render as a single dashboard. If one persona's call fails, that card shows a "data stream lost" state instead of taking down the whole page — you still get the other four.

## Language

An **EN / SV** toggle in the header switches the entire interface — and the AI's own output — between English and Swedish. Flip it before running an analysis and all five personas write their verdict, feedback, and questions in Swedish instead of English; results already on screen stay in whichever language they were generated in. The choice is remembered locally between visits.

## How it "thinks"

- All five prompts are given the **same resume + job description pair** and instructed to return structured JSON (`response_format: json_object`) so the app never has to guess at parsing free text.
- Each persona has a narrow, single-purpose system prompt (see [lib/ai/prompts.ts](lib/ai/prompts.ts)) rather than one mega-prompt trying to do everything — this keeps each answer focused and makes a bad response from one persona isolated from the rest.
- Calls run via `Promise.allSettled` (see [lib/ai/analysis.ts](lib/ai/analysis.ts)), so a slow or failed persona doesn't block the others.
- Every response is validated and clamped (scores forced into 0–100, arrays capped at their intended length, missing fields defaulted) before it reaches the UI — the model's JSON is treated as untrusted input, not gospel.
- Inference runs on [Groq](https://groq.com) (`llama-3.3-70b-versatile`), chosen for its free tier and low latency — the whole 5-call analysis typically finishes in a few seconds.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** — HUD panels, corner-bracket frames, neon utility classes
- **Framer Motion** — the scan sequence, count-up numbers, staggered card entrances, glitch bursts
- **Zustand** — client state machine (`idle → analyzing → results | error`)
- **groq-sdk** — AI inference
- **pdfjs-dist** / **mammoth** — client-side PDF / DOCX text extraction (files never leave the browser as binaries; only extracted text is sent to the API)
- **lucide-react** — icon set

## Design

The whole UI leans into a "hiring surveillance system" bit: a warm-charcoal background, crimson primary accent with cyan for positive signals and amber for warnings, Share Tech Mono for HUD labels, a soft vignette overlay, and an ambient violet/cyan smoke-ring shader drifting behind the content. The loading screen is the centerpiece — a wireframe resume gets swept by a laser while particles stream out to four persona nodes that light up one at a time with a live terminal log underneath.

Everything respects `prefers-reduced-motion` (the shader background, glitch, and the laser scan all fall back to static equivalents).

## Running it locally

```bash
npm install
```

Create `.env.local` in the project root with a free [Groq API key](https://console.groq.com):

```
GROQ_API_KEY=your_key_here
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
├── page.tsx                  # State machine: idle → analyzing → results
├── api/analyze/route.ts      # Single endpoint, orchestrates the 5 persona calls
└── components/
    ├── fx/                   # Smoke-ring shader background, scanlines, glitch text, typewriter, HUD frame
    └── ...                   # Upload zone, results cards, loading scene, language toggle, etc.
lib/
├── ai/                       # Groq client, per-persona prompts, orchestration + validation
├── parsers/                  # Client-side PDF/DOCX/TXT text extraction
├── i18n.ts                   # English/Swedish UI dictionary
├── store.ts                  # Zustand app state
└── types.ts                  # Shared types for every AI response shape
```

## Status

Core analysis flow is complete and working end-to-end. Not yet built: a one-click "improve this section" rewrite feature and result caching.
