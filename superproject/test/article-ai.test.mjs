import test from "node:test";
import assert from "node:assert/strict";
import { createAiDraft } from "../src/article.mjs";

test("AI draft uses only source records, preserves links, and stays unpublished", async () => {
  let request;
  const provider = {
    model: "fake-model",
    async complete(input) {
      request = input;
      return "A short draft with a sourced claim [1].\n\n## What remains to verify\nThe detail needs a human check.";
    },
  };
  const draft = await createAiDraft({
    topic: "Test article",
    sources: [{ title: "Example source", url: "https://example.org/a", publishedAt: null, description: "Source snippet." }],
    modelProvider: provider,
    generatedAt: "2026-10-24T00:00:00.000Z",
  });
  assert.match(request.system, /Do not invent facts/);
  assert.match(request.prompt, /https:\/\/example\.org\/a/);
  assert.match(draft.markdown, /AI-assisted draft/);
  assert.match(draft.markdown, /https:\/\/example\.org\/a/);
  assert.match(draft.markdown, /not approved or published/i);
  assert.equal(draft.status, "draft");
});

test("AI draft refuses missing provider", async () => {
  await assert.rejects(createAiDraft({ topic: "x", sources: [{ url: "https://example.org" }] }), /configured text model provider/);
});
