import { runSuperprojectDemo } from "../src/superproject/demo.js";
import { runModelWorkflow } from "../src/superproject/agent-runner.js";
import { providerFromEnvironment } from "../src/superproject/provider.js";

const args = process.argv.slice(2);
const mock = args.includes("--mock");
const approveImplementation = args.includes("--approve-implementation");
const goal = args.filter((arg) => !arg.startsWith("--")).join(" ").trim();

if (!goal) {
  console.error("Usage: pnpm exec tsx scripts/superproject-demo.ts [--mock] [--approve-implementation] <goal>");
  process.exitCode = 2;
} else {
  try {
    const result = mock
      ? await runSuperprojectDemo(goal, approveImplementation)
      : await runModelWorkflow(goal, providerFromEnvironment(), approveImplementation);
    console.log(JSON.stringify(result, null, 2));
    if (result.status === "failed") process.exitCode = 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    console.error(`Superproject demo failed: ${message}`);
    process.exitCode = 1;
  }
}
