#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"

SW_RACE_ACTIVE = 100
SW_INPUT_LOCKED = 101
SW_PAUSED = 104

EARLY_RACE_ACTIVE_OFF = {
    "code": 121,
    "indent": 0,
    "parameters": [SW_RACE_ACTIVE, SW_RACE_ACTIVE, 1],
}
INPUT_LOCK_ON = {
    "code": 121,
    "indent": 0,
    "parameters": [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0],
}
PAUSED_ON = {
    "code": 121,
    "indent": 0,
    "parameters": [SW_PAUSED, SW_PAUSED, 0],
}
CE7_LOCK_ON = {
    "code": 121,
    "indent": 1,
    "parameters": [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0],
}
CE7_WAIT_AFTER_LOCK = {"code": 230, "indent": 1, "parameters": [18]}
CE7_UNLOCK_DIRECT = {
    "code": 121,
    "indent": 1,
    "parameters": [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1],
}
CE7_UNLOCK_IF_NOT_PAUSED = [
    {"code": 111, "indent": 1, "parameters": [0, SW_PAUSED, 1]},
    {
        "code": 121,
        "indent": 2,
        "parameters": [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1],
    },
    {"code": 412, "indent": 1, "parameters": []},
]


def load_common_events():
    with COMMON_EVENTS_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_common_events(common_events):
    COMMON_EVENTS_PATH.write_text(
        json.dumps(common_events, ensure_ascii=False, indent=4) + "\n",
        encoding="utf-8",
    )


def assert_command(actual, expected, label):
    assert actual == expected, f"{label}: expected {expected}, got {actual}"


def count_targeted_variable_writes(common_events):
    tracked_variables = {100, 101, 104, 105, 108, 117}
    counts = {variable_id: 0 for variable_id in tracked_variables}
    for common_event in common_events:
        if not common_event:
            continue
        for command in common_event["list"]:
            if command["code"] != 122:
                continue
            start_id, end_id = command["parameters"][0], command["parameters"][1]
            for variable_id in tracked_variables:
                if start_id <= variable_id <= end_id:
                    counts[variable_id] += 1
    return counts


def main():
    common_events = load_common_events()
    before_counts = count_targeted_variable_writes(common_events)

    ce7 = common_events[7]
    ce19 = common_events[19]

    assert ce7["id"] == 7 and ce7["name"] == "EV_RaceRenderer"
    assert ce19["id"] == 19 and ce19["name"] == "EV_VitoriaCorrida"

    assert_command(ce19["list"][0], INPUT_LOCK_ON, "CE19[0] input lock")
    assert_command(ce19["list"][1], EARLY_RACE_ACTIVE_OFF, "CE19[1] bad early race stop")
    assert_command(ce19["list"][2], PAUSED_ON, "CE19[2] pause on")
    assert any(
        command == EARLY_RACE_ACTIVE_OFF
        for command in ce19["list"][30:]
    ), "CE19 later SW_RACE_ACTIVE OFF cleanup was not found"
    assert any(
        command["code"] == 111 and command["parameters"] == [12, "!Input.isPressed('ok')"]
        for command in ce19["list"]
    ), "CE19 WAIT_INPUT is not using Input.isPressed('ok')"

    assert_command(ce7["list"][37], CE7_LOCK_ON, "CE7[37] input lock")
    assert_command(ce7["list"][38], CE7_WAIT_AFTER_LOCK, "CE7[38] post-lock wait")
    assert_command(ce7["list"][39], CE7_UNLOCK_DIRECT, "CE7[39] direct unlock")
    assert_command(ce7["list"][40], {"code": 412, "indent": 0, "parameters": []}, "CE7[40] outer branch end")

    del ce19["list"][1]
    ce7["list"][39:40] = CE7_UNLOCK_IF_NOT_PAUSED

    write_common_events(common_events)

    reloaded = load_common_events()
    after_counts = count_targeted_variable_writes(reloaded)
    assert before_counts == after_counts, (
        f"Tracked variable write counts changed: before {before_counts}, after {after_counts}"
    )

    ce7_after = reloaded[7]
    ce19_after = reloaded[19]
    assert_command(ce19_after["list"][0], INPUT_LOCK_ON, "CE19[0] after input lock")
    assert_command(ce19_after["list"][1], PAUSED_ON, "CE19[1] after pause on")
    assert any(
        command == EARLY_RACE_ACTIVE_OFF
        for command in ce19_after["list"][29:]
    ), "CE19 later SW_RACE_ACTIVE OFF cleanup was not preserved"
    assert all(
        command != EARLY_RACE_ACTIVE_OFF
        for command in ce19_after["list"][1:29]
    ), "CE19 still has early SW_RACE_ACTIVE OFF before WAIT_INPUT cleanup"
    assert any(
        command["code"] == 111 and command["parameters"] == [12, "!Input.isPressed('ok')"]
        for command in ce19_after["list"]
    ), "CE19 WAIT_INPUT lost Input.isPressed('ok')"

    assert_command(ce7_after["list"][37], CE7_LOCK_ON, "CE7[37] after input lock")
    assert_command(ce7_after["list"][38], CE7_WAIT_AFTER_LOCK, "CE7[38] after wait")
    assert ce7_after["list"][39:42] == CE7_UNLOCK_IF_NOT_PAUSED, (
        f"CE7 unlock guard mismatch: {ce7_after['list'][39:42]}"
    )
    assert_command(ce7_after["list"][42], {"code": 412, "indent": 0, "parameters": []}, "CE7 outer branch end after guard")
    assert ce7_after["list"][-1]["code"] == 0
    assert ce19_after["list"][-1]["code"] == 0

    print("Patched CommonEvents.json")
    print("- Removed early CE19 SW_RACE_ACTIVE OFF before result WAIT_INPUT")
    print("- Preserved later CE19 SW_RACE_ACTIVE OFF cleanup")
    print("- Wrapped CE7 post-render SW_INPUT_LOCKED OFF in SW_PAUSED OFF branch")
    print(f"- Tracked variable write counts unchanged: {after_counts}")


if __name__ == "__main__":
    main()
