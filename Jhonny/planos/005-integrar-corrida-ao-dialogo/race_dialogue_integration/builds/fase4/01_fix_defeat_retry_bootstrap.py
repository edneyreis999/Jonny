#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"
OUTPUT_DIR = PLAN_DIR / "interaction" / "fase4"
SUMMARY_PATH = OUTPUT_DIR / "defeat-retry-bootstrap-summary.md"

CE5_ID = 5
CE18_ID = 18
CE19_ID = 19


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path: Path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    data = load_json(COMMON_EVENTS_PATH)
    ce19 = data[CE19_ID]

    assert ce19["id"] == CE19_ID
    assert ce19["name"] == "EV_VitoriaCorrida"
    assert ce19["list"][60]["code"] == 117
    assert ce19["list"][60]["parameters"] == [CE18_ID], (
        "CE19 defeat branch no longer points to CE18 at command 60"
    )
    assert ce19["list"][45]["code"] == 121
    assert ce19["list"][45]["parameters"] == [100, 100, 1]
    assert ce19["list"][46]["code"] == 355
    assert ce19["list"][46]["parameters"] == ["$gameTemp.clearCommonEventReservation();"]

    ce19["list"][60]["parameters"] = [CE5_ID]

    save_json(COMMON_EVENTS_PATH, data)
    reloaded = load_json(COMMON_EVENTS_PATH)
    reloaded_ce19 = reloaded[CE19_ID]

    assert reloaded_ce19["list"][60]["code"] == 117
    assert reloaded_ce19["list"][60]["parameters"] == [CE5_ID]
    assert not any(
        command["code"] == 117 and command["parameters"] == [CE18_ID]
        for command in reloaded_ce19["list"]
    ), "CE19 still delegates defeat to CE18 after patch"
    assert reloaded_ce19["list"][-1]["code"] == 0

    lines = [
        "# Defeat Retry Bootstrap Summary",
        "",
        f"- Patched file: `{COMMON_EVENTS_PATH}`",
        "- Common Event: `CE19 EV_VitoriaCorrida`",
        "- Defeat branch now reboots through `CE5 EV_RaceOrchestrator` instead of `CE18 EV_Crash`.",
        "- Existing CE19 cleanup before the retry call was preserved.",
        "- `CE18` remains available for direct crash/fail handling during the active race loop.",
        "",
        "## Key Commands",
        "",
        f"- Command 45: `{reloaded_ce19['list'][45]['parameters']}`",
        f"- Command 46: `{reloaded_ce19['list'][46]['parameters'][0]}`",
        f"- Command 60: `{reloaded_ce19['list'][60]['parameters']}`",
        "",
    ]
    SUMMARY_PATH.write_text("\n".join(lines), encoding="utf-8")

    print(f"Patched {COMMON_EVENTS_PATH}")
    print("CE19 defeat branch now calls CE5 directly after post-result cleanup")
    print(f"Saved summary to {SUMMARY_PATH}")


if __name__ == "__main__":
    main()
