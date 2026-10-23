import { describe, expect, it, vi } from "vitest";
import { createModelTaskExecutor, runModelWorkflow } from "../superproject/agent-runner.js";
import type { TextModelProvider, TextCompletionRequest } from "../superproject/provider.js";

describe("superproject model runner", () => {
  it("passes task role and dependency output to an injected provider", async () => {
    const complete = vi.fn(async (_request: TextCompletionRequest) => "A bounded plan.");
    const executor = createModelTaskExecutor({ complete } as TextModelProvider);
    const result = await executor(
      { id: "plan", role: "planner", input: "Plan a basic workflow." },
      { research: { summary: "Research summary" } },
    );
    expect(complete).toHaveBeenCalledTimes(1);
    expect(complete.mock.calls[0]?.[0].systemPrompt).toContain("planner");
    expect(complete.mock.calls[0]?.[0].userPrompt).toContain("Research summary");
    expect(result).toMatchObject({ role: "planner", taskId: "plan", text: "A bounded plan." });
  });

  it("keeps implementation paused without explicit approval", async () => {
    const complete = vi.fn(async (_request: TextCompletionRequest) => "simulated text");
    const result = await runModelWorkflow(
      "Draft a project plan",
      { complete } as TextModelProvider,
      false,
    );
    expect(result.status).toBe("needs_approval");
    expect(complete).toHaveBeenCalledTimes(2);
    expect(result.tasks.find((task) => task.taskId === "implement")?.status).toBe("awaiting_approval");
  });
});
