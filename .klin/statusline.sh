#!/usr/bin/env bash
# Statusline for klin: shows model, task and session cost, and saves the
# cost for /done to log. Reads the statusline JSON from stdin.
in=$(cat)
if ! command -v jq >/dev/null 2>&1; then printf "klin: install jq"; exit 0; fi
dir=$(printf '%s' "$in" | jq -r '.workspace.project_dir // .cwd // "."' 2>/dev/null)
[ -n "$dir" ] && cd "$dir" 2>/dev/null
mkdir -p .klin/tmp 2>/dev/null
printf '%s' "$in" | jq -c '{model: .model.display_name, cost_usd: (.cost.total_cost_usd // 0), duration_min: (((.cost.total_duration_ms // 0) / 60000) | floor), session_id: .session_id}' > .klin/tmp/session-cost.json 2>/dev/null
model=$(jq -r '.model' .klin/tmp/session-cost.json 2>/dev/null)
cost=$(jq -r '.cost_usd' .klin/tmp/session-cost.json 2>/dev/null)
task="no task"
[ -f .klin/task.md ] && task=$(head -1 .klin/task.md | sed -e 's/^# Task: //' -e 's/ (started.*//' | cut -c1-40)
printf '%s | %s | $%.2f' "${model:-?}" "$task" "${cost:-0}"
