#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
MAP_PATH = PROJECT_DIR / "data" / "Map001.json"

EVENT_NAME = "Init Corrida"
RACE_VARIABLE_ID = 100
ORCHESTRATOR_COMMON_EVENT_ID = 5
ERASE_EVENT_CODE = 214
RACE_PAGES = (1, 2, 3)


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


def assert_contained_page(page, page_number):
    conditions = page["conditions"]
    assert page["trigger"] == 3, f"Page {page_number}: expected autorun trigger"
    assert conditions["variableValid"] is True, (
        f"Page {page_number}: expected variable condition"
    )
    assert conditions["variableId"] == RACE_VARIABLE_ID, (
        f"Page {page_number}: expected VAR_RACE_ID variable {RACE_VARIABLE_ID}"
    )
    assert conditions["variableValue"] == page_number, (
        f"Page {page_number}: expected VAR_RACE_ID >= {page_number}"
    )
    assert page["list"] == [
        {"code": 117, "indent": 0, "parameters": [ORCHESTRATOR_COMMON_EVENT_ID]},
        {"code": 0, "indent": 0, "parameters": []},
    ], f"Page {page_number}: expected CE5 followed by terminator before patch"


def patch_event(event):
    changed_pages = []
    for page_number in RACE_PAGES:
        page = event["pages"][page_number - 1]
        assert_contained_page(page, page_number)
        page["list"].insert(
            1,
            {"code": ERASE_EVENT_CODE, "indent": 0, "parameters": []},
        )
        changed_pages.append(page_number)
    return changed_pages


def validate_post_patch(path):
    data = load_json(path)
    event = find_event(data, EVENT_NAME)
    summary = []

    for page_number in RACE_PAGES:
        page = event["pages"][page_number - 1]
        command_codes = [command["code"] for command in page["list"]]
        assert command_codes == [117, ERASE_EVENT_CODE, 0], (
            f"Page {page_number}: expected CE5, Erase Event, terminator"
        )
        assert not any(
            command["code"] == 201 for command in page["list"]
        ), f"Page {page_number}: Transfer Player must stay removed"
        summary.append(
            {
                "page": page_number,
                "conditionVariableId": page["conditions"]["variableId"],
                "conditionValue": page["conditions"]["variableValue"],
                "commandCodes": command_codes,
            }
        )

    return summary


def main():
    data = load_json(MAP_PATH)
    event = find_event(data, EVENT_NAME)
    changed_pages = patch_event(event)
    save_json(MAP_PATH, data)
    summary = validate_post_patch(MAP_PATH)

    print(f"Patched {MAP_PATH}")
    print(f"Event: {event['id']} {event['name']}")
    print(f"Inserted Erase Event command on pages: {changed_pages}")
    for item in summary:
        print(
            "Post-patch page "
            f"{item['page']}: VAR {item['conditionVariableId']} >= "
            f"{item['conditionValue']}, command codes {item['commandCodes']}"
        )


if __name__ == "__main__":
    main()
