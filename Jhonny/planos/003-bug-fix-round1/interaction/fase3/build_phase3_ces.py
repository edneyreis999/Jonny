"""
Fase 3 — HUD de Consciência atualiza live e sobrevive a crash→restart (#5 + #6).

Três patches coordenados:

    Patch I-a — Converte CE 6 (EV_UpdateHud) em parallel (trigger=2,
              switchId=100) e adiciona loop HUD_TICK com guard SW_PAUSED
              dentro do loop + re-bake do pic 60 a cada 6 frames. Resolve
              bug #5 (Texto "%" "stuck at 0%"): o TextPicture bakeia
              `\\V[104]` uma vez no INIT; sem re-bake, o número nunca muda.

    Patch I-b — Remove as chamadas `117 [6]` em CE 11 (Safe), CE 12 (Risk)
              e CE 18 (Crash). OBRIGATÓRIO: após Patch I-a, CE 6 tem loop
              HUD_TICK infinito. `command117` faz `setupChild` — o
              interpretador do caller adota a lista do CE 6 e trava no
              loop forever. Sem este patch, o jogo congela na primeira
              ação Safe/Risk/Crash.

    Patch J  — Insere `[357 TextPicture, 657, 231 pic 60]` imediatamente
              após `SW_RACE_ACTIVE = ON` no CE 5 (EV_RaceOrchestrator).
              Garante que pic 60 seja a PRIMEIRA picture mostrada após o
              switch ON, precedente por TextPicture (audit J). O pic 60
              pre-existente em CE 5 cmds 23-25 torna-se redundante;
              mantido por segurança (Show com mesmo ID substitui).

Bug #6 ("HUD disappears after first attempt") é resolvido pela combo
I-a + I-b: CE 6 paralelo re-bakeia pic 60 a 10 Hz enquanto
SW_RACE_ACTIVE estiver ON, e EV_Crash não desliga essa switch
(invariante do ceremony-lock da Fase 1).

Idempotente:
    Cada patch detecta se o padrão alvo já está presente e skipa. Reexecução
    produz "skipped" x3 e git diff vazio em Jhonny/data/CommonEvents.json.

Estado atual (snapshot 2026-06-20 pós-Fase 2):
    CE 6  — trigger=0, switch=1, 9 cmds. Sem HUD_TICK. Sem guard SW_PAUSED.
            Chamado por CE 11/12/18 via `117 [6]`.
    CE 5  — INIT mostra pic 60 em cmds 23-25 (após pics 20/21, antes do
            Tint fade-in). SW_RACE_ACTIVE ON está em cmd 20.
    CE 11/12/18 — contêm `117 [6]` em índices 20/18/24 respectivamente.

Referências:
    - Plano:     Jhonny/planos/003-bug-fix-round1/tasks.md (Fase 3)
    - Guia:      Jhonny/planos/003-bug-fix-round1/race-feedback-impl-guide.md §6,§7
    - Findings:  Jhonny/planos/003-bug-fix-round1/fase3/hud-findings.md
    - Prior art: Jhonny/planos/003-bug-fix-round1/builds/build_phase2_ces.py

Convenção de nomes:
    Fase 1 v2 usou patches A-F; Fase 2 usou G-H; Fase 3 começa em I. As
    sub-letras (I-a, I-b) separam as duas metades do Patch I (modificação
    do CE 6 vs. remoção dos callers). Audit permanece "I" (audit I valida
    o estado final do CE 6, independente de quantos sub-patches chegaram
    lá).

Editor IDs (System.json):
    SW_RACE_ACTIVE   = 100  (switch) — owner de todo parallel CE da corrida
    SW_INPUT_LOCKED  = 101  (switch) — não tocar (Fase 1)
    SW_PAUSED        = 104  (switch) — guard do loop HUD_TICK
    VAR_CONSCIENCIA  = 104  (variable) — texto do pic 60 via \\V[104]

CE indices (CommonEvents.json):
    CE_INDEX_ORCHESTRATOR = 5  (EV_RaceOrchestrator)
    CE_INDEX_UPDATE_HUD   = 6  (EV_UpdateHud)
    CE_INDEX_ON_SAFE      = 11 (EV_OnSafe)
    CE_INDEX_ON_RISK      = 12 (EV_OnRisk)
    CE_INDEX_CRASH        = 18 (EV_Crash)

Opcodes verificados em Jhonny/js/rmmz_objects.js (2026-06-20):
    111 (command111, linha 9927)  — If Branch: params[0]=0 (Switch),
                                    params[1]=switchId, params[2]=0 means ON.
    115 (command115, linha 10118) — Exit Event Processing: _index = list.length.
    117 (command117, linha 10121) — Common Event: setupChild(list, eventId).
    118 (command118, linha 10139) — Label: parameters[0] = labelName.
    119 (command119, linha 10144) — Jump to Label: parameters[0] = labelName.
    121 (command121, linha 10172) — Control Switch.
    230 (command230, linha 10702) — Wait: parameters[0] = frames.
    231 (command231, linha 10708) — Show Picture.
    357 (command357, linha 11321) — Plugin Command.
"""

import json
import pathlib
import sys

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")

# CE Editor IDs (índices no array do JSON)
CE_INDEX_ORCHESTRATOR = 5
CE_INDEX_UPDATE_HUD = 6
CE_INDEX_ON_SAFE = 11
CE_INDEX_ON_RISK = 12
CE_INDEX_CRASH = 18

# Switch / Variable Editor IDs
SW_RACE_ACTIVE = 100
SW_PAUSED = 104
PIC_ID_HUD_TEXT = 60
HUD_TICK_LABEL = "HUD_TICK"
HUD_REFRESH_FRAMES = 6

# RMMZ command codes (verificados em rmmz_objects.js)
CODE_LABEL = 118
CODE_JUMP_TO_LABEL = 119
CODE_CONTROL_SWITCH = 121
CODE_WAIT = 230
CODE_SHOW_PICTURE = 231
CODE_PLUGIN_CMD = 357
CODE_PLUGIN_ARG = 657
CODE_SCRIPT = 355
CODE_CONDITIONAL_BRANCH = 111
CODE_EXIT_EVENT = 115
CODE_BRANCH_ELSE = 411
CODE_BRANCH_END = 412
CODE_COMMON_EVENT_CALL = 117
CODE_END_OF_LIST = 0

# Branch params para "If SW_PAUSED == ON" — tipo Switch (0), params[2]=0 means ON.
BRANCH_SW_PAUSED_ON = [0, SW_PAUSED, 0]

# Re-bake do pic 60 — mesmas params do CE 5 INIT cmds 23-25.
TEXTPICTURE_HUD_TRIPLE = [
    {
        "code": CODE_PLUGIN_CMD,
        "indent": 0,
        "parameters": ["TextPicture", "set", "Set Text Picture", {"text": "\\V[104]%"}],
    },
    {
        "code": CODE_PLUGIN_ARG,
        "indent": 0,
        "parameters": ["Text = \\V[104]%"],
    },
    {
        "code": CODE_SHOW_PICTURE,
        "indent": 0,
        "parameters": [PIC_ID_HUD_TEXT, "", 1, 0, 100, 148, 100, 100, 255, 0],
    },
]


def C(code, indent, parameters=None):
    """Helper para construir um command MZ no formato JSON."""
    return {"code": code, "indent": indent, "parameters": parameters or []}


def _write_back(ces):
    CE_PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def _deep_copy(obj):
    """Cópia profunda via JSON round-trip — garante que patches não mutam input."""
    return json.loads(json.dumps(obj))


# =============================================================================
# Patch I-a — Converte CE 6 em parallel + loop HUD_TICK + re-bake pic 60
# =============================================================================
def patch_i_a_update_hud_parallel(ces):
    """Transforma CE 6 (EV_UpdateHud) em CE paralelo com loop HUD_TICK.

    Pré-Patch I-a (estado atual, 9 cmds):
      trigger=0, switchId=1
      [0] code 355: move pic 21
      [1] code 357: TextPicture GLÓRIA
      [2] code 657
      [3] code 231: pic 57
      [4] code 231: pic 51 (bg-ranking)
      [5] code 357: TextPicture TENTATIVA
      [6] code 657
      [7] code 231: pic 52
      [8] code 0 (end-of-list)

    Pós-Patch I-a (estado alvo, 18 cmds):
      trigger=2, switchId=100
      [0] code 118: Label HUD_TICK                (NOVO)
      [1] code 111: If SW_PAUSED == ON            (NOVO, guard dentro do loop)
      [2] code 115:   Exit Event Processing       (NOVO, indent 1)
      [3] code 412: End                            (NOVO)
      [4] code 355: move pic 21                   (existente)
      [5..11] Glória/TENTATIVA/bg-ranking         (existente, 7 cmds)
      [12] code 357: TextPicture CONSCIÊNCIA      (NOVO)
      [13] code 657                                (NOVO)
      [14] code 231: pic 60                        (NOVO, re-bake)
      [15] code 230: Wait 6                        (NOVO)
      [16] code 119: Jump HUD_TICK                 (NOVO)
      [17] code 0: end-of-list

    Idempotente: skipa se CE 6 já tem trigger=2, switchId=100, e label HUD_TICK.
    """
    ce6 = ces[CE_INDEX_UPDATE_HUD]
    cmds = ce6["list"]

    # Idempotência: trigger+switch+label já no estado alvo.
    if (
        ce6.get("trigger") == 2
        and ce6.get("switchId") == SW_RACE_ACTIVE
        and any(
            cmd.get("code") == CODE_LABEL
            and cmd.get("parameters") == [HUD_TICK_LABEL]
            for cmd in cmds
        )
    ):
        return ("skipped (CE 6 already parallel with HUD_TICK label)", ces)

    # Sanity: o CE 6 deve ter o formato esperado (9 cmds, termina em code 0).
    # Se uma futura edição mudar o tamanho, abortar para análise manual.
    if len(cmds) != 9:
        return (
            f"skipped (CE 6 has {len(cmds)} cmds, expected 9; manual review)",
            ces,
        )

    # Valida o formato esperado: cmd[0] é Script que move pic 21 (indicador
    # de que estamos no CE certo). Não validamos os outros cmds — apenas
    # tomamos os 8 cmds úteis (excluindo trailing code 0).
    if cmds[0].get("code") != CODE_SCRIPT or "$gameScreen.picture(21)" not in cmds[0].get("parameters", [""])[0]:
        return (
            "skipped (CE 6 cmd[0] does not look like the pic-21 move script; manual review)",
            ces,
        )

    existing_body = [cmd for cmd in cmds if cmd.get("code") != CODE_END_OF_LIST]

    new_list = []
    # [0] Label HUD_TICK
    new_list.append(C(CODE_LABEL, 0, [HUD_TICK_LABEL]))
    # [1-3] Guard SW_PAUSED dentro do loop (Exit termina a run; parallel
    #       CE reinicia do topo no próximo frame, re-avaliando SW_PAUSED).
    new_list.append(C(CODE_CONDITIONAL_BRANCH, 0, list(BRANCH_SW_PAUSED_ON)))
    new_list.append(C(CODE_EXIT_EVENT, 1, []))
    new_list.append(C(CODE_BRANCH_END, 0, []))
    # [4..11] Corpo existente (8 cmds)
    new_list.extend(_deep_copy(existing_body))
    # [12-14] Re-bake pic 60 via TextPicture (cópia profunda p/ não compartilhar refs)
    new_list.extend(_deep_copy(TEXTPICTURE_HUD_TRIPLE))
    # [15] Wait 6 frames (10 Hz refresh — Implementation Guide §10.3)
    new_list.append(C(CODE_WAIT, 0, [HUD_REFRESH_FRAMES]))
    # [16] Jump HUD_TICK — fecha o loop
    new_list.append(C(CODE_JUMP_TO_LABEL, 0, [HUD_TICK_LABEL]))
    # [17] end-of-list
    new_list.append(C(CODE_END_OF_LIST, 0, []))

    ce6["trigger"] = 2
    ce6["switchId"] = SW_RACE_ACTIVE
    ce6["list"] = new_list

    return (
        f"applied (CE 6 converted to parallel switch={SW_RACE_ACTIVE}, "
        f"loop HUD_TICK + SW_PAUSED guard + pic {PIC_ID_HUD_TEXT} re-bake; "
        f"{len(new_list)} cmds)",
        ces,
    )


# =============================================================================
# Patch I-b — Remove `117 [6]` callers (CE 11/12/18)
# =============================================================================
def patch_i_b_remove_callers(ces):
    """Remove todas as chamadas `117 [6]` (Common Event 6) em CE 11/12/18.

    OBRIGATÓRIO após Patch I-a: com CE 6 em loop HUD_TICK infinito, qualquer
    `117 [6]` faria `setupChild` e o caller travaria no loop.

    Com CE 6 parallel, essas chamadas são redundantes (o loop auto-atualiza
    HUD a 10 Hz). Remover é correto e necessário.

    Idempotente: skipa se nenhuma chamada `117 [6]` existe em CE 11/12/18.
    """
    caller_indices = [
        (CE_INDEX_ON_SAFE, "EV_OnSafe"),
        (CE_INDEX_ON_RISK, "EV_OnRisk"),
        (CE_INDEX_CRASH, "EV_Crash"),
    ]

    removed_total = 0
    for ce_idx, ce_name in caller_indices:
        ce = ces[ce_idx]
        cmds = ce["list"]
        before = len(cmds)
        # Remove qualquer cmd code=117 parameters=[6]. Preserva os demais.
        ce["list"] = [
            cmd
            for cmd in cmds
            if not (
                cmd.get("code") == CODE_COMMON_EVENT_CALL
                and cmd.get("parameters") == [CE_INDEX_UPDATE_HUD]
            )
        ]
        removed = before - len(ce["list"])
        removed_total += removed

    if removed_total == 0:
        return ("skipped (no `117 [6]` callers in CE 11/12/18)", ces)

    return (
        f"applied (removed {removed_total} `117 [6]` caller(s) across "
        f"CE 11/12/18 — prevents parallel-CE hang from Patch I-a)",
        ces,
    )


# =============================================================================
# Patch J — Insert pic 60 re-show no CE 5 INIT após SW_RACE_ACTIVE ON
# =============================================================================
def patch_j_init_reshow_hud(ces):
    """Insere trio TextPicture + Show pic 60 imediatamente após SW_RACE_ACTIVE=ON
    no CE 5 (EV_RaceOrchestrator).

    Audit J exige que a PRIMEIRA Show Picture após o switch ON seja precedida
    por um Plugin Command (TextPicture). Hoje a primeira Show Picture é pic 20
    (bar bg), sem TextPicture antes — audit falha.

    Pós-Patch J:
      [N]   code 121: SW_RACE_ACTIVE = ON  (params [100,100,0])
      [N+1] code 357: TextPicture     (NOVO)
      [N+2] code 657:                 (NOVO)
      [N+3] code 231: pic 60          (NOVO — primeira Show Picture após switch)
      [N+4] code 231: pic 20          (bar bg, estava em N+1)
      ...

    Idempotente: skipa se cmds[sw_on_idx+1] já é 357 TextPicture.
    """
    ce5 = ces[CE_INDEX_ORCHESTRATOR]
    cmds = ce5["list"]

    # Localiza o ControlSwitch [100, 100, 0] = SW_RACE_ACTIVE = ON.
    sw_on_idx = -1
    for i, cmd in enumerate(cmds):
        if (
            cmd.get("code") == CODE_CONTROL_SWITCH
            and cmd.get("parameters") == [SW_RACE_ACTIVE, SW_RACE_ACTIVE, 0]
        ):
            sw_on_idx = i
            break

    if sw_on_idx == -1:
        return ("skipped (SW_RACE_ACTIVE ON not found in CE 5; manual review)", ces)

    # Idempotência: cmds[sw_on_idx+1] já é 357 TextPicture?
    next_cmd = cmds[sw_on_idx + 1] if sw_on_idx + 1 < len(cmds) else None
    if (
        next_cmd
        and next_cmd.get("code") == CODE_PLUGIN_CMD
        and next_cmd.get("parameters", [""])[0] == "TextPicture"
    ):
        return (
            f"skipped (CE 5 already has TextPicture right after SW_RACE_ACTIVE ON at cmd[{sw_on_idx + 1}])",
            ces,
        )

    # Insere o trio após sw_on_idx.
    insertion = _deep_copy(TEXTPICTURE_HUD_TRIPLE)
    for offset, cmd in enumerate(insertion, start=1):
        cmds.insert(sw_on_idx + offset, cmd)

    return (
        f"applied (inserted pic {PIC_ID_HUD_TEXT} re-show trio at cmd[{sw_on_idx + 1}..{sw_on_idx + 3}] "
        f"in CE 5, right after SW_RACE_ACTIVE ON; {len(cmds)} cmds)",
        ces,
    )


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

    print("--- Patch I-a: CE 6 — parallel + HUD_TICK + SW_PAUSED guard + pic 60 re-bake ---")
    result_ia, ces = patch_i_a_update_hud_parallel(ces)
    print(f"  Patch I-a: {result_ia}\n")
    applied_any |= result_ia.startswith("applied")

    print("--- Patch I-b: CE 11/12/18 — remove `117 [6]` callers ---")
    result_ib, ces = patch_i_b_remove_callers(ces)
    print(f"  Patch I-b: {result_ib}\n")
    applied_any |= result_ib.startswith("applied")

    print("--- Patch J: CE 5 — INIT re-show pic 60 after SW_RACE_ACTIVE ON ---")
    result_j, ces = patch_j_init_reshow_hud(ces)
    print(f"  Patch J: {result_j}\n")
    applied_any |= result_j.startswith("applied")

    if applied_any:
        _write_back(ces)
        print(f"JSON escrito: {CE_PATH}")
    else:
        print("Nenhuma mudança aplicada — JSON não regravado.")

    print("\n--- Snapshot final ---")
    for idx in (CE_INDEX_ORCHESTRATOR, CE_INDEX_UPDATE_HUD, CE_INDEX_ON_SAFE, CE_INDEX_ON_RISK, CE_INDEX_CRASH):
        ce = ces[idx]
        print(
            f"  CE[{idx:2}] {ce['name']!r:25} trigger={ce.get('trigger')} "
            f"switch={ce.get('switchId')} cmds={len(ce['list'])}"
        )


if __name__ == "__main__":
    main()
