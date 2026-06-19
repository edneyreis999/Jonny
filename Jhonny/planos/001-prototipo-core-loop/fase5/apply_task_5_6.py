"""
Task 5.6 — Patch cirúrgico (preserva edições manuais + logs de debug).

Cria CE 17 (EV_ResolucaoRiskFail) e modifica CE 12 FAIL branch para
chamar CE 17 antes do Comment "TASK 6.1 PENDENTE".

Por que patch e não regenerar `build_phase5_ces.py`:
  - CE 6 tem Plugin Command TextPicture (code 357/657) inserido manualmente
    pelo usuário no MZ Editor — schema opaco não reproduzido pelo gerador.
  - CEs 5/7/10/11/12/14/15 têm 21 logs `[F5DBG]` + 4 SEs diagnósticos
    injetados por `inject_debug_logs_v2.py`.
  Regra aplicada (retrospectiva PARTE 2 §P2.2.3): quando o JSON alvo
  contém edições manuais do usuário, usar patch — nunca regenerar.

Idempotente:
  - Aborta com mensagem clara se CE 17 já existe com o nome esperado e
    CE 12 já tem Call CE 17 antes do Comment alvo.
  - Reexecução após sucesso não causa efeito colateral.

Validação:
  - JSON serializado com indent=4, ensure_ascii=False.
  - `python3 -m json.tool` implícito via json.loads após escrita.
"""

import json
import pathlib
import sys
from typing import Any

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")

CE_ON_RISK = 12
CE_RESOLUCAO_RISK_FAIL = 17
SW_INPUT_LOCKED = 101

EXPECTED_NAME = "EV_ResolucaoRiskFail"
TARGET_COMMENT_MARKER = "TASK 6.1 PENDENTE"


def build_ce17_list() -> list[dict[str, Any]]:
    return [
        {"code": 250, "indent": 0,
         "parameters": [{"name": "Buzzer1", "volume": 80, "pitch": 100, "pan": 0}]},
        {"code": 225, "indent": 0, "parameters": [5, 5, 8, False]},
        {"code": 121, "indent": 0,
         "parameters": [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1]},
        {"code": 0, "indent": 0, "parameters": []},
    ]


def build_ce17() -> dict[str, Any]:
    return {
        "id": CE_RESOLUCAO_RISK_FAIL,
        "list": build_ce17_list(),
        "name": EXPECTED_NAME,
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": "",
    }


def ce17_already_added(ces: list[Any]) -> bool:
    if len(ces) <= CE_RESOLUCAO_RISK_FAIL:
        return False
    slot = ces[CE_RESOLUCAO_RISK_FAIL]
    return isinstance(slot, dict) and slot.get("name") == EXPECTED_NAME


def add_ce17(ces: list[Any]) -> list[Any]:
    while len(ces) <= CE_RESOLUCAO_RISK_FAIL:
        ces.append(None)
    if ces[CE_RESOLUCAO_RISK_FAIL] is not None:
        existing_name = ces[CE_RESOLUCAO_RISK_FAIL].get("name", "?")
        raise RuntimeError(
            f"Slot CE {CE_RESOLUCAO_RISK_FAIL} ocupado por "
            f"{existing_name!r} — não é seguro sobrescrever."
        )
    ces[CE_RESOLUCAO_RISK_FAIL] = build_ce17()
    return ces


def find_comment_index(ce12_list: list[dict[str, Any]]) -> int:
    for i, cmd in enumerate(ce12_list):
        if cmd.get("code") != 108:
            continue
        params = cmd.get("parameters", [])
        if params and TARGET_COMMENT_MARKER in str(params[0]):
            return i
    raise RuntimeError(
        f"Comment marcador {TARGET_COMMENT_MARKER!r} não encontrado no CE 12."
    )


def call_ce17_already_wired(ce12_list: list[dict[str, Any]], comment_idx: int) -> bool:
    if comment_idx == 0:
        return False
    prev = ce12_list[comment_idx - 1]
    return (
        prev.get("code") == 117
        and prev.get("indent") == 1
        and prev.get("parameters") == [CE_RESOLUCAO_RISK_FAIL]
    )


def wire_ce12_fail_branch(ces: list[Any]) -> None:
    ce12 = ces[CE_ON_RISK]
    if not isinstance(ce12, dict) or ce12.get("name") != "EV_OnRisk":
        raise RuntimeError(
            f"CE {CE_ON_RISK} deveria ser 'EV_OnRisk', "
            f"é {ce12.get('name') if isinstance(ce12, dict) else type(ce12).__name__!r}"
        )
    cmd_list: list[dict[str, Any]] = ce12["list"]
    comment_idx = find_comment_index(cmd_list)
    if call_ce17_already_wired(cmd_list, comment_idx):
        return
    call_cmd = {
        "code": 117,
        "indent": 1,
        "parameters": [CE_RESOLUCAO_RISK_FAIL],
    }
    cmd_list.insert(comment_idx, call_cmd)


def main() -> int:
    ces = json.loads(CE_PATH.read_text(encoding="utf-8"))

    ce17_existed = ce17_already_added(ces)
    if not ce17_existed:
        ces = add_ce17(ces)

    wire_ce12_fail_branch(ces)

    CE_PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    # Re-validação estruturada
    verified = json.loads(CE_PATH.read_text(encoding="utf-8"))
    assert len(verified) == CE_RESOLUCAO_RISK_FAIL + 1, (
        f"Tamanho inesperado: {len(verified)}"
    )
    assert verified[CE_RESOLUCAO_RISK_FAIL]["name"] == EXPECTED_NAME
    ce12_list = verified[CE_ON_RISK]["list"]
    comment_idx = find_comment_index(ce12_list)
    assert call_ce17_already_wired(ce12_list, comment_idx), (
        "Call CE 17 não está wired antes do Comment."
    )

    print(f"CE 17 ({EXPECTED_NAME}): {'preservado' if ce17_existed else 'criado'}")
    print(f"CE 12 FAIL branch: Call CE 17 inserido antes do Comment (idx {comment_idx})")
    print(f"Total CEs: {len(verified)}")
    print(f"CommonEvents.json salvo e validado.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
