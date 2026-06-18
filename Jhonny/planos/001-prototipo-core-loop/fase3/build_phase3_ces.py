"""
Fase 3 — Cria os Common Events do core loop da Corrida no projeto Jhonny.

Cria:
  CE ID 5: EV_RaceOrchestrator  (trigger Call)
  CE ID 6: EV_UpdateHud          (trigger Call)
  CE ID 7: EV_RaceRenderer       (trigger Parallel, switchId 100)
  CE ID 8: EV_RenderSinal        (trigger Call)
  CE ID 9: EV_RenderCurva        (trigger Call)

Formatos MZ validados contra js/rmmz_objects.js:
  ControlSwitch (121):  [startId, endId, op]  op 0=ON, 1=OFF
  ControlVariable(122): [startId, endId, opType, operandType, ...operand]
                          opType 0=set 1=add  operandType 0=const 1=var
  If (111) switch:      [0, switchId, value]  value 0=is-ON, 1=is-OFF
  If (111) variable:    [1, varId, src, value, op]
                          src 0=const 1=var  op 0=eq 1=ge 2=le 3=gt 4=lt 5=neq
  If (111) script:      [12, "js code"]  (eval result becomes branch result)
  Show Picture (231):   [picId, name, origin, posType, x, y, scaleX, scaleY, opacity, blend]
                          origin 0=UpperLeft 1=Center; posType 0=direct 1=by-var
  Move Picture (232):   [picId, origin, posType, x, y, scaleX, scaleY, opacity, blend, duration, wait, easing]
  Tint Screen (223):    [[r,g,b,gray], duration, wait]  r,g,b,gray in -255..255
  Fadein Screen (222):  Ignora params nesta versão do MZ (sempre 24 frames). Para fade custom, usar Script.

Convenção real neste projeto:
  Variáveis: 100=VAR_RACE_ID 101=VAR_SCENE_INDEX 102=VAR_SCENE_TYPE 103=VAR_P_CENA
             104=VAR_CONSCIENCIA 105=VAR_PONTOS_GLORIA 108=VAR_TIMER_FRAMES
             109=VAR_SCENE_START 110=VAR_SEED 111=VAR_RACE_N_CENAS
             112=VAR_ATTEMPT_N 113=VAR_LAST_RENDERED_INDEX
  Switches:  100=SW_RACE_ACTIVE 101=SW_INPUT_LOCKED 105=SW_IS_CURVA_DIABO
"""

import json, pathlib

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")
ces = json.loads(CE_PATH.read_text())

# Idempotência: preservar slots 0-4 (CEs originais) e truncar quaisquer CEs F3 recriados abaixo.
KEEP = 5  # slots 0-4 são CANÔNICOS: null, acelerador, freio, EV_Preload, buffer vazio
for slot, expected in [(1, "acelerador"), (2, "freio"), (3, "EV_Preload")]:
    assert ces[slot]["name"] == expected, f"CE ID {slot} deveria ser {expected!r}, é {ces[slot]['name']!r}"
assert ces[4]["name"] == "", f"CE ID 4 deve estar vazio (buffer), tem name={ces[4]['name']!r}"
ces = ces[:KEEP]  # descarta CEs F3 anteriores se houver


def C(code, indent, parameters=None):
    """Atalho para construir um comando MZ."""
    return {"code": code, "indent": indent, "parameters": parameters or []}


# Constantes MZ
SW_RACE_ACTIVE = 100
SW_INPUT_LOCKED = 101
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

CE_PRELOAD = 3
CE_ORCHESTRATOR = 5
CE_UPDATE_HUD = 6
CE_RENDERER = 7
CE_RENDER_SINAL = 8
CE_RENDER_CURVA = 9


# =============================================================================
# CE 5: EV_RaceOrchestrator (Trigger: Call)
# =============================================================================
orchestrator_list = [
    # === INIT block ===
    C(122, 0, [VAR_CONSCIENCIA, VAR_CONSCIENCIA, 0, 0, 0]),        # VAR_CONSCIENCIA = 0
    C(122, 0, [VAR_PONTOS_GLORIA, VAR_PONTOS_GLORIA, 0, 0, 0]),    # VAR_PONTOS_GLORIA = 0
    C(122, 0, [VAR_SCENE_INDEX, VAR_SCENE_INDEX, 0, 0, 0]),        # VAR_SCENE_INDEX = 0
    C(122, 0, [VAR_LAST_RENDERED_INDEX, VAR_LAST_RENDERED_INDEX, 0, 0, -1]),  # VAR_LAST_RENDERED_INDEX = -1 (força re-render na cena 0)
    C(122, 0, [VAR_ATTEMPT_N, VAR_ATTEMPT_N, 1, 0, 1]),            # VAR_ATTEMPT_N += 1

    # === Composição: VAR_RACE_N_CENAS baseado em VAR_RACE_ID ===
    C(111, 0, [1, VAR_RACE_ID, 0, 1, 0]),                          # If VAR_RACE_ID == 1
    C(122, 1, [VAR_RACE_N_CENAS, VAR_RACE_N_CENAS, 0, 0, 6]),      #   VAR_RACE_N_CENAS = 6
    C(411, 0, []),                                                  # Else
    C(111, 1, [1, VAR_RACE_ID, 0, 2, 0]),                          #   If VAR_RACE_ID == 2
    C(122, 2, [VAR_RACE_N_CENAS, VAR_RACE_N_CENAS, 0, 0, 8]),      #     VAR_RACE_N_CENAS = 8
    C(411, 1, []),                                                  #   Else
    C(122, 2, [VAR_RACE_N_CENAS, VAR_RACE_N_CENAS, 0, 0, 10]),     #     VAR_RACE_N_CENAS = 10
    C(412, 1, []),                                                  #   End
    C(412, 0, []),                                                  # End

    # === Seed decorativa (Math.random() — v1 não seedável) ===
    C(355, 0, [f"$gameVariables.setValue({VAR_SEED}, Math.floor(Math.random() * 1000000000));"]),

    # === Estado da corrida ===
    # NOTA: SW_RACE_ACTIVE=ON fica APÓS o EV_Preload. Se setar antes, o RaceRenderer
    # (Parallel) dispara durante o Preload, que por sua vez faz Show+Erase sequencial
    # em Picture ID 1 para aquecer texturas — sobrescrevendo o fundo que RenderSinal/Curva
    # acabou de mostrar. Sintoma observado em playtest: somente a barra de Consciência
    # aparecia (Pictures 20/21, que são mostradas depois do Preload).
    C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]),               # SW_INPUT_LOCKED = ON (durante setup)

    # === Pré-carregamento das pictures ===
    C(117, 0, [CE_PRELOAD]),                                        # Call EV_Preload

    # === Ativa o RaceRenderer SÓ APÓS o Preload terminar ===
    C(121, 0, [SW_RACE_ACTIVE, SW_RACE_ACTIVE, 0]),                 # SW_RACE_ACTIVE = ON

    # === HUD de Consciência (Picture 20 bg + 21 fill com scaleX 0%) ===
    C(231, 0, [20, "race/bar_consciencia_bg",   0, 0, 308, 16, 100, 100, 255, 0]),
    C(231, 0, [21, "race/bar_consciencia_fill", 0, 0, 310, 18,   0, 100, 255, 0]),

    # === Fadein 18 frames ===
    # startFadeIn da tela já visível não tem efeito. Para forçar "de preto para visível":
    # Tint Screen para preto absoluto (0 frames = instantâneo), depois para normal (18 frames).
    # Tint (223): params = [[r,g,b,gray], duration, wait]  valores em -255..255.
    C(223, 0, [[-255, -255, -255, 0], 0, False]),                    # Tint to black instant
    C(223, 0, [[0, 0, 0, 0], 18, False]),                            # Tint to normal over 18 frames
    C(230, 0, [18]),                                                 # Wait 18 frames

    C(0, 0, []),
]
ces.append({
    "id": 5,
    "list": orchestrator_list,
    "name": "EV_RaceOrchestrator",
    "trigger": 0,
    "switchId": 1,
    "autoErase": False,
    "conditionString": ""
})


# =============================================================================
# CE 6: EV_UpdateHud (Trigger: Call) — anima scaleX da Picture 21
# =============================================================================
update_hud_list = [
    # Var CONSCIENCIA já está em 0..100 — usada direto como percent de scaleX.
    # API: Game_Picture.move(x, y, scaleX, scaleY, opacity, blendMode, duration)
    C(355, 0, [
        f"const c = $gameVariables.value({VAR_CONSCIENCIA});"
        " const p = $gameScreen.picture(21);"
        " if (p) p.move(310, 18, Math.max(0, Math.min(100, c)), 100, 255, 0, 6);"
    ]),
    C(0, 0, []),
]
ces.append({
    "id": 6,
    "list": update_hud_list,
    "name": "EV_UpdateHud",
    "trigger": 0,
    "switchId": 1,
    "autoErase": False,
    "conditionString": ""
})


# =============================================================================
# CE 7: EV_RaceRenderer (Trigger: Parallel, Condition: SW_RACE_ACTIVE)
# =============================================================================
renderer_list = [
    # Label RENDER_LOOP
    C(118, 0, ["RENDER_LOOP"]),

    # Guarda de saída: se SW_RACE_ACTIVE == OFF, finaliza
    C(111, 0, [0, SW_RACE_ACTIVE, 1]),                              # If SW_RACE_ACTIVE is OFF
    C(115, 1, []),                                                  #   Exit Event Processing
    C(412, 0, []),                                                  # End

    # Detecta mudança de cena: VAR_SCENE_INDEX != VAR_LAST_RENDERED_INDEX
    C(111, 0, [1, VAR_SCENE_INDEX, 1, VAR_LAST_RENDERED_INDEX, 5]), # If (var != var) op=5 neq
    # LAST = SCENE  (opType=0=set, operandType=1=variable, value=VAR_SCENE_INDEX)
    # BUG ANTERIOR: params errados [114,114,1,0,102] significavam LAST += 102 (const),
    # causando re-render infinito. Corrigido para [114,114,0,1,102] = set LAST = var 102.
    C(122, 1, [VAR_LAST_RENDERED_INDEX, VAR_LAST_RENDERED_INDEX, 0, 1, VAR_SCENE_INDEX]),  # LAST = SCENE

    # Limpa pictures da cena anterior (faixa 10-19 intermediária)
    C(235, 1, [10]),
    C(235, 1, [11]),
    C(235, 1, [12]),

    # Determina tipo da cena — Curva do Diabo (corrida 3, cena 9) OU sorteio
    # Corrida 3 = sempre 10 cenas (índices 0-9). Última = 9.
    # If composto via Script (MZ não suporta AND nativo em If único)
    C(111, 1, [12, f"$gameVariables.value({VAR_RACE_ID}) === 3 && $gameVariables.value({VAR_SCENE_INDEX}) === 9"]),
    # Curva do Diabo
    C(122, 2, [VAR_SCENE_TYPE, VAR_SCENE_TYPE, 0, 0, 2]),           #   VAR_SCENE_TYPE = 2 (Curva do Diabo)
    C(122, 2, [VAR_P_CENA, VAR_P_CENA, 0, 0, 100]),                 #   VAR_P_CENA = 100
    C(121, 2, [SW_IS_CURVA_DIABO, SW_IS_CURVA_DIABO, 0]),           #   SW_IS_CURVA_DIABO = ON
    C(411, 1, []),                                                  # Else
    # Sorteio normal (60% SINAL, 40% CURVA; P_CENA U{0,10,...,100})
    C(355, 2, [f"$gameVariables.setValue({VAR_SCENE_TYPE}, JhonnyRace.rollSceneType());"]),
    C(355, 2, [f"$gameVariables.setValue({VAR_P_CENA}, JhonnyRace.rollPCena());"]),
    C(121, 2, [SW_IS_CURVA_DIABO, SW_IS_CURVA_DIABO, 1]),           #   SW_IS_CURVA_DIABO = OFF
    C(412, 1, []),                                                  # End

    # Renderiza cena conforme tipo (0=Sinal, 1=Curva, 2=Curva do Diabo)
    C(111, 1, [1, VAR_SCENE_TYPE, 0, 0, 0]),                        # If VAR_SCENE_TYPE == 0
    C(117, 2, [CE_RENDER_SINAL]),                                   #   Call EV_RenderSinal
    C(411, 1, []),                                                  # Else
    C(117, 2, [CE_RENDER_CURVA]),                                   #   Call EV_RenderCurva
    C(412, 1, []),                                                  # End

    # Configura timer da cena
    C(111, 1, [1, VAR_SCENE_TYPE, 0, 0, 0]),                        # If VAR_SCENE_TYPE == 0 (Sinal)
    C(122, 2, [VAR_TIMER_FRAMES, VAR_TIMER_FRAMES, 0, 0, 240]),     #   VAR_TIMER_FRAMES = 240 (4.0s)
    C(411, 1, []),                                                  # Else
    C(122, 2, [VAR_TIMER_FRAMES, VAR_TIMER_FRAMES, 0, 0, 210]),     #   VAR_TIMER_FRAMES = 210 (3.5s)
    C(412, 1, []),                                                  # End

    # Salva frame inicial para barra de timer sub-frame
    C(355, 1, [f"$gameVariables.setValue({VAR_SCENE_START}, Graphics.frameCount);"]),

    # Setup 18 frames com input locked (spec §3 fase 1)
    C(121, 1, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0]),               # SW_INPUT_LOCKED = ON
    C(230, 1, [18]),                                                 # Wait 18 frames
    C(121, 1, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1]),               # SW_INPUT_LOCKED = OFF

    C(412, 0, []),                                                  # End (detectou mudança)

    # Wait obrigatório + Jump — evita spin infinito
    C(230, 0, [1]),                                                  # Wait 1 frame
    C(119, 0, ["RENDER_LOOP"]),                                      # Jump to Label RENDER_LOOP

    C(0, 0, []),
]
ces.append({
    "id": 7,
    "list": renderer_list,
    "name": "EV_RaceRenderer",
    "trigger": 2,            # Parallel
    "switchId": SW_RACE_ACTIVE,  # Condition: SW_RACE_ACTIVE
    "autoErase": False,
    "conditionString": ""
})


# =============================================================================
# CE 8: EV_RenderSinal (Trigger: Call)
# =============================================================================
render_sinal_list = [
    C(231, 0, [1,  "race/bg_sinal",   0, 0,   0,   0, 100, 100, 255, 0]),
    C(231, 0, [10, "race/opala_pov",  0, 0,   0,   0, 100, 100, 255, 0]),
    C(231, 0, [11, "race/sinal_red",  0, 0, 308,  80, 100, 100, 255, 0]),
    C(0, 0, []),
]
ces.append({
    "id": 8,
    "list": render_sinal_list,
    "name": "EV_RenderSinal",
    "trigger": 0,
    "switchId": 1,
    "autoErase": False,
    "conditionString": ""
})


# =============================================================================
# CE 9: EV_RenderCurva (Trigger: Call) — placa normal + placa Curva do Diabo condicional
# =============================================================================
render_curva_list = [
    C(231, 0, [1,  "race/bg_curva",             0, 0,   0,   0, 100, 100, 255, 0]),
    C(231, 0, [10, "race/opala_pov",            0, 0,   0,   0, 100, 100, 255, 0]),
    C(231, 0, [11, "race/placa_curva_dir",      0, 0, 600, 100, 100, 100, 255, 0]),
    # If SW_IS_CURVA_DIABO == ON → mostrar placa especial (Picture ID 12)
    C(111, 0, [0, SW_IS_CURVA_DIABO, 0]),                            # If SW_IS_CURVA_DIABO is ON
    C(231, 1, [12, "race/curva_do_diabo_placa", 0, 0, 308,  80, 100, 100, 255, 0]),
    C(412, 0, []),                                                   # End
    C(0, 0, []),
]
ces.append({
    "id": 9,
    "list": render_curva_list,
    "name": "EV_RenderCurva",
    "trigger": 0,
    "switchId": 1,
    "autoErase": False,
    "conditionString": ""
})


# Escrever CommonEvents.json
CE_PATH.write_text(json.dumps(ces, indent=4, ensure_ascii=False) + "\n")

# Resumo
print(f"CommonEvents.json atualizado — {len(ces)} slots totais")
for ce in ces:
    if ce is None:
        continue
    if isinstance(ce, dict) and "name" in ce:
        print(f"  CE ID {ce.get('id')}: {ce['name']!r} trigger={ce['trigger']} cmds={len(ce.get('list', []))}")
