import { createStarterWorkflow, executeWorkflow } from "./workflow.js";
import type { TaskExecutor } from "./workflow.js";

/**
 * A no-cost deterministic demonstration. It does not call a model or execute tools.
 * Replace the executor only after adding a provider adapter and applying policy checks.
 */
export async function runSuperprojectDemo(goal: string, approveImplementation = false) {
  const workflow = createStarterWorkflow(goal);
  const executor: TaskExecutor = async (task, dependencies) => {
    const dependencyCount = Object.keys(dependencies).length;
    return {
      simulated: true,
      role: task.role,
      summary: `Demo output for ${task.id}: ${task.input}`,
      dependencyCount,
      nextStep: task.id === "plan" ? "Request human approval before implementation." : undefined,
    };
  };

  return executeWorkflow(
    workflow,
    executor,
    { approvedTaskIds: approveImplementation ? ["implement"] : [] },
  );
}
