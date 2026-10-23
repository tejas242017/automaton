import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseRss, normalizeSourceUrl } from "../src/rss.mjs";
import { createDraft } from "../src/article.mjs";
import { runPipeline } from "../src/pipeline.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.resolve(here, "../fixtures/feed.xml");

test("normalizes tracking params and fragments", () => {
  assert.equal(
    normalizeSourceUrl("HTTPS://Example.org/story?utm_source=test&x=1#section"),
    "https://example.org/story?x=1",
  );
});

test("rejects unsafe and relative URL schemes", () => {
  assert.throws(() => normalizeSourceUrl("file:///etc/passwd"), /HTTP/);
  assert.throws(() => normalizeSourceUrl("/relative"), /absolute/);
});

test("parses fixture and deduplicates normalized links", async () => {
  const xml = await readFile(fixture, "utf8");
  const rows = parseRss(xml, { retrievedAt: "2026-10-24T00:00:00.000Z" });
  assert.equal(rows.length, 2);
  assert.ok(rows.every((row) => row.url.startsWith("https://")));
  assert.ok(rows.every((row) => row.id && row.retrievedAt));
});

test("draft preserves URLs and states that sources are not verified", async () => {
  const xml = await readFile(fixture, "utf8");
  const sources = parseRss(xml, { retrievedAt: "2026-10-24T00:00:00.000Z" });
  const draft = createDraft({ topic: "A test article", sources, generatedAt: "2026-10-24T00:00:00.000Z" });
  assert.equal(draft.status, "draft");
  assert.match(draft.markdown, /not been independently verified/i);
  for (const source of sources) assert.ok(draft.markdown.includes(source.url));
  assert.match(draft.markdown, /Not approved or published/);
});

test("pipeline writes markdown, sources and run report without network/API calls", async () => {
  const tmp = await import("node:os").then((m) => m.tmpdir());
  const { mkdtemp, rm, readFile: read } = await import("node:fs/promises");
  const output = await mkdtemp(path.join(tmp, "automaton-superproject-"));
  try {
    const result = await runPipeline({ inputPath: fixture, outputDir: output, topic: "Pipeline smoke test", now: new Date("2026-10-24T00:00:00.000Z") });
    assert.equal(result.sourceCount, 2);
    assert.equal(result.published, false);
    const draft = await read(result.draftPath, "utf8");
    const sourceJson = JSON.parse(await read(result.sourcesPath, "utf8"));
    const report = JSON.parse(await read(result.reportPath, "utf8"));
    assert.match(draft, /Pipeline smoke test/);
    assert.equal(sourceJson.length, 2);
    assert.equal(report.published, false);
    assert.equal(report.mode, "fixture");
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
