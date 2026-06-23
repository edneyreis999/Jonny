#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
COMMON_EVENTS_PATH = PROJECT_DIR / "data" / "CommonEvents.json"
INTERACTION_DIR = PLAN_DIR / "interaction" / "fase3"
BEFORE_SUMMARY_PATH = INTERACTION_DIR / "ce19-before-summary.md"
BLOCKER_PATH = INTERACTION_DIR / "ce19-routing-blocker.md"

COMMON_EVENT_ID = 19
COMMON_EVENT_NAME = "EV_VitoriaCorrida"
DEFEAT_COMMON_EVENT_ID = 18

RACE_ID_VARIABLE_ID = 100
VICTORY_VARIABLE_ID = 117

RACE_1_TRANSFER = [0, 5, 3, 2, 0, 0]
RACE_2_TRANSFER = [0, 13, 4, 5, 0, 0]
RACE_3_TRANSFER = [0, 12, 0, 0, 0, 0]

EXPECTED_BEFORE_CODES = [
    121, 121, 357, 657, 355, 242, 355, 655, 655, 655,
    655, 111, 249, 411, 249, 412, 223, 108, 111, 357,
    657, 231, 411, 357, 657, 231, 412, 357, 657, 231,
    357, 657, 231, 118, 111, 230, 119, 412, 121, 235,
    235, 235, 235, 235, 223, 111, 111, 122, 117, 411,
    108, 118, 230, 119, 412, 411, 117, 412, 0,
]

EXPECTED_AFTER_CODES = [
    121, 121, 357, 657, 355, 242, 355, 655, 655, 655,
    655, 111, 249, 411, 249, 412, 223, 108, 111, 357,
    657, 231, 411, 357, 657, 231, 412, 357, 657, 231,
    357, 657, 231, 118, 111, 230, 119, 412, 121, 235,
    235, 235, 235, 235, 223, 111, 111, 201, 411, 111,
    201, 411, 111, 201, 412, 412, 412, 411, 117, 412,
    0,
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


def summarize_before(event):
    lines = [
        "# CE19 Before Summary",
        "",
        f"- Common Event: CE{event['id']} `{event['name']}`",
        f"- Command count: {len(event['list'])}",
        f"- Command codes: {[command['code'] for command in event['list']]}",
        "",
        "## Routing Findings",
        "",
    ]

    for index, command in enumerate(event["list"]):
        if command["code"] == 122 and command["parameters"] == [100, 100, 1, 0, 1]:
            lines.append(
                f"- Command {index}: increments `VAR_RACE_ID` with parameters "
                f"`{command['parameters']}`."
            )
        if command["code"] == 117 and command["parameters"] == [5]:
            lines.append(
                f"- Command {index}: calls CE5 `EV_RaceOrchestrator`, causing "
                "victory auto-advance."
            )
        if command["code"] == 117 and command["parameters"] == [18]:
            lines.append(
                f"- Command {index}: calls CE18 `EV_Crash`, which is the "
                "existing defeat retry path."
            )
        if command["code"] == 118 and command["parameters"] == ["FIM_LOOP"]:
            lines.append(
                f"- Command {index}: starts the final `FIM_LOOP` branch used by "
                "Race 3 victory."
            )

    lines.extend(
        [
            "",
            "## Expected Routing Targets",
            "",
            f"- Race 1 victory -> `Transfer Player {RACE_1_TRANSFER}`",
            f"- Race 2 victory -> `Transfer Player {RACE_2_TRANSFER}`",
            f"- Race 3 victory -> `Transfer Player {RACE_3_TRANSFER}`",
            f"- Defeat remains on `Map001` through CE{DEFEAT_COMMON_EVENT_ID}.",
            "",
        ]
    )
    return "\n".join(lines)


def build_victory_branch():
    return [
        {"code": 111, "indent": 0, "parameters": [1, VICTORY_VARIABLE_ID, 0, 1, 0]},
        {"code": 111, "indent": 1, "parameters": [1, RACE_ID_VARIABLE_ID, 0, 1, 0]},
        {"code": 201, "indent": 2, "parameters": RACE_1_TRANSFER},
        {"code": 411, "indent": 1, "parameters": []},
        {"code": 111, "indent": 2, "parameters": [1, RACE_ID_VARIABLE_ID, 0, 2, 0]},
        {"code": 201, "indent": 3, "parameters": RACE_2_TRANSFER},
        {"code": 411, "indent": 2, "parameters": []},
        {"code": 111, "indent": 3, "parameters": [1, RACE_ID_VARIABLE_ID, 0, 3, 0]},
        {"code": 201, "indent": 4, "parameters": RACE_3_TRANSFER},
        {"code": 412, "indent": 3, "parameters": []},
        {"code": 412, "indent": 2, "parameters": []},
        {"code": 412, "indent": 1, "parameters": []},
        {"code": 411, "indent": 0, "parameters": []},
        {"code": 117, "indent": 1, "parameters": [DEFEAT_COMMON_EVENT_ID]},
        {"code": 412, "indent": 0, "parameters": []},
        {"code": 0, "indent": 0, "parameters": []},
    ]


def patch_event(event):
    before_codes = [command["code"] for command in event["list"]]
    assert before_codes == EXPECTED_BEFORE_CODES, (
        "CE19 code sequence diverged from the audited structure"
    )
    assert event["list"][47]["code"] == 122, "Expected VAR_RACE_ID increment command"
    assert event["list"][47]["parameters"] == [100, 100, 1, 0, 1], (
        "Expected CE19 to increment VAR_RACE_ID before patch"
    )
    assert event["list"][48]["code"] == 117, "Expected CE5 call after increment"
    assert event["list"][48]["parameters"] == [5], (
        "Expected CE19 to call CE5 before patch"
    )
    assert event["list"][56]["code"] == 117, "Expected CE18 defeat call before patch"
    assert event["list"][56]["parameters"] == [18], (
        "Expected CE19 defeat branch to call CE18 before patch"
    )

    prefix = event["list"][:45]
    event["list"] = prefix + build_victory_branch()


def validate_after(event):
    after_codes = [command["code"] for command in event["list"]]
    assert after_codes == EXPECTED_AFTER_CODES, "Unexpected CE19 code sequence after patch"
    assert event["list"][-1]["code"] == 0, "CE19 terminator missing after patch"

    transfers = [
        command["parameters"]
        for command in event["list"]
        if command["code"] == 201
    ]
    assert transfers == [RACE_1_TRANSFER, RACE_2_TRANSFER, RACE_3_TRANSFER], (
        f"Unexpected transfer set: {transfers}"
    )

    assert not any(
        command["code"] == 122 and command["parameters"] == [100, 100, 1, 0, 1]
        for command in event["list"]
    ), "VAR_RACE_ID increment still present after patch"
    assert not any(
        command["code"] == 117 and command["parameters"] == [5]
        for command in event["list"]
    ), "CE5 call still present in victory path after patch"
    assert not any(
        command["code"] == 118 and command["parameters"] == ["FIM_LOOP"]
        for command in event["list"]
    ), "Race 3 final loop still present after patch"

    defeat_calls = [
        index
        for index, command in enumerate(event["list"])
        if command["code"] == 117 and command["parameters"] == [18]
    ]
    assert defeat_calls == [58], f"Unexpected CE18 defeat call positions: {defeat_calls}"


def main():
    ensure_dirs()
    data = load_json(COMMON_EVENTS_PATH)
    event = get_ce19(data)
    write_text(BEFORE_SUMMARY_PATH, summarize_before(event) + "\n")

    try:
        patch_event(event)
    except AssertionError as error:
        write_text(
            BLOCKER_PATH,
            "\n".join(
                [
                    "# CE19 Routing Blocker",
                    "",
                    f"- Error: {error}",
                    f"- Command codes found: {[command['code'] for command in event['list']]}",
                    "",
                    "No mutation was written because the audited CE19 shape diverged.",
                    "",
                ]
            ),
        )
        raise

    save_json(COMMON_EVENTS_PATH, data)
    reloaded = load_json(COMMON_EVENTS_PATH)
    reloaded_event = get_ce19(reloaded)
    validate_after(reloaded_event)

    print(f"Patched {COMMON_EVENTS_PATH}")
    print(f"Saved before summary to {BEFORE_SUMMARY_PATH}")
    print(
        "Victory routes:"
        f" race 1 -> {RACE_1_TRANSFER},"
        f" race 2 -> {RACE_2_TRANSFER},"
        f" race 3 -> {RACE_3_TRANSFER}"
    )
    print(
        "Defeat route preserved through "
        f"CE{DEFEAT_COMMON_EVENT_ID} at command index 58"
    )
    print(
        "Removed victory auto-advance markers:"
        " VAR_RACE_ID increment, CE5 restart call, Race 3 final loop"
    )


if __name__ == "__main__":
    main()
