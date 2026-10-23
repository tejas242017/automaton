import test from "node:test";
import assert from "node:assert/strict";
import { createGeminiProvider, GEMINI_PROVIDER_LIMITS } from "../src/gemini.mjs";

function mockResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return payload; },
  };
}

test("Gemini provider requires a key only when explicitly created", () => {
  assert.throws(() => createGeminiProvider({ apiKey: "" }), /GEMINI_API_KEY/);
});

test("Gemini provider calls only Google's fixed endpoint with bounded text", async () => {
  let call;
  const provider = createGeminiProvider({
    apiKey: "not-a-real-key",
    fetchImpl: async (url, options) => {
      call = { url, options };
      return mockResponse({ choices: [{ message: { content: "Draft text" } }] });
    },
  });
  assert.equal(await provider.complete({ system: "You are a writer.", prompt: "Use the source notes." }), "Draft text");
  assert.equal(call.url, GEMINI_PROVIDER_LIMITS.endpoint);
  assert.equal(call.options.method, "POST");
  assert.equal(call.options.headers.Authorization, "Bearer not-a-real-key");
  assert.equal(JSON.parse(call.options.body).model, GEMINI_PROVIDER_LIMITS.defaultModel);
  assert.equal(provider.requestsUsed, 1);
});

test("Gemini provider enforces per-run call limit and never falls back", async () => {
  let requests = 0;
  const provider = createGeminiProvider({
    apiKey: "test",
    maxRequests: 1,
    fetchImpl: async () => { requests += 1; return mockResponse({ choices: [{ message: { content: "ok" } }] }); },
  });
  await provider.complete({ system: "system", prompt: "first" });
  await assert.rejects(provider.complete({ system: "system", prompt: "second" }), /budget exhausted/);
  assert.equal(requests, 1);
});

test("Gemini errors are returned without automatic retries", async () => {
  let requests = 0;
  const provider = createGeminiProvider({
    apiKey: "test",
    fetchImpl: async () => { requests += 1; return mockResponse({ error: { message: "Quota exceeded" } }, 429); },
  });
  await assert.rejects(provider.complete({ system: "system", prompt: "hello" }), /Quota exceeded/);
  assert.equal(requests, 1);
});

test("Gemini adapter bounds prompt and output sizes", async () => {
  const provider = createGeminiProvider({ apiKey: "test", fetchImpl: async () => mockResponse({ choices: [{ message: { content: "ok" } }] }) });
  await assert.rejects(provider.complete({ system: "s", prompt: "p".repeat(GEMINI_PROVIDER_LIMITS.maxInputChars + 1) }), /exceeds/);
  await assert.rejects(provider.complete({ system: "s", prompt: "p", maxOutputTokens: GEMINI_PROVIDER_LIMITS.maxOutputTokens + 1 }), /maxOutputTokens/);
});
