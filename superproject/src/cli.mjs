import { runPipeline } from "./pipeline.mjs";

function parseArgs(args) {
  let researchUrl;
  const topicParts = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--agent-reach") {
      researchUrl = args[i + 1];
      if (!researchUrl) throw new Error("--agent-reach requires an HTTPS URL.");
      i += 1;
    } else {
      topicParts.push(arg);
    }
  }
  return {
    researchUrl,
    topic: topicParts.length ? topicParts.join(" ") : "Research briefing: open standards and editorial quality",
  };
}

try {
  const options = parseArgs(process.argv.slice(2));
  const result = await runPipeline(options);
  console.log("AUTOMATON SUPERPROJECT");
  console.log(JSON.stringify(result, null, 2));
  if (result.mode === "fixture") {
    console.log("\nFixture mode: no model was called, no network request was made, and nothing was published.");
  } else {
    console.log("\nAgent Reach mode: read-only retrieval requested; output still requires human source review. Nothing was published.");
  }
} catch (error) {
  console.error(`Superproject run failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
