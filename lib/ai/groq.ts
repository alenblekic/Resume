import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      throw new Error("GROQ_API_KEY is not configured");
    }
    client = new Groq({ apiKey });
  }
  return client;
}

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

/**
 * Runs a single JSON-mode chat completion and parses the result.
 * Retries once on transient failure (but not on rate limits).
 */
export async function completeJson<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const groq = getClient();

  const run = async (): Promise<T> => {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from model");
    return JSON.parse(content) as T;
  };

  try {
    return await run();
  } catch (err) {
    if (err instanceof Groq.APIError && err.status === 429) {
      throw new RateLimitError();
    }
    // one retry for transient failures (bad JSON, network blips)
    return await run();
  }
}
