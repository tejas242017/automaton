import { runPipeline } from "./pipeline.mjs";

try {
  const args = process.argv.slice(2);
  const topic = args.length ? args.join(" ") : "Research briefing: open standards and editorial quality";
  const result = await runPipeline({ topic });
  console.log("AUTOMATON SUPERPROJECT — FIXTURE MODE");
  console.log(JSON.stringify(result, null, 2));
  console.log("\nNo model was called. No network request was made. Nothing was published.");
} catch (error) {
  console.error(`Superproject run failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
