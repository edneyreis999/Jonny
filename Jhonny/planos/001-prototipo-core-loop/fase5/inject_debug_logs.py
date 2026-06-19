"""
Fase 5 — Injeção de console.log de diagnóstico nos CEs 5, 11, 12, 14, 15.

Motivo:
  Usuário reporta:
    - Safe click: Glória HUD aparece, console.log("Glória on terminal") funciona.
    - Risk click: Glória NÃO aparece, console.log NÃO funciona.
    - Flashes (verde/dourado) não aparecem em nenhum dos dois.
    - Safe pode ser clicado múltiplas vezes por cenário (deveria travar após 1).

  Hipótese: Risk sempre cai no fail branch (taxa=0 porque consciencia inicia em 0
  em CE 5 RaceOrchestrator). Logs vão confirmar a execucao por branch.

Estratégia:
  - Cada log é um command code=355 (Script) com prefixo "[F5DBG]" no texto.
  - Prefixo permite filtrar no terminal (F12 devtools → Console → filtro "[F5DBG]").
  - Logs em pontos chave: entrada do CE, pós-lock, pós-cálculos, branch entries,
    pós-calls, fim.

Idempotência:
  - Detecta "[F5DBG]" em qualquer CE → aborta com mensagem clara (reexecute
    remove_debug_logs.py antes de reinyetar).

NÃO toca:
  - CE 6 (preserva edições manuais do usuário: TextPicture + console.log atual).
  - CE 16 (hover funciona, sem necessidade de diagnóstico).
"""

import json
import pathlib

P = pathlib.Path("Jhonny/data/CommonEvents.json")
MARK = "[F5DBG]"


def script(text: str, indent: int = 0) -> dict:
    return {"code": 355, "indent": indent, "parameters": [text]}


def has_debug_logs(lst: list) -> bool:
    for c in lst:
        if c.get("code") == 355:
            params = c.get("parameters", [])
            if params and MARK in str(params[0]):
                return True
    return False


def insert_before(lst: list, predicate, log_text: str, log_indent: int = 0) -> list:
    """Insere log ANTES do primeiro cmd que satisfaz predicate."""
    result = []
    inserted = False
    for cmd in lst:
        if not inserted and predicate(cmd):
            result.append(script(log_text, log_indent))
            inserted = True
        result.append(cmd)
    if not inserted:
        raise RuntimeError(f"insert_before: nenhum cmd satisfez predicate. log={log_text!r}")
    return result


def insert_after(lst: list, predicate, log_text: str, log_indent: int = 0) -> list:
    """Insere log DEPOIS do primeiro cmd que satisfaz predicate."""
    result = []
    inserted = False
    for cmd in lst:
        result.append(cmd)
        if not inserted and predicate(cmd):
            result.append(script(log_text, log_indent))
            inserted = True
    if not inserted:
        raise RuntimeError(f"insert_after: nenhum cmd satisfez predicate. log={log_text!r}")
    return result


def insert_at_top(lst: list, log_text: str) -> list:
    """Insere log na posição 0 (após o início do CE)."""
    return [script(log_text, 0)] + lst


def insert_before_end(lst: list, log_text: str, indent: int = 0) -> list:
    """Insere log antes do último cmd code=0 (END)."""
    if not lst or lst[-1].get("code") != 0:
        raise RuntimeError("insert_before_end: último cmd não é code=0")
    return lst[:-1] + [script(log_text, indent), lst[-1]]


def main():
    ce = json.loads(P.read_text(encoding="utf-8"))

    # Verifica idempotência em todos os CEs que vamos tocar
    for idx in [5, 11, 12, 14, 15]:
        if has_debug_logs(ce[idx]["list"]):
            raise SystemExit(
                f"CE {idx} já contém logs '{MARK}'. "
                f"Rode remove_debug_logs.py antes de reinyetar."
            )

    # === CE 5 — EV_RaceOrchestrator ===
    # Log no topo (antes da linha 0) para ver estado inicial das variáveis.
    e5 = ce[5]
    e5["list"] = insert_at_top(
        e5["list"],
        'console.log("[F5DBG] CE5 Orchestrator INI — var104(consc)=" + $gameVariables.value(104) '
        '+ " var105(gloria)=" + $gameVariables.value(105) + " var101(cena)=" + $gameVariables.value(101))'
    )
    # Após var[104]=0 (linha original [0]), confirma reset
    e5["list"] = insert_after(
        e5["list"],
        lambda c: c.get("code") == 122 and c.get("parameters")[:2] == [104, 104],
        'console.log("[F5DBG] CE5 var104(consc) RESET para=" + $gameVariables.value(104))'
    )

    # === CE 11 — EV_OnSafe ===
    e11 = ce[11]
    # Entrada: mostra estado dos guards
    e11["list"] = insert_at_top(
        e11["list"],
        'console.log("[F5DBG] CE11 OnSafe CLICK — sw100(race)=" + $gameSwitches.value(100) '
        '+ " sw101(locked)=" + $gameSwitches.value(101))'
    )
    # Após lock set (code 121 [101,101,0])
    e11["list"] = insert_after(
        e11["list"],
        lambda c: c.get("code") == 121 and c.get("parameters") == [101, 101, 0],
        'console.log("[F5DBG] CE11 LOCK aplicado (sw101=" + $gameSwitches.value(101) + ")")'
    )
    # Após Glória += 10 (code 122 [105,105,1,0,10])
    e11["list"] = insert_after(
        e11["list"],
        lambda c: c.get("code") == 122 and c.get("parameters") == [105, 105, 1, 0, 10],
        'console.log("[F5DBG] CE11 gloria=" + $gameVariables.value(105) '
        '+ " consc=" + $gameVariables.value(104) + " cena=" + $gameVariables.value(101))'
    )
    # Antes do Call CE 6
    e11["list"] = insert_before(
        e11["list"],
        lambda c: c.get("code") == 117 and c.get("parameters") == [6],
        'console.log("[F5DBG] CE11 → Call CE 6 (HUD)")'
    )
    # Antes do Call CE 14
    e11["list"] = insert_before(
        e11["list"],
        lambda c: c.get("code") == 117 and c.get("parameters") == [14],
        'console.log("[F5DBG] CE11 → Call CE 14 (flash verde)")'
    )

    # === CE 12 — EV_OnRisk ===
    e12 = ce[12]
    e12["list"] = insert_at_top(
        e12["list"],
        'console.log("[F5DBG] CE12 OnRisk CLICK — sw100(race)=" + $gameSwitches.value(100) '
        '+ " sw101(locked)=" + $gameSwitches.value(101) + " sw102(crash)=" + $gameSwitches.value(102))'
    )
    # Após lock set (code 121 [101,101,0])
    e12["list"] = insert_after(
        e12["list"],
        lambda c: c.get("code") == 121 and c.get("parameters") == [101, 101, 0],
        'console.log("[F5DBG] CE12 LOCK aplicado")'
    )
    # Após taxa set (code 355 com setValue(106)
    e12["list"] = insert_after(
        e12["list"],
        lambda c: c.get("code") == 355 and "setValue(106" in str(c.get("parameters", [""])[0]),
        'console.log("[F5DBG] CE12 taxa(var106)=" + $gameVariables.value(106) '
        '+ " (consc=" + $gameVariables.value(104) + ")")'
    )
    # Após roll set (code 355 com setValue(107)
    e12["list"] = insert_after(
        e12["list"],
        lambda c: c.get("code") == 355 and "setValue(107" in str(c.get("parameters", [""])[0]),
        'console.log("[F5DBG] CE12 roll(var107)=" + $gameVariables.value(107) '
        '+ " vs taxa=" + $gameVariables.value(106))'
    )
    # Após outer If (success branch entry) — primeiro cmd com indent=1 APÓS o If roll<taxa
    # O outer If é code 111 params=[1,107,1,106,4]; primeiro cmd indent=1 seguinte
    def success_entry(cmd, _state={"found_if": False}):
        if not _state["found_if"]:
            if (cmd.get("code") == 111 and cmd.get("indent") == 0
                    and cmd.get("parameters") == [1, 107, 1, 106, 4]):
                _state["found_if"] = True
            return False
        # Primeiro cmd após o If com indent >= 1
        return cmd.get("indent", 0) >= 1
    e12["list"] = insert_before(
        e12["list"],
        success_entry,
        'console.log("[F5DBG] CE12 SUCCESS branch (roll < taxa)")',
        log_indent=1,
    )
    # Antes do Call CE 6 (dentro do success branch)
    e12["list"] = insert_before(
        e12["list"],
        lambda c: c.get("code") == 117 and c.get("parameters") == [6],
        'console.log("[F5DBG] CE12 SUCCESS → Call CE 6 (HUD)")',
        log_indent=1,
    )
    # Antes do Call CE 15
    e12["list"] = insert_before(
        e12["list"],
        lambda c: c.get("code") == 117 and c.get("parameters") == [15],
        'console.log("[F5DBG] CE12 SUCCESS → Call CE 15 (flash dourado)")',
        log_indent=1,
    )
    # Fail branch entry — primeiro cmd após code=411 indent=0 (Else)
    def fail_entry(cmd, _state={"seen_else": False}):
        if not _state["seen_else"]:
            if cmd.get("code") == 411 and cmd.get("indent") == 0:
                _state["seen_else"] = True
            return False
        return cmd.get("indent", 0) >= 1
    e12["list"] = insert_before(
        e12["list"],
        fail_entry,
        'console.log("[F5DBG] CE12 FAIL branch (roll >= taxa) — prepara crash")',
        log_indent=1,
    )
    # Após SW_CRASH_FLAG set (code 121 [102,102,0])
    e12["list"] = insert_after(
        e12["list"],
        lambda c: c.get("code") == 121 and c.get("parameters") == [102, 102, 0],
        'console.log("[F5DBG] CE12 SW_CRASH_FLAG setado (sw102=" + $gameSwitches.value(102) + ") — EV_Crash é F6")',
        log_indent=1,
    )

    # === CE 14 — EV_ResolucaoSafe ===
    e14 = ce[14]
    e14["list"] = insert_at_top(
        e14["list"],
        'console.log("[F5DBG] CE14 ResolucaoSafe INI (flash verde)")'
    )
    e14["list"] = insert_before_end(
        e14["list"],
        'console.log("[F5DBG] CE14 ResolucaoSafe FIM — unlock (sw101=" + $gameSwitches.value(101) + ")")'
    )

    # === CE 15 — EV_ResolucaoRiskOK ===
    e15 = ce[15]
    e15["list"] = insert_at_top(
        e15["list"],
        'console.log("[F5DBG] CE15 ResolucaoRiskOK INI (flash dourado + shake)")'
    )
    e15["list"] = insert_before_end(
        e15["list"],
        'console.log("[F5DBG] CE15 ResolucaoRiskOK FIM — unlock (sw101=" + $gameSwitches.value(101) + ")")'
    )

    # Escreve
    P.write_text(
        json.dumps(ce, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    # Auditoria
    print("Logs injetados. Resumo:")
    for idx in [5, 11, 12, 14, 15]:
        e = ce[idx]
        n_logs = sum(
            1 for c in e["list"]
            if c.get("code") == 355 and MARK in str(c.get("parameters", [""])[0])
        )
        print(f"  CE {idx:2d} ({e['name']:25s}) — {n_logs} logs, total cmds={len(e['list'])}")

    print(f"\nArquivo: {P}")
    print(f"Tamanho: {P.stat().st_size} bytes")


if __name__ == "__main__":
    main()
