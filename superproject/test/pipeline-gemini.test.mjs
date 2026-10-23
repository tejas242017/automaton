import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runPipeline } from "../src/pipeline.mjs";

test("AI pipeline uses injected provider and keeps fixture flow free of network", async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), "superproject-gemini-"));
  let calls = 0;
  try {
    const result = await runPipeline({
      topic: "AI fixture smoke",
      outputDir,
      now: new Date("2026-10-24T00:00:00.000Z"),
      ai: true,
      modelProvider: {
        model: "test-model",
        async complete() {
          calls += 1;
          return "Generated text using supplied source notes.\n\n## What remains to verify\nCheck evidence.";
        },
      },
    });
    assert.equal(calls, 2);
    assert.equal(result.mode, "fixture+gemini");
    assert.equal(result.published, false);
    const draft = await readFile(result.draftPath, "utf8");
    const report = JSON.parse(await readFile(result.reportPath, "utf8"));
    assert.match(draft, /Generated text using supplied source notes/);
    assert.equal(report.mode, "fixture+gemini");
    assert.equal(report.model, "test-model");
    assert.equal(report.modelRequestsUsed, 2);
    assert.match(report.warnings.join(" "), /human verification/i);
    assert.equal(report.published, false);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
