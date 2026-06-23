#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"

CE13_ID = 13
CE19_ID = 19
SW_INPUT_LOCKED = 101

EXPECTED_CE13_SCRIPT = (
    "if ($gameVariables.value(102) === 0) {  "
    "if (Input.isTriggered('down')) $gameTemp.reserveCommonEvent(11);  "
    "if (Input.isTriggered('up'))   $gameTemp.reserveCommonEvent(12);"
    "} else {  "
    "if (Input.isTriggered('right')) $gameTemp.reserveCommonEvent(12);  "
    "if (Input.isTriggered('left'))  $gameTemp.reserveCommonEvent(11);"
    "}"
)

PATCHED_CE13_SCRIPT = (
    "if (!$gameSwitches.value(101)) { "
    "if ($gameVariables.value(102) === 0) { "
    "if (Input.isTriggered('down')) $gameTemp.reserveCommonEvent(11); "
    "if (Input.isTriggered('up')) $gameTemp.reserveCommonEvent(12); "
    "} else { "
    "if (Input.isTriggered('right')) $gameTemp.reserveCommonEvent(12); "
    "if (Input.isTriggered('left')) $gameTemp.reserveCommonEvent(11); "
    "} "
    "}"
)

EXPECTED_CE19_WAIT_CONDITION = "!Input.isTriggered('ok')"
PATCHED_CE19_WAIT_CONDITION = "!Input.isPressed('ok')"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json(path: Path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def assert_command(command, code, indent, parameters, label):
    assert command["code"] == code, f"{label}: expected code {code}, got {command['code']}"
    assert command["indent"] == indent, f"{label}: expected indent {indent}, got {command['indent']}"
    assert command["parameters"] == parameters, (
        f"{label}: expected parameters {parameters}, got {command['parameters']}"
    )


def main():
    common_events = load_json(COMMON_EVENTS_PATH)
    original_length = len(common_events)

    ce13 = common_events[CE13_ID]
    ce19 = common_events[CE19_ID]

    assert ce13["id"] == CE13_ID and ce13["name"] == "EV_KeyInput"
    assert ce13["trigger"] == 2 and ce13["switchId"] == 100
    assert ce19["id"] == CE19_ID and ce19["name"] == "EV_VitoriaCorrida"

    ce13_script_command = ce13["list"][4]
    assert_command(
        ce13_script_command,
        355,
        0,
        [EXPECTED_CE13_SCRIPT],
        "CE13 command 4 directional input script",
    )

    ce19_wait_label = ce19["list"][29]
    ce19_wait_condition = ce19["list"][30]
    ce19_wait = ce19["list"][31]
    ce19_jump = ce19["list"][32]
    ce19_branch_end = ce19["list"][33]

    assert_command(ce19_wait_label, 118, 0, ["WAIT_INPUT"], "CE19 command 29 wait label")
    assert_command(
        ce19_wait_condition,
        111,
        0,
        [12, EXPECTED_CE19_WAIT_CONDITION],
        "CE19 command 30 wait condition",
    )
    assert_command(ce19_wait, 230, 1, [1], "CE19 command 31 wait frame")
    assert_command(ce19_jump, 119, 1, ["WAIT_INPUT"], "CE19 command 32 jump label")
    assert_command(ce19_branch_end, 412, 0, [], "CE19 command 33 branch end")

    ce13_script_command["parameters"] = [PATCHED_CE13_SCRIPT]
    ce19_wait_condition["parameters"] = [12, PATCHED_CE19_WAIT_CONDITION]

    write_json(COMMON_EVENTS_PATH, common_events)

    reloaded = load_json(COMMON_EVENTS_PATH)
    assert len(reloaded) == original_length
    assert reloaded[CE13_ID]["id"] == CE13_ID
    assert reloaded[CE19_ID]["id"] == CE19_ID
    assert reloaded[CE13_ID]["list"][4]["parameters"] == [PATCHED_CE13_SCRIPT]
    assert reloaded[CE19_ID]["list"][30]["parameters"] == [12, PATCHED_CE19_WAIT_CONDITION]
    assert reloaded[CE13_ID]["list"][-1]["code"] == 0
    assert reloaded[CE19_ID]["list"][-1]["code"] == 0
    assert f"$gameSwitches.value({SW_INPUT_LOCKED})" in PATCHED_CE13_SCRIPT

    print("Updated CommonEvents.json")
    print(f"- CE13 EV_KeyInput command 4 now ignores arrows while switch {SW_INPUT_LOCKED} is ON")
    print("- CE19 EV_VitoriaCorrida command 30 now waits on !Input.isPressed('ok')")
    print(f"- CommonEvents length preserved: {original_length}")


if __name__ == "__main__":
    main()
