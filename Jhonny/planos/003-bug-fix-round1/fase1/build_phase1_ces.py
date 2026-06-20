"""
Fase 1 — Correção do exploit de glória infinita na tela cerimonial (#3).

Três patches coordenados que fecham a cadeia do exploit sem desligar
SW_RACE_ACTIVE durante o WAIT_INPUT do CE 19 (o dono paralelo CE 7 precisa
dele vivo enquanto a chamada sincrona roda).

    Patch A — CE 19 head: SW_INPUT_LOCKED=ON + SW_PAUSED=ON (linchpin).
              Sem isto, os guards dos Patches B/C nunca disparam porque
              nada liga o lock ao entrar na tela de vitória/derrota.
    Patch B — CE 10 timer: SW_RACE_ACTIVE==OFF aborta; SW_INPUT_LOCKED==ON
              espera 1f e salta para TICK. (Defense-in-depth; hoje já existe.)
    Patch C — CE 11 OnSafe: SW_INPUT_LOCKED==ON aborta antes do +10 glória.
              (Defense-in-depth; hoje já existe.)

Idempotente:
    Cada patch detecta se o padrão alvo já está presente e skipa. Reexecução
    produz "skipped" x3 e git diff vazio em Jhonny/data/CommonEvents.json.

    Estado atual (snapshot 2026-06-20, ver fase1/findings.md):
      Patch A — FALTA (CE 19 head não tem ControlSwitch).
      Patch B — JÁ PRESENTE em CE 10 (skip esperado).
      Patch C — JÁ PRESENTE em CE 11 (skip esperado).

Referências:
    - Plano:  Jhonny/planos/003-bug-fix-round1/tasks.md (Fase 1)
    - Guia:   Jhonny/planos/003-bug-fix-round1/race-feedback-impl-guide.md §4
    - Findings: Jhonny/planos/003-bug-fix-round1/fase1/findings.md
    - Prior art: Jhonny/planos/001-prototipo-core-loop/fase7/build_phase7_ces.py

Editor IDs (System.json):
    SW_RACE_ACTIVE  = 100  (switch) — dono dos CEs paralelos 7/10/13/16
    SW_INPUT_LOCKED = 101  (switch) — lock operacional do cerimonial
    SW_PAUSED       = 104  (switch) — sinal canônico de pause (sem leitores hoje)

CE indices (CommonEvents.json):
    CE_INDEX_VITORIA = 19  (EV_VitoriaCorrida) — chamada por CE 7 cmd[5]
    CE_INDEX_TIMER   = 10  (EV_RaceTimer)      — paralelo, switch 100
    CE_INDEX_SAFE    = 11  (EV_OnSafe)         — premio +10 glória em cmd[13]
"""

import json
import pathlib
import sys

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")

# CE Editor IDs
CE_INDEX_VITORIA = 19
CE_INDEX_TIMER = 10
CE_INDEX_SAFE = 11

# Switch Editor IDs
SW_RACE_ACTIVE = 100
SW_INPUT_LOCKED = 101
SW_PAUSED = 104

# RMMZ command codes usados aqui
CODE_CONTROL_SWITCH = 121      # params: [startId, endId, value]  value 0=ON, 1=OFF
CODE_CONDITIONAL_BRANCH = 111  # params: [0, switchId, expectedValue] para switch
CODE_EXIT_EVENT = 115
CODE_END = 412
CODE_WAIT = 230
CODE_JUMP_TO_LABEL = 119
CODE_CONTROL_VARIABLE = 122    # params: [startId, endId, operation, operandType, operandValue]


def C(code, indent, parameters=None):
    """Helper para construir um command MZ no formato JSON."""
    return {"code": code, "indent": indent, "parameters": parameters or []}


def _find(cmds, predicate):
    """Primeiro índice cujo cmd satisfaz predicate(cmd), ou -1."""
    for i, cmd in enumerate(cmds):
        if predicate(cmd):
            return i
    return -1


def _write_back(ces):
    CE_PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


# =============================================================================
# Patch A — CE 19 head: ceremony lock (linchpin)
# =============================================================================
def patch_a_ceremony_lock(ces):
    """Insere SW_INPUT_LOCKED=ON e SW_PAUSED=ON no topo do CE 19.

    Idempotente: skipa se ambos os ControlSwitch já estão presentes nos
    primeiros 8 comandos. Nunca insere ou restaura SW_RACE_ACTIVE.
    """
    cmds = ces[CE_INDEX_VITORIA]["list"]
    head = cmds[:8]

    has_input_locked_on = any(
        cmd["code"] == CODE_CONTROL_SWITCH
        and cmd["parameters"] == [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]
        for cmd in head
    )
    has_paused_on = any(
        cmd["code"] == CODE_CONTROL_SWITCH
        and cmd["parameters"] == [SW_PAUSED, SW_PAUSED, 0]
        for cmd in head
    )

    # Sanity: nunca devemos tocar SW_RACE_ACTIVE em CE 19.
    has_race_active_toggle = any(
        cmd["code"] == CODE_CONTROL_SWITCH
        and SW_RACE_ACTIVE in (cmd["parameters"][0], cmd["parameters"][1] if len(cmd["parameters"]) > 1 else None)
        for cmd in head
        if cmd["code"] == CODE_CONTROL_SWITCH and cmd["parameters"]
    )
    if has_race_active_toggle:
        return ("skipped (CE19 head unexpectedly touches SW_RACE_ACTIVE)", ces)

    if has_input_locked_on and has_paused_on:
        return ("skipped (ceremony lock already present)", ces)

    to_insert = [
        C(CODE_CONTROL_SWITCH, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]),
        C(CODE_CONTROL_SWITCH, 0, [SW_PAUSED, SW_PAUSED, 0]),
    ]
    for offset, cmd in enumerate(to_insert):
        cmds.insert(offset, cmd)
    return (f"applied (inserted 2 ControlSwitch at CE19 head; {len(cmds)} cmds)", ces)


# =============================================================================
# Patch B — CE 10 timer guards (defense-in-depth)
# =============================================================================
def patch_b_timer_guards(ces):
    """Garante que CE 10 tem o guard SW_RACE_ACTIVE==OFF -> Exit no topo.

    O guard SW_INPUT_LOCKED==ON -> Wait 1f -> Jump TICK também é verificado.
    Hoje ambos já existem; este patch só insere o RACE_ACTIVE abort se faltar.
    """
    cmds = ces[CE_INDEX_TIMER]["list"]

    # Padrão 1: ConditionalBranch [0, 100, 1] seguido de ExitEventProcessing.
    has_race_active_abort = any(
        i + 1 < len(cmds)
        and cmds[i]["code"] == CODE_CONDITIONAL_BRANCH
        and cmds[i]["parameters"] == [0, SW_RACE_ACTIVE, 1]
        and cmds[i + 1]["code"] == CODE_EXIT_EVENT
        for i in range(len(cmds) - 1)
    )

    # Padrão 2: ConditionalBranch [0, 101, 0] -> Wait 1f -> Jump TICK.
    has_input_locked_wait = any(
        i + 2 < len(cmds)
        and cmds[i]["code"] == CODE_CONDITIONAL_BRANCH
        and cmds[i]["parameters"] == [0, SW_INPUT_LOCKED, 0]
        and cmds[i + 1]["code"] == CODE_WAIT
        and cmds[i + 2]["code"] == CODE_JUMP_TO_LABEL
        for i in range(len(cmds) - 2)
    )

    if has_race_active_abort and has_input_locked_wait:
        return ("skipped (timer RACE_ACTIVE abort + INPUT_LOCKED wait-loop already present)", ces)

    # Se chegou aqui, falta algum dos guards. Não esperado no snapshot atual,
    # mas o patch precisa saber a estrutura para inserir com segurança.
    # Procura o Label "TICK" para inserir logo após ele.
    label_idx = _find(
        cmds,
        lambda c: c["code"] == 118 and c["parameters"] == ["TICK"],
    )
    if label_idx == -1:
        return ("skipped (Label TICK not found; manual review required)", ces)

    insert_at = label_idx + 1
    inserted = []
    if not has_race_active_abort:
        inserted += [
            C(CODE_CONDITIONAL_BRANCH, 0, [0, SW_RACE_ACTIVE, 1]),
            C(CODE_EXIT_EVENT, 1, []),
            C(CODE_END, 0, []),
        ]
    if not has_input_locked_wait:
        inserted += [
            C(CODE_CONDITIONAL_BRANCH, 0, [0, SW_INPUT_LOCKED, 0]),
            C(CODE_WAIT, 1, [1]),
            C(CODE_JUMP_TO_LABEL, 1, ["TICK"]),
            C(CODE_END, 0, []),
        ]
    for offset, cmd in enumerate(inserted):
        cmds.insert(insert_at + offset, cmd)
    return (f"applied (inserted {len(inserted)} timer guard cmds at CE10)", ces)


# =============================================================================
# Patch C — CE 11 safe-resolution lock guard (defense-in-depth)
# =============================================================================
def patch_c_safe_lock_guard(ces):
    """Garante que CE 11 aborta em SW_INPUT_LOCKED==ON antes do +10 glória.

    Hoje o guard já existe no cmd[3]. Este patch só insere se faltar.
    """
    cmds = ces[CE_INDEX_SAFE]["list"]

    # Guard: ConditionalBranch [0, 101, 0] seguido de ExitEventProcessing.
    guard_idx = _find(
        cmds,
        lambda c: c["code"] == CODE_CONDITIONAL_BRANCH
        and c["parameters"] == [0, SW_INPUT_LOCKED, 0],
    )
    if guard_idx != -1:
        # Verifica que o próximo cmd é ExitEventProcessing.
        if guard_idx + 1 < len(cmds) and cmds[guard_idx + 1]["code"] == CODE_EXIT_EVENT:
            return ("skipped (safe INPUT_LOCKED guard already present)", ces)
        # Guard existe mas não seguido de Exit — não esperado, não mexer.
        return ("skipped (INPUT_LOCKED branch found but not followed by Exit; manual review)", ces)

    # Sem guard: precisa inserir no topo. Inserir antes do primeiro cmd real
    # (code != 0). Como CE 11 começa direto com o branch RACE_ACTIVE, inserimos
    # na posição 0.
    to_insert = [
        C(CODE_CONDITIONAL_BRANCH, 0, [0, SW_INPUT_LOCKED, 0]),
        C(CODE_EXIT_EVENT, 1, []),
        C(CODE_END, 0, []),
    ]
    for offset, cmd in enumerate(to_insert):
        cmds.insert(offset, cmd)
    return (f"applied (inserted INPUT_LOCKED guard at CE11 head; {len(cmds)} cmds)", ces)


# =============================================================================
# Patch D — CE 19 exit: clear SW_PAUSED (release ceremony signal)
# =============================================================================
def patch_d_ceremony_unlock(ces):
    """Limpa SW_PAUSED=OFF logo após o fim do loop WAIT_INPUT do CE 19.

    Sem isto, o sinal de pause fica permanentemente ON após a primeira
    vitória/derrota, travando CE 10 e CE 11 nas próximas raças.

    Idempotente: skipa se o ControlSwitch [104,104,1] já está presente
    nas 6 posições após o End que fecha o WAIT_INPUT.
    """
    cmds = ces[CE_INDEX_VITORIA]["list"]

    # Localiza o Label WAIT_INPUT.
    label_idx = _find(
        cmds,
        lambda c: c["code"] == 118 and c["parameters"] == ["WAIT_INPUT"],
    )
    if label_idx == -1:
        return ("skipped (Label WAIT_INPUT not found in CE19)", ces)

    # Localiza o primeiro ErasePicture (code=235) após o label — marco
    # de "fim do loop WAIT_INPUT". O End (code=412) que fecha o If está
    # logo antes desse ErasePicture.
    erase_idx = -1
    for i in range(label_idx + 1, len(cmds)):
        if cmds[i]["code"] == 235:
            erase_idx = i
            break
    if erase_idx == -1:
        return ("skipped (ErasePicture after WAIT_INPUT not found)", ces)

    # Idempotência: procura ControlSwitch [104,104,1] nas 6 posições antes
    # do ErasePicture (ou seja, entre o End do WAIT_INPUT e o ErasePicture).
    insert_at = erase_idx
    scan_start = max(label_idx + 1, erase_idx - 6)
    for i in range(scan_start, erase_idx):
        if (cmds[i]["code"] == CODE_CONTROL_SWITCH
                and cmds[i]["parameters"] == [SW_PAUSED, SW_PAUSED, 1]):
            return ("skipped (PAUSED clear after WAIT_INPUT already present)", ces)

    to_insert = [C(CODE_CONTROL_SWITCH, 0, [SW_PAUSED, SW_PAUSED, 1])]
    cmds.insert(insert_at, to_insert[0])
    return (f"applied (inserted PAUSED=OFF at CE19 cmd[{insert_at}]; {len(cmds)} cmds)", ces)


# =============================================================================
# Patch E — CE 10 timer: SW_PAUSED guard (robust against CE 14 clearing INPUT_LOCKED)
# =============================================================================
def patch_e_timer_paused_guard(ces):
    """Adiciona guard SW_PAUSED==ON -> Wait 1f -> Jump TICK no CE 10.

    Necessário porque CE 14 (cleanup do Safe) desliga INPUT_LOCKED ao fim do
    pipeline CE 11 -> CE 14, e isso pode correr APOS Patch A ter ligado o lock
    na entrada do CE 19 (race condition via reserveCommonEvent + Wait 12 frames
    no interpretador do mapa). SW_PAUSED é setado APENAS por Patch A e limpo
    APENAS por Patch D, então é imune a CE 14.
    """
    cmds = ces[CE_INDEX_TIMER]["list"]

    # Idempotência: já existe ConditionalBranch [0, 104, 0] no CE 10?
    has_paused_guard = any(
        cmd["code"] == CODE_CONDITIONAL_BRANCH
        and cmd["parameters"] == [0, SW_PAUSED, 0]
        for cmd in cmds
    )
    if has_paused_guard:
        return ("skipped (timer PAUSED guard already present)", ces)

    # Inserir após o End (code=412) que fecha o branch RACE_ACTIVE do topo,
    # e antes do branch INPUT_LOCKED existente. Estrutura atual do CE 10:
    #   [0] Label TICK
    #   [1] If RACE_ACTIVE==OFF
    #   [2]   Exit
    #   [3] End
    #   [4] If INPUT_LOCKED==ON  <- queremos inserir antes deste
    # Procura pelo branch INPUT_LOCKED existente para inserir antes dele.
    input_locked_branch_idx = _find(
        cmds,
        lambda c: c["code"] == CODE_CONDITIONAL_BRANCH
        and c["parameters"] == [0, SW_INPUT_LOCKED, 0],
    )
    if input_locked_branch_idx == -1:
        return ("skipped (INPUT_LOCKED branch not found; cannot anchor PAUSED guard)", ces)

    to_insert = [
        C(CODE_CONDITIONAL_BRANCH, 0, [0, SW_PAUSED, 0]),
        C(CODE_WAIT, 1, [1]),
        C(CODE_JUMP_TO_LABEL, 1, ["TICK"]),
        C(CODE_END, 0, []),
    ]
    for offset, cmd in enumerate(to_insert):
        cmds.insert(input_locked_branch_idx + offset, cmd)
    return (f"applied (inserted PAUSED guard at CE10 cmd[{input_locked_branch_idx}]; {len(cmds)} cmds)", ces)


# =============================================================================
# Patch F — CE 11 safe-resolution: SW_PAUSED guard (robust against CE 14)
# =============================================================================
def patch_f_safe_paused_guard(ces):
    """Adiciona guard SW_PAUSED==ON -> Exit no topo do CE 11.

    Mesma justificativa do Patch E: CE 14 pode limpar INPUT_LOCKED em uma
    janela de race, mas SW_PAUSED permanece ON durante a tela cerimonial.
    """
    cmds = ces[CE_INDEX_SAFE]["list"]

    # Idempotência: já existe ConditionalBranch [0, 104, 0] no topo do CE 11?
    # Procura nos primeiros 6 cmds (antes do branch RACE_ACTIVE existente).
    head = cmds[:6]
    has_paused_guard = any(
        cmd["code"] == CODE_CONDITIONAL_BRANCH
        and cmd["parameters"] == [0, SW_PAUSED, 0]
        for cmd in head
    )
    if has_paused_guard:
        return ("skipped (safe PAUSED guard already present)", ces)

    to_insert = [
        C(CODE_CONDITIONAL_BRANCH, 0, [0, SW_PAUSED, 0]),
        C(CODE_EXIT_EVENT, 1, []),
        C(CODE_END, 0, []),
    ]
    for offset, cmd in enumerate(to_insert):
        cmds.insert(offset, cmd)
    return (f"applied (inserted PAUSED guard at CE11 head; {len(cmds)} cmds)", ces)


# =============================================================================
# Orquestração
# =============================================================================
def main():
    if not CE_PATH.exists():
        print(f"ERRO: {CE_PATH} não encontrado", file=sys.stderr)
        sys.exit(1)

    ces = json.loads(CE_PATH.read_text(encoding="utf-8"))
    print(f"Estado inicial: {len(ces)} slots CE\n")

    applied_any = False

    print("--- Patch A: CE 19 ceremony lock (linchpin) ---")
    result_a, ces = patch_a_ceremony_lock(ces)
    print(f"  Patch A: {result_a}\n")
    applied_any |= result_a.startswith("applied")

    print("--- Patch B: CE 10 timer guards (defense-in-depth) ---")
    result_b, ces = patch_b_timer_guards(ces)
    print(f"  Patch B: {result_b}\n")
    applied_any |= result_b.startswith("applied")

    print("--- Patch C: CE 11 safe-resolution guard (defense-in-depth) ---")
    result_c, ces = patch_c_safe_lock_guard(ces)
    print(f"  Patch C: {result_c}\n")
    applied_any |= result_c.startswith("applied")

    # Patches D/E/F close a race condition discovered on Phase 1 Playtest
    # (attempt 2+): CE 14 (Safe cleanup) clears INPUT_LOCKED AFTER Patch A
    # set it ON, because CE 14's Wait 12 frames can finish after CE 19
    # enters its WAIT_INPUT loop on a different interpreter. SW_PAUSED is
    # the robust ceremony signal — only Patch A sets it and only Patch D
    # clears it, so CE 14 cannot override it.
    print("--- Patch D: CE 19 exit — clear SW_PAUSED after WAIT_INPUT ---")
    result_d, ces = patch_d_ceremony_unlock(ces)
    print(f"  Patch D: {result_d}\n")
    applied_any |= result_d.startswith("applied")

    print("--- Patch E: CE 10 timer — SW_PAUSED guard (race-condition fix) ---")
    result_e, ces = patch_e_timer_paused_guard(ces)
    print(f"  Patch E: {result_e}\n")
    applied_any |= result_e.startswith("applied")

    print("--- Patch F: CE 11 safe — SW_PAUSED guard (race-condition fix) ---")
    result_f, ces = patch_f_safe_paused_guard(ces)
    print(f"  Patch F: {result_f}\n")
    applied_any |= result_f.startswith("applied")

    if applied_any:
        _write_back(ces)
        print(f"JSON escrito: {CE_PATH}")
    else:
        print("Nenhuma mudança aplicada — JSON não regravado.")

    print("\n--- Snapshot final ---")
    for i in [CE_INDEX_VITORIA, CE_INDEX_TIMER, CE_INDEX_SAFE]:
        ce = ces[i]
        print(f"  CE[{i:2}] {ce['name']!r:30} cmds={len(ce['list'])}")


if __name__ == "__main__":
    main()
