"""
Fase 6 — Crash, Restart, Variação de Corridas e Vitória.

Estende / cria / limpa Common Events para implementar tasks 6.1, 6.3, 6.4:
  CE  5 (EV_RaceOrchestrator)   — patch INIT com reset VAR_VITORIA_PASSOU=0
  CE  7 (EV_RaceRenderer)       — patch com check de vitória antes do render block
  CE 12 (EV_OnRisk)             — patch FAIL branch: Call CE 17 → Call CE 18 + remove placeholder
  CE 17 (EV_ResolucaoRiskFail)  — LIMPO para objeto vazio canônico (absorvido por CE 18; regra never-delete-common-events)
  CE 18 (EV_Crash)              — NOVO: crash visual + reset + restart <1s
  CE 19 (EV_VitoriaCorrida)     — NOVO: tela de vitória/derrota com threshold

Idempotente:
  Reexecutar reescreve 5/7/12/18/19 deterministicamente; re-aplica patches; re-limpa CE 17.

Decisões confirmadas pelo usuário (2026-06-19):
  1. EV_Crash absorve CE 17 (separação artificial eliminada)
  2. EV_Crash incrementa VAR_ATTEMPT_N a cada falha
  3. Curva do Diabo cena especial fora de escopo (Corrida 3 tem 10 cenas normais)
  4. Threshold por corrida: R1=60, R2=100, R3=150
  5. Som de crash = Buzzer1 (ME) — ASSET NÃO EXISTE em audio/me/; usando Shock1
     como fallback mais próximo (harsh, curto, sem melodia). Buzzer1 reservado p/ v2.
  6. VAR_SEED resetado a cada crash (spec §7.3 literalmente)
  7. VAR_VITORIA_PASSOU resetado em 2 lugares: EV_Crash + INIT Orchestrator (defensivo)
  8. Texto VITÓRIA/DERROTA = 2 TextPicture separados (Picture 53 vs 56) com If/Else
     Show Picture — não alternar texto da mesma picture
  9. NUNCA deletar Common Events — CE 17 é LIMPO para objeto vazio canônico, nunca null
     (regra never-delete-common-events: preserva save files legados + referências indiretas)

Mapa de IDs (snapshot 2026-06-19 pós-F5 + setup_phase6_system.py):
  Variáveis Editor ID:
    100=VAR_RACE_ID          108=VAR_TIMER_FRAMES
    101=VAR_SCENE_INDEX      109=VAR_SCENE_START
    102=VAR_SCENE_TYPE       110=VAR_SEED
    103=VAR_P_CENA           111=VAR_RACE_N_CENAS
    104=VAR_CONSCIENCIA      112=VAR_ATTEMPT_N
    105=VAR_PONTOS_GLORIA    113=VAR_LAST_RENDERED_INDEX
    106=VAR_TAXA_SUCESSO     115=VAR_HOVER_LEVEL (F5)
    107=VAR_ROLL_RESULT      116=VAR_TIMER_TIMEOUT_FLAG (F4)
                             117=VAR_VITORIA_PASSOU (F6 — setup_phase6_system.py)
  Switches Editor ID:
    100=SW_RACE_ACTIVE       103=SW_LAST_ACTION_SAFE
    101=SW_INPUT_LOCKED      104=SW_PAUSED
    102=SW_CRASH_FLAG        105=SW_IS_CURVA_DIABO

Formatos MZ validados contra js/rmmz_objects.js:
  If Switch ON:   [0, switchId, 0]
  If Switch OFF:  [0, switchId, 1]
  If Variable op: [1, varId, src(0=const|1=var), operand, op]
                  op 0=eq 1=ge 2=le 3=gt 4=lt 5=neq
  If Script:      [12, scriptString]
  ControlVar:     [startId, endId, op(0=set|1=add|2=sub|3=mul|4=div|5=mod),
                   operandType(0=const), operand]
  ControlSwitch:  [startId, endId, state(0=ON|1=OFF)]
  Show Picture:   [picId, name, origin, designation, x, y, scaleX, scaleY, opacity, blendMode]
  Move Picture:   [picId, 0, origin, designation, x, y, scaleX, scaleY, opacity,
                   blendMode, duration, waitForCompletion, easing]
  Tint Screen:    [[R, G, B, Intensity], duration, preserveErase]
  Shake Screen:   [power, speed, duration, waitForCompletion]
  Play ME:        [{name, volume, pitch, pan}]
  Fadeout BGM:    [durationSeconds]
  Call CE:        [ceId]
  Comment:        [textString]
  Label/Jump:     [labelName]
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

VAR_RACE_ID = 100
VAR_SCENE_INDEX = 101
VAR_SCENE_TYPE = 102
VAR_P_CENA = 103
VAR_CONSCIENCIA = 104
VAR_PONTOS_GLORIA = 105
VAR_TAXA_SUCESSO = 106
VAR_ROLL_RESULT = 107
VAR_TIMER_FRAMES = 108
VAR_SEED = 110
VAR_RACE_N_CENAS = 111
VAR_ATTEMPT_N = 112
VAR_LAST_RENDERED_INDEX = 113
VAR_VITORIA_PASSOU = 117

# CE Editor IDs
CE_RACE_ORCHESTRATOR = 5
CE_UPDATE_HUD = 6
CE_RACE_RENDERER = 7
CE_RENDER_SINAL = 8
CE_ON_RISK = 12
CE_CRASH = 18
CE_VITORIA_CORRIDA = 19

# Pictures
PIC_FLASH_WHITE = 32
PIC_BG_VITORIA = 5
PIC_TEXTO_VITORIA = 53
PIC_TEXTO_DERROTA = 56
PIC_TEXTO_GLORIA = 54
PIC_TEXTO_INSTR = 55

# Thresholds por corrida
THRESHOLDS = {1: 60, 2: 100, 3: 150}

# Áudio
CRASH_ME_NAME = "Shock1"  # Buzzer1 não existe; Shock1 é o ME harsh mais próximo
VITORIA_ME_NAME = "Victory1"


def C(code, indent, parameters=None):
    return {"code": code, "indent": indent, "parameters": parameters or []}


def make_empty_ce(ce_id):
    """CE limpo canônico — preserva o slot sem ativá-lo.

    Regra never-delete-common-events: Common Events nunca são deletados
    (null/removidos do array), sempre limpos para este objeto vazio.
    Preserva o `id` para compatibilidade com save files legados e
    referências indiretas em outros CEs/Maps.
    """
    return {
        "id": ce_id,
        "list": [C(0, 0, [])],
        "name": "",
        "switchId": 1,
        "trigger": 0,
    }


def is_empty_ce(ce, ce_id):
    """True se o CE está no formato vazio canônico (limpo)."""
    if ce is None or ce.get("id") != ce_id:
        return False
    if ce.get("name") != "" or ce.get("trigger") != 0 or ce.get("switchId") != 1:
        return False
    cmds = ce.get("list", [])
    return len(cmds) == 1 and cmds[0].get("code") == 0 and cmds[0].get("indent") == 0


# =============================================================================
# Patch CE 5: EV_RaceOrchestrator INIT — reset VAR_VITORIA_PASSOU=0
# Inserido antes do script de SEED reset (atualmente cmd 14)
# =============================================================================
def patch_ce5_orchestrator(ces):
    ce = ces[CE_RACE_ORCHESTRATOR]
    cmds = ce["list"]
    # Localizar o script de SEED reset (code 355 com conteúdo contendo setValue(110)
    seed_idx = None
    for i, cmd in enumerate(cmds):
        if cmd["code"] == 355 and "setValue(110" in (cmd["parameters"][0] if cmd["parameters"] else ""):
            seed_idx = i
            break
    if seed_idx is None:
        raise SystemExit("patch_ce5: SEED reset script não encontrado no CE 5")

    # Verificar se o patch já foi aplicado (idempotência)
    for i in range(seed_idx):
        cmd = cmds[i]
        if cmd["code"] == 122 and cmd["parameters"][:2] == [VAR_VITORIA_PASSOU, VAR_VITORIA_PASSOU]:
            print(f"CE 5: patch VITORIA_PASSOU já presente (cmd {i}) — skip")
            return

    # Inserir antes do SEED reset: ControlVar VAR_VITORIA_PASSOU = 0
    new_cmd = C(122, 0, [VAR_VITORIA_PASSOU, VAR_VITORIA_PASSOU, 0, 0, 0])
    cmds.insert(seed_idx, new_cmd)
    print(f"CE 5: inserido reset VAR_VITORIA_PASSOU=0 no cmd {seed_idx}")


# =============================================================================
# Patch CE 7: EV_RaceRenderer — vitória check antes do render-on-change block
# Inserido após o guard SW_RACE_ACTIVE (cmds 1-3) e antes do If SCENE_INDEX != LAST
# =============================================================================
def patch_ce7_renderer(ces):
    ce = ces[CE_RACE_RENDERER]
    cmds = ce["list"]

    # Idempotência: procurar por Call CE 19 já presente
    for cmd in cmds:
        if cmd["code"] == 117 and cmd["parameters"] == [CE_VITORIA_CORRIDA]:
            print("CE 7: vitória check já presente — skip")
            return

    # Encontrar o primeiro If code 111 após o guard SW_RACE_ACTIVE
    # Estrutura atual: [Label, If SW_OFF, Exit, End, If SCENE_INDEX != LAST...]
    # Procuramos pelo segundo If (após o primeiro End em indent 0)
    insert_at = None
    end_count = 0
    for i, cmd in enumerate(cmds):
        if cmd["code"] == 412 and cmd["indent"] == 0:
            end_count += 1
            if end_count == 1:
                insert_at = i + 1
                break
    if insert_at is None:
        raise SystemExit("patch_ce7: primeiro End indent=0 não encontrado")

    # Inserir If VAR_SCENE_INDEX >= VAR_RACE_N_CENAS → Call CE 19 + Exit
    new_cmds = [
        C(111, 0, [1, VAR_SCENE_INDEX, 1, VAR_RACE_N_CENAS, 1]),  # op=1 (ge)
        C(117, 1, [CE_VITORIA_CORRIDA]),
        C(115, 1, []),  # Exit Event Processing
        C(412, 0, []),  # End
    ]
    for offset, cmd in enumerate(new_cmds):
        cmds.insert(insert_at + offset, cmd)
    print(f"CE 7: vitória check inserido no cmd {insert_at} (4 cmds)")


# =============================================================================
# Patch CE 12: EV_OnRisk — FAIL branch troca Call CE 17 → CE 18
# Remove Comment placeholder [TASK 6.1 PENDENTE]
# =============================================================================
def patch_ce12_on_risk(ces):
    ce = ces[CE_ON_RISK]
    cmds = ce["list"]
    patched_call = False
    removed_comment = False

    for i, cmd in enumerate(cmds):
        # Substituir Call CE 17 → CE 18 no FAIL branch
        if cmd["code"] == 117 and cmd["parameters"] == [17]:
            cmd["parameters"] = [CE_CRASH]
            patched_call = True
        # Remover Comment [TASK 6.1 PENDENTE]
        elif cmd["code"] == 108 and cmd["parameters"] and "TASK 6.1 PENDENTE" in cmd["parameters"][0]:
            cmds[i] = None  # marcar para remoção
            removed_comment = True

    # Compactar lista (remover None)
    if removed_comment:
        ce["list"] = [c for c in cmds if c is not None]

    if patched_call:
        print("CE 12: Call CE 17 → CE 18 (aplicado)")
    else:
        print("CE 12: Call CE 18 já estava (idempotente) — skip")
    if removed_comment:
        print("CE 12: Comment [TASK 6.1 PENDENTE] removido")


# =============================================================================
# CE 18: EV_Crash — sequência completa (≤60 frames = 1s)
# =============================================================================
def build_ce18_crash():
    cmds = []
    # 1. Play ME Buzzer1 (na verdade Shock1 — asset Buzzer1 não existe)
    cmds.append(C(249, 0, [{"name": CRASH_ME_NAME, "volume": 90, "pitch": 100, "pan": 0}]))
    # 2. Shake Screen power 8, speed 6, 18 frames (no wait — corre em paralelo com flash+tint)
    cmds.append(C(225, 0, [8, 6, 18, False]))
    # 3. Show Picture 32 (flash branco fullscreen) opacity 255
    cmds.append(C(231, 0, [PIC_FLASH_WHITE, "race/overlay_flash_white", 0, 0, 0, 0, 100, 100, 255, 0]))
    # 4. Move Picture 32 fade out em 6 frames
    cmds.append(C(232, 0, [PIC_FLASH_WHITE, 0, 0, 0, 0, 0, 100, 100, 0, 0, 6, False, 0]))
    # 5. Tint Screen escuro (-255,-255,-255,0) em 6 frames
    cmds.append(C(223, 0, [[-255, -255, -255, 0], 6, False]))
    # 6. Wait 18 frames (shake completa, flash já apagou, tint no escuro)
    cmds.append(C(230, 0, [18]))

    # 7. Bloco de reset (no escuro) — variáveis
    cmds.append(C(122, 0, [VAR_CONSCIENCIA, VAR_CONSCIENCIA, 0, 0, 0]))      # = 0
    cmds.append(C(122, 0, [VAR_PONTOS_GLORIA, VAR_PONTOS_GLORIA, 0, 0, 0]))   # = 0
    cmds.append(C(122, 0, [VAR_SCENE_INDEX, VAR_SCENE_INDEX, 0, 0, 0]))       # = 0
    cmds.append(C(122, 0, [VAR_LAST_RENDERED_INDEX, VAR_LAST_RENDERED_INDEX, 0, 0, -1]))  # = -1 (força re-render)
    cmds.append(C(122, 0, [VAR_TIMER_FRAMES, VAR_TIMER_FRAMES, 0, 0, 240]))   # = 240
    cmds.append(C(122, 0, [VAR_TAXA_SUCESSO, VAR_TAXA_SUCESSO, 0, 0, 0]))     # = 0
    cmds.append(C(122, 0, [VAR_ROLL_RESULT, VAR_ROLL_RESULT, 0, 0, 0]))       # = 0
    cmds.append(C(122, 0, [VAR_VITORIA_PASSOU, VAR_VITORIA_PASSOU, 0, 0, 0])) # = 0 (defensivo)
    # ATTEMPT_N += 1
    cmds.append(C(122, 0, [VAR_ATTEMPT_N, VAR_ATTEMPT_N, 1, 0, 1]))
    # SEED = Math.floor(Math.random()*1e9)
    cmds.append(C(355, 0, ["$gameVariables.setValue(110, Math.floor(Math.random() * 1000000000));"]))

    # 8. Reset switches (CRASH_FLAG OFF, INPUT_LOCKED OFF, LAST_ACTION_SAFE OFF)
    cmds.append(C(121, 0, [SW_CRASH_FLAG, SW_CRASH_FLAG, 1]))         # OFF
    cmds.append(C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 1]))     # OFF
    cmds.append(C(121, 0, [SW_LAST_ACTION_SAFE, SW_LAST_ACTION_SAFE, 1]))  # OFF

    # 9. Erase pictures 1-60 (Script inline)
    cmds.append(C(355, 0, ["for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);"]))
    # 10. Erase Picture 32 explicitamente (já coberto pelo loop acima, mas defensivo)
    cmds.append(C(235, 0, [PIC_FLASH_WHITE]))

    # 11. Tint Screen normal em 12 frames
    cmds.append(C(223, 0, [[0, 0, 0, 0], 12, False]))

    # 12. Call CE 6 (UpdateHud) — recria HUD zerado
    cmds.append(C(117, 0, [CE_UPDATE_HUD]))
    # 13. Call CE 8 (RenderSinal) — recria cena 1
    cmds.append(C(117, 0, [CE_RENDER_SINAL]))
    # 14. Wait 6 frames (estabilização)
    cmds.append(C(230, 0, [6]))

    cmds.append(C(0, 0, []))
    return cmds


# =============================================================================
# CE 19: EV_VitoriaCorrida — tela de vitória/derrota + threshold
# Padrão TextPicture (replicado de CE 6 / EV_UpdateHud):
#   code 357 [pluginName, cmdName, displayName, argsObj]  → Plugin Command "Set Text"
#   code 657 ["Text = <valor>"]                           → Plugin Command continuation
#   code 231 [picId, "", origin, designation, x, y, ...]  → Show Picture (name vazio consome texto)
# TextPicture.js processa escape codes MZ: \C[n] cor, \V[n] variável.
# Estrutura If/Else envolve VITÓRIA vs DERROTA (apenas UM é mostrado).
# =============================================================================
def build_ce19_vitoria():
    cmds = []
    # 1. Erase pictures 1-60 (Script inline)
    cmds.append(C(355, 0, ["for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);"]))
    # 2. Fadeout BGM 1s (code 242)
    cmds.append(C(242, 0, [1]))
    # 3. Play ME Victory1
    cmds.append(C(249, 0, [{"name": VITORIA_ME_NAME, "volume": 90, "pitch": 100, "pan": 0}]))
    # 4. Tint Screen dourado (fallback p/ bg_vitoria ausente)
    cmds.append(C(223, 0, [[60, 20, -120, 60], 12, False]))
    # 5. Comment: bg_vitoria.png ausente — fallback Tint dourado ativo
    cmds.append(C(108, 0, ["[F6.4] bg_vitoria.png ausente — fallback Tint dourado acima"]))

    # 6. Threshold check (Script inline) — seta VAR_VITORIA_PASSOU (deve rodar ANTES do If/Else)
    threshold_script = (
        "const pontos = $gameVariables.value(105);\n"
        "const raceId = $gameVariables.value(100);\n"
        "const thresholds = { 1: 60, 2: 100, 3: 150 };\n"
        "const passou = pontos >= (thresholds[raceId] || 60);\n"
        "$gameVariables.setValue(117, passou ? 1 : 0);"
    )
    cmds.append(C(355, 0, [threshold_script]))

    # 7. If VITORIA_PASSOU == 1 → Set Text VITÓRIA + Show Pic 53
    cmds.append(C(111, 0, [1, VAR_VITORIA_PASSOU, 0, 1, 0]))  # If eq 1
    cmds.append(C(357, 1, ["TextPicture", "set", "Set Text Picture", {"text": "\\C[6]VITÓRIA!"}]))
    cmds.append(C(657, 1, ["Text = \\C[6]VITÓRIA!"]))
    cmds.append(C(231, 1, [PIC_TEXTO_VITORIA, "", 0, 0, 308, 200, 100, 100, 255, 0]))
    # 8. Else → Set Text DERROTA + Show Pic 56
    cmds.append(C(411, 0, []))
    cmds.append(C(357, 1, ["TextPicture", "set", "Set Text Picture", {"text": "\\C[18]DERROTA!"}]))
    cmds.append(C(657, 1, ["Text = \\C[18]DERROTA!"]))
    cmds.append(C(231, 1, [PIC_TEXTO_DERROTA, "", 0, 0, 308, 200, 100, 100, 255, 0]))
    cmds.append(C(412, 0, []))  # End

    # 9. Glória — sempre mostrado (Picture 54)
    cmds.append(C(357, 0, ["TextPicture", "set", "Set Text Picture", {"text": "Pontos de Glória: \\V[105]"}]))
    cmds.append(C(657, 0, ["Text = Pontos de Glória: \\V[105]"]))
    cmds.append(C(231, 0, [PIC_TEXTO_GLORIA, "", 0, 0, 258, 300, 100, 100, 255, 0]))

    # 10. Instrução — sempre mostrado (Picture 55)
    cmds.append(C(357, 0, ["TextPicture", "set", "Set Text Picture", {"text": "Pressione [Espaço] para continuar"}]))
    cmds.append(C(657, 0, ["Text = Pressione [Espaço] para continuar"]))
    cmds.append(C(231, 0, [PIC_TEXTO_INSTR, "", 0, 0, 258, 360, 100, 100, 255, 0]))

    # 11. Wait input loop (Label/Jump com Script Input.isTriggered('ok'))
    cmds.append(C(118, 0, ["WAIT_INPUT"]))
    cmds.append(C(111, 0, [12, "!Input.isTriggered('ok')"]))
    cmds.append(C(230, 1, [1]))
    cmds.append(C(119, 1, ["WAIT_INPUT"]))
    cmds.append(C(412, 0, []))

    # 12. Erase pictures de vitória/derrota antes da transição
    cmds.append(C(235, 0, [PIC_BG_VITORIA]))       # 5 — no-op se não foi shown
    cmds.append(C(235, 0, [PIC_TEXTO_VITORIA]))     # 53
    cmds.append(C(235, 0, [PIC_TEXTO_DERROTA]))     # 56
    cmds.append(C(235, 0, [PIC_TEXTO_GLORIA]))      # 54
    cmds.append(C(235, 0, [PIC_TEXTO_INSTR]))       # 55

    # 13. Tint Screen normal (limpa dourado)
    cmds.append(C(223, 0, [[0, 0, 0, 0], 6, False]))

    # 14. If VAR_VITORIA_PASSOU == 1
    cmds.append(C(111, 0, [1, VAR_VITORIA_PASSOU, 0, 1, 0]))  # eq 1
    # Then: If VAR_RACE_ID < 3
    cmds.append(C(111, 1, [1, VAR_RACE_ID, 0, 3, 4]))  # lt 3
    cmds.append(C(122, 2, [VAR_RACE_ID, VAR_RACE_ID, 1, 0, 1]))  # RACE_ID += 1
    cmds.append(C(117, 2, [CE_RACE_ORCHESTRATOR]))  # Call CE 5
    cmds.append(C(411, 1, []))  # Else (RACE_ID == 3)
    cmds.append(C(108, 2, ["[F6.4] Tela FIM: bg_fim.png ausente — tela preta + loop Label/Jump abaixo"]))
    cmds.append(C(118, 2, ["FIM_LOOP"]))
    cmds.append(C(230, 3, [1]))
    cmds.append(C(119, 3, ["FIM_LOOP"]))
    cmds.append(C(412, 2, []))  # End inner If
    cmds.append(C(411, 0, []))  # Else (VITORIA_PASSOU == 0)
    cmds.append(C(117, 1, [CE_CRASH]))  # Call CE 18 (restart sem avançar)
    cmds.append(C(412, 0, []))  # End outer If

    cmds.append(C(0, 0, []))
    return cmds


# =============================================================================
# Orquestração
# =============================================================================
def main():
    ces = json.loads(CE_PATH.read_text(encoding="utf-8"))

    print(f"Estado inicial: {len(ces)} slots CE (índices 0..{len(ces)-1})")

    # 1. Patches em CEs existentes
    patch_ce5_orchestrator(ces)
    patch_ce7_renderer(ces)
    patch_ce12_on_risk(ces)

    # 2. Limpar CE 17 (EV_ResolucaoRiskFail) para objeto vazio canônico
    #    — absorvido por CE 18; NUNCA deletar (regra never-delete-common-events)
    while len(ces) <= 17:
        ces.append(None)
    if is_empty_ce(ces[17], 17):
        print("CE 17 já está limpo (objeto vazio) — skip")
    else:
        old_name = ces[17].get("name", "") if ces[17] else "(null)"
        ces[17] = make_empty_ce(17)
        print(f"CE 17 ({old_name}) limpo para objeto vazio (absorvido por CE 18)")

    # 3. Garantir slot 18 (EV_Crash)
    while len(ces) <= CE_CRASH:
        ces.append(None)
    if ces[CE_CRASH] is None or ces[CE_CRASH].get("name") != "EV_Crash":
        ces[CE_CRASH] = {
            "id": CE_CRASH,
            "list": build_ce18_crash(),
            "name": "EV_Crash",
            "note": "",
            "switchId": 1,
            "trigger": 0,
        }
        print(f"CE {CE_CRASH} (EV_Crash) criado ({len(ces[CE_CRASH]['list'])} cmds)")
    else:
        # Idempotente: regenerar list
        ces[CE_CRASH]["list"] = build_ce18_crash()
        print(f"CE {CE_CRASH} (EV_Crash) regenerado ({len(ces[CE_CRASH]['list'])} cmds)")

    # 4. Garantir slot 19 (EV_VitoriaCorrida)
    while len(ces) <= CE_VITORIA_CORRIDA:
        ces.append(None)
    if ces[CE_VITORIA_CORRIDA] is None or ces[CE_VITORIA_CORRIDA].get("name") != "EV_VitoriaCorrida":
        ces[CE_VITORIA_CORRIDA] = {
            "id": CE_VITORIA_CORRIDA,
            "list": build_ce19_vitoria(),
            "name": "EV_VitoriaCorrida",
            "note": "",
            "switchId": 1,
            "trigger": 0,
        }
        print(f"CE {CE_VITORIA_CORRIDA} (EV_VitoriaCorrida) criado ({len(ces[CE_VITORIA_CORRIDA]['list'])} cmds)")
    else:
        ces[CE_VITORIA_CORRIDA]["list"] = build_ce19_vitoria()
        print(f"CE {CE_VITORIA_CORRIDA} (EV_VitoriaCorrida) regenerado ({len(ces[CE_VITORIA_CORRIDA]['list'])} cmds)")

    # 5. Gravar
    CE_PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"\nCommonEvents.json gravado: {len(ces)} slots (índices 0..{len(ces)-1})")

    # Snapshot final
    print("\nMapa de CEs pós-F6:")
    for i, ce in enumerate(ces):
        if ce is None:
            print(f"  CE[{i}]: None")
        else:
            print(f"  CE[{i}] name={ce.get('name')!r} trigger={ce.get('trigger')} cmds={len(ce.get('list', []))}")


if __name__ == "__main__":
    main()
