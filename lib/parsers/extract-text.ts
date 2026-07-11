export type ParseErrorCode = "unsupported" | "unreadable" | "no-text";

/** Carries a machine-readable code; the UI maps it to a localized message. */
export class ParseError extends Error {
  code: ParseErrorCode;

  constructor(code: ParseErrorCode, message: string) {
    super(message);
    this.name = "ParseError";
    this.code = code;
  }
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(text);
  }
  return pages.join("\n\n");
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Extracts plain text from a resume file (PDF, DOCX, or TXT), fully client-side.
 * Throws ParseError with a user-friendly message on failure.
 */
export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  let text: string;

  try {
    if (name.endsWith(".pdf")) {
      text = await extractPdf(file);
    } else if (name.endsWith(".docx")) {
      text = await extractDocx(file);
    } else if (name.endsWith(".txt")) {
      text = await file.text();
    } else {
      throw new ParseError(
        "unsupported",
        "Unsupported file type. Please upload a PDF, DOCX, or TXT file."
      );
    }
  } catch (err) {
    if (err instanceof ParseError) throw err;
    throw new ParseError(
      "unreadable",
      "Could not read this file. It may be corrupted or image-based — paste your resume text instead."
    );
  }

  if (text.trim().length < 50) {
    throw new ParseError(
      "no-text",
      "This file contains almost no readable text (it may be a scanned image). Paste your resume text instead."
    );
  }
  return text.trim();
}
