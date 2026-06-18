"""
Fase 4 — Cria os Common Events 10-13 e estende CE 7-9 com botões clicáveis.

Cria (CE Editor IDs novos —atenção: a documentação pré-F4 dizia 11-14, mas o
RMMZ acessa $dataCommonEvents[id] diretamente; os CEs da F3 vivem em 5-9, então
F4 usa 10-13):
  CE 10: EV_RaceTimer   (Parallel, switchId=SW_RACE_ACTIVE)
  CE 11: EV_OnSafe      (Call)
  CE 12: EV_OnRisk      (Call)
  CE 13: EV_KeyInput    (Parallel, switchId=SW_RACE_ACTIVE)

Estende:
  CE 7  (EV_RaceRenderer)  — adiciona Erase Picture 41-44 ao trocar de cena
  CE 8  (EV_RenderSinal)   — adiciona Pictures 41/42 + bind via Script (CE 11/12)
  CE 9  (EV_RenderCurva)   — adiciona Pictures 43/44 + bind via Script (CE 11/12)

Idempotente:
  Reexecutar o script regenera CE 7-13 de forma determinística. CE 5/6 (F3)
  são apenas validados — não modificados.

Formatos MZ validados contra js/rmmz_objects.js (command111):
  If Switch ON:   [0, switchId, 0]
  If Switch OFF:  [0, switchId, 1]
  If Variable op: [1, varId, src(0=const|1=var), operand, op]
                   op 0=eq 1=ge 2=le 3=gt 4=lt 5=neq

Convenção de IDs (fonte: System.json + rmmz_objects.js:691,723):
  Variáveis 100-113 + 116 (VAR_TIMER_TIMEOUT_FLAG)
  Switches  100-105
"""

import json
import pathlib

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")


# =============================================================================
# Constantes MZ
# =============================================================================
SW_RACE_ACTIVE = 100
SW_INPUT_LOCKED = 101
SW_CRASH_FLAG = 102
SW_IS_CURVA_DIABO = 105

VAR_RACE_ID = 100
VAR_SCENE_INDEX = 101
VAR_SCENE_TYPE = 102
VAR_P_CENA = 103
VAR_CONSCIENCIA = 104
VAR_PONTOS_GLORIA = 105
VAR_TIMER_FRAMES = 108
VAR_SCENE_START = 109
VAR_SEED = 110
VAR_RACE_N_CENAS = 111
VAR_ATTEMPT_N = 112
VAR_LAST_RENDERED_INDEX = 113
VAR_TIMER_TIMEOUT_FLAG = 116

CE_PRELOAD = 3
CE_RENDER_SINAL = 8
CE_RENDER_CURVA = 9
CE_RACE_TIMER = 10
CE_ON_SAFE = 11
CE_ON_RISK = 12
CE_KEY_INPUT = 13


def C(code, indent, parameters=None):
    return {"code": code, "indent": indent, "parameters": parameters or []}


# =============================================================================
# CE 7: EV_RaceRenderer (Parallel, switchId=SW_RACE_ACTIVE)
# F3 base + F4 extensão: Erase Picture 41-44 ao detectar mudança de cena
# =============================================================================
def build_renderer_list():
    return [
        C(118, 0, ["RENDER_LOOP"]),

        C(111, 0, [0, SW_RACE_ACTIVE, 1]),
        C(115, 1, []),
        C(412, 0, []),

        C(111, 0, [1, VAR_SCENE_INDEX, 1, VAR_LAST_RENDERED_INDEX, 5]),
        C(122, 1, [VAR_LAST_RENDERED_INDEX, VAR_LAST_RENDERED_INDEX, 0, 1, VAR_SCENE_INDEX]),

        # === Limpeza F3: pictures da cena anterior ===
        C(235, 1, [10]),
        C(235, 1, [11]),
        C(235, 1, [12]),
        # === F4: limpeza dos botões 41-44 ===
        C(235, 1, [41]),
        C(235, 1, [42]),
        C(235, 1, [43]),
        C(235, 1, [44]),

        # === Determinação do tipo da cena ===
        C(111, 1, [12, f"$gameVariables.value({VAR_RACE_ID}) === 3 && $gameVariables.value({VAR_SCENE_INDEX}) === 9"]),
        C(122, 2, [VAR_SCENE_TYPE, VAR_SCENE_TYPE, 0, 0, 2]),
        C(122, 2, [VAR_P_CENA, VAR_P_CENA, 0, 0, 100]),
        C(121, 2, [SW_IS_CURVA_DIABO, SW_IS_CURVA_DIABO, 0]),
        C(411, 1, []),
        C(355, 2, [f"$gameVariables.setValue({VAR_SCENE_TYPE}, JhonnyRace.rollSceneType());"]),
        C(355, 2, [f"$gameVariables.setValue({VAR_P_CENA}, JhonnyRace.rollPCena());"]),
        C(121, 2, [SW_IS_CURVA_DIABO, SW_IS_CURVA_DIABO, 1]),
        C(412, 1, []),

        # === Renderiza cena ===
        C(111, 1, [1, VAR_SCENE_TYPE, 0, 0, 0]),
        C(117, 2, [CE_RENDER_SINAL]),
        C(411, 1, []),
        C(117, 2, [CE_RENDER_CURVA]),
        C(412, 1, []),

        # === Configura timer ===
        C(111, 1, [1, VAR_SCENE_TYPE, 0, 0, 0]),
        C(122, 2, [VAR_TIMER_FRAMES, VAR_TIMER_FRAMES, 0, 0, 240]),
        C(411, 1, []),
        C(122, 2, [VAR_TIMER_FRAMES, VAR_TIMER_FRAMES, 0, 0, 210]),
        C(412, 1, []),

        C(355, 1, [f"$gameVariables.setValue({VAR_SCENE_START}, Graphics.frameCount);"]),

        # === Setup 18 frames com input locked ===
        C(121, 1, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]),
        C(230, 1, [18]),
        C(121, 1, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1]),

        C(412, 0, []),

        C(230, 0, [1]),
        C(119, 0, ["RENDER_LOOP"]),

        C(0, 0, []),
    ]


# =============================================================================
# CE 8: EV_RenderSinal (Call) — F3 base + F4 botões 41/42
# =============================================================================
def build_render_sinal_list():
    return [
        # F3: fundo + ator + sinal
        C(231, 0, [1,  "race/bg_sinal",   0, 0,   0,   0, 100, 100, 255, 0]),
        C(231, 0, [10, "race/opala_pov",  0, 0,   0,   0, 100, 100, 255, 0]),
        C(231, 0, [11, "race/sinal_red",  0, 0, 308,  80, 100, 100, 255, 0]),

        # F4: botões da cena de Sinal
        # btn_parar (Picture 41) → EV_OnSafe (CE 11); btn_furar (42) → EV_OnRisk (CE 12)
        C(231, 0, [41, "race/btn_parar",  0, 0, 220, 500, 100, 100, 255, 0]),
        C(231, 0, [42, "race/btn_furar",  0, 0, 440, 500, 100, 100, 255, 0]),

        # Bind via Script: mzkp_commonEventId é a propriedade que ButtonPicture.js lê
        # em Sprite_Picture.isClickEnabled e onClick (ver js/plugins/ButtonPicture.js)
        C(355, 0, [
            "const p1 = $gameScreen.picture(41);"
            " if (p1) p1.mzkp_commonEventId = 11;"  # EV_OnSafe
        ]),
        C(355, 0, [
            "const p2 = $gameScreen.picture(42);"
            " if (p2) p2.mzkp_commonEventId = 12;"  # EV_OnRisk
        ]),

        C(0, 0, []),
    ]


# =============================================================================
# CE 9: EV_RenderCurva (Call) — F3 base + F4 botões 43/44
# =============================================================================
def build_render_curva_list():
    return [
        # F3: fundo + ator + placa normal
        C(231, 0, [1,  "race/bg_curva",         0, 0,   0,   0, 100, 100, 255, 0]),
        C(231, 0, [10, "race/opala_pov",        0, 0,   0,   0, 100, 100, 255, 0]),
        C(231, 0, [11, "race/placa_curva_dir",  0, 0, 600, 100, 100, 100, 255, 0]),

        # F3: placa Curva do Diabo condicional
        C(111, 0, [0, SW_IS_CURVA_DIABO, 0]),
        C(231, 1, [12, "race/curva_do_diabo_placa", 0, 0, 308,  80, 100, 100, 255, 0]),
        C(412, 0, []),

        # F4: botões da cena de Curva
        # btn_direita (Picture 43) → EV_OnSafe (CE 11); btn_esquerda (44) → EV_OnRisk (CE 12)
        C(231, 0, [43, "race/btn_direita",   0, 0, 220, 500, 100, 100, 255, 0]),
        C(231, 0, [44, "race/btn_esquerda",  0, 0, 440, 500, 100, 100, 255, 0]),

        C(355, 0, [
            "const p3 = $gameScreen.picture(43);"
            " if (p3) p3.mzkp_commonEventId = 11;"  # EV_OnSafe
        ]),
        C(355, 0, [
            "const p4 = $gameScreen.picture(44);"
            " if (p4) p4.mzkp_commonEventId = 12;"  # EV_OnRisk
        ]),

        C(0, 0, []),
    ]


# =============================================================================
# CE 10: EV_RaceTimer (Parallel, switchId=SW_RACE_ACTIVE)
# Único escritor de VAR_TIMER_FRAMES (decremento) e VAR_TIMER_TIMEOUT_FLAG (set 1)
# =============================================================================
def build_race_timer_list():
    return [
        C(118, 0, ["TICK"]),

        # Guarda 1: fora de corrida
        C(111, 0, [0, SW_RACE_ACTIVE, 1]),
        C(115, 1, []),
        C(412, 0, []),

        # Guarda 2: input locked (setup ou resolução) — pausa timer
        C(111, 0, [0, SW_INPUT_LOCKED, 0]),
        C(230, 1, [1]),
        C(119, 1, ["TICK"]),
        C(412, 0, []),

        # Guarda 3: já expirou (evita underflow)
        C(111, 0, [1, VAR_TIMER_FRAMES, 0, 0, 2]),  # var <= 0 (op 2 = le)
        C(230, 1, [1]),
        C(119, 1, ["TICK"]),
        C(412, 0, []),

        # Decremento: VAR_TIMER_FRAMES -= 1
        # command122 params: [startId, endId, operationType(0=set|1=add|2=sub|3=mul|4=div|5=mod),
        #                     operandType(0=const), operand]
        C(122, 0, [VAR_TIMER_FRAMES, VAR_TIMER_FRAMES, 2, 0, 1]),

        # Detecção de timeout
        C(111, 0, [1, VAR_TIMER_FRAMES, 0, 0, 0]),  # var == 0 (op 0 = eq)
        C(122, 1, [VAR_TIMER_TIMEOUT_FLAG, VAR_TIMER_TIMEOUT_FLAG, 0, 0, 1]),  # = 1
        C(117, 1, [CE_ON_SAFE]),  # Call EV_OnSafe
        C(412, 0, []),

        C(230, 0, [1]),
        C(119, 0, ["TICK"]),

        C(0, 0, []),
    ]


# =============================================================================
# CE 11: EV_OnSafe (Call) — esqueleto com 3 guardas
# =============================================================================
def build_on_safe_list():
    return [
        C(111, 0, [0, SW_RACE_ACTIVE, 1]),
        C(115, 1, []),
        C(412, 0, []),

        C(111, 0, [0, SW_INPUT_LOCKED, 0]),
        C(115, 1, []),
        C(412, 0, []),

        # Lock imediato (anti-re-entrada)
        C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]),

        # F4.5: feedback sonoro — Play SE: freada (code 250)
        # Regra user-testable-feedback: validação manual não pode depender de F12/F9
        C(250, 0, [{"name": "freada", "volume": 90, "pitch": 100, "pan": 0}]),

        # Placeholder task 5.1 — lógica Safe vai aqui:
        #   VAR_CONSCIENCIA (104) = min(100, value(104) + 10)
        #   VAR_PONTOS_GLORIA (105) += 10
        #   VAR_SCENE_INDEX (101) += 1
        #   Call EV_UpdateHud (CE 6)
        #   Call EV_ResolucaoSafe (task 5.3)
        #   If VAR_TIMER_TIMEOUT_FLAG (116) == 1: reset para 0

        C(0, 0, []),
    ]


# =============================================================================
# CE 12: EV_OnRisk (Call) — esqueleto com 3 guardas
# =============================================================================
def build_on_risk_list():
    return [
        C(111, 0, [0, SW_RACE_ACTIVE, 1]),
        C(115, 1, []),
        C(412, 0, []),

        C(111, 0, [0, SW_INPUT_LOCKED, 0]),
        C(115, 1, []),
        C(412, 0, []),

        C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]),

        # F4.5: feedback sonoro — Play SE: pneu_cantando (code 250)
        # Regra user-testable-feedback: validação manual não pode depender de F12/F9
        C(250, 0, [{"name": "pneu_cantando", "volume": 90, "pitch": 100, "pan": 0}]),

        # Placeholder task 5.2 — lógica Risk vai aqui:
        #   VAR_TAXA_SUCESSO (106) = min(100, value(104) + value(103))
        #   VAR_ROLL_RESULT (107) = JhonnyRace.rollD100()
        #   If VAR_ROLL_RESULT < VAR_TAXA_SUCESSO:
        #     VAR_PONTOS_GLORIA (105) += value(103) * 2
        #     VAR_CONSCIENCIA (104) = max(0, value(104) - value(103))
        #     VAR_SCENE_INDEX (101) += 1
        #     Call EV_ResolucaoRiskOK (task 5.3)
        #   Else:
        #     VAR_CONSCIENCIA (104) = max(0, value(104) - value(103))
        #     SW_CRASH_FLAG (102) = ON
        #     Call EV_Crash (task 6.1)

        C(0, 0, []),
    ]


# =============================================================================
# CE 13: EV_KeyInput (Parallel, switchId=SW_RACE_ACTIVE)
# Captura setas + WASD, ramifica por VAR_SCENE_TYPE, dispara EV_OnSafe/EV_OnRisk
# =============================================================================
def build_key_input_list():
    return [
        C(118, 0, ["KEY_LOOP"]),

        C(111, 0, [0, SW_RACE_ACTIVE, 1]),
        C(115, 1, []),
        C(412, 0, []),

        # Captura + dispatch em um único Script (mais eficiente que 4 If aninhados)
        # VAR_SCENE_TYPE (102) == 0 → Sinal: down=Safe, up=Risk
        # VAR_SCENE_TYPE (102) != 0 → Curva: right=Safe, left=Risk
        C(355, 0, [
            "if ($gameVariables.value(102) === 0) {"
            f"  if (Input.isTriggered('down')) $gameTemp.reserveCommonEvent({CE_ON_SAFE});"
            f"  if (Input.isTriggered('up'))   $gameTemp.reserveCommonEvent({CE_ON_RISK});"
            "} else {"
            f"  if (Input.isTriggered('right')) $gameTemp.reserveCommonEvent({CE_ON_SAFE});"
            f"  if (Input.isTriggered('left'))  $gameTemp.reserveCommonEvent({CE_ON_RISK});"
            "}"
        ]),

        C(230, 0, [1]),
        C(119, 0, ["KEY_LOOP"]),

        C(0, 0, []),
    ]


# =============================================================================
# Main
# =============================================================================
def main():
    ces = json.loads(CE_PATH.read_text(encoding="utf-8"))

    # Valida slots 0-6 (preservados — F2/F3 canônicos)
    expected_prefix = [
        (0, None),
        (1, "acelerador"),
        (2, "freio"),
        (3, "EV_Preload"),
        (4, ""),
        (5, "EV_RaceOrchestrator"),
        (6, "EV_UpdateHud"),
    ]
    for slot, expected_name in expected_prefix:
        if slot >= len(ces) or ces[slot] is None:
            actual = None
        else:
            actual = ces[slot].get("name")
        if expected_name is None:
            assert actual is None, f"CE[{slot}] deveria ser null, é {actual!r}"
        else:
            assert actual == expected_name, (
                f"CE[{slot}] deveria ser {expected_name!r}, é {actual!r}"
            )

    # Trunca tudo após índice 6 — regenera 7-13
    ces = ces[:7]

    # CE 7: EV_RaceRenderer (Parallel, switchId=SW_RACE_ACTIVE)
    ces.append({
        "id": 7,
        "list": build_renderer_list(),
        "name": "EV_RaceRenderer",
        "trigger": 2,
        "switchId": SW_RACE_ACTIVE,
        "autoErase": False,
        "conditionString": ""
    })

    # CE 8: EV_RenderSinal (Call)
    ces.append({
        "id": 8,
        "list": build_render_sinal_list(),
        "name": "EV_RenderSinal",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": ""
    })

    # CE 9: EV_RenderCurva (Call)
    ces.append({
        "id": 9,
        "list": build_render_curva_list(),
        "name": "EV_RenderCurva",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": ""
    })

    # CE 10: EV_RaceTimer (Parallel, switchId=SW_RACE_ACTIVE)
    ces.append({
        "id": 10,
        "list": build_race_timer_list(),
        "name": "EV_RaceTimer",
        "trigger": 2,
        "switchId": SW_RACE_ACTIVE,
        "autoErase": False,
        "conditionString": ""
    })

    # CE 11: EV_OnSafe (Call)
    ces.append({
        "id": 11,
        "list": build_on_safe_list(),
        "name": "EV_OnSafe",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": ""
    })

    # CE 12: EV_OnRisk (Call)
    ces.append({
        "id": 12,
        "list": build_on_risk_list(),
        "name": "EV_OnRisk",
        "trigger": 0,
        "switchId": 1,
        "autoErase": False,
        "conditionString": ""
    })

    # CE 13: EV_KeyInput (Parallel, switchId=SW_RACE_ACTIVE)
    ces.append({
        "id": 13,
        "list": build_key_input_list(),
        "name": "EV_KeyInput",
        "trigger": 2,
        "switchId": SW_RACE_ACTIVE,
        "autoErase": False,
        "conditionString": ""
    })

    CE_PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"CommonEvents.json salvo — {len(ces)} slots totais")
    for ce in ces:
        if ce is None:
            continue
        if isinstance(ce, dict) and "name" in ce:
            print(f"  CE ID {ce.get('id')}: {ce['name']!r} trigger={ce['trigger']} cmds={len(ce.get('list', []))}")


if __name__ == "__main__":
    main()
