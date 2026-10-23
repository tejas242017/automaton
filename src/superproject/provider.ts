import OpenAI from "openai";

export interface TextCompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface TextModelProvider {
  complete(request: TextCompletionRequest): Promise<string>;
}

export interface OpenAICompatibleProviderConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
  timeoutMs?: number;
}

/**
 * Adapter for OpenAI Chat Completions-compatible endpoints.
 * The key is supplied by the operator and is never logged by this module.
 * This adapter provides text only; it deliberately does not expose model tool calls.
 */
export function createOpenAICompatibleProvider(
  config: OpenAICompatibleProviderConfig,
): TextModelProvider {
  const apiKey = config.apiKey.trim();
  const model = config.model.trim();
  if (!apiKey) throw new Error("A provider API key is required for live model calls.");
  if (!model) throw new Error("A model name is required for live model calls.");

  const timeoutMs = config.timeoutMs ?? 45_000;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 180_000) {
    throw new Error("timeoutMs must be an integer between 1000 and 180000.");
  }

  if (config.baseURL) {
    let parsed: URL;
    try {
      parsed = new URL(config.baseURL);
    } catch {
      throw new Error("baseURL must be a valid absolute URL.");
    }
    const isLoopback =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "::1";
    if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && isLoopback)) {
      throw new Error("Provider baseURL must use HTTPS; plain HTTP is permitted only for loopback development endpoints.");
    }
  }

  const client = new OpenAI({
    apiKey,
    ...(config.baseURL ? { baseURL: config.baseURL } : {}),
    timeout: timeoutMs,
    maxRetries: 0,
  });

  return {
    async complete(request): Promise<string> {
      if (!request.systemPrompt.trim()) throw new Error("systemPrompt cannot be empty.");
      if (!request.userPrompt.trim()) throw new Error("userPrompt cannot be empty.");
      if (request.maxOutputTokens !== undefined &&
          (!Number.isInteger(request.maxOutputTokens) ||
           request.maxOutputTokens < 1 ||
           request.maxOutputTokens > 32_768)) {
        throw new Error("maxOutputTokens must be an integer between 1 and 32768.");
      }
      if (request.temperature !== undefined &&
          (!Number.isFinite(request.temperature) ||
           request.temperature < 0 ||
           request.temperature > 2)) {
        throw new Error("temperature must be between 0 and 2.");
      }

      const result = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt },
        ],
        ...(request.maxOutputTokens !== undefined
          ? { max_tokens: request.maxOutputTokens }
          : {}),
        ...(request.temperature !== undefined
          ? { temperature: request.temperature }
          : {}),
      });
      const content = result.choices[0]?.message.content;
      if (typeof content !== "string" || !content.trim()) {
        throw new Error("The configured model returned no text content.");
      }
      return content.trim();
    },
  };
}

/** Reads secrets from the environment; nothing is written to disk by this function. */
export function providerFromEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): TextModelProvider {
  const apiKey = env.SUPERPROJECT_API_KEY ?? env.OPENAI_API_KEY ?? "";
  const model = env.SUPERPROJECT_MODEL ?? "";
  const baseURL = env.SUPERPROJECT_BASE_URL?.trim() || undefined;
  return createOpenAICompatibleProvider({ apiKey, model, baseURL });
}
