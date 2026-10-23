function escapeMarkdown(value) {
  return String(value ?? "").replace(/\r/g, "").trim();
}

export function createDraft({ topic, sources, generatedAt = new Date().toISOString() }) {
  if (!topic?.trim()) throw new Error("A topic is required.");
  if (!Array.isArray(sources) || sources.length === 0) throw new Error("At least one source is required.");
  const sourceRows = sources.map((source, index) => {
    const description = escapeMarkdown(source.description);
    return {
      number: index + 1,
      title: escapeMarkdown(source.title),
      url: source.url,
      publishedAt: source.publishedAt,
      description,
    };
  });
  const headline = escapeMarkdown(topic);
  const body = [
    `# ${headline}`,
    "",
    `> Draft created ${generatedAt}. This is a research scaffold, not a fact-checked article.`,
    "",
    "## Editorial summary",
    "",
    "This draft organizes the selected sources for a writer to review. The feed descriptions below are source-provided snippets; they have not been independently verified by this prototype.",
    "",
    "## Source notes",
    "",
    ...sourceRows.flatMap((source) => [
      `### ${source.number}. ${source.title}`,
      "",
      source.description || "_No description was supplied in the feed._",
      "",
      `Source: ${source.url}`,
      source.publishedAt ? `Published: ${source.publishedAt}` : "Publication date: unknown",
      "",
    ]),
    "## Fact-check checklist",
    "",
    "- [ ] Open each source and confirm that it supports the planned claims.",
    "- [ ] Verify dates, names, figures and quotations against primary sources.",
    "- [ ] Distinguish source facts from interpretation and opinion.",
    "- [ ] Check image, quotation and reuse rights before publication.",
    "- [ ] Have a human editor approve the final article.",
    "",
    "## Publication status",
    "",
    "**Draft only. Not approved or published.**",
    "",
  ].join("\n");
  return { title: headline, generatedAt, sources: sourceRows, markdown: body, status: "draft" };
}

export function createRunReport({ runId, startedAt, finishedAt, inputPath, sources, outputPath, mode = "fixture" }) {
  return {
    schemaVersion: 1,
    runId,
    mode,
    startedAt,
    finishedAt,
    inputPath,
    sourceCount: sources.length,
    sourceIds: sources.map((source) => source.id),
    outputPath,
    published: false,
    warnings: ["Fixture/template mode was used; no source was fetched from the internet and no model was called."],
  };
}
