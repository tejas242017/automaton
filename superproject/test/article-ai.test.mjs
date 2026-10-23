import test from "node:test";
import assert from "node:assert/strict";
import { createAiDraft } from "../src/article.mjs";

test("AI draft uses writer and editor/critic passes, preserves links, and stays unpublished", async () => {
  const requests = [];
  const provider = {
    model: "fake-model",
    requestsUsed: 0,
    async complete(input) {
      requests.push(input);
      this.requestsUsed += 1;
      return requests.length === 1
        ? "First draft with a sourced claim [1].\n\n## What remains to verify\nCheck evidence."
        : "Edited draft with a sourced claim [1].\n\n## What remains to verify\nCheck evidence.";
    },
  };
  const draft = await createAiDraft({
    topic: "Test article",
    sources: [{ title: "Example source", url: "https://example.org/a", publishedAt: null, description: "Source snippet." }],
    modelProvider: provider,
    generatedAt: "2026-10-24T00:00:00.000Z",
  });
  assert.equal(requests.length, 2);
  assert.match(requests[0].system, /Do not invent facts/);
  assert.match(requests[0].prompt, /https:\/\/example\.org\/a/);
  assert.match(requests[1].system, /Independent editor and fact-check critic/);
  assert.match(draft.markdown, /AI-assisted draft/);
  assert.match(draft.markdown, /https:\/\/example\.org\/a/);
  assert.match(draft.markdown, /Edited draft with a sourced claim/);
  assert.match(draft.markdown, /not approved or published/i);
  assert.equal(draft.status, "draft");
  assert.equal(draft.modelRequestsUsed, 2);
});

test("AI draft refuses missing provider", async () => {
  await assert.rejects(createAiDraft({ topic: "x", sources: [{ url: "https://example.org" }] }), /configured text model provider/);
});
