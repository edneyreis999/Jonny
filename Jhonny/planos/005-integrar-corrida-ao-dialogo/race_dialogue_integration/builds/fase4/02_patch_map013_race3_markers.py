#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
MAP013_PATH = PROJECT_DIR / "data" / "Map013.json"
OUTPUT_DIR = PLAN_DIR / "interaction" / "fase4"
SUMMARY_PATH = OUTPUT_DIR / "map013-race3-marker-summary.md"

EVENT_ID = 1
PAGE_INDEX = 0
VAR_RACE_ID_ASSIGNMENT = {
    "code": 122,
    "indent": 0,
    "parameters": [100, 100, 0, 0, 3],
}
TARGETS = [
    {"transfer_index": 7107, "expected_indent": 0, "expected_parameters": [0, 12, 0, 0, 0, 0]},
    {"transfer_index": 7082, "expected_indent": 5, "expected_parameters": [0, 6, 0, 0, 0, 0]},
]


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path: Path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def make_var_command(indent: int) -> dict:
    command = dict(VAR_RACE_ID_ASSIGNMENT)
    command["indent"] = indent
    command["parameters"] = list(VAR_RACE_ID_ASSIGNMENT["parameters"])
    return command


def find_existing_target(page_list: list, target: dict):
    start = max(0, target["transfer_index"] - 1)
    end = min(len(page_list), target["transfer_index"] + 3)
    for index in range(start, end):
        command = page_list[index]
        if command["code"] == 122 and command["parameters"] == [100, 100, 0, 0, 3]:
            transfer_index = index + 1
            if transfer_index < len(page_list):
                transfer = page_list[transfer_index]
                if transfer["code"] == 201 and transfer["parameters"][1] == 1:
                    return {"state": "patched", "var_index": index, "transfer_index": transfer_index}
        if (
            command["code"] == 201
            and command["indent"] == target["expected_indent"]
            and command["parameters"] == target["expected_parameters"]
        ):
            return {"state": "original", "transfer_index": index}
    raise AssertionError(
        f"Could not resolve target near audited index {target['transfer_index']}"
    )


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    data = load_json(MAP013_PATH)
    event = data["events"][EVENT_ID]
    page = event["pages"][PAGE_INDEX]
    patched_indexes = []
    applied_targets = []

    for target in sorted(TARGETS, key=lambda item: item["transfer_index"], reverse=True):
        resolved = find_existing_target(page["list"], target)

        if resolved["state"] == "patched":
            applied_targets.append(
                {
                    "var_index": resolved["var_index"],
                    "transfer_index": resolved["transfer_index"],
                }
            )
            continue

        transfer_index = resolved["transfer_index"]
        command = page["list"][transfer_index]
        indent = command["indent"]
        page["list"].insert(transfer_index, make_var_command(indent))
        transfer = page["list"][transfer_index + 1]
        transfer["parameters"] = [
            0,
            1,
            transfer["parameters"][2],
            transfer["parameters"][3],
            transfer["parameters"][4],
            transfer["parameters"][5],
        ]
        patched_indexes.append(transfer_index)
        applied_targets.append(
            {
                "var_index": transfer_index,
                "transfer_index": transfer_index + 1,
            }
        )

    save_json(MAP013_PATH, data)
    reloaded = load_json(MAP013_PATH)
    page = reloaded["events"][EVENT_ID]["pages"][PAGE_INDEX]

    checks = []
    for target in sorted(applied_targets, key=lambda item: item["var_index"]):
        var_index = target["var_index"]
        transfer_index = target["transfer_index"]
        var_command = page["list"][var_index]
        transfer = page["list"][transfer_index]
        assert var_command["code"] == 122
        assert var_command["parameters"] == [100, 100, 0, 0, 3]
        assert transfer["code"] == 201
        assert transfer["parameters"][1] == 1
        checks.append((var_index, transfer_index, transfer["parameters"]))

    lines = [
        "# Map013 Race 3 Marker Summary",
        "",
        f"- Patched file: `{MAP013_PATH}`",
        f"- Event `{EVENT_ID}` page `{PAGE_INDEX + 1}`",
        "- Patched the audited executable transfer points to set `VAR_RACE_ID = 3` before entering `Map001`.",
        "",
        "## Patched Commands",
        "",
    ]
    for var_index, transfer_index, parameters in checks:
        lines.append(f"- Command {var_index}: `Control Variables {VAR_RACE_ID_ASSIGNMENT['parameters']}`")
        lines.append(f"- Command {transfer_index}: `Transfer Player {parameters}`")
    lines.append("")
    SUMMARY_PATH.write_text("\n".join(lines), encoding="utf-8")

    print(f"Patched {MAP013_PATH}")
    print(f"Patched transfer points: {patched_indexes}")
    print(f"Saved summary to {SUMMARY_PATH}")


if __name__ == "__main__":
    main()
