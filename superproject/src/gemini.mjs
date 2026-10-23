const GEMINI_OPENAI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const MAX_REQUESTS_PER_RUN = 2;
const MAX_OUTPUT_TOKENS = 1_800;
const MAX_INPUT_CHARS = 22_000;

function asErrorMessage(data, status) {
  const message = data && typeof data.error?.message === "string"
    ? data.error.message
    : `Gemini API returned HTTP ${status}.`;
  return message.slice(0, 1200);
}

/**
 * Small, explicitly opt-in Gemini adapter using Google's documented OpenAI-compatible endpoint.
 * It fixes the endpoint (no caller-controlled base URL), caps model calls per process,
 * caps input/output, has no retries/fallbacks, and never logs the key.
 *
 * Important: API billing tier is configured in Google AI Studio/Cloud, not discoverable
 * here. Use a free-tier project without billing attached if you require a hard ₹0 ceiling.
 */
export function createGeminiProvider({
  apiKey = process.env.GEMINI_API_KEY ?? "",
  model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
  maxRequests = MAX_REQUESTS_PER_RUN,
  timeoutMs = 30_000,
  fetchImpl = fetch,
} = {}) {
  const key = String(apiKey).trim();
  const modelId = String(model).trim();
  if (!key) throw new Error("AI mode requires GEMINI_API_KEY. Fixture mode remains free and works without it.");
  if (!modelId || !/^[a-zA-Z0-9._-]{1,100}$/.test(modelId)) {
    throw new Error("GEMINI_MODEL must be a valid model id.");
  }
  if (!Number.isInteger(maxRequests) || maxRequests < 1 || maxRequests > MAX_REQUESTS_PER_RUN) {
    throw new Error(`maxRequests must be 1-${MAX_REQUESTS_PER_RUN}; the per-run cap cannot be raised here.`);
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 60_000) {
    throw new Error("timeoutMs must be between 1000 and 60000.");
  }

  let requestCount = 0;
  return {
    model: modelId,
    get requestsUsed() { return requestCount; },
    async complete({ system, prompt, maxOutputTokens = MAX_OUTPUT_TOKENS }) {
      if (requestCount >= maxRequests) {
        throw new Error(`Gemini request budget exhausted (${maxRequests} calls per run). No fallback provider will be called.`);
      }
      if (typeof system !== "string" || !system.trim()) throw new Error("System instructions are required.");
      if (typeof prompt !== "string" || !prompt.trim()) throw new Error("Prompt is required.");
      if (!Number.isInteger(maxOutputTokens) || maxOutputTokens < 1 || maxOutputTokens > MAX_OUTPUT_TOKENS) {
        throw new Error(`maxOutputTokens must be between 1 and ${MAX_OUTPUT_TOKENS}.`);
      }
      const input = `${system.trim()}\n\n${prompt.trim()}`;
      if (input.length > MAX_INPUT_CHARS) throw new Error(`Gemini input exceeds ${MAX_INPUT_CHARS} characters.`);

      requestCount += 1;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl(GEMINI_OPENAI_ENDPOINT, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              { role: "system", content: system.trim() },
              { role: "user", content: prompt.trim() },
            ],
            max_tokens: maxOutputTokens,
            temperature: 0.2,
          }),
          signal: controller.signal,
        });
        let payload;
        try {
          payload = await response.json();
        } catch {
          throw new Error("Gemini returned a non-JSON response.");
        }
        if (!response.ok) throw new Error(asErrorMessage(payload, response.status));
        const text = payload?.choices?.[0]?.message?.content;
        if (typeof text !== "string" || !text.trim()) {
          throw new Error("Gemini returned no text content.");
        }
        return text.trim().slice(0, 20_000);
      } catch (error) {
        if (error?.name === "AbortError") throw new Error("Gemini request timed out; no retry or paid fallback was attempted.");
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export const GEMINI_PROVIDER_LIMITS = Object.freeze({
  endpoint: GEMINI_OPENAI_ENDPOINT,
  defaultModel: DEFAULT_MODEL,
  maxRequestsPerRun: MAX_REQUESTS_PER_RUN,
  maxOutputTokens: MAX_OUTPUT_TOKENS,
  maxInputChars: MAX_INPUT_CHARS,
});
