#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import {
  ENVELOPE_SCHEMA,
  NATIVE_REPORT_SCHEMA,
  PAYLOAD_SCHEMA,
  PRODUCER_ID,
  envelopeFromTranslation,
  notApplicableEnvelope,
  prepareEvidenceDir,
  translateNativeTestReport,
  writeEnvelope,
} from "./quality-evidence.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SUITE = "quality-evidence-adapter";
const FILE = "scripts/quality-evidence.test.mjs";
const definitions = [];

function test(name, run) {
  definitions.push({ name, run });
}

test("committed declaration exactly matches the adapter producer", async () => {
  const config = JSON.parse(await readFile(path.join(REPO_ROOT, ".faktorial/main-verify.json"), "utf8"));
  assert.equal(config.schema_version, "main-verify.v2");
  assert.deepEqual(config.commands, ["npm run quality"]);
  assert.deepEqual(config.evidence, [{
    command: "npm run quality",
    producer_id: PRODUCER_ID,
    kind: "test-results",
    payload_schema: PAYLOAD_SCHEMA,
    required: true,
  }]);
});

test("translation reports exact terminal counts and stable failed-test identities", async () => {
  await withTempDir(async (dir) => {
    const reportPath = path.join(dir, "native.json");
    await writeNativeReport(reportPath, nativeReport("run-1", [
      nativeResult("passes", "passed"),
      nativeResult("is skipped", "skipped"),
      nativeResult("fails stably", "failed", "expected documentation contract"),
    ]));
    const envelope = envelopeFromTranslation(await translateNativeTestReport(reportPath, "run-1"));
    assert.equal(envelope.status, "complete");
    assert.deepEqual(envelope.payload.counts, { total: 3, passed: 1, failed: 1, skipped: 1 });
    assert.deepEqual(envelope.payload.failures, [{
      suite: SUITE,
      file: FILE,
      test: "fails stably",
      message: "expected documentation contract",
    }]);
  });
});

test("missing and invalid native reports become translation_failed", async () => {
  await withTempDir(async (dir) => {
    const missing = envelopeFromTranslation(await translateNativeTestReport(path.join(dir, "missing.json"), "run-1"));
    assert.equal(missing.status, "translation_failed");
    assert.match(missing.reason, /unavailable/);

    const invalidPath = path.join(dir, "invalid.json");
    await writeFile(invalidPath, "not-json\n");
    const invalid = envelopeFromTranslation(await translateNativeTestReport(invalidPath, "run-1"));
    assert.equal(invalid.status, "translation_failed");
    assert.match(invalid.reason, /invalid JSON/);
  });
});

test("duplicate terminal identities become translation_failed", async () => {
  await withTempDir(async (dir) => {
    const reportPath = path.join(dir, "native.json");
    await writeNativeReport(reportPath, nativeReport("run-1", [
      nativeResult("same identity", "passed"),
      nativeResult("same identity", "passed"),
    ]));
    const envelope = envelopeFromTranslation(await translateNativeTestReport(reportPath, "run-1"));
    assert.equal(envelope.status, "translation_failed");
    assert.match(envelope.reason, /duplicate terminal identity/);
  });
});

test("stale native reports become translation_failed", async () => {
  await withTempDir(async (dir) => {
    const reportPath = path.join(dir, "native.json");
    await writeNativeReport(reportPath, nativeReport("previous-run", [nativeResult("passes", "passed")]));
    const envelope = envelopeFromTranslation(await translateNativeTestReport(reportPath, "current-run"));
    assert.equal(envelope.status, "translation_failed");
    assert.match(envelope.reason, /stale/);
  });
});

test("incomplete native reports become translation_failed", async () => {
  await withTempDir(async (dir) => {
    const reportPath = path.join(dir, "native.json");
    const report = nativeReport("run-1", [nativeResult("passes", "passed")]);
    report.started = 2;
    await writeNativeReport(reportPath, report);
    const envelope = envelopeFromTranslation(await translateNativeTestReport(reportPath, "run-1"));
    assert.equal(envelope.status, "translation_failed");
    assert.match(envelope.reason, /incomplete/);
  });
});

test("a producer that genuinely did not run is explicitly not_applicable", () => {
  const envelope = notApplicableEnvelope("focused evidence-contract test process could not start");
  assert.equal(envelope.status, "not_applicable");
  assert.ok(envelope.reason);
  assert.equal("payload" in envelope, false);
});

test("evidence directory preparation removes stale and duplicate envelopes", async () => {
  await withTempDir(async (dir) => {
    await writeFile(path.join(dir, "stale.quality-evidence.json"), "{}\n");
    await writeFile(path.join(dir, "duplicate.quality-evidence.json"), "{}\n");
    await writeFile(path.join(dir, `${PRODUCER_ID}.native.json`), "{}\n");
    await writeFile(path.join(dir, "keep.txt"), "keep\n");
    await prepareEvidenceDir(dir);
    assert.deepEqual(await readdir(dir), ["keep.txt"]);
  });
});

test("adapter writes one atomic canonical envelope", async () => {
  await withTempDir(async (dir) => {
    const envelope = {
      schema_version: ENVELOPE_SCHEMA,
      producer_id: PRODUCER_ID,
      kind: "test-results",
      payload_schema: PAYLOAD_SCHEMA,
      status: "complete",
      payload: { counts: { total: 1, passed: 1, failed: 0, skipped: 0 }, failures: [] },
    };
    await writeEnvelope(dir, envelope);
    const entries = await readdir(dir);
    assert.deepEqual(entries, [`${PRODUCER_ID}.quality-evidence.json`]);
    assert.deepEqual(JSON.parse(await readFile(path.join(dir, entries[0]), "utf8")), envelope);
  });
});

async function run() {
  const results = [];
  for (const definition of definitions) {
    try {
      await definition.run();
      results.push(nativeResult(definition.name, "passed"));
      console.log(`ok - ${definition.name}`);
    } catch (error) {
      const message = error instanceof Error ? (error.stack || error.message) : String(error);
      results.push(nativeResult(definition.name, "failed", message));
      console.error(`not ok - ${definition.name}\n${message}`);
    }
  }

  const reportPath = String(process.env.QUALITY_EVIDENCE_TEST_REPORT || "").trim();
  if (reportPath) {
    const runID = String(process.env.QUALITY_EVIDENCE_TEST_RUN_ID || "").trim();
    try {
      await writeNativeReport(reportPath, nativeReport(runID, results));
    } catch (error) {
      console.error(`quality-evidence tests: could not write native report: ${error.message}`);
      process.exitCode = 2;
      return;
    }
  }

  const failed = results.filter(({ status }) => status === "failed").length;
  console.log(`quality-evidence tests: ${results.length - failed} passed, ${failed} failed`);
  process.exitCode = failed === 0 ? 0 : 1;
}

function nativeReport(runID, tests) {
  return {
    schema_version: NATIVE_REPORT_SCHEMA,
    run_id: runID,
    started: tests.length,
    tests,
  };
}

function nativeResult(name, status, message = "") {
  const result = { suite: SUITE, file: FILE, test: name, status };
  if (message) result.message = message;
  return result;
}

async function writeNativeReport(target, report) {
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, target);
}

async function withTempDir(action) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "asynkron-docs-evidence-test-"));
  try {
    await action(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

await run();
