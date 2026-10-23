import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runPipeline } from "../src/pipeline.mjs";

test("pipeline can use an injected Agent Reach reader and records provenance", async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), "superproject-agent-reach-"));
  try {
    const result = await runPipeline({
      topic: "Research adapter smoke test",
      researchUrl: "https://example.org/research?utm_source=test",
      outputDir,
      now: new Date("2026-10-24T00:00:00.000Z"),
      agentReachReader: async (url) => {
        assert.equal(url, "https://example.org/research");
        return "Retrieved page text. A human must verify claims before publication.";
      },
    });
    assert.equal(result.mode, "agent-reach");
    assert.equal(result.sourceCount, 1);
    const sources = JSON.parse(await readFile(result.sourcesPath, "utf8"));
    const report = JSON.parse(await readFile(result.reportPath, "utf8"));
    const draft = await readFile(result.draftPath, "utf8");
    assert.equal(sources[0].url, "https://example.org/research");
    assert.equal(report.mode, "agent-reach");
    assert.equal(report.published, false);
    assert.match(draft, /Retrieved page text/);
    assert.match(report.warnings.join(" "), /not independently fact-checked/i);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test("pipeline refuses empty Agent Reach output", async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), "superproject-agent-reach-empty-"));
  try {
    await assert.rejects(
      runPipeline({
        topic: "Empty research",
        researchUrl: "https://example.org/",
        outputDir,
        agentReachReader: async () => "  ",
      }),
      /no usable content/i,
    );
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
