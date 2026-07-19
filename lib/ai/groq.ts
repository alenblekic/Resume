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

const DEFAULT_RETRY_AFTER_MS = 15_000;
const MAX_RATE_LIMIT_RETRIES = 2;
const RATE_LIMIT_WAIT_BUDGET_MS = 40_000; // stays under the route's 60s maxDuration

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Runs a single JSON-mode chat completion and parses the result.
 * Retries rate limits with a retry-after-honoring delay (bounded), and once
 * on other transient failures (bad JSON, network blips).
 */
export async function completeJson<T>(
  systemPrompt: string,
  userPrompt: string,
  startDelayMs = 0
): Promise<T> {
  const groq = getClient();
  if (startDelayMs > 0) await sleep(startDelayMs);

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

  let waitedMs = 0;
  let rateLimitRetries = 0;
  let transientRetried = false;

  for (;;) {
    try {
      return await run();
    } catch (err) {
      if (err instanceof Groq.APIError && err.status === 429) {
        if (rateLimitRetries >= MAX_RATE_LIMIT_RETRIES || waitedMs >= RATE_LIMIT_WAIT_BUDGET_MS) {
          throw new RateLimitError();
        }
        const retryAfterSec = Number(err.headers?.get("retry-after"));
        const base =
          Number.isFinite(retryAfterSec) && retryAfterSec > 0
            ? retryAfterSec * 1000
            : DEFAULT_RETRY_AFTER_MS;
        // jitter decorrelates the concurrent persona retries
        const delay = Math.min(base + Math.random() * 4_000, RATE_LIMIT_WAIT_BUDGET_MS - waitedMs);
        waitedMs += delay;
        rateLimitRetries++;
        await sleep(delay);
        continue;
      }
      // one retry for transient failures (bad JSON, network blips)
      if (transientRetried) throw err;
      transientRetried = true;
    }
  }
}
