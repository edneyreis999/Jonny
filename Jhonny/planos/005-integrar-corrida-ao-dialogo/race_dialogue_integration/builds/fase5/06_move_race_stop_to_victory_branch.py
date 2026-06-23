#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"

SW_RACE_ACTIVE = 100
SW_CRASH_FLAG = 102
VAR_RACE_ID = 100
VAR_VITORIA_PASSOU = 117

RACE_ACTIVE_OFF = {
    "code": 121,
    "indent": 0,
    "parameters": [SW_RACE_ACTIVE, SW_RACE_ACTIVE, 1],
}
CLEAR_COMMON_EVENT_RESERVATION = {
    "code": 355,
    "indent": 0,
    "parameters": ["$gameTemp.clearCommonEventReservation();"],
}
CRASH_FLAG_OFF = {
    "code": 121,
    "indent": 0,
    "parameters": [SW_CRASH_FLAG, SW_CRASH_FLAG, 1],
}
VICTORY_CONDITION = {
    "code": 111,
    "indent": 0,
    "parameters": [1, VAR_VITORIA_PASSOU, 0, 1, 0],
}
RACE_1_CONDITION = {
    "code": 111,
    "indent": 1,
    "parameters": [1, VAR_RACE_ID, 0, 1, 0],
}
RACE_2_CONDITION = {
    "code": 111,
    "indent": 2,
    "parameters": [1, VAR_RACE_ID, 0, 2, 0],
}
RACE_3_CONDITION = {
    "code": 111,
    "indent": 3,
    "parameters": [1, VAR_RACE_ID, 0, 3, 0],
}
TRANSFER_RACE_1 = {"code": 201, "indent": 2, "parameters": [0, 5, 3, 2, 0, 0]}
TRANSFER_RACE_2 = {"code": 201, "indent": 3, "parameters": [0, 13, 4, 5, 0, 0]}
TRANSFER_RACE_3 = {"code": 201, "indent": 4, "parameters": [0, 12, 0, 0, 0, 0]}
DEFEAT_ELSE = {"code": 411, "indent": 0, "parameters": []}
DEFEAT_RETRY_CALL = {"code": 117, "indent": 1, "parameters": [5]}


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


def count_variable_writes(common_events):
    tracked_variables = {100, 101, 104, 105, 108, 112, 113, 117}
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


def find_command_index(commands, expected, start=0):
    for index in range(start, len(commands)):
        if commands[index] == expected:
            return index
    raise AssertionError(f"Command not found after {start}: {expected}")


def assert_no_defeat_path_race_stop(commands):
    defeat_else_index = find_command_index(commands, DEFEAT_ELSE, start=40)
    retry_index = find_command_index(commands, DEFEAT_RETRY_CALL, start=defeat_else_index)
    for index in range(defeat_else_index, retry_index + 1):
        command = commands[index]
        assert command != RACE_ACTIVE_OFF, (
            f"Defeat path still turns SW_RACE_ACTIVE OFF at CE19[{index}] before retry"
        )


def main():
    common_events = load_common_events()
    before_variable_counts = count_variable_writes(common_events)

    ce19 = common_events[19]
    assert ce19["id"] == 19 and ce19["name"] == "EV_VitoriaCorrida"
    commands = ce19["list"]

    global_race_stop_index = find_command_index(commands, RACE_ACTIVE_OFF, start=34)
    assert_command(commands[global_race_stop_index + 1], CLEAR_COMMON_EVENT_RESERVATION, "CE19 clear reservation after global race stop")
    assert_command(commands[global_race_stop_index + 2], CRASH_FLAG_OFF, "CE19 crash flag off after global race stop")
    assert_command(commands[global_race_stop_index + 3], VICTORY_CONDITION, "CE19 victory branch after cleanup")

    race_stop_count_before = sum(1 for command in commands if command == RACE_ACTIVE_OFF)
    assert race_stop_count_before == 1, f"Expected one CE19 SW_RACE_ACTIVE OFF before patch, got {race_stop_count_before}"

    del commands[global_race_stop_index]

    race_1_condition_index = find_command_index(commands, RACE_1_CONDITION, start=global_race_stop_index)
    assert_command(commands[race_1_condition_index + 1], TRANSFER_RACE_1, "CE19 race 1 transfer before patch")
    commands.insert(race_1_condition_index + 1, {**RACE_ACTIVE_OFF, "indent": 2})

    race_2_condition_index = find_command_index(commands, RACE_2_CONDITION, start=race_1_condition_index)
    assert_command(commands[race_2_condition_index + 1], TRANSFER_RACE_2, "CE19 race 2 transfer before patch")
    commands.insert(race_2_condition_index + 1, {**RACE_ACTIVE_OFF, "indent": 3})

    race_3_condition_index = find_command_index(commands, RACE_3_CONDITION, start=race_2_condition_index)
    assert_command(commands[race_3_condition_index + 1], TRANSFER_RACE_3, "CE19 race 3 transfer before patch")
    commands.insert(race_3_condition_index + 1, {**RACE_ACTIVE_OFF, "indent": 4})

    write_common_events(common_events)

    reloaded = load_common_events()
    after_variable_counts = count_variable_writes(reloaded)
    assert before_variable_counts == after_variable_counts, (
        f"Tracked variable write counts changed: before {before_variable_counts}, after {after_variable_counts}"
    )

    ce19_after = reloaded[19]
    commands_after = ce19_after["list"]
    assert ce19_after["id"] == 19 and ce19_after["name"] == "EV_VitoriaCorrida"
    assert commands_after[-1]["code"] == 0, "CE19 must still end with command 0"

    race_stop_count_after = sum(
        1
        for command in commands_after
        if command["code"] == 121 and command["parameters"] == [SW_RACE_ACTIVE, SW_RACE_ACTIVE, 1]
    )
    assert race_stop_count_after == 3, f"Expected three victory-only SW_RACE_ACTIVE OFF commands, got {race_stop_count_after}"

    clear_index = find_command_index(commands_after, CLEAR_COMMON_EVENT_RESERVATION, start=34)
    assert_command(commands_after[clear_index + 1], CRASH_FLAG_OFF, "CE19 crash flag off after clear reservation")
    assert_command(commands_after[clear_index + 2], VICTORY_CONDITION, "CE19 victory branch after clear reservation")

    race_1_condition_index = find_command_index(commands_after, RACE_1_CONDITION, start=clear_index)
    assert_command(commands_after[race_1_condition_index + 1], {**RACE_ACTIVE_OFF, "indent": 2}, "CE19 race 1 victory race stop")
    assert_command(commands_after[race_1_condition_index + 2], TRANSFER_RACE_1, "CE19 race 1 transfer after race stop")

    race_2_condition_index = find_command_index(commands_after, RACE_2_CONDITION, start=race_1_condition_index)
    assert_command(commands_after[race_2_condition_index + 1], {**RACE_ACTIVE_OFF, "indent": 3}, "CE19 race 2 victory race stop")
    assert_command(commands_after[race_2_condition_index + 2], TRANSFER_RACE_2, "CE19 race 2 transfer after race stop")

    race_3_condition_index = find_command_index(commands_after, RACE_3_CONDITION, start=race_2_condition_index)
    assert_command(commands_after[race_3_condition_index + 1], {**RACE_ACTIVE_OFF, "indent": 4}, "CE19 race 3 victory race stop")
    assert_command(commands_after[race_3_condition_index + 2], TRANSFER_RACE_3, "CE19 race 3 transfer after race stop")

    assert_no_defeat_path_race_stop(commands_after)

    print("Patched CommonEvents.json")
    print("- Removed CE19 global SW_RACE_ACTIVE OFF before victory/defeat routing")
    print("- Added SW_RACE_ACTIVE OFF inside each victory transfer branch only")
    print("- Preserved defeat retry as CE19 -> CE5 without turning SW_RACE_ACTIVE OFF first")
    print(f"- Tracked variable write counts unchanged: {after_variable_counts}")


if __name__ == "__main__":
    main()
