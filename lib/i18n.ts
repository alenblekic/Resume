import type { Lang } from "./types";
import { useAppStore } from "./store";

const en = {
  home: {
    system: "┌ hiring surveillance system v2.0 ┐",
    intro:
      "> 4 AI hiring personas will process your document: recruiter // ATS // hiring manager // interviewer",
    analyze: "Initiate analysis",
    genericError: "Something went wrong analyzing your resume. Please try again.",
    faultTitle: "System fault",
    reboot: "▸ Reboot session",
  },
  upload: {
    label: "▸ Subject document",
    uploadAria: "Upload resume — PDF, DOCX, or TXT",
    parsing: "Ingesting document…",
    dropRelease: "Target acquired — release",
    linesIngested: (n: number) => `// ${n} LINES INGESTED`,
    remove: "Remove resume",
    dropTitle: "Drop resume into scanner",
    dropHint: "or click to browse — PDF / DOCX / TXT",
    parseFault: "⚠ Parse fault:",
    genericParseError: "Could not read this file.",
    pastePlaceholder: "$ paste_resume_text_here",
    pasteAria: "Paste resume text",
    parseErrors: {
      unsupported: "Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
      unreadable:
        "Could not read this file. It may be corrupted or image-based — paste your resume text instead.",
      "no-text":
        "This file contains almost no readable text (it may be a scanned image). Paste your resume text instead.",
    },
  },
  jd: {
    label: "▸ Target position",
    placeholder: "$ paste_job_description — the more detail, the sharper the analysis",
    hint: "// career level & industry auto-detected from posting",
  },
  loading: {
    header: "┌ document processing in progress ┐",
    aria: "Analyzing your resume: four AI personas processing the document",
    extras: [
      "> cross-referencing job requirements…",
      "> salary band estimation running…",
      "> probability matrix computing…",
    ],
  },
  personas: {
    recruiter: {
      label: "Recruiter",
      statusLine: "RECRUITER.exe — first impression forming…",
    },
    ats: { label: "ATS", statusLine: "ATS.sys — keyword sweep in progress…" },
    hiringManager: {
      label: "Hiring Mgr",
      statusLine: "HIRING_MGR.exe — scrutinizing sections…",
    },
    interviewer: {
      label: "Interviewer",
      statusLine: "INTERVIEWER.bin — compiling questions…",
    },
  },
  results: {
    complete: "// Analysis complete",
    newScan: "▸ New scan",
    atsScore: "ATS Score",
    recruiterPass: "Recruiter First Pass",
    missingKeywords: "Missing Keywords",
    weakSections: "Weak Sections",
    salaryEstimate: "Salary Estimate",
    interviewQuestions: "Interview Questions",
    interviewProbability: "Interview Probability",
    statusGood: "STATUS: GOOD",
    statusNeedsWork: "STATUS: NEEDS WORK",
    footer: "Scan complete — no data retained",
  },
  card: {
    dataLost: "Data stream lost",
    rerun: "— re-run analysis.",
  },
  keywords: {
    empty: "No critical keywords missing — full coverage.",
    fix: ">> FIX:",
    importance: { critical: "critical", important: "important" },
  },
  weak: {
    empty: "No weak sections detected — document integrity high.",
    fix: ">> Fix:",
  },
  questions: {
    tabs: {
      technical: "Technical",
      behavioral: "Behavioral",
      system_design: "Sys Design",
    },
    empty: "No questions generated.",
  },
  salary: {
    band: "Est. compensation band",
  },
  probability: {
    boost: "Signal boost",
    drag: "Signal drag",
    odds: "Interview odds",
  },
};

export type Dict = typeof en;

const sv: Dict = {
  home: {
    system: "┌ rekryteringsövervakningssystem v2.0 ┐",
    intro:
      "> 4 AI-rekryteringspersonas kommer att bearbeta ditt dokument: rekryterare // ATS // rekryterande chef // intervjuare",
    analyze: "Initiera analys",
    genericError: "Något gick fel vid analysen av ditt CV. Försök igen.",
    faultTitle: "Systemfel",
    reboot: "▸ Starta om sessionen",
  },
  upload: {
    label: "▸ Subjektets dokument",
    uploadAria: "Ladda upp CV — PDF, DOCX eller TXT",
    parsing: "Läser in dokument…",
    dropRelease: "Mål låst — släpp",
    linesIngested: (n: number) => `// ${n} RADER INLÄSTA`,
    remove: "Ta bort CV",
    dropTitle: "Släpp ditt CV i skannern",
    dropHint: "eller klicka för att bläddra — PDF / DOCX / TXT",
    parseFault: "⚠ Läsfel:",
    genericParseError: "Kunde inte läsa filen.",
    pastePlaceholder: "$ klistra_in_cv_text_här",
    pasteAria: "Klistra in CV-text",
    parseErrors: {
      unsupported: "Filtypen stöds inte. Ladda upp en PDF-, DOCX- eller TXT-fil.",
      unreadable:
        "Kunde inte läsa filen. Den kan vara skadad eller bildbaserad — klistra in din CV-text istället.",
      "no-text":
        "Filen innehåller nästan ingen läsbar text (den kan vara en skannad bild). Klistra in din CV-text istället.",
    },
  },
  jd: {
    label: "▸ Måltjänst",
    placeholder: "$ klistra_in_jobbannons — ju fler detaljer, desto skarpare analys",
    hint: "// karriärnivå & bransch identifieras automatiskt från annonsen",
  },
  loading: {
    header: "┌ dokumentbearbetning pågår ┐",
    aria: "Analyserar ditt CV: fyra AI-personas bearbetar dokumentet",
    extras: [
      "> korsrefererar jobbkrav…",
      "> löneintervall estimeras…",
      "> sannolikhetsmatris beräknas…",
    ],
  },
  personas: {
    recruiter: {
      label: "Rekryterare",
      statusLine: "RECRUITER.exe — första intryck formas…",
    },
    ats: { label: "ATS", statusLine: "ATS.sys — nyckelordssvep pågår…" },
    hiringManager: {
      label: "Rekr. chef",
      statusLine: "HIRING_MGR.exe — granskar sektioner…",
    },
    interviewer: {
      label: "Intervjuare",
      statusLine: "INTERVIEWER.bin — kompilerar frågor…",
    },
  },
  results: {
    complete: "// Analys slutförd",
    newScan: "▸ Ny skanning",
    atsScore: "ATS-poäng",
    recruiterPass: "Rekryterarens första blick",
    missingKeywords: "Saknade nyckelord",
    weakSections: "Svaga sektioner",
    salaryEstimate: "Löneestimat",
    interviewQuestions: "Intervjufrågor",
    interviewProbability: "Intervjusannolikhet",
    statusGood: "STATUS: BRA",
    statusNeedsWork: "STATUS: BEHÖVER ARBETE",
    footer: "Skanning slutförd — ingen data sparas",
  },
  card: {
    dataLost: "Dataström förlorad",
    rerun: "— kör analysen igen.",
  },
  keywords: {
    empty: "Inga kritiska nyckelord saknas — full täckning.",
    fix: ">> FIX:",
    importance: { critical: "kritiskt", important: "viktigt" },
  },
  weak: {
    empty: "Inga svaga sektioner hittades — hög dokumentintegritet.",
    fix: ">> Fix:",
  },
  questions: {
    tabs: {
      technical: "Tekniska",
      behavioral: "Beteende",
      system_design: "Systemdesign",
    },
    empty: "Inga frågor genererade.",
  },
  salary: {
    band: "Uppskattat lönespann",
  },
  probability: {
    boost: "Signalförstärkning",
    drag: "Signalstörning",
    odds: "Intervjuodds",
  },
};

export const MESSAGES: Record<Lang, Dict> = { en, sv };

/** Current-language dictionary, reactive to the store's language toggle. */
export function useT(): Dict {
  return MESSAGES[useAppStore((s) => s.language)];
}
