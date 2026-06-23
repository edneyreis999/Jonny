#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"

SW_RACE_ACTIVE = 100
SW_INPUT_LOCKED = 101
SW_PAUSED = 104

PAUSED_GUARD = [
    {"code": 111, "indent": 0, "parameters": [0, SW_PAUSED, 0]},
    {"code": 115, "indent": 1, "parameters": []},
    {"code": 412, "indent": 0, "parameters": []},
]
RACE_ACTIVE_OFF_GUARD = [
    {"code": 111, "indent": 0, "parameters": [0, SW_RACE_ACTIVE, 1]},
    {"code": 115, "indent": 1, "parameters": []},
    {"code": 412, "indent": 0, "parameters": []},
]
INPUT_LOCKED_GUARD = [
    {"code": 111, "indent": 0, "parameters": [0, SW_INPUT_LOCKED, 0]},
    {"code": 115, "indent": 1, "parameters": []},
    {"code": 412, "indent": 0, "parameters": []},
]


def load_common_events():
    with COMMON_EVENTS_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_common_events(common_events):
    COMMON_EVENTS_PATH.write_text(
        json.dumps(common_events, ensure_ascii=False, indent=4) + "\n",
        encoding="utf-8",
    )


def count_targeted_writes(common_events):
    tracked_ids = {100, 101, 102, 103, 104, 105, 106, 107, 108, 116, 117}
    counts = {variable_id: 0 for variable_id in tracked_ids}
    for common_event in common_events:
        if not common_event:
            continue
        for command in common_event["list"]:
            if command["code"] != 122:
                continue
            start_id, end_id = command["parameters"][0], command["parameters"][1]
            for variable_id in tracked_ids:
                if start_id <= variable_id <= end_id:
                    counts[variable_id] += 1
    return counts


def assert_command_slice(actual, expected, label):
    assert actual == expected, f"{label}: expected {expected}, got {actual}"


def main():
    common_events = load_common_events()
    before_counts = count_targeted_writes(common_events)

    ce11 = common_events[11]
    ce12 = common_events[12]

    assert ce11["id"] == 11 and ce11["name"] == "EV_OnSafe"
    assert ce12["id"] == 12 and ce12["name"] == "EV_OnRisk"

    assert_command_slice(ce11["list"][0:3], PAUSED_GUARD, "CE11 paused guard")
    assert_command_slice(ce11["list"][3:6], RACE_ACTIVE_OFF_GUARD, "CE11 race-active guard")
    assert_command_slice(ce11["list"][6:9], INPUT_LOCKED_GUARD, "CE11 input-locked guard")

    assert_command_slice(ce12["list"][0:3], RACE_ACTIVE_OFF_GUARD, "CE12 current race-active guard")
    assert_command_slice(ce12["list"][3:6], INPUT_LOCKED_GUARD, "CE12 current input-locked guard")
    assert ce12["list"][0:3] != PAUSED_GUARD, "CE12 already starts with paused guard"
    assert ce12["list"][-1]["code"] == 0, "CE12 does not end with command 0"

    ce12["list"][0:0] = PAUSED_GUARD

    write_common_events(common_events)

    reloaded = load_common_events()
    after_counts = count_targeted_writes(reloaded)
    assert before_counts == after_counts, (
        f"Tracked variable write counts changed: before {before_counts}, after {after_counts}"
    )

    ce11_after = reloaded[11]
    ce12_after = reloaded[12]
    assert_command_slice(ce11_after["list"][0:3], PAUSED_GUARD, "CE11 paused guard after")
    assert_command_slice(ce12_after["list"][0:3], PAUSED_GUARD, "CE12 paused guard after")
    assert_command_slice(ce12_after["list"][3:6], RACE_ACTIVE_OFF_GUARD, "CE12 race-active guard after")
    assert_command_slice(ce12_after["list"][6:9], INPUT_LOCKED_GUARD, "CE12 input-locked guard after")
    assert ce12_after["list"][-1]["code"] == 0, "CE12 final command changed"

    print("Patched CommonEvents.json")
    print("- Added SW_PAUSED ON -> Exit Event Processing guard to CE12 EV_OnRisk")
    print("- Preserved CE12 SW_RACE_ACTIVE OFF and SW_INPUT_LOCKED ON guards")
    print("- CE11 and CE12 now both reject actions while SW_PAUSED is ON")
    print(f"- Tracked variable write counts unchanged: {after_counts}")


if __name__ == "__main__":
    main()
