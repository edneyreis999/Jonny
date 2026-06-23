#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"

CE19_ID = 19
SW_RACE_ACTIVE_OFF_COMMAND = {"code": 121, "indent": 0, "parameters": [100, 100, 1]}


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json(path: Path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def main():
    common_events = load_json(COMMON_EVENTS_PATH)
    original_length = len(common_events)
    ce19 = common_events[CE19_ID]

    assert ce19["id"] == CE19_ID and ce19["name"] == "EV_VitoriaCorrida"
    assert ce19["list"][0] == {"code": 121, "indent": 0, "parameters": [101, 101, 0]}
    assert ce19["list"][1] == {"code": 121, "indent": 0, "parameters": [104, 104, 0]}
    assert ce19["list"][30] == {"code": 111, "indent": 0, "parameters": [12, "!Input.isPressed('ok')"]}
    assert any(command == SW_RACE_ACTIVE_OFF_COMMAND for command in ce19["list"][35:])
    assert ce19["list"][1] != SW_RACE_ACTIVE_OFF_COMMAND

    ce19["list"].insert(1, dict(SW_RACE_ACTIVE_OFF_COMMAND))

    write_json(COMMON_EVENTS_PATH, common_events)

    reloaded = load_json(COMMON_EVENTS_PATH)
    reloaded_ce19 = reloaded[CE19_ID]
    assert len(reloaded) == original_length
    assert reloaded_ce19["list"][0] == {"code": 121, "indent": 0, "parameters": [101, 101, 0]}
    assert reloaded_ce19["list"][1] == SW_RACE_ACTIVE_OFF_COMMAND
    assert reloaded_ce19["list"][2] == {"code": 121, "indent": 0, "parameters": [104, 104, 0]}
    assert reloaded_ce19["list"][-1]["code"] == 0
    assert sum(1 for command in reloaded_ce19["list"] if command == SW_RACE_ACTIVE_OFF_COMMAND) >= 2

    print("Updated CE19 EV_VitoriaCorrida")
    print("- Inserted SW_RACE_ACTIVE OFF at command 1, before result-screen rendering and WAIT_INPUT")
    print("- Later SW_RACE_ACTIVE OFF cleanup command preserved")
    print(f"- CommonEvents length preserved: {original_length}")


if __name__ == "__main__":
    main()
