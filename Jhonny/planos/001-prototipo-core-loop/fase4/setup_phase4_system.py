"""
Fase 4 — Pré-passo: criar variável VAR_TIMER_TIMEOUT_FLAG (Editor ID 116) em System.json.

Motivo:
  EV_RaceTimer (CE 10) precisa sinalizar ao EV_OnSafe (CE 11) quando o disparo veio
  de timeout (não de clique manual). O handler lê VAR_TIMER_TIMEOUT_FLAG e reseta
  para 0 após aplicar a lógica Safe.

Convenção confirmada (rmmz_objects.js:723):
  Game_Variables.value(id) -> _data[id]
  Portanto o índice do array em System.json é igual ao Editor ID.
  Neste projeto, variáveis vivem em Editor IDs 100-113 (+ 116 agora).

Idempotente:
  Se VAR_TIMER_TIMEOUT_FLAG já existir no índice 116, o script apenas confirma.
"""

import json
import pathlib

SYSTEM_PATH = pathlib.Path("Jhonny/data/System.json")

EXPECTED_IDS = {
    100: "VAR_RACE_ID",
    101: "VAR_SCENE_INDEX",
    102: "VAR_SCENE_TYPE",
    103: "VAR_P_CENA",
    104: "VAR_CONSCIENCIA",
    105: "VAR_PONTOS_GLORIA",
    108: "VAR_TIMER_FRAMES",
    113: "VAR_LAST_RENDERED_INDEX",
}

NEW_VAR_EDITOR_ID = 116
NEW_VAR_NAME = "VAR_TIMER_TIMEOUT_FLAG"


def main():
    system = json.loads(SYSTEM_PATH.read_text(encoding="utf-8"))
    variables = system["variables"]

    for editor_id, expected_name in EXPECTED_IDS.items():
        actual = variables[editor_id] if editor_id < len(variables) else None
        assert actual == expected_name, (
            f"Convenção de IDs quebrada: variables[{editor_id}] deveria ser "
            f"{expected_name!r}, é {actual!r}"
        )

    while len(variables) <= NEW_VAR_EDITOR_ID:
        variables.append("")

    if variables[NEW_VAR_EDITOR_ID] == NEW_VAR_NAME:
        print(f"OK (idempotente): variables[{NEW_VAR_EDITOR_ID}] já é {NEW_VAR_NAME!r}")
    elif variables[NEW_VAR_EDITOR_ID] == "":
        variables[NEW_VAR_EDITOR_ID] = NEW_VAR_NAME
        print(f"OK: variables[{NEW_VAR_EDITOR_ID}] = {NEW_VAR_NAME!r}")
    else:
        raise RuntimeError(
            f"Conflito: variables[{NEW_VAR_EDITOR_ID}] contém "
            f"{variables[NEW_VAR_EDITOR_ID]!r}, esperado vazio ou {NEW_VAR_NAME!r}"
        )

    SYSTEM_PATH.write_text(
        json.dumps(system, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"System.json salvo ({len(variables)} variáveis)")


if __name__ == "__main__":
    main()
