"""
Fase 7 — Audio feedback + HUD TENTATIVA N + logRaceEvent calls nos CEs.

Tasks:
  7.1 — Move Play SE pneu_cantando de CE 12 (EV_OnRisk) para CE 15 (EV_ResolucaoRiskOK).
        Mantem Play SE freada em CE 11 e Play ME Shock1 em CE 18.
  7.2 — Estende CE 6 (EV_UpdateHud) com TextPicture TENTATIVA N (Picture 52).
  7.3 — Insere chamadas Plugin Command logRaceEvent nos CEs 5/11/12/18/19.

Idempotente:
  Cada patch detecta se ja foi aplicado (pattern match) e skipa. Reexecucao produz diff vazio.

Mapa de CEs (snapshot pós-F6):
  CE  5 EV_RaceOrchestrator   INIT (25 cmds)  — alvo: logRaceEvent("RACE_INIT")
  CE  6 EV_UpdateHud          (6 cmds)        — alvo: TextPicture TENTATIVA (Picture 52)
  CE 11 EV_OnSafe             (23 cmds)       — alvo: logRaceEvent("SAFE_CLICK") (já tem freada ✓)
  CE 12 EV_OnRisk             (34 cmds)       — alvo: REMOVE pneu_cantando; ADD RISK_SUCCESS + RISK_FAIL
  CE 15 EV_ResolucaoRiskOK    (6 cmds)        — alvo: ADD pneu_cantando no inicio
  CE 18 EV_Crash              (26 cmds)       — alvo: logRaceEvent("CRASH") no inicio
  CE 19 EV_VitoriaCorrida     (46 cmds)       — alvo: logRaceEvent("VICTORY") no inicio

Padrões MZ relevantes:
  Play SE:  {code: 250, indent, parameters: [{"name":..., "volume":90, "pitch":100, "pan":0}]}
  Plugin Cmd logRaceEvent:
    {code: 357, indent, parameters: ["Jhonny_RaceHelper", "logRaceEvent", "Log Race Event", {"type": "<EVENT>"}]}
    {code: 657, indent, parameters: ["type = <EVENT>"]}
  TextPicture (replicado de CE 6):
    {code: 357, indent, parameters: ["TextPicture", "set", "Set Text Picture", {"text": "<valor>"}]}
    {code: 657, indent, parameters: ["Text = <valor>"]}
    {code: 231, indent, parameters: [picId, "", origin, designation, x, y, scaleX, scaleY, opacity, blendMode]}
"""

import json
import pathlib

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")

PLUGIN_NAME = "Jhonny_RaceHelper"

# CE Editor IDs
CE_RACE_ORCHESTRATOR = 5
CE_UPDATE_HUD = 6
CE_ON_SAFE = 11
CE_ON_RISK = 12
CE_RESOLUCAO_RISK_OK = 15
CE_CRASH = 18
CE_VITORIA_CORRIDA = 19

# Picture ID
PIC_TENTATIVA = 52


def C(code, indent, parameters=None):
    return {"code": code, "indent": indent, "parameters": parameters or []}


# =============================================================================
# Helpers — Plugin Command logRaceEvent
# =============================================================================
def make_log_race_event_cmd(event_type, indent=0):
    """Gera os 2 cmds MZ para chamar logRaceEvent via Plugin Command."""
    return [
        C(357, indent, [PLUGIN_NAME, "logRaceEvent", "Log Race Event", {"type": event_type}]),
        C(657, indent, [f"type = {event_type}"]),
    ]


def has_log_race_event(cmds, event_type):
    """True se a lista ja tem logRaceEvent com o event_type especifico."""
    for cmd in cmds:
        if cmd["code"] != 357 or len(cmd["parameters"]) < 4:
            continue
        if cmd["parameters"][1] != "logRaceEvent":
            continue
        args = cmd["parameters"][3]
        if isinstance(args, dict) and args.get("type") == event_type:
            return True
    return False


def _fix_log_race_event_indent(cmds, event_type, target_indent):
    """Garante que o par (357, 657) do logRaceEvent esteja em target_indent.

    Necessario porque a primeira versao do patch inseriu com indent=0 mesmo
    estando dentro de ramos IF/ELSE em CE 12 — o quebrava skipBranch do MZ.
    Idempotente: so reescreve se o indent atual for diferente.
    """
    fixed = False
    for i, cmd in enumerate(cmds):
        if cmd["code"] != 357 or len(cmd["parameters"]) < 4:
            continue
        if cmd["parameters"][1] != "logRaceEvent":
            continue
        args = cmd["parameters"][3]
        if not (isinstance(args, dict) and args.get("type") == event_type):
            continue
        if cmd["indent"] != target_indent:
            cmd["indent"] = target_indent
            fixed = True
        # O PluginCont (657) correspondente vem logo apos o 357
        if (i + 1 < len(cmds)
                and cmds[i + 1]["code"] == 657
                and cmds[i + 1]["indent"] != target_indent):
            cmds[i + 1]["indent"] = target_indent
            fixed = True
    return fixed


def find_cmd_index(cmds, predicate):
    """Retorna o primeiro indice cujo cmd satisfaz predicate(cmd)."""
    for i, cmd in enumerate(cmds):
        if predicate(cmd):
            return i
    return -1


# =============================================================================
# Task 7.1 — CE 12: REMOVE Play SE pneu_cantando
# =============================================================================
def patch_ce12_remove_pneu_cantando(ces):
    ce = ces[CE_ON_RISK]
    cmds = ce["list"]
    before = len(cmds)

    def is_pneu_cantando(cmd):
        if cmd["code"] != 250 or not cmd["parameters"]:
            return False
        audio = cmd["parameters"][0]
        return isinstance(audio, dict) and audio.get("name") == "pneu_cantando"

    idx = find_cmd_index(cmds, is_pneu_cantando)
    if idx == -1:
        print("CE 12: Play SE pneu_cantando ja removido — skip")
        return
    cmds.pop(idx)
    print(f"CE 12: removido Play SE pneu_cantando no cmd {idx} ({before}→{len(cmds)} cmds)")


# =============================================================================
# Task 7.1 — CE 15: ADD Play SE pneu_cantando no inicio
# =============================================================================
def patch_ce15_add_pneu_cantando(ces):
    ce = ces[CE_RESOLUCAO_RISK_OK]
    cmds = ce["list"]

    def is_pneu_cantando(cmd):
        if cmd["code"] != 250 or not cmd["parameters"]:
            return False
        audio = cmd["parameters"][0]
        return isinstance(audio, dict) and audio.get("name") == "pneu_cantando"

    if any(is_pneu_cantando(cmd) for cmd in cmds):
        print("CE 15: Play SE pneu_cantando ja presente — skip")
        return

    new_cmd = C(250, 0, [{"name": "pneu_cantando", "volume": 90, "pitch": 100, "pan": 0}])
    # Inserir como cmd 0 (antes do Tint escuro atual cmd 0)
    cmds.insert(0, new_cmd)
    print(f"CE 15: adicionado Play SE pneu_cantando no inicio ({len(cmds)} cmds)")


# =============================================================================
# Task 7.2 — CE 6: ADD TextPicture TENTATIVA N (Picture 52) ao final
# Tambem limpa Comment placeholder [TASK 5.4 MANUAL MZ] stale (cmds 2-4 ja implementam)
# =============================================================================
def patch_ce6_add_tentativa(ces):
    ce = ces[CE_UPDATE_HUD]
    cmds = ce["list"]

    # Cleanup: remover Comment [TASK 5.4 MANUAL MZ] (stale desde F6)
    removed_stale = False
    for i in range(len(cmds) - 1, -1, -1):
        cmd = cmds[i]
        if (cmd["code"] == 108 and cmd["parameters"]
                and "TASK 5.4 MANUAL MZ" in cmd["parameters"][0]):
            cmds.pop(i)
            removed_stale = True
            print(f"CE 6: removido Comment stale [TASK 5.4 MANUAL MZ] no cmd {i}")
            break

    # Idempotência: detectar Show Picture 52
    has_pic_52 = any(
        cmd["code"] == 231 and cmd["parameters"] and cmd["parameters"][0] == PIC_TENTATIVA
        for cmd in cmds
    )

    if has_pic_52 and not removed_stale:
        print("CE 6: TextPicture TENTATIVA ja presente — skip")
        return

    if has_pic_52:
        # So limpamos o Comment stale; Picture 52 ja existe
        return

    text_value = "\\C[7]TENTATIVA \\V[112]"
    cmds_to_add = [
        C(357, 0, ["TextPicture", "set", "Set Text Picture", {"text": text_value}]),
        C(657, 0, [f"Text = {text_value}"]),
        C(231, 0, [PIC_TENTATIVA, "", 0, 0, 350, 20, 100, 100, 180, 0]),
    ]

    # Inserir antes do terminador code 0 (ultimo cmd)
    terminador_idx = len(cmds) - 1
    for offset, cmd in enumerate(cmds_to_add):
        cmds.insert(terminador_idx + offset, cmd)
    print(f"CE 6: adicionado TextPicture TENTATIVA (Picture {PIC_TENTATIVA}) ({len(cmds)} cmds)")


# =============================================================================
# Task 7.3 — CE 5: logRaceEvent("RACE_INIT") apos INIT block
# =============================================================================
def patch_ce5_log_init(ces):
    ce = ces[CE_RACE_ORCHESTRATOR]
    cmds = ce["list"]

    if has_log_race_event(cmds, "RACE_INIT"):
        print("CE 5: logRaceEvent RACE_INIT ja presente — skip")
        return

    # Localizar cmd ControlVar VAR_VITORIA_PASSOU=0 (cmd 14) — inserir logo apos
    idx = find_cmd_index(
        cmds,
        lambda c: c["code"] == 122 and c["parameters"][:2] == [117, 117]
    )
    if idx == -1:
        raise SystemExit("patch_ce5: ControlVar 117=117 nao encontrado")

    insert_at = idx + 1
    for offset, cmd in enumerate(make_log_race_event_cmd("RACE_INIT")):
        cmds.insert(insert_at + offset, cmd)
    print(f"CE 5: inserido logRaceEvent RACE_INIT apos cmd {idx} (insert_at={insert_at})")


# =============================================================================
# Task 7.3 — CE 11: logRaceEvent("SAFE_CLICK") antes do Call EV_ResolucaoSafe
# =============================================================================
def patch_ce11_log_safe(ces):
    ce = ces[CE_ON_SAFE]
    cmds = ce["list"]

    if has_log_race_event(cmds, "SAFE_CLICK"):
        print("CE 11: logRaceEvent SAFE_CLICK ja presente — skip")
        return

    # Localizar Call CE 14 (EV_ResolucaoSafe)
    idx = find_cmd_index(cmds, lambda c: c["code"] == 117 and c["parameters"] == [14])
    if idx == -1:
        raise SystemExit("patch_ce11: Call CE 14 (EV_ResolucaoSafe) nao encontrado")

    for offset, cmd in enumerate(make_log_race_event_cmd("SAFE_CLICK")):
        cmds.insert(idx + offset, cmd)
    print(f"CE 11: inserido logRaceEvent SAFE_CLICK antes do cmd {idx} (Call CE 14)")


# =============================================================================
# Task 7.3 — CE 12: logRaceEvent("RISK_SUCCESS") + logRaceEvent("RISK_FAIL")
# =============================================================================
def patch_ce12_log_risk(ces):
    ce = ces[CE_ON_RISK]
    cmds = ce["list"]

    # RISK_SUCCESS: antes do Call CE 15 (EV_ResolucaoRiskOK).
    # CRITICAL: indent DEVE ser 1 (mesmo indent do Call CE 15 que esta dentro
    # do corpo do IF em cmd 9). Se for 0, skipBranch do MZ (que compara indent,
    # nao IF/ELSE/END) para cedo demais e o corpo do sucesso "vaza" para o ramo
    # do fail, fazendo CE 18 (Crash) rodar em ambos os caminhos.
    branch_indent = 1
    if not has_log_race_event(cmds, "RISK_SUCCESS"):
        idx_success = find_cmd_index(cmds, lambda c: c["code"] == 117 and c["parameters"] == [15])
        if idx_success == -1:
            raise SystemExit("patch_ce12: Call CE 15 (ResolucaoRiskOK) nao encontrado")
        for offset, cmd in enumerate(make_log_race_event_cmd("RISK_SUCCESS", indent=branch_indent)):
            cmds.insert(idx_success + offset, cmd)
        print(f"CE 12: inserido logRaceEvent RISK_SUCCESS antes do cmd {idx_success} (Call CE 15) indent={branch_indent}")
    else:
        # Correcao de indent se aplicado com indent errado em run anterior
        _fix_log_race_event_indent(cmds, "RISK_SUCCESS", branch_indent)
        print("CE 12: logRaceEvent RISK_SUCCESS ja presente (indent corrigido p/ 1)")

    # RISK_FAIL: antes do Call CE 18 (EV_Crash). Mesmo motivo: indent=1.
    if not has_log_race_event(cmds, "RISK_FAIL"):
        idx_fail = find_cmd_index(cmds, lambda c: c["code"] == 117 and c["parameters"] == [18])
        if idx_fail == -1:
            raise SystemExit("patch_ce12: Call CE 18 (EV_Crash) nao encontrado")
        for offset, cmd in enumerate(make_log_race_event_cmd("RISK_FAIL", indent=branch_indent)):
            cmds.insert(idx_fail + offset, cmd)
        print(f"CE 12: inserido logRaceEvent RISK_FAIL antes do cmd {idx_fail} (Call CE 18) indent={branch_indent}")
    else:
        _fix_log_race_event_indent(cmds, "RISK_FAIL", branch_indent)
        print("CE 12: logRaceEvent RISK_FAIL ja presente (indent corrigido p/ 1)")


# =============================================================================
# Task 7.3 — CE 18: logRaceEvent("CRASH") no inicio (cmd 0, antes do Play ME Shock1)
# =============================================================================
def patch_ce18_log_crash(ces):
    ce = ces[CE_CRASH]
    cmds = ce["list"]

    if has_log_race_event(cmds, "CRASH"):
        print("CE 18: logRaceEvent CRASH ja presente — skip")
        return

    for offset, cmd in enumerate(make_log_race_event_cmd("CRASH")):
        cmds.insert(offset, cmd)
    print(f"CE 18: inserido logRaceEvent CRASH no inicio ({len(cmds)} cmds)")


# =============================================================================
# Task 7.3 — CE 19: logRaceEvent("VICTORY") no inicio
# =============================================================================
def patch_ce19_log_victory(ces):
    ce = ces[CE_VITORIA_CORRIDA]
    cmds = ce["list"]

    if has_log_race_event(cmds, "VICTORY"):
        print("CE 19: logRaceEvent VICTORY ja presente — skip")
        return

    for offset, cmd in enumerate(make_log_race_event_cmd("VICTORY")):
        cmds.insert(offset, cmd)
    print(f"CE 19: inserido logRaceEvent VICTORY no inicio ({len(cmds)} cmds)")


# =============================================================================
# Orquestração
# =============================================================================
def main():
    ces = json.loads(CE_PATH.read_text(encoding="utf-8"))
    print(f"Estado inicial: {len(ces)} slots CE\n")

    # Task 7.1 — audio feedback
    print("--- Task 7.1: Audio feedback ---")
    patch_ce12_remove_pneu_cantando(ces)
    patch_ce15_add_pneu_cantando(ces)

    # Task 7.2 — HUD TENTATIVA N
    print("\n--- Task 7.2: HUD TENTATIVA N (CE 6) ---")
    patch_ce6_add_tentativa(ces)

    # Task 7.3 — logRaceEvent calls
    print("\n--- Task 7.3: logRaceEvent calls ---")
    patch_ce5_log_init(ces)
    patch_ce11_log_safe(ces)
    patch_ce12_log_risk(ces)
    patch_ce18_log_crash(ces)
    patch_ce19_log_victory(ces)

    # Gravar
    CE_PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print("\n--- Snapshot final ---")
    for i in [5, 6, 11, 12, 15, 18, 19]:
        ce = ces[i]
        print(f"  CE[{i:2}] {ce['name']!r:30} cmds={len(ce['list'])}")


if __name__ == "__main__":
    main()
