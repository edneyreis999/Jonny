#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"
MAP001_PATH = PROJECT_DIR / "data" / "Map001.json"
OUTPUT_DIR = PLAN_DIR / "interaction" / "fase4"
OUTPUT_PATH = OUTPUT_DIR / "defeat-retry-bootstrap-audit.md"

CE5_ID = 5
CE18_ID = 18
CE19_ID = 19
MAP001_EVENT_ID = 1


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def describe_command(index: int, command: dict) -> str:
    return (
        f"- Command {index}: code `{command['code']}`, "
        f"indent `{command['indent']}`, parameters `{command['parameters']}`"
    )


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    common_events = load_json(COMMON_EVENTS_PATH)
    map001 = load_json(MAP001_PATH)

    ce5 = common_events[CE5_ID]
    ce18 = common_events[CE18_ID]
    ce19 = common_events[CE19_ID]
    init_event = map001["events"][MAP001_EVENT_ID]

    assert ce5["id"] == CE5_ID
    assert ce18["id"] == CE18_ID
    assert ce19["id"] == CE19_ID
    assert init_event["id"] == MAP001_EVENT_ID
    assert init_event["name"] == "Init Corrida"

    ce19_defeat_indexes = [
        index
        for index, command in enumerate(ce19["list"])
        if command["code"] == 117 and command["parameters"] == [CE18_ID]
    ]
    assert ce19_defeat_indexes == [60], (
        f"Unexpected CE19 defeat handoff indexes: {ce19_defeat_indexes}"
    )

    ce5_attempt_index = 4
    ce19_cleanup_range = range(38, 47)
    ce18_reset_range = range(8, 26)

    lines = [
        "# Defeat Retry Bootstrap Audit",
        "",
        "## Scope",
        "",
        f"- Target Common Events: `CE{CE5_ID}`, `CE{CE18_ID}`, `CE{CE19_ID}`",
        f"- Target map event: `Map001` event `{MAP001_EVENT_ID}` `{init_event['name']}`",
        "",
        "## Map001 Bootstrap",
        "",
    ]

    for page_index, page in enumerate(init_event["pages"], start=1):
        lines.append(
            f"- Page {page_index}: trigger `{page['trigger']}`, "
            f"variable condition `{page['conditions']['variableId']}` = "
            f"`{page['conditions']['variableValue']}`"
        )
        for index, command in enumerate(page["list"]):
            if command["code"] != 0:
                lines.append(
                    f"  - Command {index}: code `{command['code']}`, "
                    f"parameters `{command['parameters']}`"
                )

    lines.extend(
        [
            "",
            "## CE19 Defeat Handoff",
            "",
            f"- CE19 name: `{ce19['name']}`",
            f"- CE19 command count: `{len(ce19['list'])}`",
            f"- Defeat handoff currently occurs at command `{ce19_defeat_indexes[0]}`.",
            "",
            "### Cleanup Before Handoff",
            "",
        ]
    )

    for index in ce19_cleanup_range:
        lines.append(describe_command(index, ce19["list"][index]))

    lines.extend(
        [
            "",
            "### Current Defeat Branch",
            "",
            describe_command(59, ce19["list"][59]),
            describe_command(60, ce19["list"][60]),
            describe_command(61, ce19["list"][61]),
            "",
            "## CE18 Retry Behavior",
            "",
            f"- CE18 name: `{ce18['name']}`",
            "",
        ]
    )

    for index in ce18_reset_range:
        lines.append(describe_command(index, ce18["list"][index]))

    lines.extend(
        [
            "",
            "## CE5 Canonical Rebootstrap",
            "",
            f"- CE5 name: `{ce5['name']}`",
            f"- CE5 attempt increment command: {describe_command(ce5_attempt_index, ce5['list'][ce5_attempt_index])[2:]}",
            f"- CE5 race activation command: {describe_command(20, ce5['list'][20])[2:]}",
            f"- CE5 preload command: {describe_command(19, ce5['list'][19])[2:]}",
            "",
            "## Findings",
            "",
            "- `Map001` still boots the race through an autorun event followed by `Erase Event`.",
            "- `CE19` already performs the necessary post-result cleanup before deciding victory or defeat.",
            "- The current defeat branch delegates to `CE18`, which was designed for in-race crash recovery rather than post-result retry.",
            "- Rebooting the race through `CE5` avoids depending on the erased `Map001` autorun during the same map load.",
            "",
            "## Recommended Patch",
            "",
            "- Replace the post-result defeat handoff in `CE19` from `Call Common Event 18` to `Call Common Event 5`.",
            "- Keep `CE18` unchanged for direct crash/fail states that happen during the active race loop.",
            "- Preserve the existing CE19 cleanup block before the retry call.",
            "",
        ]
    )

    OUTPUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Wrote audit to {OUTPUT_PATH}")
    print("Confirmed CE19 defeat handoff: command 60 -> CE18")
    print("Confirmed Map001 bootstrap still depends on autorun + Erase Event")


if __name__ == "__main__":
    main()
