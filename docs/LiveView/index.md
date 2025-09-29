---
title: Asynkron.LiveView
sidebar_position: 1
sidebar_label: Overview
---

# Asynkron.LiveView

Asynkron.LiveView is a lightweight web experience that turns a directory of Markdown logs into a continuously updating "control center" for CLI-based AI agents. It watches a folder, orders the Markdown files chronologically, and renders the combined content with live updates in the browser—complete with Mermaid diagrams and syntax-highlighted code. The same runtime can also expose a Model Context Protocol (MCP) endpoint so assistants can create and edit log files programmatically.

## Project links

- Source repository: [asynkron/Asynkron.LiveView](https://github.com/asynkron/Asynkron.LiveView)

## Why build a live log viewer?

Command-line agents such as Codex CLI or CoPilot CLI typically emit architectural notes, reasoning, and progress reports into Markdown files. Reading those files in the terminal quickly becomes unwieldy. LiveView keeps the full conversation visible at `http://localhost:8080`, so you can:

- Watch the agent's plan, design conversations, and execution history evolve in real time.
- Follow architectural diagrams rendered directly from Mermaid blocks.
- Keep a structured log of the project that doubles as decision records.
- Spot regressions or failing tasks without tailing multiple files manually.

## System components

The project ships with three cooperating building blocks:

- **File watcher** – Monitors a target directory for `*.md` files (defaults to `./markdown`) and reacts immediately to new or updated documents.
- **Unified HTTP server** – Serves the web UI, exposes JSON and WebSocket endpoints for real-time refreshes, and (optionally) hosts an MCP endpoint.
- **HTML client** – Uses `marked.js` and `mermaid.js` to render the aggregated Markdown stream in your browser.

Because the server and watcher run in one process, LiveView works equally well for human-authored notes, automated log pipelines, or MCP-powered assistants.

## Quick start (recommended path)

The fastest way to launch LiveView is the convenience script that provisions dependencies (without touching system packages) and starts the unified server:

```bash
./run_all.sh
```

This one command will:

1. Detect a suitable Python (3.7+) interpreter.
2. Install the required dependencies if they are missing.
3. Ensure the watched Markdown directory exists.
4. Start the unified server on port 8080, watching the `markdown/` folder.
5. Print the URL you can open in your browser.

Set `ENABLE_STDIO=true ./run_all.sh` when you also want to expose the MCP stdio transport in addition to the HTTP endpoint.

Visit `http://localhost:8080/` and you will see existing logs; add Markdown files to the watched directory to watch LiveView update instantly.

### Manual setup

Prefer to control each step yourself? You can run the server manually:

```bash
pip install -r requirements.txt
python unified_server.py --dir markdown --port 8080  # add --mcp-stdio to expose the stdio transport alongside HTTP
```

Or disable MCP when you only need the LiveView HTTP server:

```bash
python unified_server.py --dir markdown --port 8080 --disable-mcp
```

Set `PORT=3000` or `MARKDOWN_DIR=docs` (or export `LIVEVIEW_PATH`) before running `./run_all.sh` to change the listening port or default directory, or pass `--port` / `--dir` flags when using the Python entry points directly.

## Pointing LiveView at the right directory

LiveView resolves the directory to render using the following priority order:

1. `?path=/path/to/logs` – a query parameter on the web UI and WebSocket endpoints.
2. `LIVEVIEW_PATH=/path/to/logs` – an environment variable read by the server.
3. `--dir /path/to/logs` – a command-line flag when you start the process.
4. Default to the bundled `markdown/` folder when nothing else is provided.

If the directory does not exist or is empty, the UI displays a help document explaining how to fix the configuration, so you are never staring at a blank page.

## Working with file-based logging

For human workflows or agents that already emit Markdown files, LiveView acts as a passive dashboard:

1. Ensure your automation writes logs to a shared folder (for example, `Logs/` at the root of your repository).
2. Start LiveView and pass that directory path using one of the methods above.
3. Encourage your agent to include timestamps, headings, and Mermaid diagrams so the page stays readable. A sample `agents.md` snippet might instruct the agent to write files such as `log{unix-timestamp}.md` that capture builds, tests, plans, and every 15-minute status update.
4. Open the browser view and keep it running while you work; new files appear immediately, ordered by creation time.

Because the frontend renders standard Markdown, you can mix prose, checklists, code blocks, or diagrams, and the history remains available for later auditing.

## MCP-powered workflows

Asynkron.LiveView also speaks the Model Context Protocol so AI assistants can manage log files programmatically instead of writing directly to disk. The unified server exposes both the LiveView UI and an MCP endpoint.

### Unified MCP endpoint (HTTP JSON-RPC)

1. Start the unified server (`./run_all.sh` or `python unified_server.py`).
2. Configure your assistant to send MCP JSON-RPC requests to `POST http://localhost:8080/mcp`.
3. Use the built-in tools to create, list, read, update, or delete Markdown files:
   - `create_markdown_file`
   - `list_markdown_files`
   - `read_markdown_file`
   - `update_markdown_file`
   - `delete_markdown_file`
4. Every file change immediately propagates to the LiveView UI via the shared watcher and WebSocket pipeline.

### Legacy MCP server (stdio or separate process)

If you prefer the original separation of concerns, you can still run the historical `mcp_server.py` alongside the LiveView HTTP server:

```bash
python mcp_server.py --dir markdown
```

Use the provided `mcp_config.json` in your assistant to establish the stdio transport. The LiveView web server continues to watch the same directory, so both approaches ultimately produce the same Markdown stream.

## Testing the setup

The repository includes two focused scripts that validate key pathways:

- `python test_unified.py` checks the combined HTTP + MCP server behaviour.
- `python test_mcp.py` validates the legacy MCP server.

Run them whenever you modify the automation scripts or upgrade dependencies to confirm the live updates and MCP operations still succeed.

## Operational tips

- **Mermaid diagrams** – Encourage assistants to include Mermaid snippets; the frontend automatically renders them when the diagram is wrapped in a fenced code block with `mermaid`.
- **Custom ports** – Set `PORT=XXXX` before running the scripts or pass `--port` when calling the Python entry points.
- **Alternate directories** – Combine `MARKDOWN_DIR`, `LIVEVIEW_PATH`, and query parameters to switch between multiple projects without restarting the process.
- **Fallback content** – When the watcher cannot find files, LiveView ships a friendly Markdown explainer rather than leaving the UI blank.
- **Browser support** – The UI relies on modern JavaScript and works in current browsers; keep the tab open to monitor updates.

## Repository layout

```
Asynkron.LiveView/
├── unified_server.py   # Combined LiveView + MCP process (with optional stdio toggle)
├── mcp_server.py       # Legacy MCP stdio server
├── run_all.sh          # Automation script for the unified process (HTTP + MCP)
├── start.py            # Cross-platform bootstrapper for manual setups
├── markdown/           # Default directory that gets watched
├── requirements.txt    # Python dependencies (aiohttp, watchdog, mcp, ...)
├── templates/          # HTML templates for the UI
└── test_*.py           # Smoke tests for server paths
```

Use this overview as a launchpad: pick either pure file watching or the MCP workflow, start the server, and let LiveView give you a live window into your AI agents' thinking.
