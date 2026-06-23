#!/usr/bin/env python3
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MAP001_PATH = PROJECT_ROOT / "data" / "Map001.json"
SYSTEM_PATH = PROJECT_ROOT / "data" / "System.json"


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json(path, data, indent):
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=indent)
        file.write("\n")


def apply_map001_bgm():
    data = load_json(MAP001_PATH)
    data["autoplayBgm"] = True
    data["bgm"] = {
        "name": "darkeletronic",
        "pan": 0,
        "pitch": 120,
        "volume": 40,
    }
    write_json(MAP001_PATH, data, indent=2)
    reparsed = load_json(MAP001_PATH)
    assert reparsed["autoplayBgm"] is True
    assert reparsed["bgm"]["name"] == "darkeletronic"
    assert reparsed["bgm"]["pitch"] == 120
    assert reparsed["bgm"]["volume"] == 40
    print("Map001: autoplayBgm=True, bgm=darkeletronic, pitch=120, volume=40")


def validate_start_map():
    data = load_json(SYSTEM_PATH)
    assert data["startMapId"] == 11
    print(
        "System: startMapId={startMapId}, startX={startX}, startY={startY}".format(
            startMapId=data["startMapId"],
            startX=data["startX"],
            startY=data["startY"],
        )
    )


def main():
    apply_map001_bgm()
    validate_start_map()


if __name__ == "__main__":
    main()
