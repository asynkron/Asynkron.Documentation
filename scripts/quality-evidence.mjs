#!/usr/bin/env node

// Repository-owned adapter from this documentation site's native quality
// commands to Faktorial's runner-neutral quality-evidence contract. Faktorial
// consumes only the resulting envelope and has no knowledge of npm, TypeScript,
// Docusaurus, or this repository's focused test-report format.

import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

export const ENVELOPE_SCHEMA = "quality-evidence.v1";
export const PAYLOAD_SCHEMA = "test-results.v1";
export const NATIVE_REPORT_SCHEMA = "documentation-test-results.v1";
export const PRODUCER_ID = "quality-evidence-tests";

const ARTIFACT_SUFFIX = ".quality-evidence.json";
const NATIVE_REPORT_NAME = `${PRODUCER_ID}.native.json`;

export async function translateNativeTestReport(reportPath, expectedRunID) {
  let raw;
  try {
    raw = await readFile(reportPath, "utf8");
  } catch (error) {
    return translationError(`native test report is unavailable: ${error.message}`);
  }

  let report;
  try {
    report = JSON.parse(raw);
  } catch (error) {
    return translationError(`native test report is invalid JSON: ${error.message}`);
  }

  if (!report || typeof report !== "object" || Array.isArray(report)) {
    return translationError("native test report must be a JSON object");
  }
  if (report.schema_version !== NATIVE_REPORT_SCHEMA) {
    return translationError(`native test report has unsupported schema ${JSON.stringify(report.schema_version)}`);
  }
  if (report.run_id !== expectedRunID) {
    return translationError("native test report is stale: run identity does not match this quality execution");
  }
  if (!Number.isInteger(report.started) || report.started < 0 || !Array.isArray(report.tests)) {
    return translationError("native test report omitted a valid started count or terminal test list");
  }
  if (report.tests.length !== report.started) {
    return translationError(
      `native test report is incomplete: ${report.started} tests started but ${report.tests.length} terminal results were recorded`,
    );
  }
  if (report.started === 0) {
    return translationError("native test report contains no focused evidence-contract tests");
  }

  const counts = { total: report.tests.length, passed: 0, failed: 0, skipped: 0 };
  const failures = [];
  const identities = new Set();
  for (const [index, result] of report.tests.entries()) {
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      return translationError(`native test result ${index + 1} is not an object`);
    }
    const suite = requiredString(result.suite);
    const file = requiredString(result.file);
    const test = requiredString(result.test);
    if (!suite || !file || !test) {
      return translationError(`native test result ${index + 1} omitted a stable suite, file, or test identity`);
    }
    const identity = `${suite}\u0000${file}\u0000${test}`;
    if (identities.has(identity)) {
      return translationError(`native test report contains duplicate terminal identity ${JSON.stringify(test)}`);
    }
    identities.add(identity);

    switch (result.status) {
      case "passed":
        counts.passed++;
        break;
      case "skipped":
        counts.skipped++;
        break;
      case "failed": {
        const message = requiredString(result.message);
        if (!message) {
          return translationError(`failed native test ${JSON.stringify(test)} omitted diagnostics`);
        }
        counts.failed++;
        failures.push({ suite, file, test, message });
        break;
      }
      default:
        return translationError(
          `native test ${JSON.stringify(test)} has non-terminal status ${JSON.stringify(result.status)}`,
        );
    }
  }

  return { payload: { counts, failures } };
}

export function envelopeFromTranslation(translation) {
  if (translation?.error) {
    return {
      schema_version: ENVELOPE_SCHEMA,
      producer_id: PRODUCER_ID,
      kind: "test-results",
      payload_schema: PAYLOAD_SCHEMA,
      status: "translation_failed",
      reason: String(translation.error),
    };
  }
  return {
    schema_version: ENVELOPE_SCHEMA,
    producer_id: PRODUCER_ID,
    kind: "test-results",
    payload_schema: PAYLOAD_SCHEMA,
    status: "complete",
    payload: translation.payload,
  };
}

export function notApplicableEnvelope(reason) {
  return {
    schema_version: ENVELOPE_SCHEMA,
    producer_id: PRODUCER_ID,
    kind: "test-results",
    payload_schema: PAYLOAD_SCHEMA,
    status: "not_applicable",
    reason: String(reason),
  };
}

export async function prepareEvidenceDir(dir) {
  await mkdir(dir, { recursive: true });
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(entries
    .filter((entry) => (
      entry.name.endsWith(ARTIFACT_SUFFIX)
      || entry.name === NATIVE_REPORT_NAME
      || (entry.name.startsWith(".") && entry.name.endsWith(".tmp"))
    ))
    .map((entry) => rm(path.join(dir, entry.name), { recursive: entry.isDirectory(), force: true })));
}

export async function writeEnvelope(dir, envelope) {
  await writeJSONAtomically(path.join(dir, `${PRODUCER_ID}${ARTIFACT_SUFFIX}`), envelope);
}

export async function writeJSONAtomically(target, value) {
  const temporary = path.join(path.dirname(target), `.${path.basename(target)}.${process.pid}.${randomUUID()}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, target);
}

async function main() {
  const configuredEvidenceDir = String(process.env.FAKTORIAL_QUALITY_EVIDENCE_DIR || "").trim();
  const evidenceDir = configuredEvidenceDir || await mkdtemp(path.join(os.tmpdir(), "asynkron-documentation-quality-"));
  const removeEvidenceDir = !configuredEvidenceDir;
  const runID = `${Date.now()}-${process.pid}-${randomUUID()}`;
  const reportPath = path.join(evidenceDir, NATIVE_REPORT_NAME);
  let envelope;
  let exitCode = 0;

  try {
    await prepareEvidenceDir(evidenceDir);

    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const typecheck = await runProcess("TypeScript validation", npm, ["run", "typecheck"]);
    const build = await runProcess("Docusaurus production build", npm, ["run", "build"]);
    for (const result of [typecheck, build]) {
      if (processSucceeded(result)) continue;
      console.error(`quality-evidence: ${result.label} failed: ${formatExit(result)}`);
      exitCode = 1;
    }

    const focusedTests = await runProcess(
      "quality-evidence contract tests",
      process.execPath,
      ["./scripts/quality-evidence.test.mjs"],
      {
        ...process.env,
        QUALITY_EVIDENCE_TEST_REPORT: reportPath,
        QUALITY_EVIDENCE_TEST_RUN_ID: runID,
      },
    );

    if (!focusedTests.started) {
      envelope = notApplicableEnvelope(
        `focused evidence-contract tests did not run: ${focusedTests.error || "the native process could not start"}`,
      );
      exitCode = 1;
    } else {
      let translation = await translateNativeTestReport(reportPath, runID);
      if (!translation.error) {
        const reportPassed = translation.payload.counts.failed === 0;
        const processPassed = processSucceeded(focusedTests);
        if (reportPassed !== processPassed) {
          translation = translationError(
            `native test report and process exit disagree: failed=${translation.payload.counts.failed}, exit=${formatExit(focusedTests)}`,
          );
        }
      }
      envelope = envelopeFromTranslation(translation);
      if (!processSucceeded(focusedTests) || envelope.status !== "complete") exitCode = 1;
    }

    await writeEnvelope(evidenceDir, envelope);
    console.log(
      `quality-evidence: ${PRODUCER_ID} ${envelope.status}${envelope.payload ? ` (${formatCounts(envelope.payload.counts)})` : ""}`,
    );
    if (envelope.reason) console.error(`quality-evidence: ${envelope.reason}`);
  } catch (error) {
    console.error(`quality-evidence: adapter failure: ${error.message}`);
    exitCode = 2;
  } finally {
    if (removeEvidenceDir) await rm(evidenceDir, { recursive: true, force: true });
  }

  process.exitCode = exitCode;
}

function runProcess(label, command, args, env = process.env) {
  console.log(`quality-evidence: running ${label}`);
  return new Promise((resolve) => {
    let settled = false;
    let started = false;
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.once("spawn", () => {
      started = true;
    });
    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      resolve({ label, started, exitCode: null, signal: null, error: error.message });
    });
    child.once("close", (code, signal) => {
      if (settled) return;
      settled = true;
      resolve({
        label,
        started,
        exitCode: Number.isInteger(code) ? code : null,
        signal: signal || null,
        error: "",
      });
    });
  });
}

function processSucceeded(result) {
  return result.started && result.exitCode === 0 && !result.signal && !result.error;
}

function formatExit(result) {
  if (result.error) return result.error;
  if (result.signal) return `signal ${result.signal}`;
  return String(result.exitCode);
}

function formatCounts(counts) {
  return `${counts.total} total, ${counts.passed} passed, ${counts.failed} failed, ${counts.skipped} skipped`;
}

function requiredString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function translationError(message) {
  return { error: String(message) };
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) await main();
