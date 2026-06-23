#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
DATA_DIR = PROJECT_DIR / "data"

FILES_TO_PARSE = [
    "Map001.json",
    "Map005.json",
    "Map010.json",
    "Map012.json",
    "Map013.json",
    "CommonEvents.json",
    "System.json",
    "MapInfos.json",
]


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def get_map_name(map_infos, map_id: int) -> str:
    entry = map_infos[map_id]
    return entry["name"] if entry else f"Map{map_id:03d}"


def main():
    loaded = {}
    for filename in FILES_TO_PARSE:
        path = DATA_DIR / filename
        loaded[filename] = load_json(path)

    common_events = loaded["CommonEvents.json"]
    map001 = loaded["Map001.json"]
    map005 = loaded["Map005.json"]
    map010 = loaded["Map010.json"]
    map013 = loaded["Map013.json"]
    map_infos = loaded["MapInfos.json"]

    ce19 = common_events[19]
    ce5 = common_events[5]
    ce3 = common_events[3]
    map001_init = map001["events"][1]

    map010_page = map010["events"][1]["pages"][1]
    map005_page = map005["events"][1]["pages"][2]
    map013_page = map013["events"][1]["pages"][0]

    race3_var_indexes = [
        index
        for index, command in enumerate(map013_page["list"])
        if command["code"] == 122 and command["parameters"] == [100, 100, 0, 0, 3]
    ]
    race3_transfer_indexes = [
        index
        for index, command in enumerate(map013_page["list"])
        if command["code"] == 201 and command["parameters"][1] == 1
    ]
    ce19_victory_transfers = [
        (index, command["parameters"])
        for index, command in enumerate(ce19["list"])
        if command["code"] == 201
    ]
    ce19_defeat_calls = [
        (index, command["parameters"])
        for index, command in enumerate(ce19["list"])
        if command["code"] == 117 and command["parameters"] in ([5], [18])
    ]
    ce5_preload_window = [
        (index, command["code"], command["parameters"])
        for index, command in enumerate(ce5["list"])
        if 18 <= index <= 22
    ]
    ce5_attempt_guard_indexes = [
        index
        for index, command in enumerate(ce5["list"])
        if command["code"] == 111 and command["parameters"] == [1, 112, 0, 1, 2]
    ]

    print("Parsed JSON files:")
    for filename in FILES_TO_PARSE:
        print(f"- {filename}")

    print("\nEntry routes:")
    print(
        f"- Race 1: Map010 event 1 page 2 commands 79-80 -> "
        f"VAR_RACE_ID {map010_page['list'][79]['parameters']} / "
        f"Transfer {map010_page['list'][80]['parameters']}"
    )
    print(
        f"- Race 2: Map005 event 1 page 3 commands 104-105 -> "
        f"VAR_RACE_ID {map005_page['list'][104]['parameters']} / "
        f"Transfer {map005_page['list'][105]['parameters']}"
    )
    print(f"- Race 3 variable commands in Map013: {race3_var_indexes}")
    for index in race3_transfer_indexes:
        print(f"- Race 3 transfer command {index}: {map013_page['list'][index]['parameters']}")

    print("\nVictory routes from CE19:")
    for index, parameters in ce19_victory_transfers:
        destination = get_map_name(map_infos, parameters[1])
        print(f"- Command {index}: map {parameters[1]} ({destination}) params {parameters}")

    print("\nDefeat retry bootstrap:")
    print(f"- CE19 defeat call(s): {ce19_defeat_calls}")
    print(f"- CE5 attempt increment command 4: {ce5['list'][4]['parameters']}")
    print(
        f"- Map001 Init Corrida pages: "
        f"{[(page['conditions']['variableValue'], page['list'][0]['parameters']) for page in map001_init['pages']]}"
    )
    print(f"- CE3 preload length: {len(ce3['list'])}")
    print(f"- CE5 attempt guard indexes: {ce5_attempt_guard_indexes}")
    print(f"- CE5 preload window: {ce5_preload_window}")


if __name__ == "__main__":
    main()
