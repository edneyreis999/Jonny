#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
COMMON_EVENTS = DATA / "CommonEvents.json"
SYSTEM = DATA / "System.json"


def command(code, parameters=None, indent=0):
    return {
        "code": code,
        "indent": indent,
        "parameters": [] if parameters is None else parameters,
    }


def plugin_log(event_type, indent=0):
    return [
        command(
            357,
            [
                "Jhonny_RaceHelper",
                "logRaceEvent",
                "Log Race Event",
                {"type": event_type},
            ],
            indent,
        ),
        command(657, [f"type = {event_type}"], indent),
    ]


def text_picture(text, indent=0):
    return [
        command(
            357,
            ["TextPicture", "set", "Set Text Picture", {"text": text}],
            indent,
        ),
        command(657, [f"Text = {text}"], indent),
    ]


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path, data):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def ensure_variable_name(system, editor_id, name):
    variables = system["variables"]
    while len(variables) < editor_id + 1:
        variables.append("")
    variables[editor_id] = name


def add_race_start_juice(common_events):
    event = common_events[5]
    assert event["name"] == "EV_RaceOrchestrator"
    existing = event["list"]
    if any(
        cmd["code"] == 241
        and cmd["parameters"]
        and cmd["parameters"][0].get("name") == "Battle3"
        for cmd in existing
    ):
        return
    start_commands = [
        command(242, [1]),
        command(
            355,
            [
                "if (window.JhonnyRace && window.JhonnyRace.playRaceStartEffect) window.JhonnyRace.playRaceStartEffect();"
            ],
        ),
        command(230, [72]),
        command(241, [{"name": "Battle3", "volume": 90, "pitch": 100, "pan": 0}]),
        command(
            355,
            [
                "const raceId = $gameVariables.value(100); const fallback = { 1: 200, 2: 400, 3: 600 }; const meta = window.JhonnyRace ? window.JhonnyRace.thresholdFor(raceId) : (fallback[raceId] || 60); $gameVariables.setValue(119, meta);"
            ],
        ),
        command(122, [120, 120, 0, 0, 0]),
        command(122, [121, 121, 0, 0, 1]),
        command(121, [102, 102, 1]),
        command(121, [105, 105, 1]),
    ]
    event["list"] = start_commands + existing


def update_hud(common_events):
    event = common_events[6]
    assert event["name"] == "EV_UpdateHud"
    hud_script = "const raceId = $gameVariables.value(100); const maxScenes = Math.max(1, $gameVariables.value(111)); const sceneNow = Math.max(1, Math.min(maxScenes, $gameVariables.value(101) + 1)); const frames = Math.max(0, $gameVariables.value(108)); const fallback = { 1: 200, 2: 400, 3: 600 }; const meta = window.JhonnyRace ? window.JhonnyRace.thresholdFor(raceId) : (fallback[raceId] || 60); $gameVariables.setValue(119, meta); $gameVariables.setValue(120, Math.ceil(frames / 60)); $gameVariables.setValue(121, sceneNow);"
    if not any(cmd["code"] == 355 and cmd["parameters"] == [hud_script] for cmd in event["list"]):
        event["list"].insert(4, command(355, [hud_script]))
    for cmd in event["list"]:
        if (
            cmd["code"] == 357
            and len(cmd["parameters"]) >= 4
            and cmd["parameters"][0] == "TextPicture"
            and cmd["parameters"][3].get("text") == "\\C[15] GLÓRIA: \\V[105]"
        ):
            cmd["parameters"][3]["text"] = "\\C[15] GLÓRIA: \\V[105]/\\V[119]"
        if cmd["code"] == 657 and cmd["parameters"] == ["Text = \\C[15] GLÓRIA: \\V[105]"]:
            cmd["parameters"] = ["Text = \\C[15] GLÓRIA: \\V[105]/\\V[119]"]
    has_timer_picture = any(cmd["code"] == 231 and cmd["parameters"][:1] == [62] for cmd in event["list"])
    has_counter_picture = any(cmd["code"] == 231 and cmd["parameters"][:1] == [63] for cmd in event["list"])
    if not (has_timer_picture and has_counter_picture):
        wait_indexes = [i for i, cmd in enumerate(event["list"]) if cmd["code"] == 230 and cmd["parameters"] == [6]]
        assert len(wait_indexes) == 1
        insert_at = wait_indexes[0]
        extra = []
        extra.extend(text_picture("\\C[0]TEMPO: \\V[120]s"))
        extra.append(command(231, [62, "", 1, 0, 640, 36, 100, 100, 255, 0]))
        extra.extend(text_picture("\\C[0]\\V[121]/\\V[111]"))
        extra.append(command(231, [63, "", 1, 0, 640, 676, 100, 100, 255, 0]))
        event["list"][insert_at:insert_at] = extra


def disable_hover_band(common_events):
    event = common_events[16]
    assert event["name"] == "EV_HoverRiskButton"
    event["list"] = [
        command(118, ["HOVER_LOOP"]),
        command(
            355,
            [
                "$gameVariables.setValue(115, 0); $gameScreen.erasePicture(22); $gameScreen.erasePicture(23); $gameScreen.erasePicture(24);"
            ],
        ),
        command(230, [6]),
        command(119, ["HOVER_LOOP"]),
        command(0),
    ]


def route_crash_to_defeat(common_events):
    event = common_events[18]
    assert event["name"] == "EV_Crash"
    new_list = []
    new_list.extend(plugin_log("CRASH"))
    new_list.extend(
        [
            command(121, [100, 100, 1]),
            command(121, [101, 101, 0]),
            command(121, [102, 102, 0]),
            command(121, [103, 103, 1]),
            command(121, [104, 104, 1]),
            command(121, [105, 105, 1]),
            command(355, ["for (let i = 1; i <= 63; i++) $gameScreen.erasePicture(i);"]),
            command(117, [19]),
            command(0),
        ]
    )
    event["list"] = new_list


def force_crash_defeat_in_result(common_events):
    event = common_events[19]
    assert event["name"] == "EV_VitoriaCorrida"
    for cmd in event["list"]:
        if cmd["code"] == 355 and cmd["parameters"] == ["for (let i = 1; i <= 61; i++) $gameScreen.erasePicture(i);"]:
            cmd["parameters"] = ["for (let i = 1; i <= 63; i++) $gameScreen.erasePicture(i);"]
        if cmd["code"] == 355 and cmd["parameters"][0].startswith("if (typeof window.JhonnyRace"):
            cmd["parameters"] = [
                "const forcedDefeat = $gameSwitches.value(102); if (forcedDefeat) { $gameVariables.setValue(117, 0); } else if (typeof window.JhonnyRace === \"undefined\") { const pontos = $gameVariables.value(105); const raceId = $gameVariables.value(100); const thresholds = { 1: 200, 2: 400, 3: 600 }; const passou = pontos >= (thresholds[raceId] || 60); $gameVariables.setValue(117, passou ? 1 : 0); } else { const raceId = $gameVariables.value(100); const pontos = $gameVariables.value(105); $gameVariables.setValue(117, window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0); }"
            ]
    event["list"] = [
        cmd
        for cmd in event["list"]
        if not (cmd["code"] == 655 and any("raceId" in str(param) or "pontos" in str(param) or "Vitoria" in str(param) or "$gameVariables.setValue(117" in str(param) or param.strip() == "}" for param in cmd["parameters"]))
    ]
    clear_index = next(
        i
        for i, cmd in enumerate(event["list"])
        if cmd["code"] == 355 and cmd["parameters"] == ["$gameTemp.clearCommonEventReservation();"]
    )
    if not any(cmd["code"] == 121 and cmd["parameters"] == [102, 102, 1] for cmd in event["list"]):
        event["list"].insert(clear_index + 1, command(121, [102, 102, 1]))


def validate(common_events, system):
    for event_id in [5, 6, 16, 18, 19]:
        event = common_events[event_id]
        assert event["list"][-1]["code"] == 0, f"CE {event_id} missing terminator"
    assert system["variables"][119] == "VAR_GLORIA_META"
    assert system["variables"][120] == "VAR_TIMER_SECONDS"
    assert system["variables"][121] == "VAR_SCENE_DISPLAY"
    assert any(
        cmd["code"] == 241 and cmd["parameters"][0]["name"] == "Battle3"
        for cmd in common_events[5]["list"]
    )
    assert common_events[18]["list"][2]["parameters"] == [100, 100, 1]


def main():
    common_events = load_json(COMMON_EVENTS)
    system = load_json(SYSTEM)
    ensure_variable_name(system, 119, "VAR_GLORIA_META")
    ensure_variable_name(system, 120, "VAR_TIMER_SECONDS")
    ensure_variable_name(system, 121, "VAR_SCENE_DISPLAY")
    add_race_start_juice(common_events)
    update_hud(common_events)
    disable_hover_band(common_events)
    route_crash_to_defeat(common_events)
    force_crash_defeat_in_result(common_events)
    validate(common_events, system)
    save_json(COMMON_EVENTS, common_events)
    save_json(SYSTEM, system)
    load_json(COMMON_EVENTS)
    load_json(SYSTEM)
    print("Updated Common Events: 5, 6, 16, 18, 19")
    print("System variable IDs: 119=VAR_GLORIA_META, 120=VAR_TIMER_SECONDS, 121=VAR_SCENE_DISPLAY")
    print("Race BGM: Battle3")


if __name__ == "__main__":
    main()
