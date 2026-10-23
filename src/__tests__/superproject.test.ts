import { describe, expect, it } from "vitest";
import { evaluateToolCall } from "../superproject/policy.js";
import { createStarterWorkflow, executeWorkflow } from "../superproject/workflow.js";
import { runSuperprojectDemo } from "../superproject/demo.js";
import type { ToolManifest } from "../superproject/types.js";

describe("superproject policy", () => {
  const registry: ToolManifest[] = [
    { name: "read-news", description: "Read a known news endpoint", effect: "read", enabled: true, requiresApproval: false, networkDomains: ["news.example"] },
    { name: "publish-post", description: "Publish a public post", effect: "external", enabled: true, requiresApproval: false },
    { name: "disabled-tool", description: "Disabled", effect: "read", enabled: false, requiresApproval: false },
  ];

  it("denies unknown tools by default", () => {
    expect(evaluateToolCall({ toolName: "anything", arguments: {} }, registry).decision).toBe("deny");
  });

  it("requires approval for external side effects", () => {
    expect(evaluateToolCall({ toolName: "publish-post", arguments: {} }, registry).decision).toBe("approval_required");
    expect(evaluateToolCall({ toolName: "publish-post", arguments: {}, approvalGranted: true }, registry).decision).toBe("allow");
  });

  it("enforces exact network host allowlists", () => {
    expect(evaluateToolCall({ toolName: "read-news", arguments: { url: "https://news.example/latest" } }, registry).decision).toBe("allow");
    expect(evaluateToolCall({ toolName: "read-news", arguments: { url: "https://evil.example/latest" } }, registry).decision).toBe("deny");
    expect(evaluateToolCall({ toolName: "read-news", arguments: { url: "not a URL" } }, registry).decision).toBe("deny");
  });

  it("denies disabled tools", () => {
    expect(evaluateToolCall({ toolName: "disabled-tool", arguments: {} }, registry).decision).toBe("deny");
  });
});

describe("superproject workflow", () => {
  it("pauses implementation until approved and records an audit trail", async () => {
    const workflow = createStarterWorkflow("Create a sample article workflow");
    const executed: string[] = [];
    const result = await executeWorkflow(workflow, async (task) => {
      executed.push(task.id);
      return { ok: true };
    });

    expect(result.status).toBe("needs_approval");
    expect(executed).toEqual(["research", "plan"]);
    expect(result.tasks.find((task) => task.taskId === "implement")?.status).toBe("awaiting_approval");
    expect(result.tasks.find((task) => task.taskId === "review")?.status).toBe("blocked");
    expect(result.audit.length).toBeGreaterThan(0);
  });

  it("runs the bounded workflow when implementation is approved", async () => {
    const workflow = createStarterWorkflow("Test an implementation");
    const result = await executeWorkflow(workflow, async (task) => task.id, {
      approvedTaskIds: ["implement"],
    });
    expect(result.status).toBe("completed");
    expect(result.tasks.every((task) => task.status === "completed")).toBe(true);
  });

  it("rejects cycles and oversized workflows before executing anything", async () => {
    const executor = async () => "should not run";
    await expect(executeWorkflow({
      name: "cycle",
      goal: "test",
      tasks: [
        { id: "a", role: "planner", input: "a", dependsOn: ["b"] },
        { id: "b", role: "planner", input: "b", dependsOn: ["a"] },
      ],
    }, executor)).rejects.toThrow(/cycle/i);

    await expect(executeWorkflow({
      name: "large",
      goal: "test",
      tasks: Array.from({ length: 3 }, (_, i) => ({ id: String(i), role: "planner" as const, input: "x" })),
    }, executor, { maxTasks: 2 })).rejects.toThrow(/limit/i);
  });

  it("offers a no-key deterministic demo", async () => {
    const result = await runSuperprojectDemo("Draft a business research note");
    expect(result.status).toBe("needs_approval");
    expect(result.tasks[0]?.status).toBe("completed");
  });
});
