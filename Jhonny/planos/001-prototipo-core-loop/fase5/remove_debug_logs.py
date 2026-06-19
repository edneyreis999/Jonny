"""
Fase 5 — Remove TODOS os logs de diagnóstico (console.log com [F5DBG]) E os
SEs diagnósticos injetados pela `inject_debug_logs_v2.py` em CEs 5/7/10/11/12/14/15.

Idempotente:
  - Se não houver nada a remover, apenas reescreve o arquivo igual.
  - Pode ser executado quantas vezes quiser.

Preserva:
  - Tudo que não for log [F5DBG] ou SE diagnóstico.
  - Edições manuais do usuário em CE 6 (TextPicture + Glória on terminal).
  - CE 17 (`EV_ResolucaoRiskFail`) — criado pela task 5.6 APÓS a injeção de
    logs. Buzzer1 lá é SE real do jogo, não diagnóstico. Skipamos a limpeza
    de SE diagnóstico neste CE inteiro.
  - SEs reais do jogo: `freada` (CE 11), `pneu_cantando` (CE 12) — não estão
    em DIAG_SE_NAMES.
"""

import json
import pathlib

P = pathlib.Path("Jhonny/data/CommonEvents.json")
MARK = "[F5DBG]"
# SEs diagnósticos têm nome conhecido (injetados pela v2 em CEs 5/7/10/11/12/14/15).
# Buzzer1 está incluído: foi injetado em CE 12 FAIL como diagnóstico pela v2.
# CE 17 (criado depois pela task 5.6) também tem Buzzer1 mas é SE real —
# por isso skipamos a limpeza de SE diagnóstico no CE 17 inteiro.
DIAG_SE_NAMES = {"Bell3", "Buzzer1", "Cursor1", "Applause2", "Up", "Blow1"}
CE_RESOLUCAO_RISK_FAIL = 17


def is_debug_log(cmd: dict) -> bool:
    if cmd.get("code") != 355:
        return False
    params = cmd.get("parameters", [])
    return bool(params) and MARK in str(params[0])


def is_diag_se(cmd: dict) -> bool:
    """Detecta Play SE diagnóstico (code 250) com nome na lista de diagnósticos."""
    if cmd.get("code") != 250:
        return False
    params = cmd.get("parameters", [])
    if not params:
        return False
    name = params[0].get("name", "") if isinstance(params[0], dict) else ""
    return name in DIAG_SE_NAMES


def clean_list(lst: list, skip_se_cleaning: bool) -> list:
    if skip_se_cleaning:
        return [c for c in lst if not is_debug_log(c)]
    return [c for c in lst if not (is_debug_log(c) or is_diag_se(c))]


def main():
    ce = json.loads(P.read_text(encoding="utf-8"))
    total_removed = 0
    per_ce = {}
    for i, e in enumerate(ce):
        if e is None:
            continue
        skip_se = (i == CE_RESOLUCAO_RISK_FAIL)
        original_len = len(e.get("list", []))
        e["list"] = clean_list(e.get("list", []), skip_se_cleaning=skip_se)
        removed = original_len - len(e["list"])
        if removed:
            per_ce[i] = removed
            total_removed += removed

    P.write_text(
        json.dumps(ce, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"Removidos {total_removed} comandos de diagnóstico.")
    for ce_id, count in sorted(per_ce.items()):
        name = ce[ce_id].get("name", "")
        print(f"  CE{ce_id:2d} ({name:25s}) — {count} removidos")
    if not per_ce:
        print("  (nada a remover — JSON já estava limpo)")
    print(f"\nArquivo: {P}")


if __name__ == "__main__":
    main()
