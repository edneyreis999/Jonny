"""
Fase 5 (pré-passo) — Adiciona VAR_HOVER_LEVEL (Editor ID 115) em System.json.

Motivo:
  A task 5.5 (EV_HoverRiskButton) precisa de uma variável para armazenar o nível
  atual do hover (0..3). O snapshot pós-F4 mostra o slot 115 vago.

Idempotente:
  Reexecutar apenas confirma que o nome já está lá. Não sobrescreve outros IDs.

Convenção (F3 confirmed): System.json `variables[N]` corresponde ao Editor ID N
(índice do array == Editor ID). Slot 115 deve sair de '' para 'VAR_HOVER_LEVEL'.
"""

import json
import pathlib

SYSTEM_PATH = pathlib.Path("Jhonny/data/System.json")
TARGET_ID = 115
EXPECTED_NAME = "VAR_HOVER_LEVEL"


def main():
    system = json.loads(SYSTEM_PATH.read_text(encoding="utf-8"))

    variables = system["variables"]
    if len(variables) <= TARGET_ID:
        raise SystemExit(
            f"System.json variables array too small: len={len(variables)}, "
            f"need index {TARGET_ID}"
        )

    current = variables[TARGET_ID]
    if current == EXPECTED_NAME:
        print(f"OK (idempotente) — var[{TARGET_ID}] já é {EXPECTED_NAME!r}")
        return

    if current != "":
        raise SystemExit(
            f"Slot 115 ocupado por {current!r} — abortar para não sobrescrever"
        )

    variables[TARGET_ID] = EXPECTED_NAME
    SYSTEM_PATH.write_text(
        json.dumps(system, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"var[{TARGET_ID}] = {EXPECTED_NAME!r} gravado em System.json")

    # Snapshot pós-edição para auditoria
    print("\nSnapshot variables[100:117]:")
    for i in range(100, 117):
        print(f"  var[{i}] = {variables[i]!r}")


if __name__ == "__main__":
    main()
