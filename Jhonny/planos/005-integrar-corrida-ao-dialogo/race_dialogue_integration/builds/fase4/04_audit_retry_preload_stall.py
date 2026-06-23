#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"
OUTPUT_DIR = PLAN_DIR / "interaction" / "fase4"
REPORT_PATH = OUTPUT_DIR / "defeat-retry-preload-audit.md"

CE3_ID = 3
CE5_ID = 5
CE19_ID = 19
ATTEMPT_VAR_ID = 112
RACE_ACTIVE_SWITCH_ID = 100


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def format_command(index: int, command: dict) -> str:
    return (
        f"- `{index}`: code `{command['code']}`, indent `{command['indent']}`, "
        f"params `{command['parameters']}`"
    )


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    common_events = load_json(COMMON_EVENTS_PATH)
    ce3 = common_events[CE3_ID]
    ce5 = common_events[CE5_ID]
    ce19 = common_events[CE19_ID]

    ce19_defeat_call_indexes = [
        index
        for index, command in enumerate(ce19["list"])
        if command["code"] == 117 and command["parameters"] == [CE5_ID]
    ]
    ce5_preload_call_indexes = [
        index
        for index, command in enumerate(ce5["list"])
        if command["code"] == 117 and command["parameters"] == [CE3_ID]
    ]
    ce5_race_active_on_indexes = [
        index
        for index, command in enumerate(ce5["list"])
        if command["code"] == 121
        and command["parameters"] == [RACE_ACTIVE_SWITCH_ID, RACE_ACTIVE_SWITCH_ID, 0]
    ]
    ce5_attempt_guard_indexes = [
        index
        for index, command in enumerate(ce5["list"])
        if command["code"] == 111
        and command["parameters"] == [1, ATTEMPT_VAR_ID, 0, 1, 2]
    ]

    lines = [
        "# Defeat Retry Preload Audit",
        "",
        f"- File: `{COMMON_EVENTS_PATH}`",
        f"- `CE19` defeat handoff to `CE5`: {ce19_defeat_call_indexes}",
        f"- `CE5` preload call to `CE3`: {ce5_preload_call_indexes}",
        f"- `CE5` `SW_RACE_ACTIVE ON` commands: {ce5_race_active_on_indexes}",
        f"- `CE5` attempt guard commands (`V[112] <= 1`): {ce5_attempt_guard_indexes}",
        "",
        "## CE3 preload commands",
        "",
        f"- Length: `{len(ce3['list'])}`",
        format_command(0, ce3["list"][0]),
        format_command(1, ce3["list"][1]),
        format_command(2, ce3["list"][2]),
        format_command(len(ce3["list"]) - 1, ce3["list"][-1]),
        "",
        "## CE5 bootstrap window",
        "",
    ]

    for index in range(14, min(len(ce5["list"]), 25)):
        lines.append(format_command(index, ce5["list"][index]))

    lines.extend(
        [
            "",
            "## Interpretation",
            "",
            "- The retry path is structurally safe only if the `CE3` preload call is guarded away from post-defeat retries.",
            "- The intended guard for this patch is `V[112] <= 1`, which keeps preload on the cold bootstrap and skips it on retries.",
            "- `SW_RACE_ACTIVE` must still turn on immediately after the guarded preload block.",
        ]
    )

    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Saved audit to {REPORT_PATH}")
    print(f"CE19 defeat handoff indexes: {ce19_defeat_call_indexes}")
    print(f"CE5 preload call indexes: {ce5_preload_call_indexes}")
    print(f"CE5 race-active-on indexes: {ce5_race_active_on_indexes}")
    print(f"CE5 attempt guard indexes: {ce5_attempt_guard_indexes}")


if __name__ == "__main__":
    main()
