export const AGENT_ROLES = [
  "orchestrator",
  "researcher",
  "planner",
  "implementer",
  "critic",
  "editor",
  "publisher",
  "analyst",
] as const;

export type AgentRole = (typeof AGENT_ROLES)[number];

export type ToolEffect = "read" | "write" | "external" | "financial" | "execution";

export interface ToolManifest {
  name: string;
  description: string;
  effect: ToolEffect;
  enabled: boolean;
  requiresApproval: boolean;
  /** Exact hostnames only; omitted/empty means no network destination is approved. */
  networkDomains?: string[];
  timeoutMs?: number;
  maxOutputChars?: number;
}

export interface ToolCallRequest {
  toolName: string;
  arguments: Record<string, unknown>;
  approvalGranted?: boolean;
}

export type PolicyDecision =
  | { decision: "allow"; reason: string }
  | { decision: "deny"; reason: string }
  | { decision: "approval_required"; reason: string };

export interface WorkflowTask {
  id: string;
  role: AgentRole;
  input: string;
  dependsOn?: string[];
  requiresApproval?: boolean;
}

export interface WorkflowDefinition {
  name: string;
  goal: string;
  tasks: WorkflowTask[];
}

export type TaskStatus =
  | "pending"
  | "running"
  | "completed"
  | "awaiting_approval"
  | "blocked"
  | "failed";

export interface TaskResult {
  taskId: string;
  role: AgentRole;
  status: TaskStatus;
  output?: unknown;
  error?: string;
}

export interface AuditEvent {
  at: string;
  action: string;
  subject: string;
  outcome: string;
  detail?: string;
}

export interface WorkflowResult {
  workflowName: string;
  status: "completed" | "needs_approval" | "blocked" | "failed";
  tasks: TaskResult[];
  audit: AuditEvent[];
}
