import type { PolicyDecision, ToolCallRequest, ToolManifest } from "./types.js";

const MUTATING_EFFECTS = new Set(["write", "external", "financial", "execution"]);

function getUrlArgument(args: Record<string, unknown>): string | undefined {
  for (const key of ["url", "endpoint", "uri"]) {
    const value = args[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

/**
 * Conservative policy gate for registered tools.
 * This does not execute tools; it only decides whether a request may proceed.
 */
export function evaluateToolCall(
  request: ToolCallRequest,
  registry: readonly ToolManifest[],
): PolicyDecision {
  const tool = registry.find((candidate) => candidate.name === request.toolName);

  if (!tool) {
    return { decision: "deny", reason: "Tool is not registered; unknown tools are denied by default." };
  }
  if (!tool.enabled) {
    return { decision: "deny", reason: "Tool is disabled by configuration." };
  }

  const url = getUrlArgument(request.arguments);
  if (url) {
    let hostname: string;
    try {
      hostname = new URL(url).hostname.toLowerCase();
    } catch {
      return { decision: "deny", reason: "A URL argument was supplied but is not a valid absolute URL." };
    }

    const approvedDomains = (tool.networkDomains ?? []).map((domain) => domain.toLowerCase());
    if (!approvedDomains.includes(hostname)) {
      return {
        decision: "deny",
        reason: approvedDomains.length
          ? `Destination host '${hostname}' is not on this tool's exact-host allowlist.`
          : "This tool has no approved network destinations.",
      };
    }
  }

  const approvalNeeded = tool.requiresApproval || MUTATING_EFFECTS.has(tool.effect);
  if (approvalNeeded && request.approvalGranted !== true) {
    return {
      decision: "approval_required",
      reason: "This tool can change files, contact external systems, execute commands, or affect finances; explicit human approval is required.",
    };
  }

  return { decision: "allow", reason: "Registered tool passed the configured policy checks." };
}
