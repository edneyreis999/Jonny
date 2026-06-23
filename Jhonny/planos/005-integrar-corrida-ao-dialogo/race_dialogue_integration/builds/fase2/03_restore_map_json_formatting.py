#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]

MAP_CHECKS = [
    {
        "path": PROJECT_DIR / "data" / "Map010.json",
        "eventId": 1,
        "pageIndex": 1,
        "raceId": 1,
        "transferParams": [0, 1, 3, 2, 0, 0],
    },
    {
        "path": PROJECT_DIR / "data" / "Map005.json",
        "eventId": 1,
        "pageIndex": 2,
        "raceId": 2,
        "transferParams": [0, 1, 4, 5, 0, 0],
    },
]


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def validate_marker(data, check):
    commands = data["events"][check["eventId"]]["pages"][check["pageIndex"]]["list"]
    expected_variable = [100, 100, 0, 0, check["raceId"]]

    for index, command in enumerate(commands[:-1]):
        next_command = commands[index + 1]
        if command["code"] != 122 or command["parameters"] != expected_variable:
            continue
        assert next_command["code"] == 201, "Expected Transfer Player after marker"
        assert next_command["parameters"] == check["transferParams"], (
            f"Unexpected transfer parameters: {next_command['parameters']}"
        )
        return index, index + 1

    raise AssertionError(f"Expected race marker not found in {check['path']}")


def main():
    for check in MAP_CHECKS:
        data = load_json(check["path"])
        variable_index, transfer_index = validate_marker(data, check)
        save_json(check["path"], data)
        reloaded = load_json(check["path"])
        validate_marker(reloaded, check)
        print(
            f"Reformatted {check['path']} with 4-space indentation; "
            f"command {variable_index} keeps VAR_RACE_ID={check['raceId']}, "
            f"command {transfer_index} transfer={check['transferParams']}"
        )


if __name__ == "__main__":
    main()
