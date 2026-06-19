"""
Fase 5 — Lógica de Estado e Resolução.

Estende / cria Common Events para implementar tasks 5.1-5.5:
  CE  6 (EV_UpdateHud)         — placeholder Comment para TextPicture (task 5.4)
  CE 11 (EV_OnSafe)            — lógica Safe completa (task 5.1)
  CE 12 (EV_OnRisk)            — lógica Risk completa (task 5.2)
  CE 14 (EV_ResolucaoSafe)     — NOVO: flash verde + unlock (task 5.3)
  CE 15 (EV_ResolucaoRiskOK)   — NOVO: flash dourado + shake + unlock (task 5.3)
  CE 16 (EV_HoverRiskButton)   — NOVO: Parallel com 3 níveis de hover (task 5.5)

Idempotente:
  Preserva slots 0-10 (placeholders/legados/EV_Preload/F3/F4 EV_RaceRenderer,
  EV_RenderSinal, EV_RenderCurva, EV_RaceTimer). Regenera 6, 11, 12 determini-
  sticamente. Cria 14, 15, 16 se não existirem (trunca o array em 14 antes de
  reapendar).

NÃO modifica:
  CE 1-5 (placeholders, acelerador, freio, EV_Preload, EV_RaceOrchestrator)
  CE 7-10 (EV_RaceRenderer, EV_RenderSinal, EV_RenderCurva, EV_RaceTimer)
  CE 13 (EV_KeyInput) — F4 canônico

Mapa de IDs (snapshot 2026-06-18 pós-F4 + setup_phase5_system.py):
  Variáveis Editor ID:
    100=VAR_RACE_ID        108=VAR_TIMER_FRAMES
    101=VAR_SCENE_INDEX    109=VAR_SCENE_START
    102=VAR_SCENE_TYPE     110=VAR_SEED
    103=VAR_P_CENA         111=VAR_RACE_N_CENAS
    104=VAR_CONSCIENCIA    112=VAR_ATTEMPT_N
    105=VAR_PONTOS_GLORIA  113=VAR_LAST_RENDERED_INDEX
    106=VAR_TAXA_SUCESSO   115=VAR_HOVER_LEVEL  (criado no setup_phase5_system.py)
    107=VAR_ROLL_RESULT    116=VAR_TIMER_TIMEOUT_FLAG
  Switches Editor ID:
    100=SW_RACE_ACTIVE     103=SW_LAST_ACTION_SAFE
    101=SW_INPUT_LOCKED    104=SW_PAUSED
    102=SW_CRASH_FLAG      105=SW_IS_CURVA_DIABO

Formatos MZ validados contra js/rmmz_objects.js (command111/121/122):
  If Switch ON:   [0, switchId, 0]
  If Switch OFF:  [0, switchId, 1]
  If Variable op: [1, varId, src(0=const|1=var), operand, op]
                  op 0=eq 1=ge 2=le 3=gt 4=lt 5=neq
  ControlVar:     [startId, endId, op(0=set|1=add|2=sub|3=mul|4=div|5=mod),
                   operandType(0=const), operand]
  ControlSwitch:  [startId, endId, state(0=ON|1=OFF)]  (MZ source: params[2] === 0 → ON)
  Tint Screen:    [[R, G, B,Intensity], duration(frames), preserveErase]
  Shake Screen:   [power, speed, duration, waitForCompletion]
"""

import json
import pathlib

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")


# =============================================================================
# Constantes — Variáveis e Switches (Editor IDs)
# =============================================================================
SW_RACE_ACTIVE = 100
SW_INPUT_LOCKED = 101
SW_CRASH_FLAG = 102
SW_LAST_ACTION_SAFE = 103
SW_IS_CURVA_DIABO = 105

VAR_RACE_ID = 100
VAR_SCENE_INDEX = 101
VAR_SCENE_TYPE = 102
VAR_P_CENA = 103
VAR_CONSCIENCIA = 104
VAR_PONTOS_GLORIA = 105
VAR_TAXA_SUCESSO = 106
VAR_ROLL_RESULT = 107
VAR_TIMER_FRAMES = 108
VAR_HOVER_LEVEL = 115
VAR_TIMER_TIMEOUT_FLAG = 116

# CE Editor IDs
CE_UPDATE_HUD = 6
CE_ON_SAFE = 11
CE_ON_RISK = 12
CE_RESOLUCAO_SAFE = 14
CE_RESOLUCAO_RISK_OK = 15
CE_HOVER_RISK_BUTTON = 16
CE_RESOLUCAO_RISK_FAIL = 17

# Hover — geometria do botão Furar (race/btn_furar.png = 160x80 em (440,500))
# Origem Upper-Left (0,0). Botões da Curva (Esquerda) usam mesma dimensão.
BTN_FURAR_X = 440
BTN_FURAR_Y = 500
BTN_FURAR_W = 160
BTN_FURAR_H = 80

# Botão Esquerda (Curva) — posição definida em EV_RenderCurva (F4)
BTN_ESQUERDA_X = 440
BTN_ESQUERDA_Y = 500
BTN_ESQUERDA_W = 160
BTN_ESQUERDA_H = 80

# Overlays de hover (pictures 22/23/24) — reuse dos assets F2 overlay_risk_*
# Largura 200, alturas 6/12/20. Posicionamos como faixa horizontal no topo do
# botão (alinhado ao centro-x do botão).
HOVER_PIC_L1 = "race/overlay_risk_low"
HOVER_PIC_L2 = "race/overlay_risk_med"
HOVER_PIC_L3 = "race/overlay_risk_high"
HOVER_OVERLAY_W = 200
HOVER_OVERLAY_OFFSET_X = (BTN_FURAR_W - HOVER_OVERLAY_W) // 2  # -20 → faixa centralizada
HOVER_OVERLAY_Y_TOP = BTN_FURAR_Y  # topo do botão


def C(code, indent, parameters=None):
    return {"code": code, "indent": indent, "parameters": parameters or []}


# =============================================================================
# CE 6: EV_UpdateHud (Call) — Task 5.4 parcial
# Mantém o script inline da barra de Consciência (F3). Adiciona Comment
# placeholder para o Plugin Command TextPicture (GLÓRIA: \V[105]) — manual MZ.
# =============================================================================
def build_update_hud_list():
    return [
        # HUD Consciência (F3 original — preservado)
        C(355, 0, [
            "const c = $gameVariables.value(104);"
            " const p = $gameScreen.picture(21);"
            " if (p) p.move(310, 18, Math.max(0, Math.min(100, c)), 100, 255, 0, 6);"
        ]),

        # Task 5.4 (manual MZ Editor): inserir aqui Plugin Commands:
        #   TextPicture > Set Text  text="GLÓRIA: \\V[105]"
        #   TextPicture > Show       pictureId=51, position=(560, 20)
        # O Plugin Command (code 357) tem schema opaco — não automatizável via
        # JSON direto. Documentado em fase-5-completa.md §Task 5.4 passo manual.
        C(108, 0, ["[TASK 5.4 MANUAL MZ] Inserir Plugin Command TextPicture: Set Text \"GLÓRIA: \\\\V[105]\" + Show (Pic ID 51, pos 560,20). Ver fase-5-completa.md."]),

        C(0, 0, []),
    ]


# =============================================================================
# CE 11: EV_OnSafe (Call) — Task 5.1
# F4 esqueleto (2 guardas + lock + Play SE) + lógica Safe completa.
# =============================================================================
def build_on_safe_list():
    return [
        # Guarda 1: fora de corrida
        C(111, 0, [0, SW_RACE_ACTIVE, 1]),
        C(115, 1, []),
        C(412, 0, []),

        # Guarda 2: input já locked (anti-re-entrada)
        C(111, 0, [0, SW_INPUT_LOCKED, 0]),
        C(115, 1, []),
        C(412, 0, []),

        # Lock imediato
        C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]),

        # F4.5: feedback sonoro
        C(250, 0, [{"name": "freada", "volume": 90, "pitch": 100, "pan": 0}]),

        # === Task 5.1 — Lógica Safe ===

        # Consciência: clamp em 100 via If/Else
        # If VAR_CONSCIENCIA <= 90 (op 2 = le): += 10
        C(111, 0, [1, VAR_CONSCIENCIA, 0, 90, 2]),
        C(122, 1, [VAR_CONSCIENCIA, VAR_CONSCIENCIA, 1, 0, 10]),
        C(411, 0, []),
        C(122, 1, [VAR_CONSCIENCIA, VAR_CONSCIENCIA, 0, 0, 100]),
        C(412, 0, []),

        # Glória += 10
        C(122, 0, [VAR_PONTOS_GLORIA, VAR_PONTOS_GLORIA, 1, 0, 10]),

        # Marca última ação como Safe (SW_LAST_ACTION_SAFE = ON)
        C(121, 0, [SW_LAST_ACTION_SAFE, SW_LAST_ACTION_SAFE, 0]),

        # Cena++ (DEPOIS de atualizar Consciência — armadilha da ordem §3.3.1)
        C(122, 0, [VAR_SCENE_INDEX, VAR_SCENE_INDEX, 1, 0, 1]),

        # Atualiza HUD (barra + Glória)
        C(117, 0, [CE_UPDATE_HUD]),

        # Resolução visual (flash verde + unlock) — task 5.3
        C(117, 0, [CE_RESOLUCAO_SAFE]),

        # Timeout flag reset (se veio de timeout do timer, limpa)
        C(111, 0, [1, VAR_TIMER_TIMEOUT_FLAG, 0, 1, 0]),
        C(122, 1, [VAR_TIMER_TIMEOUT_FLAG, VAR_TIMER_TIMEOUT_FLAG, 0, 0, 0]),
        C(412, 0, []),

        C(0, 0, []),
    ]


# =============================================================================
# CE 12: EV_OnRisk (Call) — Task 5.2
# F4 esqueleto (2 guardas + lock + Play SE) + lógica Risk completa.
# =============================================================================
def build_on_risk_list():
    return [
        # Guarda 1
        C(111, 0, [0, SW_RACE_ACTIVE, 1]),
        C(115, 1, []),
        C(412, 0, []),

        # Guarda 2
        C(111, 0, [0, SW_INPUT_LOCKED, 0]),
        C(115, 1, []),
        C(412, 0, []),

        # Lock imediato
        C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]),

        # F4.5: feedback sonoro
        C(250, 0, [{"name": "pneu_cantando", "volume": 90, "pitch": 100, "pan": 0}]),

        # === Task 5.2 — Lógica Risk ===

        # Passo 1: taxa = clamp(CONSCIENCIA + P_CENA, 0, 100)
        C(355, 0, [
            f"$gameVariables.setValue({VAR_TAXA_SUCESSO},"
            f" Math.max(0, Math.min(100,"
            f" $gameVariables.value({VAR_CONSCIENCIA})"
            f" + $gameVariables.value({VAR_P_CENA}))));"
        ]),

        # Passo 2: roll d100 (0..99)
        C(355, 0, [
            f"$gameVariables.setValue({VAR_ROLL_RESULT},"
            f" Math.floor(Math.random() * 100));"
        ]),

        # Passo 3: If ROLL < TAXA (sucesso)
        # [1, varRoll, 1, varTaxa, 4] → var op=lt(4): roll < taxa
        C(111, 0, [1, VAR_ROLL_RESULT, 1, VAR_TAXA_SUCESSO, 4]),

        # --- Ramo SUCESSO (indent 1) ---
        # Custo: CONSCIENCIA = max(0, current - P_CENA) via If/Else
        C(111, 1, [1, VAR_CONSCIENCIA, 1, VAR_P_CENA, 1]),  # cons >= p_cena
        C(122, 2, [VAR_CONSCIENCIA, VAR_CONSCIENCIA, 2, 1, VAR_P_CENA]),
        C(411, 1, []),
        C(122, 2, [VAR_CONSCIENCIA, VAR_CONSCIENCIA, 0, 0, 0]),
        C(412, 1, []),

        # Glória += P_CENA * 2 (Script — ControlVar não aceita expr composta)
        C(355, 1, [
            f"$gameVariables.setValue({VAR_PONTOS_GLORIA},"
            f" $gameVariables.value({VAR_PONTOS_GLORIA})"
            f" + $gameVariables.value({VAR_P_CENA}) * 2);"
        ]),

        # SW_LAST_ACTION_SAFE = OFF (última ação foi Risk, não Safe)
        C(121, 1, [SW_LAST_ACTION_SAFE, SW_LAST_ACTION_SAFE, 1]),

        # Cena++ (após custo — armadilha da ordem)
        C(122, 1, [VAR_SCENE_INDEX, VAR_SCENE_INDEX, 1, 0, 1]),

        # HUD + resolução
        C(117, 1, [CE_UPDATE_HUD]),
        C(117, 1, [CE_RESOLUCAO_RISK_OK]),

        # Timeout flag reset
        C(111, 1, [1, VAR_TIMER_TIMEOUT_FLAG, 0, 1, 0]),
        C(122, 2, [VAR_TIMER_TIMEOUT_FLAG, VAR_TIMER_TIMEOUT_FLAG, 0, 0, 0]),
        C(412, 1, []),

        C(411, 0, []),

        # --- Ramo FALHA (indent 1) ---
        # Custo: CONSCIENCIA = max(0, current - P_CENA) — mesmo no crash
        C(111, 1, [1, VAR_CONSCIENCIA, 1, VAR_P_CENA, 1]),
        C(122, 2, [VAR_CONSCIENCIA, VAR_CONSCIENCIA, 2, 1, VAR_P_CENA]),
        C(411, 1, []),
        C(122, 2, [VAR_CONSCIENCIA, VAR_CONSCIENCIA, 0, 0, 0]),
        C(412, 1, []),

        # SW_CRASH_FLAG = ON (crash — F6 EV_Crash consome esta flag)
        C(121, 1, [SW_CRASH_FLAG, SW_CRASH_FLAG, 0]),

        # Task 5.6: Call EV_ResolucaoRiskFail (CE 17) para destravar input +
        # feedback audível/tátil. F6 substituirá este Call por encadeamento
        # CE 12 FAIL → CE 17 → EV_Crash quando a animação de crash chegar.
        C(117, 1, [CE_RESOLUCAO_RISK_FAIL]),

        # Call EV_Crash — task 6.1 (ainda não existe; Comment placeholder)
        # Quando task 6.1 criar o CE, trocar o Comment por: C(117, 1, [CE_CRASH])
        C(108, 1, ["[TASK 6.1 PENDENTE] Call EV_Crash aqui quando F6 criar o CE."]),

        C(412, 0, []),

        C(0, 0, []),
    ]


# =============================================================================
# CE 14: EV_ResolucaoSafe (Call) — Task 5.3
# Flash verde via Tint Screen + unlock. Duração total ~20 frames.
# (Pictures overlay_flash_green/gold não existem — fallback Tint Screen,
#  conforme note em task-5.3.md.)
# =============================================================================
def build_resolucao_safe_list():
    return [
        # Flash verde: Tint Screen verde por 8 frames
        # [R, G, B, Intensity], duration, preserveErase
        # Verde suave: R=-200 G=0 B=-200 Intensity=0 → tinta verde sobre a cena
        C(223, 0, [[-200, 0, -200, 0], 8, False]),

        # Reset Tint para normal em 12 frames (~0,2s)
        C(223, 0, [[0, 0, 0, 0], 12, False]),

        # Wait 12 frames para cobrir toda a transição
        C(230, 0, [12]),

        # Destravar input (SW_INPUT_LOCKED = OFF)
        C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1]),

        C(0, 0, []),
    ]


# =============================================================================
# CE 15: EV_ResolucaoRiskOK (Call) — Task 5.3
# Flash dourado + Shake + unlock. Duração total ~24 frames.
# =============================================================================
def build_resolucao_risk_ok_list():
    return [
        # Flash dourado intenso: Tint Screen por 6 frames
        # Dourado = reduzir B fortemente, manter R e G em ~0 → amarelado
        C(223, 0, [[0, 0, -255, 0], 6, False]),

        # Shake Screen: power 3, speed 5, duration 8 frames, sem wait
        # params: [power, speed, duration, waitForCompletion]
        # (MZ canônico: 225=Shake Screen, 250=Play SE — não confundir.)
        C(225, 0, [3, 5, 8, False]),

        # Reset Tint para normal em 18 frames
        C(223, 0, [[0, 0, 0, 0], 18, False]),

        # Wait 18 frames para cobrir toda a transição
        C(230, 0, [18]),

        # Destravar input (SW_INPUT_LOCKED = OFF)
        C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1]),

        C(0, 0, []),
    ]


# =============================================================================
# CE 16: EV_HoverRiskButton (Parallel, switchId=SW_RACE_ACTIVE) — Task 5.5
# Detecta hover no botão Furar (42) ou Esquerda (44) via TouchInput.x/y.
# Calcula nível 0/1/2/3 baseado em VAR_TAXA_SUCESSO (106).
# Mostra overlay 22/23/24 conforme nível.
# =============================================================================
def build_hover_risk_button_list():
    return [
        C(118, 0, ["HOVER_LOOP"]),

        # Guarda: input locked → apaga overlays e espera (sem hover durante resolução)
        C(111, 0, [0, SW_INPUT_LOCKED, 0]),
        C(235, 1, [22]),
        C(235, 1, [23]),
        C(235, 1, [24]),
        C(355, 1, [f"$gameVariables.setValue({VAR_HOVER_LEVEL}, 0);"]),
        C(230, 1, [1]),
        C(119, 1, ["HOVER_LOOP"]),
        C(412, 0, []),

        # Detecção de hover — Script inline computa VAR_HOVER_LEVEL (115)
        # Verifica botão 42 (Furar/Sinal) e 44 (Esquerda/Curva).
        # Thresholds: >=70 suave (1), 40..69 médio (2), <40 intenso (3).
        C(355, 0, [
            f"const p = $gameScreen.picture(42) || $gameScreen.picture(44);"
            f" let nivel = 0;"
            f" if (p) {{"
            f"   const bx = (p === $gameScreen.picture(42)) ? {BTN_FURAR_X} : {BTN_ESQUERDA_X};"
            f"   const by = (p === $gameScreen.picture(42)) ? {BTN_FURAR_Y} : {BTN_ESQUERDA_Y};"
            f"   const bw = {BTN_FURAR_W};"
            f"   const bh = {BTN_FURAR_H};"
            f"   const tx = TouchInput.x;"
            f"   const ty = TouchInput.y;"
            f"   const isHover = (tx >= bx && tx <= bx + bw && ty >= by && ty <= by + bh);"
            f"   if (isHover) {{"
            f"     const taxa = $gameVariables.value({VAR_TAXA_SUCESSO});"
            f"     nivel = (taxa >= 70) ? 1 : (taxa >= 40) ? 2 : 3;"
            f"   }}"
            f" }}"
            f" $gameVariables.setValue({VAR_HOVER_LEVEL}, nivel);"
        ]),

        # === Branches por nível ===

        # Nível 0: apaga todos overlays
        C(111, 0, [1, VAR_HOVER_LEVEL, 0, 0, 0]),
        C(235, 1, [22]),
        C(235, 1, [23]),
        C(235, 1, [24]),
        C(412, 0, []),

        # Nível 1: apaga 23/24, mostra 22
        C(111, 0, [1, VAR_HOVER_LEVEL, 0, 1, 0]),
        C(235, 1, [23]),
        C(235, 1, [24]),
        C(231, 1, [22, HOVER_PIC_L1, 0, 0,
                    BTN_FURAR_X + HOVER_OVERLAY_OFFSET_X, HOVER_OVERLAY_Y_TOP,
                    100, 100, 80, 0]),
        C(412, 0, []),

        # Nível 2: apaga 22/24, mostra 23
        C(111, 0, [1, VAR_HOVER_LEVEL, 0, 2, 0]),
        C(235, 1, [22]),
        C(235, 1, [24]),
        C(231, 1, [23, HOVER_PIC_L2, 0, 0,
                    BTN_FURAR_X + HOVER_OVERLAY_OFFSET_X, HOVER_OVERLAY_Y_TOP,
                    100, 100, 140, 0]),
        C(412, 0, []),

        # Nível 3: apaga 22/23, mostra 24
        C(111, 0, [1, VAR_HOVER_LEVEL, 0, 3, 0]),
        C(235, 1, [22]),
        C(235, 1, [23]),
        C(231, 1, [24, HOVER_PIC_L3, 0, 0,
                    BTN_FURAR_X + HOVER_OVERLAY_OFFSET_X, HOVER_OVERLAY_Y_TOP,
                    100, 100, 220, 0]),
        C(412, 0, []),

        C(230, 0, [1]),
        C(119, 0, ["HOVER_LOOP"]),

        C(0, 0, []),
    ]


# =============================================================================
# CE 17: EV_ResolucaoRiskFail (Call) — Task 5.6 (bugfix pós-playtest)
# Bridge para F6 EV_Crash. Destrava SW_INPUT_LOCKED + feedback audível/tátil.
# Duração total ~8 frames (Shake). Buzzer1 já confirmado audível em playtest.
# Ref: rmmz_objects.js:10172 (code 121 params[2]=0 → ON, 1 → OFF).
# =============================================================================
def build_resolucao_risk_fail_list():
    return [
        # Play SE: Buzzer1 (failure audible — confirmado em playtest anterior)
        C(250, 0, [{"name": "Buzzer1", "volume": 80, "pitch": 100, "pan": 0}]),

        # Shake Screen: power 5, speed 5, 8 frames, sem wait
        # params: [power, speed, duration, waitForCompletion]
        C(225, 0, [5, 5, 8, False]),

        # Destravar input (SW_INPUT_LOCKED = OFF) — correção central do bug
        C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1]),

        C(0, 0, []),
    ]


# =============================================================================
# Main — validação e escrita
# =============================================================================
def assert_name(ce, slot, expected):
    actual = ce[slot].get("name") if (ce[slot] and isinstance(ce[slot], dict)) else None
    assert actual == expected, (
        f"CE[{slot}] deveria ser {expected!r}, é {actual!r}"
    )


def main():
    ces = json.loads(CE_PATH.read_text(encoding="utf-8"))

    # Preservados (apenas validados, não regenerados):
    #   0=null, 1=acelerador, 2=freio, 3=EV_Preload, 4="", 5=EV_RaceOrchestrator,
    #   7=EV_RaceRenderer, 8=EV_RenderSinal, 9=EV_RenderCurva, 10=EV_RaceTimer,
    #   13=EV_KeyInput
    expected_preserved = [
        (0, None),
        (1, "acelerador"),
        (2, "freio"),
        (3, "EV_Preload"),
        (4, ""),
        (5, "EV_RaceOrchestrator"),
        (7, "EV_RaceRenderer"),
        (8, "EV_RenderSinal"),
        (9, "EV_RenderCurva"),
        (10, "EV_RaceTimer"),
        (13, "EV_KeyInput"),
    ]
    for slot, expected in expected_preserved:
        if slot >= len(ces) or ces[slot] is None:
            actual = None
        else:
            actual = ces[slot].get("name")
        if expected is None:
            assert actual is None, f"CE[{slot}] deveria ser null, é {actual!r}"
        else:
            assert actual == expected, (
                f"CE[{slot}] deveria ser {expected!r}, é {actual!r}"
            )

    # Substitui CE 6 (EV_UpdateHud) — task 5.4 placeholder
    ces[CE_UPDATE_HUD] = {
        "id": CE_UPDATE_HUD,
        "list": build_update_hud_list(),
        "name": "EV_UpdateHud",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": "",
    }

    # Substitui CE 11 (EV_OnSafe) — task 5.1
    ces[CE_ON_SAFE] = {
        "id": CE_ON_SAFE,
        "list": build_on_safe_list(),
        "name": "EV_OnSafe",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": "",
    }

    # Substitui CE 12 (EV_OnRisk) — task 5.2
    ces[CE_ON_RISK] = {
        "id": CE_ON_RISK,
        "list": build_on_risk_list(),
        "name": "EV_OnRisk",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": "",
    }

    # Trunca para 14 elementos e adiciona 14/15/16/17
    ces = ces[:CE_RESOLUCAO_SAFE]

    ces.append({
        "id": CE_RESOLUCAO_SAFE,
        "list": build_resolucao_safe_list(),
        "name": "EV_ResolucaoSafe",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": "",
    })

    ces.append({
        "id": CE_RESOLUCAO_RISK_OK,
        "list": build_resolucao_risk_ok_list(),
        "name": "EV_ResolucaoRiskOK",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": "",
    })

    ces.append({
        "id": CE_HOVER_RISK_BUTTON,
        "list": build_hover_risk_button_list(),
        "name": "EV_HoverRiskButton",
        "trigger": 2,
        "switchId": SW_RACE_ACTIVE,
        "autoErase": False,
        "conditionString": "",
    })

    ces.append({
        "id": CE_RESOLUCAO_RISK_FAIL,
        "list": build_resolucao_risk_fail_list(),
        "name": "EV_ResolucaoRiskFail",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": "",
    })

    CE_PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"CommonEvents.json salvo — {len(ces)} slots totais\n")
    print("CE layout final:")
    for ce in ces:
        if ce is None:
            continue
        if isinstance(ce, dict) and "name" in ce:
            print(
                f"  CE {ce.get('id')}: {ce['name']!r:25} "
                f"trigger={ce['trigger']} cmds={len(ce.get('list', []))}"
            )


if __name__ == "__main__":
    main()
