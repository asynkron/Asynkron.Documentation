---
sidebar_position: 1
title: OpenAgent overview
description: Learn what OpenAgent does, how to install the CLI, and how to configure its JSON-native workflow automation loop.
---

# OpenAgent overview

[OpenAgent](https://github.com/asynkron/openagent) is Asynkron's task-focused CLI agent. It wraps an OpenAI-powered assistant in a JSON protocol so every command proposal, execution, and observation stays deterministic and auditable. The CLI runs entirely on your machine, offering human-in-the-loop command approvals, configurable safety limits, and ready-to-use templates that accelerate everyday terminal automation.

## Key capabilities

- **Structured JSON orchestration** – all instructions between the LLM and the agent follow a strict schema so you can reason about plans, commands, and telemetry with confidence.
- **Interactive execution loop** – the CLI renders plans as checklists, shows the exact command (including working directory, timeout, and filters), and waits for explicit approval before running anything.
- **Safety-first defaults** – timeouts, optional regex filters, and tail limits keep command output readable while preventing runaway processes.
- **Extensible shortcuts and templates** – reusable command snippets live in `templates/` and `shortcuts/`, letting you capture common workflows and run them with a single instruction.

## Install and run the CLI

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/asynkron/openagent
   cd openagent
   npm install
   ```

2. Copy the environment template into the CLI workspace and set your OpenAI API key:

   ```bash
   cp .env.example packages/cli/.env
   ```

3. Start the agent loop from the project root:

   ```bash
   npm start
   ```

When the CLI launches, type a goal, review the agent's plan, and approve commands step by step. You can exit at any time with `exit` or `quit`.

## Configuration reference

OpenAgent reads its defaults from `packages/cli/.env`. At minimum you must supply `OPENAI_API_KEY`. The remaining properties let you fine-tune models, context windows, retries, and API endpoints:

```bash
OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4.1-mini
# OPENAI_CONTEXT_WINDOW=256000
# OPENAI_REASONING_EFFORT=medium
# OPENAI_TIMEOUT_MS=60000
# OPENAI_MAX_RETRIES=2
# OPENAI_BASE_URL=https://api.openai.com/v1
```

The CLI validates these values before starting a run so misconfigurations fail fast rather than after a long session. If the `.env` file is missing, the startup script reminds you to create it before proceeding.

## JSON protocol primer

The LLM sends plans and commands as JSON payloads:

```json
{
  "message": "status update",
  "plan": [{ "step": 1, "title": "Describe goal", "status": "running" }],
  "command": {
    "shell": "bash",
    "run": "ls -a",
    "cwd": ".",
    "timeout_sec": 60,
    "filter_regex": "error|warning",
    "tail_lines": 200
  }
}
```

When OpenAgent executes a command it returns an observation object to the model:

```json
{
  "eventType": "chat-message",
  "role": "assistant",
  "pass": 18,
  "content": "{\"type\":\"observation\",\"summary\":\"I ran the command: ls -a. It finished with exit code 0.\",\"payload\":{\"stdout\":\"output\",\"stderr\":\"\",\"exit_code\":0,\"truncated\":false},\"metadata\":{\"runtime_ms\":120,\"killed\":false,\"timestamp\":\"2025-02-01T12:00:00Z\"}}"
}
```

These schemas make it straightforward to parse activity logs or pipe observations into your own tools.

## Templates and shortcuts

OpenAgent ships with reusable building blocks to speed up repetitive work:

- **Command templates** live in `templates/command-templates.json`. List, inspect, or render them with:
  - `npx openagent templates list`
  - `npx openagent templates show <id>`
  - `npx openagent templates render <id> '{"var":"value"}'`
- **Shortcuts** in `shortcuts/shortcuts.json` capture ready-made automations:
  - `npx openagent shortcuts list`
  - `npx openagent shortcuts show <id>`
  - `npx openagent shortcuts run <id>`

## Operational safety

- Every shell command respects a configurable timeout.
- Nothing runs without explicit approval (unless you opt-in with `--auto-approve`).
- Output filtering and tailing keep transcripts manageable.

Combine those guardrails with the JSON protocol to integrate OpenAgent into larger automation workflows while keeping a human in the loop.
