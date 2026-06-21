"""
Fase 2 — Derrota toca ME distinto da Vitória (#2).

Dois patches coordenados no CE 19 (EV_VitoriaCorrida):

    Patch G — Reordena o bloco script que computa VAR_VITORIA_PASSOU para
              ANTES do comando de áudio. Hoje o bloco está em cmd[9-13] e o
              áudio em cmd[6]; o Patch G move o bloco para cmd[6-10] e o
              áudio desce para cmd[11]. Sem isso, o ME toca antes do branch
              VITÓRIA/DERROTA saber qual tocar.
    Patch H — Substitui o PlaySE "Victory1" (code 249) por um branch
              condicional que toca Play ME "Victory1" ou "Defeat1" (code 246)
              conforme VAR_VITORIA_PASSOU. A conversão 249 -> 246 é
              obrigatória: Victory1.ogg e Defeat1.ogg vivem em audio/me/,
              que o canal SE não carrega.

Idempotente:
    Cada patch detecta se o padrão alvo já está presente e skipa. Reexecução
    produz "skipped" x2 e git diff vazio em Jhonny/data/CommonEvents.json.

Estado atual (snapshot 2026-06-20 pós-Fase 1 v2):
    CE 19 tem 55 cmds (dump em fase2/ce19-post-phase1-dump.txt).
    Patch G — FALTA (bloco setValue(117) em cmd[13], após áudio em cmd[6]).
    Patch H — FALTA (áudio ainda é PlaySE 249, sem branch).

Referências:
    - Plano:     Jhonny/planos/003-bug-fix-round1/tasks.md (Fase 2)
    - Guia:      Jhonny/planos/003-bug-fix-round1/race-feedback-impl-guide.md §3
    - Task 2.1:  Jhonny/planos/003-bug-fix-round1/fase2/me-asset-choice.md
    - Prior art: Jhonny/planos/003-bug-fix-round1/builds/build_phase1_ces.py

Convenção de nomes:
    Fase 1 v2 já usou Patches D/E/F. Para evitar colisão nos audits, a Fase 2
    usa letras G e H. Não renomeie para patch_d_* / patch_e_*.

Editor IDs (System.json):
    VAR_VITORIA_PASSOU = 117  (variable) — 1=passou, 0=não passou
    SW_INPUT_LOCKED    = 101  (switch)   — não tocar (Fase 1)
    SW_PAUSED          = 104  (switch)   — não tocar (Fase 1)

CE indices (CommonEvents.json):
    CE_INDEX_VITORIA = 19  (EV_VitoriaCorrida)
"""

import json
import pathlib
import sys

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")

# CE Editor IDs
CE_INDEX_VITORIA = 19

# Variable Editor IDs
VAR_VITORIA_PASSOU = 117

# RMMZ command codes usados aqui.
#
# IMPORTANTE — códigos corretos em Jhonny/js/rmmz_objects.js:
#   linha 10809: command246 = fadeOutBgs  (Fadeout BGS, params=[segundos])
#   linha 10815: command249 = playMe      (Play ME, params=[{name,volume,pitch,pan}])
#   linha 10821: command250 = playSe      (Play SE)
#
# A versão v1 deste arquivo invertia 246 e 249, tratando 246 como Play ME.
# O resultado era cmd[12]/cmd[14] chamando fadeOutBgs com um dict — silêncio
# total nos paths de vitória e derrota. v2 corrige para 249.
CODE_PLAY_ME = 249               # params: [{"name","volume","pitch","pan"}]
CODE_FADEOUT_BGS = 246           # documento/detecção de regressão (não usar como ME)
CODE_SCRIPT = 355                # params: ["<line>"]
CODE_SCRIPT_CONTINUE = 655       # params: ["<line>"] — continuação do Script anterior
CODE_CONDITIONAL_BRANCH = 111    # params: [type, varId, operandSrc, operandVal, operator]
                                 # type=1 (variable), operandSrc=0 (constant),
                                 # operandVal=1, operator=0 (==)
CODE_ELSE = 411
CODE_END = 412

# Branch params para "If VAR_VITORIA_PASSOU == 1".
# 5 elementos (mesmo formato do branch de picture em CE 19 cmd[14] pré-existente).
# params[5] seria usado apenas para operandSrc=2 (random); com constant é ignorado.
BRANCH_VITORIA_PASSOU_EQ_1 = [1, VAR_VITORIA_PASSOU, 0, 1, 0]

# Níveis de áudio (casados com PlaySE original e System.json victoryMe/defeatMe)
VICTORY_ME = "Victory1"
DEFEAT_ME = "Defeat1"
AUDIO_VOLUME = 90
AUDIO_PITCH = 100
AUDIO_PAN = 0


def C(code, indent, parameters=None):
    """Helper para construir um command MZ no formato JSON."""
    return {"code": code, "indent": indent, "parameters": parameters or []}


def _audio_param(name):
    """Dict de parâmetros para PlaySE/Play ME com níveis canônicos."""
    return {"name": name, "volume": AUDIO_VOLUME, "pitch": AUDIO_PITCH, "pan": AUDIO_PAN}


def _write_back(ces):
    CE_PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


# =============================================================================
# Helpers de localização
# =============================================================================
def _find_audio_index(cmds):
    """Índice do primeiro comando de áudio Play ME (code 249).

    Usado como âncora tanto para o Patch G (idempotência) quanto para
    diagnosticar estado. Retorna -1 se não houver.

    Nota: code 246 (FadeoutBGS) NÃO é um comando de áudio relevante para
    este patch — só aparecia no Estado B (regressão v1) onde era confundido
    com Play ME. Não procuramos 246 aqui.
    """
    for i, cmd in enumerate(cmds):
        if cmd["code"] == CODE_PLAY_ME:
            return i
    return -1


def _find_script_block(cmds):
    """(start_idx, end_idx) do bloco script que computa VAR_VITORIA_PASSOU.

    O bloco começa com code=355 contendo "pontos = $gameVariables.value(105)"
    e termina com code=655 contendo "setValue(117". Retorna (-1, -1) se não
    encontrar o par completo.
    """
    start_idx = -1
    for i, cmd in enumerate(cmds):
        if cmd["code"] == CODE_SCRIPT and "pontos = $gameVariables.value(105)" in cmd["parameters"][0]:
            start_idx = i
            break
    if start_idx == -1:
        return (-1, -1)

    end_idx = -1
    for i in range(start_idx, len(cmds)):
        cmd = cmds[i]
        if cmd["code"] in (CODE_SCRIPT, CODE_SCRIPT_CONTINUE) and "setValue(117" in cmd["parameters"][0]:
            end_idx = i
            break
    return (start_idx, end_idx)


# =============================================================================
# Patch G — Reordena bloco script (setValue 117) para antes do áudio
# =============================================================================
def patch_g_compute_before_audio(ces):
    """Move o bloco de 5 cmds que computa VAR_VITORIA_PASSOU para imediatamente
    antes do comando de áudio.

    Pré-Patch G:
      [6]   PlaySE Victory1     <- áudio
      [7]   Tint
      [8]   Comment
      [9]   Script: const pontos = ...    <- início do bloco
      ...
      [13]  ScriptContinue: setValue(117, ...)  <- fim do bloco

    Pós-Patch G:
      [6]   Script: const pontos = ...
      ...
      [10]  ScriptContinue: setValue(117, ...)
      [11]  PlaySE Victory1     <- áudio (descido 5 posições)
      [12]  Tint
      [13]  Comment

    Idempotente: skipa se setValue(117) já está em índice menor que o áudio.
    Não toca cmd[0-1] (ceremony lock) nem cmd[29] (Label WAIT_INPUT) nem
    cmd[34] (SW_PAUSED=OFF).
    """
    cmds = ces[CE_INDEX_VITORIA]["list"]

    audio_idx = _find_audio_index(cmds)
    if audio_idx == -1:
        return ("skipped (audio command not found; manual review)", ces)

    start_idx, end_idx = _find_script_block(cmds)
    if start_idx == -1 or end_idx == -1:
        return ("skipped (script block setValue(117) not found; manual review)", ces)

    # Idempotência: bloco já está antes do áudio?
    if end_idx < audio_idx:
        return (
            f"skipped (script block at [{start_idx}-{end_idx}] already precedes audio at [{audio_idx}])",
            ces,
        )

    # Sanity: o bloco deve ter exatamente 5 cmds (1 Script + 4 ScriptContinue).
    block_size = end_idx - start_idx + 1
    if block_size != 5:
        return (
            f"skipped (script block has {block_size} cmds, expected 5; manual review)",
            ces,
        )

    # Move: remove o bloco da posição atual e reinsere antes do áudio.
    # Como o bloco está DEPOIS do áudio (end_idx > audio_idx), a remoção não
    # afeta audio_idx; a reinserção em audio_idx desloca o áudio para frente.
    block = cmds[start_idx:end_idx + 1]
    del cmds[start_idx:end_idx + 1]
    for offset, cmd in enumerate(block):
        cmds.insert(audio_idx + offset, cmd)

    return (
        f"applied (moved script block [{start_idx}-{end_idx}] to before audio at [{audio_idx}]; {len(cmds)} cmds)",
        ces,
    )


# =============================================================================
# Patch H — Substitui PlaySE por branch Play ME (Victory | Defeat)
# =============================================================================
def patch_h_branch_audio(ces):
    """Troca o Play ME "Victory1" (code 249) por um branch condicional que
    toca Play ME distinto para vitória vs derrota.

    Três estados detectáveis:

    Estado A (pré-Patch H, original):
      [N]   Play ME "Victory1"                (code 249)
      → substitui pelo branch de 5 cmds abaixo.

    Estado B (regressão v1 — errado):
      [N]   If VAR_VITORIA_PASSOU == 1        (code 111)
      [N+1]   FadeoutBGS {Victory1}           (code 246, ERRADO)
      [N+2] Else                              (code 411)
      [N+3]   FadeoutBGS {Defeat1}            (code 246, ERRADO)
      [N+4] End                               (code 412)
      → corrige opcodes 246→249 e normaliza params para 5 elementos.

    Estado C (alvo, correto):
      [N]   If VAR_VITORIA_PASSOU == 1        (code 111, indent 0)
      [N+1]   Play ME "Victory1"              (code 249, indent 1)
      [N+2] Else                              (code 411, indent 0)
      [N+3]   Play ME "Defeat1"               (code 249, indent 1)
      [N+4] End                               (code 412, indent 0)
      → skip (idempotente).

    Nota histórica: a versão v1 deste patch trocava 249→246 achando que 246
    era Play ME. Na verdade 246 é FadeoutBGS. v2 detecta o estado B e repara.
    """
    cmds = ces[CE_INDEX_VITORIA]["list"]

    # Estado C: branch correto já presente (idempotente).
    for i in range(len(cmds) - 4):
        if (
            cmds[i]["code"] == CODE_CONDITIONAL_BRANCH
            and cmds[i]["parameters"][:5] == BRANCH_VITORIA_PASSOU_EQ_1
            and cmds[i + 1]["code"] == CODE_PLAY_ME
            and isinstance(cmds[i + 1]["parameters"][0], dict)
            and cmds[i + 2]["code"] == CODE_ELSE
            and cmds[i + 3]["code"] == CODE_PLAY_ME
            and isinstance(cmds[i + 3]["parameters"][0], dict)
            and cmds[i + 4]["code"] == CODE_END
        ):
            me_names = {
                cmds[i + 1]["parameters"][0].get("name"),
                cmds[i + 3]["parameters"][0].get("name"),
            }
            return (
                f"skipped (correct branched Play ME already present at cmd[{i}] with names {sorted(me_names)})",
                ces,
            )

    # Estado B: branch com opcodes errados (FadeoutBGS disfarçado de Play ME).
    for i in range(len(cmds) - 4):
        if (
            cmds[i]["code"] == CODE_CONDITIONAL_BRANCH
            and cmds[i]["parameters"][:5] == BRANCH_VITORIA_PASSOU_EQ_1
            and cmds[i + 1]["code"] == CODE_FADEOUT_BGS
            and isinstance(cmds[i + 1]["parameters"][0], dict)
            and cmds[i + 2]["code"] == CODE_ELSE
            and cmds[i + 3]["code"] == CODE_FADEOUT_BGS
            and isinstance(cmds[i + 3]["parameters"][0], dict)
            and cmds[i + 4]["code"] == CODE_END
        ):
            cmds[i + 1]["code"] = CODE_PLAY_ME
            cmds[i + 3]["code"] = CODE_PLAY_ME
            cmds[i]["parameters"] = list(BRANCH_VITORIA_PASSOU_EQ_1)
            return (
                f"applied (fixed wrong opcode 246→249 in branch at cmd[{i}]; {len(cmds)} cmds)",
                ces,
            )

    # Estado A: procurar Play ME "Victory1" único para substituir.
    audio_idx = -1
    for i, cmd in enumerate(cmds):
        if cmd["code"] == CODE_PLAY_ME and isinstance(cmd["parameters"][0], dict):
            if cmd["parameters"][0].get("name") == VICTORY_ME:
                audio_idx = i
                break
    if audio_idx == -1:
        return ("skipped (single Play ME Victory1 not found; manual review)", ces)

    # Constrói o branch (5 cmds). Substitui o Play ME in-place pelo primeiro
    # cmd e insere os 4 restantes logo após.
    branch = [
        C(CODE_CONDITIONAL_BRANCH, 0, list(BRANCH_VITORIA_PASSOU_EQ_1)),
        C(CODE_PLAY_ME, 1, [_audio_param(VICTORY_ME)]),
        C(CODE_ELSE, 0, []),
        C(CODE_PLAY_ME, 1, [_audio_param(DEFEAT_ME)]),
        C(CODE_END, 0, []),
    ]

    cmds[audio_idx] = branch[0]
    for offset, cmd in enumerate(branch[1:], start=1):
        cmds.insert(audio_idx + offset, cmd)

    return (
        f"applied (replaced single Play ME at cmd[{audio_idx}] with branched Play ME; {len(cmds)} cmds)",
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

    print("--- Patch G: CE 19 — bloco setValue(117) antes do áudio ---")
    result_g, ces = patch_g_compute_before_audio(ces)
    print(f"  Patch G: {result_g}\n")
    applied_any |= result_g.startswith("applied")

    print("--- Patch H: CE 19 — branch Play ME (Victory | Defeat) ---")
    result_h, ces = patch_h_branch_audio(ces)
    print(f"  Patch H: {result_h}\n")
    applied_any |= result_h.startswith("applied")

    if applied_any:
        _write_back(ces)
        print(f"JSON escrito: {CE_PATH}")
    else:
        print("Nenhuma mudança aplicada — JSON não regravado.")

    print("\n--- Snapshot final ---")
    ce = ces[CE_INDEX_VITORIA]
    print(f"  CE[{CE_INDEX_VITORIA:2}] {ce['name']!r:30} cmds={len(ce['list'])}")


if __name__ == "__main__":
    main()
