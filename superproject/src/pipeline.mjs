import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDraft, createRunReport } from "./article.mjs";
import { runAgentReachRead } from "./agent-reach.mjs";
import { normalizeSourceUrl, parseRss } from "./rss.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_FIXTURE = path.resolve(here, "../fixtures/feed.xml");
export const DEFAULT_OUTPUT_DIR = path.resolve(here, "../output");

export async function runPipeline({
  topic = "Research briefing: open standards and editorial quality",
  inputPath = DEFAULT_FIXTURE,
  outputDir = DEFAULT_OUTPUT_DIR,
  researchUrl,
  agentReachReader = runAgentReachRead,
  now = new Date(),
} = {}) {
  const startedAt = now.toISOString();
  let sources;
  let mode = "fixture";
  let sourceInputPath = inputPath;

  if (researchUrl) {
    const url = normalizeSourceUrl(researchUrl);
    const retrievedText = await agentReachReader(url);
    if (typeof retrievedText !== "string" || !retrievedText.trim()) {
      throw new Error("The research adapter returned no usable content.");
    }
    mode = "agent-reach";
    sourceInputPath = `Agent Reach read: ${url}`;
    sources = [{
      id: createHash("sha256").update(url).digest("hex").slice(0, 16),
      title: url,
      url,
      publishedAt: null,
      description: retrievedText.trim().slice(0, 30_000),
      feedTitle: "Agent Reach read-only research",
      retrievedAt: startedAt,
    }];
  } else {
    const xml = await readFile(inputPath, "utf8");
    sources = parseRss(xml, { retrievedAt: startedAt });
  }

  if (sources.length === 0) throw new Error("No valid source records found in the input.");
  const runId = createHash("sha256").update(startedAt + topic + sourceInputPath).digest("hex").slice(0, 12);
  const draft = createDraft({ topic, sources, generatedAt: startedAt });
  await mkdir(outputDir, { recursive: true });
  const draftPath = path.join(outputDir, `${runId}-draft.md`);
  const sourcesPath = path.join(outputDir, `${runId}-sources.json`);
  const reportPath = path.join(outputDir, `${runId}-run.json`);
  await writeFile(draftPath, draft.markdown, "utf8");
  await writeFile(sourcesPath, JSON.stringify(sources, null, 2) + "\n", "utf8");
  const finishedAt = new Date().toISOString();
  const report = createRunReport({
    runId,
    startedAt,
    finishedAt,
    inputPath: mode === "fixture" ? path.relative(process.cwd(), inputPath) : sourceInputPath,
    sources,
    outputPath: path.relative(process.cwd(), draftPath),
    mode,
  });
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  return { runId, sourceCount: sources.length, draftPath, sourcesPath, reportPath, published: false, mode };
}
