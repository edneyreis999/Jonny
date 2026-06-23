from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = ROOT / "data"
TARGET_FILES = ("Map005.json", "Map006.json", "Map010.json")
OLD_NAME = "Player"
NEW_NAME = "Chance"
EXPECTED_REPLACEMENTS = {
    "Map005.json": 2,
    "Map006.json": 1,
    "Map010.json": 8,
}


def replace_speaker_names(path: Path) -> list[str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    replacements: list[str] = []

    for event_index, event in enumerate(data["events"]):
        if not event:
            continue
        event_id = event.get("id", event_index)
        event_name = event.get("name", "")
        for page_index, page in enumerate(event["pages"]):
            for command_index, command in enumerate(page["list"]):
                if command.get("code") != 101:
                    continue
                parameters = command.get("parameters", [])
                if len(parameters) < 5 or parameters[4] != OLD_NAME:
                    continue
                parameters[4] = NEW_NAME
                replacements.append(
                    f"EV{event_id:03d} {event_name!r} page {page_index + 1} "
                    f"command {command_index}"
                )

    expected_count = EXPECTED_REPLACEMENTS[path.name]
    assert len(replacements) == expected_count, (
        f"{path.name}: expected {expected_count} replacements, got {len(replacements)}"
    )

    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=4) + "\n",
        encoding="utf-8",
    )

    reparsed = json.loads(path.read_text(encoding="utf-8"))
    remaining = []
    for event in reparsed["events"]:
        if not event:
            continue
        for page in event["pages"]:
            for command in page["list"]:
                if command.get("code") == 101 and command.get("parameters", [None] * 5)[4] == OLD_NAME:
                    remaining.append(command)
    assert not remaining, f"{path.name}: speaker_name still contains {OLD_NAME!r}"

    return replacements


def main() -> None:
    total = 0
    for file_name in TARGET_FILES:
        replacements = replace_speaker_names(DATA_DIR / file_name)
        total += len(replacements)
        print(f"{file_name}: {len(replacements)} speaker names updated")
        for replacement in replacements:
            print(f"  - {replacement}")

    expected_total = sum(EXPECTED_REPLACEMENTS.values())
    assert total == expected_total, f"expected {expected_total} total replacements, got {total}"
    print(f"TOTAL={total}")


if __name__ == "__main__":
    main()
