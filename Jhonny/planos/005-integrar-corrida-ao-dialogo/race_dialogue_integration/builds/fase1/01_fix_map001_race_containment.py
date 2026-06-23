#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
MAP_PATH = PROJECT_DIR / "data" / "Map001.json"

EVENT_NAME = "Init Corrida"
RACE_VARIABLE_ID = 100
ORCHESTRATOR_COMMON_EVENT_ID = 5
EXPECTED_TRANSFERS_BY_PAGE = {
    1: 5,
    2: 13,
    3: 12,
}


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
        file.write("\n")


def find_event(data, name):
    for event in data["events"]:
        if event and event.get("name") == name:
            return event
    raise AssertionError(f'Event "{name}" not found')


def assert_race_page(page, page_number, expected_destination):
    conditions = page["conditions"]
    assert page["trigger"] == 3, f"Page {page_number}: expected autorun trigger 3"
    assert conditions["variableValid"] is True, (
        f"Page {page_number}: expected variable condition"
    )
    assert conditions["variableId"] == RACE_VARIABLE_ID, (
        f"Page {page_number}: expected VAR_RACE_ID variable {RACE_VARIABLE_ID}"
    )
    assert conditions["variableValue"] == page_number, (
        f"Page {page_number}: expected VAR_RACE_ID >= {page_number}"
    )

    commands = page["list"]
    assert commands[-1]["code"] == 0, f"Page {page_number}: missing terminator"
    assert commands[0]["code"] == 117, (
        f"Page {page_number}: first command must call a Common Event"
    )
    assert commands[0]["parameters"] == [ORCHESTRATOR_COMMON_EVENT_ID], (
        f"Page {page_number}: expected CE{ORCHESTRATOR_COMMON_EVENT_ID}"
    )
    assert commands[1]["code"] == 201, (
        f"Page {page_number}: expected immediate Transfer Player at command 1"
    )
    assert commands[1]["parameters"][1] == expected_destination, (
        f"Page {page_number}: expected transfer to Map{expected_destination:03d}"
    )
    assert len(commands) == 3, (
        f"Page {page_number}: expected CE5, Transfer Player, terminator only"
    )


def patch_event(event):
    removed = []
    assert len(event["pages"]) >= 3, "Init Corrida must have at least 3 pages"

    for page_number, expected_destination in EXPECTED_TRANSFERS_BY_PAGE.items():
        page = event["pages"][page_number - 1]
        assert_race_page(page, page_number, expected_destination)
        transfer = page["list"].pop(1)
        removed.append(
            {
                "page": page_number,
                "removedCode": transfer["code"],
                "removedMapId": transfer["parameters"][1],
            }
        )
        assert page["list"] == [
            {"code": 117, "indent": 0, "parameters": [ORCHESTRATOR_COMMON_EVENT_ID]},
            {"code": 0, "indent": 0, "parameters": []},
        ], f"Page {page_number}: unexpected post-patch command list"

    return removed


def validate_post_patch(path):
    data = load_json(path)
    event = find_event(data, EVENT_NAME)
    summary = []

    for page_number in EXPECTED_TRANSFERS_BY_PAGE:
        page = event["pages"][page_number - 1]
        commands = page["list"]
        assert commands[-1]["code"] == 0, f"Page {page_number}: missing terminator"
        assert any(
            command["code"] == 117
            and command["parameters"] == [ORCHESTRATOR_COMMON_EVENT_ID]
            for command in commands
        ), f"Page {page_number}: CE5 call missing"
        assert not any(
            command["code"] == 201 for command in commands
        ), f"Page {page_number}: Transfer Player still present"
        summary.append(
            {
                "page": page_number,
                "conditionVariableId": page["conditions"]["variableId"],
                "conditionValue": page["conditions"]["variableValue"],
                "commandCodes": [command["code"] for command in commands],
            }
        )

    return summary


def main():
    data = load_json(MAP_PATH)
    event = find_event(data, EVENT_NAME)
    removed = patch_event(event)
    save_json(MAP_PATH, data)
    summary = validate_post_patch(MAP_PATH)

    print(f"Patched {MAP_PATH}")
    print(f"Event: {event['id']} {event['name']}")
    for item in removed:
        print(
            "Removed immediate transfer: "
            f"page {item['page']} -> Map{item['removedMapId']:03d}"
        )
    for item in summary:
        print(
            "Post-patch page "
            f"{item['page']}: VAR {item['conditionVariableId']} >= "
            f"{item['conditionValue']}, command codes {item['commandCodes']}"
        )


if __name__ == "__main__":
    main()
