#!/usr/bin/env python3
import json
from pathlib import Path


PLAN_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = PLAN_DIR.parents[2]
MAP013_PATH = PROJECT_DIR / "data" / "Map013.json"
OUTPUT_DIR = PLAN_DIR / "interaction" / "fase4"
OUTPUT_PATH = OUTPUT_DIR / "map013-race3-marker-audit.md"

EVENT_ID = 1
PAGE_INDEX = 0
EXACT_MARKER = "JOGADOR VAI PARA A CORRIDA APENAS COM A OPÇÃO 1"
TYPO_MARKER = "JOGADOR VARI PRA CORRIDA COM DUAS OPÇÕES"
TARGET_TRANSFERS = [7082, 7107]


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def command_text(command: dict) -> str:
    return " ".join(str(part) for part in command.get("parameters", []))


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    data = load_json(MAP013_PATH)
    event = data["events"][EVENT_ID]
    page = event["pages"][PAGE_INDEX]

    exact_indexes = []
    typo_indexes = []
    for index, command in enumerate(page["list"]):
        text = command_text(command)
        if EXACT_MARKER in text:
            exact_indexes.append(index)
        if TYPO_MARKER in text:
            typo_indexes.append(index)

    assert page["list"][7082]["code"] == 201
    assert page["list"][7107]["code"] == 201

    lines = [
        "# Map013 Race 3 Marker Audit",
        "",
        "## Scope",
        "",
        f"- Target file: `{MAP013_PATH}`",
        f"- Event `{EVENT_ID}` page `{PAGE_INDEX + 1}`",
        "",
        "## Marker Counts",
        "",
        f"- Exact marker `{EXACT_MARKER}` count: `{len(exact_indexes)}`",
        f"- Typo marker `{TYPO_MARKER}` count: `{len(typo_indexes)}`",
        "",
        "## Executable Transfer Points",
        "",
    ]

    for transfer_index in TARGET_TRANSFERS:
        command = page["list"][transfer_index]
        lines.append(
            f"- Command {transfer_index}: code `{command['code']}`, indent `{command['indent']}`, "
            f"parameters `{command['parameters']}`"
        )
        for nearby_index in range(max(0, transfer_index - 4), min(len(page["list"]), transfer_index + 5)):
            nearby = page["list"][nearby_index]
            lines.append(
                f"  - Nearby {nearby_index}: code `{nearby['code']}`, "
                f"indent `{nearby['indent']}`, parameters `{nearby['parameters']}`"
            )

    lines.extend(
        [
            "",
            "## Findings",
            "",
            "- The repeated comment markers are documentation only; they do not have local executable commands next to them.",
            "- Command `7082` is a real transfer inside an indented branch that currently leads to `Map006`.",
            "- Command `7107` is the terminal fallthrough transfer that currently leads to `Map012`.",
            "- `Map013` currently does not set `VAR_RACE_ID` anywhere.",
            "",
            "## Patch Strategy",
            "",
            "- Patch the known executable transfer points first.",
            "- Insert `VAR_RACE_ID = 3` immediately before each patched transfer.",
            "- Keep comment-only markers unchanged and document them as non-executable.",
            "",
        ]
    )

    OUTPUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Wrote audit to {OUTPUT_PATH}")
    print(f"Exact marker count: {len(exact_indexes)}")
    print("Confirmed executable transfer indexes: 7082, 7107")


if __name__ == "__main__":
    main()
