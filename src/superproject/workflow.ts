import type {
  AgentRole,
  AuditEvent,
  TaskResult,
  WorkflowDefinition,
  WorkflowResult,
  WorkflowTask,
} from "./types.js";

export type TaskExecutor = (
  task: WorkflowTask,
  dependencyOutputs: Readonly<Record<string, unknown>>,
) => Promise<unknown>;

export interface WorkflowOptions {
  approvedTaskIds?: readonly string[];
  maxTasks?: number;
}

function topologicalOrder(definition: WorkflowDefinition, maxTasks: number): WorkflowTask[] {
  if (!definition.name.trim()) throw new Error("Workflow name is required.");
  if (!definition.goal.trim()) throw new Error("Workflow goal is required.");
  if (!Array.isArray(definition.tasks) || definition.tasks.length === 0) {
    throw new Error("Workflow must contain at least one task.");
  }
  if (definition.tasks.length > maxTasks) {
    throw new Error(`Workflow has ${definition.tasks.length} tasks; configured limit is ${maxTasks}.`);
  }

  const byId = new Map<string, WorkflowTask>();
  for (const task of definition.tasks) {
    if (!task.id.trim()) throw new Error("Every task must have an id.");
    if (byId.has(task.id)) throw new Error(`Duplicate task id: ${task.id}`);
    byId.set(task.id, task);
  }

  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  for (const task of definition.tasks) {
    const uniqueDependencies = new Set(task.dependsOn ?? []);
    if (uniqueDependencies.has(task.id)) throw new Error(`Task '${task.id}' cannot depend on itself.`);
    for (const dependencyId of uniqueDependencies) {
      if (!byId.has(dependencyId)) {
        throw new Error(`Task '${task.id}' depends on unknown task '${dependencyId}'.`);
      }
      const list = dependents.get(dependencyId) ?? [];
      list.push(task.id);
      dependents.set(dependencyId, list);
    }
    indegree.set(task.id, uniqueDependencies.size);
  }

  const ready = definition.tasks.filter((task) => indegree.get(task.id) === 0);
  const ordered: WorkflowTask[] = [];
  while (ready.length) {
    const task = ready.shift()!;
    ordered.push(task);
    for (const dependentId of dependents.get(task.id) ?? []) {
      const nextDegree = indegree.get(dependentId)! - 1;
      indegree.set(dependentId, nextDegree);
      if (nextDegree === 0) ready.push(byId.get(dependentId)!);
    }
  }

  if (ordered.length !== definition.tasks.length) {
    throw new Error("Workflow dependencies contain a cycle.");
  }
  return ordered;
}

/**
 * Runs an explicitly supplied task graph using an injected executor.
 * It has no shell, network, model, publishing, or payment capability by itself.
 * Side-effecting stages pause until their task id appears in approvedTaskIds.
 */
export async function executeWorkflow(
  definition: WorkflowDefinition,
  executor: TaskExecutor,
  options: WorkflowOptions = {},
): Promise<WorkflowResult> {
  const ordered = topologicalOrder(definition, options.maxTasks ?? 20);
  const approved = new Set(options.approvedTaskIds ?? []);
  const results = new Map<string, TaskResult>();
  const outputs: Record<string, unknown> = {};
  const audit: AuditEvent[] = [];
  const stamp = () => new Date().toISOString();

  for (const task of ordered) {
    const dependencies = task.dependsOn ?? [];
    const dependencyResults = dependencies.map((id) => results.get(id)!);
    const failedDependency = dependencyResults.find((result) => result.status === "failed" || result.status === "blocked");
    if (failedDependency) {
      results.set(task.id, {
        taskId: task.id,
        role: task.role,
        status: "blocked",
        error: `Dependency '${failedDependency.taskId}' did not complete.`,
      });
      audit.push({ at: stamp(), action: "task", subject: task.id, outcome: "blocked", detail: "Dependency did not complete." });
      continue;
    }

    const pendingDependency = dependencyResults.find((result) => result.status !== "completed");
    if (pendingDependency) {
      results.set(task.id, {
        taskId: task.id,
        role: task.role,
        status: "blocked",
        error: `Dependency '${pendingDependency.taskId}' is awaiting approval or has not completed.`,
      });
      audit.push({ at: stamp(), action: "task", subject: task.id, outcome: "blocked", detail: "Dependency is not complete." });
      continue;
    }

    if (task.requiresApproval && !approved.has(task.id)) {
      results.set(task.id, { taskId: task.id, role: task.role, status: "awaiting_approval" });
      audit.push({ at: stamp(), action: "approval", subject: task.id, outcome: "required" });
      continue;
    }

    results.set(task.id, { taskId: task.id, role: task.role, status: "running" });
    audit.push({ at: stamp(), action: "task", subject: task.id, outcome: "started" });
    try {
      const dependencyOutputs = Object.fromEntries(
        dependencies.map((id) => [id, outputs[id]]),
      );
      const output = await executor(task, dependencyOutputs);
      outputs[task.id] = output;
      results.set(task.id, { taskId: task.id, role: task.role, status: "completed", output });
      audit.push({ at: stamp(), action: "task", subject: task.id, outcome: "completed" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown task execution error.";
      results.set(task.id, { taskId: task.id, role: task.role, status: "failed", error: message });
      audit.push({ at: stamp(), action: "task", subject: task.id, outcome: "failed", detail: message });
    }
  }

  const taskResults = ordered.map((task) => results.get(task.id)!);
  let status: WorkflowResult["status"] = "completed";
  if (taskResults.some((result) => result.status === "failed")) status = "failed";
  else if (taskResults.some((result) => result.status === "awaiting_approval")) status = "needs_approval";
  else if (taskResults.some((result) => result.status === "blocked")) status = "blocked";

  return { workflowName: definition.name, status, tasks: taskResults, audit };
}

/** Small starter workflow; the implementation step is intentionally gated. */
export function createStarterWorkflow(goal: string): WorkflowDefinition {
  const safeGoal = goal.trim();
  if (!safeGoal) throw new Error("A non-empty goal is required.");

  return {
    name: "Superproject starter workflow",
    goal: safeGoal,
    tasks: [
      { id: "research", role: "researcher", input: `Gather relevant context for: ${safeGoal}` },
      { id: "plan", role: "planner", input: `Create a bounded plan for: ${safeGoal}`, dependsOn: ["research"] },
      {
        id: "implement",
        role: "implementer",
        input: `Prepare implementation for: ${safeGoal}`,
        dependsOn: ["plan"],
        requiresApproval: true,
      },
      {
        id: "review",
        role: "critic",
        input: `Review the implementation result for: ${safeGoal}`,
        dependsOn: ["implement"],
      },
    ],
  };
}

export const roleForTask = (task: WorkflowTask): AgentRole => task.role;
