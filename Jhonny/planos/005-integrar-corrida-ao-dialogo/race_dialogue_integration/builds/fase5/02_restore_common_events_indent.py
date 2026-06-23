#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"

CE13_ID = 13
CE19_ID = 19

PATCHED_CE13_SNIPPET = "if (!$gameSwitches.value(101))"
PATCHED_CE19_WAIT_CONDITION = "!Input.isPressed('ok')"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def main():
    common_events = load_json(COMMON_EVENTS_PATH)

    ce13_command = common_events[CE13_ID]["list"][4]
    ce19_command = common_events[CE19_ID]["list"][30]

    assert ce13_command["code"] == 355
    assert PATCHED_CE13_SNIPPET in ce13_command["parameters"][0]
    assert ce19_command["parameters"] == [12, PATCHED_CE19_WAIT_CONDITION]

    with COMMON_EVENTS_PATH.open("w", encoding="utf-8") as file:
        json.dump(common_events, file, ensure_ascii=False, indent=4)
        file.write("\n")

    reloaded = load_json(COMMON_EVENTS_PATH)
    assert reloaded[CE13_ID]["list"][4]["parameters"] == ce13_command["parameters"]
    assert reloaded[CE19_ID]["list"][30]["parameters"] == ce19_command["parameters"]
    assert reloaded[CE13_ID]["list"][-1]["code"] == 0
    assert reloaded[CE19_ID]["list"][-1]["code"] == 0

    print("Restored CommonEvents.json indentation to 4 spaces")
    print("- CE13 SW_INPUT_LOCKED guard preserved")
    print("- CE19 Input.isPressed('ok') wait condition preserved")


if __name__ == "__main__":
    main()
