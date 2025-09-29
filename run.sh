#!/usr/bin/env bash
set -euo pipefail

interval=3
server_cmd=(npm run start)

usage() {
  echo "Usage: $0 [-i seconds] [-- command ...]" >&2
  echo "  -i seconds   Polling interval in seconds (default: 3)" >&2
  echo "  -- command   Command to run for the dev server (default: npm run start)" >&2
}

# Parse flags until we hit -- or run out of args
while (($# > 0)); do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    -i|--interval)
      if (($# < 2)); then
        echo "Missing value for $1" >&2
        exit 1
      fi
      interval="$2"
      shift 2
      ;;
    --)
      shift
      if (($# == 0)); then
        echo "Expected command after --" >&2
        exit 1
      fi
      server_cmd=("$@")
      break
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if ! command -v git >/dev/null 2>&1; then
  echo "git command not found" >&2
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This script must be run inside a git repository" >&2
  exit 1
fi

server_pid=""

start_server() {
  echo "[git-watch] starting dev server: ${server_cmd[*]}"
  "${server_cmd[@]}" &
  server_pid=$!
}

stop_server() {
  if [[ -n "$server_pid" ]] && kill -0 "$server_pid" >/dev/null 2>&1; then
    echo "[git-watch] stopping dev server (pid $server_pid)"
    kill "$server_pid" >/dev/null 2>&1 || true
    wait "$server_pid" 2>/dev/null || true
    server_pid=""
  fi
}

cleanup() {
  stop_server
}

trap cleanup EXIT INT TERM

last_signature="__initial__"

start_server

while true; do
  signature=$(git status --porcelain)
  if [[ "$signature" != "$last_signature" ]]; then
    last_signature="$signature"
    if [[ -n "$signature" ]]; then
      echo "[git-watch] change detected, restarting dev server"
      stop_server
      start_server
      # Skip the next check long enough to avoid thrashing while git status stabilizes
      sleep 1
      continue
    fi
  fi
  sleep "$interval"

  # If the server crashed, start it again even without changes
  if [[ -n "$server_pid" ]] && ! kill -0 "$server_pid" >/dev/null 2>&1; then
    echo "[git-watch] dev server stopped unexpectedly, restarting"
    start_server
  fi

done
