#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"
INTERACTION_DIR = PLAN_DIR / "interaction" / "fase3"
SUMMARY_PATH = INTERACTION_DIR / "ce19-cleanup-summary.md"

COMMON_EVENT_ID = 19
COMMON_EVENT_NAME = "EV_VitoriaCorrida"

SW_RACE_ACTIVE_ID = 100
SW_PAUSED_ID = 104

RACE_1_TRANSFER = [0, 5, 3, 2, 0, 0]
RACE_2_TRANSFER = [0, 13, 4, 5, 0, 0]
RACE_3_TRANSFER = [0, 12, 0, 0, 0, 0]

ERASE_RACE_PICTURES_SCRIPT_60 = "for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);"
ERASE_RACE_PICTURES_SCRIPT_61 = "for (let i = 1; i <= 61; i++) $gameScreen.erasePicture(i);"
CLEAR_QUEUE_SCRIPT = "$gameTemp.clearCommonEventReservation();"

EXPECTED_BEFORE_CODES = [
    121, 121, 357, 657, 355, 242, 355, 655, 655, 655,
    655, 111, 249, 411, 249, 412, 223, 108, 111, 357,
    657, 231, 411, 357, 657, 231, 412, 357, 657, 231,
    357, 657, 231, 118, 111, 230, 119, 412, 121, 235,
    235, 235, 235, 235, 223, 111, 111, 201, 411, 111,
    201, 411, 111, 201, 412, 412, 412, 411, 117, 412,
    0,
]

EXPECTED_AFTER_CODES = [
    121, 121, 357, 657, 355, 242, 355, 655, 655, 655,
    655, 111, 249, 411, 249, 412, 223, 108, 111, 357,
    657, 231, 411, 357, 657, 231, 412, 357, 657, 231,
    357, 657, 231, 118, 111, 230, 119, 412, 121, 235,
    235, 235, 235, 235, 223, 121, 355, 111, 111, 201,
    411, 111, 201, 411, 111, 201, 412, 412, 412, 411,
    117, 412, 0,
]


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def ensure_dirs():
    INTERACTION_DIR.mkdir(parents=True, exist_ok=True)


def write_text(path, text):
    path.write_text(text, encoding="utf-8")


def get_ce19(data):
    event = data[COMMON_EVENT_ID]
    assert event is not None, f"Common Event {COMMON_EVENT_ID} missing"
    assert event["id"] == COMMON_EVENT_ID, f"Unexpected CE id: {event['id']}"
    assert event["name"] == COMMON_EVENT_NAME, (
        f"Unexpected CE name: {event['name']}"
    )
    assert event["list"][-1]["code"] == 0, "CE19 must end with terminator"
    return event


def patch_event(event):
    before_codes = [command["code"] for command in event["list"]]
    assert before_codes == EXPECTED_BEFORE_CODES, (
        "CE19 code sequence diverged from the expected post-task-3.1 structure"
    )
    assert event["list"][4]["code"] == 355, "Expected initial race erase script"
    assert event["list"][4]["parameters"] == [ERASE_RACE_PICTURES_SCRIPT_60], (
        "Expected pre-cleanup picture erase script to stop at 60"
    )
    assert event["list"][45]["code"] == 111, "Expected victory branch start at index 45"
    assert event["list"][47]["code"] == 201, "Expected Race 1 transfer before cleanup patch"

    event["list"][4]["parameters"] = [ERASE_RACE_PICTURES_SCRIPT_61]
    event["list"].insert(
        45,
        {"code": 121, "indent": 0, "parameters": [SW_RACE_ACTIVE_ID, SW_RACE_ACTIVE_ID, 1]},
    )
    event["list"].insert(
        46,
        {"code": 355, "indent": 0, "parameters": [CLEAR_QUEUE_SCRIPT]},
    )


def validate_after(event):
    after_codes = [command["code"] for command in event["list"]]
    assert after_codes == EXPECTED_AFTER_CODES, "Unexpected CE19 code sequence after cleanup patch"
    assert event["list"][-1]["code"] == 0, "CE19 terminator missing after cleanup patch"
    assert event["list"][4]["parameters"] == [ERASE_RACE_PICTURES_SCRIPT_61], (
        "Race picture cleanup did not expand to 1..61"
    )
    assert event["list"][45]["parameters"] == [SW_RACE_ACTIVE_ID, SW_RACE_ACTIVE_ID, 1], (
        "SW_RACE_ACTIVE was not turned off before routing"
    )
    assert event["list"][46]["parameters"] == [CLEAR_QUEUE_SCRIPT], (
        "Common event queue clear was not inserted before routing"
    )
    assert event["list"][47]["code"] == 111, "Victory routing moved unexpectedly"

    transfers = [
        command["parameters"]
        for command in event["list"]
        if command["code"] == 201
    ]
    assert transfers == [RACE_1_TRANSFER, RACE_2_TRANSFER, RACE_3_TRANSFER], (
        f"Unexpected transfer set after cleanup patch: {transfers}"
    )

    assert event["list"][38]["parameters"] == [SW_PAUSED_ID, SW_PAUSED_ID, 1], (
        "SW_PAUSED off command moved unexpectedly"
    )


def build_summary(event):
    lines = [
        "# CE19 Cleanup Summary",
        "",
        f"- Common Event: CE{event['id']} `{event['name']}`",
        f"- Command count: {len(event['list'])}",
        "",
        "## Cleanup Checks",
        "",
        f"- Command 4 now erases pictures with script: `{event['list'][4]['parameters'][0]}`",
        f"- Command 45 turns `SW_RACE_ACTIVE` OFF with parameters `{event['list'][45]['parameters']}`.",
        f"- Command 46 clears reserved Common Events with script: `{event['list'][46]['parameters'][0]}`",
        f"- Command 44 still resets tint with parameters `{event['list'][44]['parameters']}`.",
        f"- Command 5 still fades out BGM with parameters `{event['list'][5]['parameters']}`.",
        "",
        "## Victory Transfers",
        "",
    ]
    for index, command in enumerate(event["list"]):
        if command["code"] == 201:
            lines.append(f"- Command {index}: `Transfer Player {command['parameters']}`")
    return "\n".join(lines) + "\n"


def main():
    ensure_dirs()
    data = load_json(COMMON_EVENTS_PATH)
    event = get_ce19(data)
    patch_event(event)
    save_json(COMMON_EVENTS_PATH, data)

    reloaded = load_json(COMMON_EVENTS_PATH)
    reloaded_event = get_ce19(reloaded)
    validate_after(reloaded_event)
    write_text(SUMMARY_PATH, build_summary(reloaded_event))

    print(f"Patched {COMMON_EVENTS_PATH}")
    print("Expanded race picture cleanup to ids 1..61")
    print("Inserted SW_RACE_ACTIVE OFF before victory routing")
    print("Inserted $gameTemp.clearCommonEventReservation() before transfers")
    print(f"Saved cleanup summary to {SUMMARY_PATH}")


if __name__ == "__main__":
    main()
