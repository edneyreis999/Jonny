from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = ROOT / "data"
TARGET = "Player"
MAP_FILE_PATTERN = re.compile(r"Map\d{3}\.json")


def iter_strings(value: Any, path: tuple[Any, ...] = ()) -> list[tuple[tuple[Any, ...], str]]:
    if isinstance(value, str):
        return [(path, value)] if TARGET in value else []
    if isinstance(value, list):
        results: list[tuple[tuple[Any, ...], str]] = []
        for index, item in enumerate(value):
            results.extend(iter_strings(item, (*path, index)))
        return results
    if isinstance(value, dict):
        results: list[tuple[tuple[Any, ...], str]] = []
        for key, item in value.items():
            results.extend(iter_strings(item, (*path, key)))
        return results
    return []


def command_role(command: dict[str, Any], param_path: tuple[Any, ...]) -> str:
    if command.get("code") == 101 and param_path == (4,):
        return "speaker_name"
    if command.get("code") == 401 and param_path == (0,):
        return "message_text"
    if command.get("code") == 108:
        return "comment"
    if command.get("code") == 408:
        return "comment_continuation"
    if command.get("code") == 355:
        return "script"
    if command.get("code") == 655:
        return "script_continuation"
    return f"command_{command.get('code')}_parameter"


def analyze_map(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    findings: list[dict[str, Any]] = []
    for event_index, event in enumerate(data.get("events", [])):
        if not event:
            continue
        for page_index, page in enumerate(event.get("pages", [])):
            for command_index, command in enumerate(page.get("list", [])):
                for value_path, value in iter_strings(command):
                    if value_path[:1] != ("parameters",):
                        continue
                    lines = []
                    if command.get("code") == 101:
                        for next_command in page.get("list", [])[command_index + 1 :]:
                            if next_command.get("code") != 401:
                                break
                            lines.append(next_command["parameters"][0])
                    findings.append(
                        {
                            "file": path.name,
                            "event_id": event.get("id", event_index),
                            "event_name": event.get("name", ""),
                            "page": page_index + 1,
                            "command": command_index,
                            "role": command_role(command, value_path[1:]),
                            "value": value,
                            "text": " / ".join(lines),
                        }
                    )
    return findings


def main() -> None:
    findings: list[dict[str, Any]] = []
    for path in sorted(DATA_DIR.glob("Map*.json")):
        if not MAP_FILE_PATTERN.fullmatch(path.name):
            continue
        findings.extend(analyze_map(path))

    if not findings:
        print("No Player references found in Map*.json command parameters.")
        return

    for item in findings:
        print(
            "{file} EV{event_id:03d} {event_name!r} page {page} command {command} "
            "[{role}]: {value!r} -> {text!r}".format(**item)
        )
    print(f"TOTAL={len(findings)}")


if __name__ == "__main__":
    main()
