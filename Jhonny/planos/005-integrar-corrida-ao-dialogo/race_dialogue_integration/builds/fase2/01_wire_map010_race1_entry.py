#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
MAP_PATH = PROJECT_DIR / "data" / "Map010.json"

EVENT_ID = 1
PAGE_INDEX = 1
RACE_VARIABLE_ID = 100
RACE_ID = 1
SOURCE_MAP_ID = 5
TARGET_MAP_ID = 1


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def find_marker(commands):
    for index, command in enumerate(commands[:-1]):
        next_command = commands[index + 1]
        if command["code"] != 122 or next_command["code"] != 201:
            continue
        if command["parameters"] != [RACE_VARIABLE_ID, RACE_VARIABLE_ID, 0, 0, RACE_ID]:
            continue
        if next_command["parameters"][1] != SOURCE_MAP_ID:
            continue
        return index, index + 1
    raise AssertionError("Race 1 marker with transfer to Map005 was not found")


def patch_transfer(data):
    event = data["events"][EVENT_ID]
    assert event and event["id"] == EVENT_ID, f"Event {EVENT_ID} missing"
    assert event["name"] == "EV001", f"Unexpected event name: {event['name']}"
    page = event["pages"][PAGE_INDEX]
    commands = page["list"]
    variable_index, transfer_index = find_marker(commands)
    transfer = commands[transfer_index]
    before = list(transfer["parameters"])
    transfer["parameters"][1] = TARGET_MAP_ID
    after = list(transfer["parameters"])
    return event, variable_index, transfer_index, before, after


def validate_post_patch(path):
    data = load_json(path)
    event = data["events"][EVENT_ID]
    page = event["pages"][PAGE_INDEX]
    commands = page["list"]

    for index, command in enumerate(commands[:-1]):
        next_command = commands[index + 1]
        if command["code"] != 122 or next_command["code"] != 201:
            continue
        if command["parameters"] != [RACE_VARIABLE_ID, RACE_VARIABLE_ID, 0, 0, RACE_ID]:
            continue
        assert next_command["parameters"][1] == TARGET_MAP_ID, (
            "Race 1 marker does not transfer to Map001"
        )
        return {
            "eventId": event["id"],
            "eventName": event["name"],
            "page": PAGE_INDEX + 1,
            "variableCommandIndex": index,
            "transferCommandIndex": index + 1,
            "variableParameters": command["parameters"],
            "transferParameters": next_command["parameters"],
        }

    raise AssertionError("Race 1 marker with transfer to Map001 was not found")


def main():
    data = load_json(MAP_PATH)
    event, variable_index, transfer_index, before, after = patch_transfer(data)
    save_json(MAP_PATH, data)
    summary = validate_post_patch(MAP_PATH)

    print(f"Patched {MAP_PATH}")
    print(f"Event: {event['id']} {event['name']}, page {PAGE_INDEX + 1}")
    print(
        "Marker: "
        f"command {variable_index} keeps VAR {RACE_VARIABLE_ID} = {RACE_ID}; "
        f"command {transfer_index} transfer {before} -> {after}"
    )
    print(f"Post-patch summary: {summary}")


if __name__ == "__main__":
    main()
