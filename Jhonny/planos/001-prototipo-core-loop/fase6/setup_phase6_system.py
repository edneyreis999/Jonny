"""
Fase 6 (pré-passo) — Adiciona VAR_VITORIA_PASSOU (Editor ID 117) em System.json.

Motivo:
  A task 6.4 (EV_VitoriaCorrida) precisa de uma variável para registrar se a
  pontuação atingiu o threshold (1 = vitória, 0 = derrota). O snapshot pós-F5
  mostra o slot 117 vago. É resetada em dois lugares (defensivo):
    - EV_Crash (CE 18) — task 6.1
    - EV_RaceOrchestrator INIT (CE 5) — task 6.3

Idempotente:
  Reexecutar apenas confirma que o nome já está lá. Não sobrescreve outros IDs.

Convenção (F3 confirmed): System.json `variables[N]` corresponde ao Editor ID N
(índice do array == Editor ID). Slot 117 deve sair de '' para 'VAR_VITORIA_PASSOU'.
"""

import json
import pathlib

SYSTEM_PATH = pathlib.Path("Jhonny/data/System.json")
TARGET_ID = 117
EXPECTED_NAME = "VAR_VITORIA_PASSOU"


def main():
    system = json.loads(SYSTEM_PATH.read_text(encoding="utf-8"))

    variables = system["variables"]
    if len(variables) <= TARGET_ID:
        variables.extend([""] * (TARGET_ID + 1 - len(variables)))
        print(f"Variables array estendido para len={len(variables)}")

    current = variables[TARGET_ID]
    if current == EXPECTED_NAME:
        print(f"OK (idempotente) — var[{TARGET_ID}] já é {EXPECTED_NAME!r}")
        return

    if current != "":
        raise SystemExit(
            f"Slot 117 ocupado por {current!r} — abortar para não sobrescrever"
        )

    variables[TARGET_ID] = EXPECTED_NAME
    SYSTEM_PATH.write_text(
        json.dumps(system, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"var[{TARGET_ID}] = {EXPECTED_NAME!r} gravado em System.json")

    # Snapshot pós-edição para auditoria
    print("\nSnapshot variables[100:118]:")
    for i in range(100, 118):
        print(f"  var[{i}] = {variables[i]!r}")


if __name__ == "__main__":
    main()
