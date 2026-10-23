import { spawn } from "node:child_process";

function isPrivateOrLocalHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host)) return true;
  const m = host.match(/^172\.(\d+)\./);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) return true;
  if (host === "0.0.0.0" || host === "::1" || host === "::") return true;
  return false;
}

export function validateResearchUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Agent Reach URL must be an absolute HTTPS URL.");
  }
  if (url.protocol !== "https:") throw new Error("Agent Reach research currently accepts HTTPS URLs only.");
  if (url.username || url.password) throw new Error("Credentials embedded in URLs are not allowed.");
  if (!url.hostname || isPrivateOrLocalHostname(url.hostname)) {
    throw new Error("Local/private destinations are not allowed for Agent Reach research.");
  }
  return url.toString();
}

/**
 * Read-only bridge to the separately installed Agent Reach CLI.
 * Uses a fixed subcommand and argument vector (never a shell), bounded time/output,
 * and no implicit installation or credentials.
 */
export function runAgentReachRead(rawUrl, {
  executable = "agent-reach",
  timeoutMs = 45_000,
  maxOutputChars = 30_000,
  spawnImpl = spawn,
} = {}) {
  const url = validateResearchUrl(rawUrl);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 120_000) {
    throw new Error("timeoutMs must be between 1000 and 120000.");
  }
  if (!Number.isInteger(maxOutputChars) || maxOutputChars < 100 || maxOutputChars > 100_000) {
    throw new Error("maxOutputChars must be between 100 and 100000.");
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let overflow = false;
    let child;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error); else resolve(value);
    };

    try {
      child = spawnImpl(executable, ["read", url], {
        shell: false,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (error) {
      finish(new Error(`Could not start Agent Reach: ${error instanceof Error ? error.message : String(error)}`));
      return;
    }

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
      finish(new Error("Agent Reach timed out; increase the bounded timeout only if needed."));
    }, timeoutMs);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (stdout.length > maxOutputChars) {
        overflow = true;
        child.kill("SIGKILL");
        finish(new Error("Agent Reach output exceeded the configured character limit."));
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk).slice(-4_000);
    });
    child.on("error", (error) => {
      if (error && error.code === "ENOENT") {
        finish(new Error("Agent Reach CLI was not found. Install it separately from the official GitHub instructions; this workflow will not auto-install tools."));
      } else {
        finish(new Error(`Agent Reach process error: ${error instanceof Error ? error.message : String(error)}`));
      }
    });
    child.on("close", (code) => {
      if (settled) return;
      if (timedOut) return finish(new Error("Agent Reach timed out."));
      if (overflow) return finish(new Error("Agent Reach output exceeded the configured character limit."));
      if (code !== 0) {
        return finish(new Error(`Agent Reach exited with code ${code}: ${stderr.trim().slice(0, 1000)}`));
      }
      if (!stdout.trim()) return finish(new Error("Agent Reach returned empty output."));
      finish(null, stdout.trim());
    });
  });
}
