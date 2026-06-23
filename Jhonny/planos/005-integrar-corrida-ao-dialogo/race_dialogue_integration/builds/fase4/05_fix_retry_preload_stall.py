#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"
OUTPUT_DIR = PLAN_DIR / "interaction" / "fase4"
SUMMARY_PATH = OUTPUT_DIR / "defeat-retry-preload-summary.md"

CE3_ID = 3
CE5_ID = 5
ATTEMPT_VAR_ID = 112
RACE_ACTIVE_SWITCH_ID = 100


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
    ce5 = data[CE5_ID]

    assert ce5["id"] == CE5_ID
    assert ce5["name"] == "EV_RaceOrchestrator"
    assert ce5["list"][18]["code"] == 121
    assert ce5["list"][18]["parameters"] == [101, 101, 0]
    assert ce5["list"][19]["code"] == 117
    assert ce5["list"][19]["parameters"] == [CE3_ID]
    assert ce5["list"][20]["code"] == 121
    assert ce5["list"][20]["parameters"] == [RACE_ACTIVE_SWITCH_ID, RACE_ACTIVE_SWITCH_ID, 0]

    has_attempt_guard = any(
        command["code"] == 111
        and command["parameters"] == [1, ATTEMPT_VAR_ID, 0, 1, 2]
        for command in ce5["list"]
    )
    assert not has_attempt_guard, "CE5 already contains the retry-preload guard"

    guarded_preload = [
        {"code": 111, "indent": 0, "parameters": [1, ATTEMPT_VAR_ID, 0, 1, 2]},
        {"code": 117, "indent": 1, "parameters": [CE3_ID]},
        {"code": 412, "indent": 0, "parameters": []},
    ]
    ce5["list"] = ce5["list"][:19] + guarded_preload + ce5["list"][20:]

    save_json(COMMON_EVENTS_PATH, data)
    reloaded = load_json(COMMON_EVENTS_PATH)
    reloaded_ce5 = reloaded[CE5_ID]

    assert reloaded_ce5["list"][19]["code"] == 111
    assert reloaded_ce5["list"][19]["parameters"] == [1, ATTEMPT_VAR_ID, 0, 1, 2]
    assert reloaded_ce5["list"][20]["code"] == 117
    assert reloaded_ce5["list"][20]["parameters"] == [CE3_ID]
    assert reloaded_ce5["list"][21]["code"] == 412
    assert reloaded_ce5["list"][22]["code"] == 121
    assert reloaded_ce5["list"][22]["parameters"] == [RACE_ACTIVE_SWITCH_ID, RACE_ACTIVE_SWITCH_ID, 0]
    assert reloaded_ce5["list"][-1]["code"] == 0

    lines = [
        "# Defeat Retry Preload Summary",
        "",
        f"- Patched file: `{COMMON_EVENTS_PATH}`",
        "- Common Event: `CE5 EV_RaceOrchestrator`",
        "- Added a guard so `CE3 EV_Preload` runs only when `V[112] <= 1`.",
        "- Retry attempts now skip the preload child interpreter and continue directly to `SW_RACE_ACTIVE ON`.",
        "- Cold bootstrap still keeps the original preload call before the race loops reactivate.",
        "",
        "## Key Commands",
        "",
        f"- Command 19: `{reloaded_ce5['list'][19]['parameters']}`",
        f"- Command 20: `{reloaded_ce5['list'][20]['parameters']}`",
        f"- Command 21: `{reloaded_ce5['list'][21]['parameters']}`",
        f"- Command 22: `{reloaded_ce5['list'][22]['parameters']}`",
        "",
    ]
    SUMMARY_PATH.write_text("\n".join(lines), encoding="utf-8")

    print(f"Patched {COMMON_EVENTS_PATH}")
    print("CE5 now skips CE3 preload on retries before re-enabling SW_RACE_ACTIVE")
    print(f"Saved summary to {SUMMARY_PATH}")


if __name__ == "__main__":
    main()
