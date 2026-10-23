import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { runAgentReachRead, validateResearchUrl } from "../src/agent-reach.mjs";

function makeChild(output = "read result", exitCode = 0) {
  const child = new EventEmitter();
  child.stdout = new PassThrough();
  child.stderr = new PassThrough();
  child.kill = () => true;
  queueMicrotask(() => {
    child.stdout.end(output);
    child.stderr.end("");
    child.emit("close", exitCode, null);
  });
  return child;
}

test("Agent Reach URL validation accepts public HTTPS URLs", () => {
  assert.equal(validateResearchUrl("https://example.org/news#part"), "https://example.org/news#part");
});

test("Agent Reach URL validation rejects credentials, local hosts and non-HTTPS", () => {
  assert.throws(() => validateResearchUrl("http://example.org/story"), /HTTPS/);
  assert.throws(() => validateResearchUrl("https://localhost/private"), /Local\/private/);
  assert.throws(() => validateResearchUrl("https://user:secret@example.org/"), /Credentials/);
});

test("Agent Reach bridge invokes the fixed read subcommand without a shell", async () => {
  let call;
  const output = await runAgentReachRead("https://example.org/research", {
    spawnImpl: (command, args, options) => {
      call = { command, args, options };
      return makeChild("Page title\nArticle text");
    },
  });
  assert.equal(output, "Page title\nArticle text");
  assert.equal(call.command, "agent-reach");
  assert.deepEqual(call.args, ["read", "https://example.org/research"]);
  assert.equal(call.options.shell, false);
});

test("Agent Reach bridge rejects failed commands", async () => {
  await assert.rejects(
    runAgentReachRead("https://example.org/", {
      spawnImpl: () => makeChild("partial", 2),
    }),
    /exited with code 2/,
  );
});

test("Agent Reach bridge rejects output beyond configured limits", async () => {
  await assert.rejects(
    runAgentReachRead("https://example.org/", {
      maxOutputChars: 100,
      spawnImpl: () => makeChild("x".repeat(150)),
    }),
    /character limit/,
  );
});
