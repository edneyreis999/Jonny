"""
Fase 5 — Injeção v2 de diagnóstico em CommonEvents.json.

OBJETIVO:
  Confirmar root cause dos 5 bugs reportados e adicionar feedback audível
  (Play SEs distintos) para os eventos visuais que o usuário não está vendo.

BUGS SENDO INVESTIGADOS:
  B1 — Consciência incrementa no Safe (suspeita: bug, mas spec é ambígua)
       Hipótese: CE 11 tem `consc += 10` intencional. Confirmar lendo spec.
       Log: exibir consc ANTES e DEPOIS do bloco clamp.

  B2 — Taxa ≠ clamp(consc) (suspeita: bug)
       Hipótese: fórmula real é `clamp(consc + P_CENA, 0, 100)`.
       Log: exibir P_CENA (var[103]) no momento do cálculo.

  B3 — Risk FAIL não destrava (CONFIRMADO POR LEITURA DE CÓDIGO)
       Causa raiz: CE 12 FAIL branch (linhas 31-41) não chama CE 14/15 nem
       faz sw[101] → OFF. Apenas 2 lugares no código fazem sw[101] → OFF:
       CE 14[4] e CE 15[5]. FAIL não chama nenhum dos dois.
       Log: exibir sw[101] em todos os pontos de saída de CE 12.

  B4 — Flash verde/dourado invisível
       Hipótese: Tint Screen dura 8f (~130ms) e 6f (~100ms) — muito curto.
       Adicionar SE distinto para tornar audível.

  B5 — Safe permite múltiplos cliques que avançam cena
       Hipótese: cada click Safe = nova cena (design intent). Não é bug.
       Log: exibir var[113] (last_cena) para confirmar detecção de mudança.

IDempotência:
  - Aborta se detectar marca [F5DBG] (rode remove_debug_logs.py antes).

NÃO toca:
  - CE 6 (preserva manual edits do usuário).
"""

import json
import pathlib

P = pathlib.Path("Jhonny/data/CommonEvents.json")
MARK = "[F5DBG]"


def script(text: str, indent: int = 0) -> dict:
    return {"code": 355, "indent": indent, "parameters": [text]}


def play_se(name: str, volume: int = 80, pitch: int = 100, indent: int = 0) -> dict:
    return {
        "code": 250,
        "indent": indent,
        "parameters": [{"name": name, "volume": volume, "pitch": pitch, "pan": 0}],
    }


def has_debug_logs(lst: list) -> bool:
    return any(
        c.get("code") == 355 and MARK in str(c.get("parameters", [""])[0])
        for c in lst
    )


def insert_before_first(lst: list, predicate, new_cmd, label: str = "") -> list:
    result = []
    inserted = False
    for cmd in lst:
        if not inserted and predicate(cmd):
            result.append(new_cmd)
            inserted = True
        result.append(cmd)
    if not inserted:
        raise RuntimeError(f"insert_before_first: predicate never matched. {label}")
    return result


def insert_after_first(lst: list, predicate, new_cmd, label: str = "") -> list:
    result = []
    inserted = False
    for cmd in lst:
        result.append(cmd)
        if not inserted and predicate(cmd):
            result.append(new_cmd)
            inserted = True
    if not inserted:
        raise RuntimeError(f"insert_after_first: predicate never matched. {label}")
    return result


def at_top(log_text: str) -> dict:
    return script(log_text, 0)


def at_top_as_list(log_text: str) -> list:
    return [script(log_text, 0)]


def main():
    ce = json.loads(P.read_text(encoding="utf-8"))

    for idx in [5, 7, 10, 11, 12, 14, 15]:
        if has_debug_logs(ce[idx]["list"]):
            raise SystemExit(
                f"CE {idx} já contém logs '{MARK}'. "
                f"Rode remove_debug_logs.py antes de reinyetar."
            )

    # ============================================================
    # CE 5 — EV_RaceOrchestrator
    # ============================================================
    e5 = ce[5]
    e5["list"] = at_top_as_list(
        'console.log("[F5DBG] CE5 Orch INI — consc=" + $gameVariables.value(104) '
        '+ " gloria=" + $gameVariables.value(105) + " cena=" + $gameVariables.value(101))'
    ) + e5["list"]
    e5["list"] = insert_after_first(
        e5["list"],
        lambda c: c.get("code") == 122 and c.get("parameters")[:2] == [104, 104],
        script('console.log("[F5DBG] CE5 consc RESET=" + $gameVariables.value(104))'),
        "CE5 var104 reset",
    )

    # ============================================================
    # CE 7 — EV_RaceRenderer (PARALLEL — cena change detection)
    # ============================================================
    e7 = ce[7]
    # Log no topo do loop paralelo — confirma que está rodando
    e7["list"] = [
        script(
            'console.log("[F5DBG] CE7 RENDER tick — cena=" + $gameVariables.value(101) '
            '+ " last_cena=" + $gameVariables.value(113) + " sw101=" + $gameSwitches.value(101))'
        )
    ] + e7["list"]
    # Log DENTRO do if "cena != last_cena" (após o If em linha [4] que agora é [5])
    # O If original é code=111 params=[1,101,1,113,5] (var cena != var last_cena)
    # O comando logo após ele é code=122 [113,113,0,1,101] (last_cena = cena)
    e7["list"] = insert_after_first(
        e7["list"],
        lambda c: c.get("code") == 122 and c.get("parameters") == [113, 113, 0, 1, 101],
        script(
            'console.log("[F5DBG] CE7 CENA MUDOU — resetando cena, lock 18f")',
            indent=1,
        ),
        "CE7 cena change detected",
    )
    # Log após lock ON (code 121 [101,101,0] dentro do if)
    e7["list"] = insert_after_first(
        e7["list"],
        lambda c: c.get("code") == 121 and c.get("parameters") == [101, 101, 0]
        and c.get("indent") == 1,
        script(
            'console.log("[F5DBG] CE7 LOCK ON durante transição cena (sw101=true)")',
            indent=1,
        ),
        "CE7 lock ON",
    )

    # ============================================================
    # CE 10 — EV_RaceTimer (PARALLEL — timeout auto-Safe)
    # ============================================================
    e10 = ce[10]
    # Log no início do timer tick
    e10["list"] = [
        script(
            'console.log("[F5DBG] CE10 TIMER tick — var108=" + $gameVariables.value(108) '
            '+ " sw100=" + $gameSwitches.value(100) + " sw101=" + $gameSwitches.value(101))'
        )
    ] + e10["list"]
    # Log quando timer atinge 0 e chama CE 11 (auto-Safe)
    # Linha: code=117 params=[11] dentro do If var[108]<=0
    e10["list"] = insert_before_first(
        e10["list"],
        lambda c: c.get("code") == 117 and c.get("parameters") == [11],
        script(
            'console.log("[F5DBG] CE10 TIMER ESGOTADO — Call CE 11 (auto-Safe)")',
            indent=1,
        ),
        "CE10 timer exhausted",
    )

    # ============================================================
    # CE 11 — EV_OnSafe
    # ============================================================
    e11 = ce[11]
    e11["list"] = at_top_as_list(
        'console.log("[F5DBG] CE11 SAFE click — sw100=" + $gameSwitches.value(100) '
        '+ " sw101=" + $gameSwitches.value(101) + " cena(pre)=" + $gameVariables.value(101))'
    ) + e11["list"]
    # Log ANTES do bloco clamp Consciência (linha [10] = If var104<=90)
    e11["list"] = insert_before_first(
        e11["list"],
        lambda c: c.get("code") == 111 and c.get("parameters") == [1, 104, 0, 90, 2],
        script(
            'console.log("[F5DBG] CE11 consc PRE-clamp = " + $gameVariables.value(104))'
        ),
        "CE11 pre-clamp",
    )
    # Log DEPOIS do bloco clamp (após End code=412 da linha [14])
    # Encontrar o primeiro 412 que vem após o If em [10]
    def after_consc_clamp(cmd, _state={"seen_if": False, "seen_end": False}):
        if not _state["seen_if"]:
            if (cmd.get("code") == 111
                    and cmd.get("parameters") == [1, 104, 0, 90, 2]):
                _state["seen_if"] = True
            return False
        if not _state["seen_end"]:
            if cmd.get("code") == 412 and cmd.get("indent") == 0:
                _state["seen_end"] = True
            return False
        return True
    e11["list"] = insert_after_first(
        e11["list"],
        after_consc_clamp,
        script(
            'console.log("[F5DBG] CE11 consc POST-clamp = " + $gameVariables.value(104) '
            '+ " (confirme: +10 se <=90, 100 caso contrário)")'
        ),
        "CE11 post-clamp",
    )
    # SE diagnóstico após Glória +10 (depois do console.log existente)
    # SE: Up (som positivo) — confirma que Safe resolveu
    e11["list"] = insert_after_first(
        e11["list"],
        lambda c: c.get("code") == 122 and c.get("parameters") == [105, 105, 1, 0, 10],
        play_se("Up", volume=70),
        "CE11 Glória SE",
    )
    # Log após cena++ (code 122 [101,101,1,0,1])
    e11["list"] = insert_after_first(
        e11["list"],
        lambda c: c.get("code") == 122 and c.get("parameters") == [101, 101, 1, 0, 1],
        script(
            'console.log("[F5DBG] CE11 cena++ → " + $gameVariables.value(101) '
            '+ " (cada Safe = nova cena, intencional)")'
        ),
        "CE11 cena++",
    )

    # ============================================================
    # CE 12 — EV_OnRisk (rama SUCCESS e FAIL)
    # ============================================================
    e12 = ce[12]
    e12["list"] = at_top_as_list(
        'console.log("[F5DBG] CE12 RISK click — sw100=" + $gameSwitches.value(100) '
        '+ " sw101=" + $gameSwitches.value(101) + " sw102=" + $gameSwitches.value(102) '
        '+ " P_CENA(var103)=" + $gameVariables.value(103))'
    ) + e12["list"]
    # Log após taxa set (Script com setValue(106))
    e12["list"] = insert_after_first(
        e12["list"],
        lambda c: c.get("code") == 355
        and "setValue(106" in str(c.get("parameters", [""])[0]),
        script(
            'console.log("[F5DBG] CE12 taxa=" + $gameVariables.value(106) '
            '+ " = clamp(consc=" + $gameVariables.value(104) + " + P_CENA=" '
            '+ $gameVariables.value(103) + ", 0, 100)")'
        ),
        "CE12 taxa calc",
    )
    # Log após roll set
    e12["list"] = insert_after_first(
        e12["list"],
        lambda c: c.get("code") == 355
        and "setValue(107" in str(c.get("parameters", [""])[0]),
        script(
            'console.log("[F5DBG] CE12 roll=" + $gameVariables.value(107) '
            '+ " vs taxa=" + $gameVariables.value(106) '
            '+ " → " + ($gameVariables.value(107) < $gameVariables.value(106) ? "SUCCESS" : "FAIL"))'
        ),
        "CE12 roll",
    )

    # SUCCESS branch — SE Bell3 (celebration)
    # Localizar "code=117 params=[15]" dentro do success branch
    e12["list"] = insert_before_first(
        e12["list"],
        lambda c: c.get("code") == 117 and c.get("parameters") == [15],
        play_se("Bell3", volume=80, indent=1),
        "CE12 SE Bell3 (Risk success)",
    )

    # FAIL branch — log de entrada + SE Buzzer1 (failure) + log ao final do branch
    # Detectar o Else (code=411 indent=0) — primeiro cmd após Else com indent>=1
    def fail_branch_entry(cmd, _state={"seen_else": False}):
        if not _state["seen_else"]:
            if cmd.get("code") == 411 and cmd.get("indent") == 0:
                _state["seen_else"] = True
            return False
        return cmd.get("indent", 0) >= 1
    e12["list"] = insert_before_first(
        e12["list"],
        fail_branch_entry,
        script(
            'console.log("[F5DBG] CE12 FAIL branch ENTERED — sw101 vai PERMANECER true (BUG)")',
            indent=1,
        ),
        "CE12 FAIL entry log",
    )
    # Após SW_CRASH_FLAG set (code 121 [102,102,0])
    e12["list"] = insert_after_first(
        e12["list"],
        lambda c: c.get("code") == 121 and c.get("parameters") == [102, 102, 0],
        script(
            'console.log("[F5DBG] CE12 SW_CRASH_FLAG ON — sw101 ainda " '
            '+ $gameSwitches.value(101) + " (deveria ser false para destravar)")',
            indent=1,
        ),
        "CE12 crash flag set",
    )
    # SE Buzzer1 após crash flag (failure audible)
    e12["list"] = insert_after_first(
        e12["list"],
        lambda c: c.get("code") == 121 and c.get("parameters") == [102, 102, 0],
        play_se("Buzzer1", volume=80, indent=1),
        "CE12 SE Buzzer1 (Risk fail)",
    )
    # Log NO FINAL do FAIL branch (antes do End code=412 indent=0)
    # Procurar o Comment [TASK 6.1 PENDENTE] (code=108)
    e12["list"] = insert_after_first(
        e12["list"],
        lambda c: c.get("code") == 108 and "TASK 6.1" in str(c.get("parameters", [""])),
        script(
            'console.log("[F5DBG] CE12 FAIL FIM — sw101=" + $gameSwitches.value(101) '
            '+ " sw102=" + $gameSwitches.value(102) + " — INPUT PERMANECE TRANCADO (bug)")',
            indent=1,
        ),
        "CE12 FAIL end log",
    )

    # ============================================================
    # CE 14 — EV_ResolucaoSafe (flash verde)
    # ============================================================
    e14 = ce[14]
    e14["list"] = at_top_as_list(
        'console.log("[F5DBG] CE14 ResolucaoSafe INI — flash verde por 8f+12f")'
    ) + e14["list"]
    # SE Cursor1 no início do flash (audio confirmation)
    e14["list"] = [play_se("Cursor1", volume=60)] + e14["list"]
    # Log ao final (antes do END)
    e14["list"] = insert_before_first(
        e14["list"],
        lambda c: c.get("code") == 0,
        script(
            'console.log("[F5DBG] CE14 FIM — sw101=" + $gameSwitches.value(101) '
            '+ " (deveria ser false)")'
        ),
        "CE14 end",
    )

    # ============================================================
    # CE 15 — EV_ResolucaoRiskOK (flash dourado + shake)
    # ============================================================
    e15 = ce[15]
    e15["list"] = at_top_as_list(
        'console.log("[F5DBG] CE15 ResolucaoRiskOK INI — flash dourado 6f+18f + shake")'
    ) + e15["list"]
    # SE Applause2 no início do flash dourado (audio celebration)
    e15["list"] = [play_se("Applause2", volume=70)] + e15["list"]
    # Log ao final
    e15["list"] = insert_before_first(
        e15["list"],
        lambda c: c.get("code") == 0,
        script(
            'console.log("[F5DBG] CE15 FIM — sw101=" + $gameSwitches.value(101) '
            '+ " (deveria ser false)")'
        ),
        "CE15 end",
    )

    # Escreve
    P.write_text(
        json.dumps(ce, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    # Auditoria
    print("Logs v2 + SEs diagnósticos injetados. Resumo:")
    for idx in [5, 7, 10, 11, 12, 14, 15]:
        e = ce[idx]
        n_logs = sum(
            1 for c in e["list"]
            if c.get("code") == 355 and MARK in str(c.get("parameters", [""])[0])
        )
        n_ses = sum(
            1 for c in e["list"]
            if c.get("code") == 250
            and isinstance(c.get("parameters", [{}])[0], dict)
            and c["parameters"][0].get("name") in {"Bell3", "Buzzer1", "Cursor1", "Up", "Applause2"}
        )
        print(f"  CE{idx:2d} ({e['name']:25s}) — {n_logs} logs, {n_ses} SEs diagnósticos, total={len(e['list'])}")

    print(f"\nArquivo: {P}")
    print(f"Tamanho: {P.stat().st_size} bytes")

    # Validação JSON
    try:
        json.loads(P.read_text(encoding="utf-8"))
        print("JSON válido ✓")
    except json.JSONDecodeError as e:
        print(f"ERRO JSON: {e}")


if __name__ == "__main__":
    main()
