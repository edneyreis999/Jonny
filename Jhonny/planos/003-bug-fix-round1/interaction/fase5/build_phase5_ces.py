"""Phase 5 — THRESHOLDS refactor: extract literals to window.JhonnyRace.

Single patch:

  patch_m_replace_threshold_with_helper — CE 19 (EV_VitoriaCorrida) cmd[6-10]:
    the contiguous Script block (1x code=355 + 4x code=655) that computes
    VAR_VITORIA_PASSOU via the dict-with-fallback structure
    `{ 1: 200, 2: 400, 3: 600 }` with `|| 60` fallback is rewritten in-place
    to an if/else:
      - if `typeof window.JhonnyRace === "undefined"` → run the OLD code
        verbatim (defensive against plugin-load failure).
      - else → call `window.JhonnyRace.isVictory(pontos, raceId)`.

The new block is exactly 5 commands (same shape: 1x code=355 + 4x code=655)
so downstream indices (ceremony-lock head, WAIT_INPUT label, conditional
branches on VAR_VITORIA_PASSOU, etc.) are NOT shifted.

Spec reference:
  - Jhonny/planos/003-bug-fix-round1/tasks.md (Fase 5)
  - Jhonny/planos/003-bug-fix-round1/race-feedback-impl-guide.md §2
  - Jhonny/planos/003-bug-fix-round1/interaction/fase5/sites-inventory.md

Patch letter M is reserved for Phase 5 (Phases 1-4 used A-L; see
`rg "patch_[a-z]_" builds/ interaction/`).

Idempotency contract:
  - 1st run: prints "applied: ..." and rewrites the JSON.
  - 2nd run: prints "skipped: ..." and leaves JSON unchanged (empty git diff).

Conventions:
  - Code 355 = Script; params[0] is the JS source string.
  - Code 655 = Script continuation; concatenated with the previous 355 via
    newline join by Game_Interpreter.prototype.command355/655 in
    Jhonny/js/rmmz_objects.js.
  - Never delete or null a CE. This patch only mutates the 5 script-source
    strings in CE 19 cmd[6-10].
  - Never touch code=121 (ControlSwitch) on switches 100/101/104
    (ceremony-lock invariant — see tasks.md "Ceremony-lock invariant").
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[5]
PATH = REPO_ROOT / "Jhonny" / "data" / "CommonEvents.json"

CE_INDEX_VITORIA = 19
CE_EXPECTED_NAME = "EV_VitoriaCorrida"

CODE_SCRIPT = 355
CODE_SCRIPT_CONTINUE = 655

# Ceremony-lock switches (must NOT be touched anywhere in CE 19).
SW_RACE_ACTIVE = 100
SW_INPUT_LOCKED = 101
SW_PAUSED = 104


def _write_back(ces):
    PATH.write_text(
        json.dumps(ces, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def _concat_script_source(cmds):
    """Concatenate every code=355/655 source string in CE 19 into one blob.

    The engine does this at runtime via newline join, so this mirrors what
    the Game_Interpreter sees when executing the script block.
    """
    return "\n".join(
        cmd["parameters"][0]
        for cmd in cmds
        if cmd["code"] in (CODE_SCRIPT, CODE_SCRIPT_CONTINUE)
        and isinstance(cmd.get("parameters"), list)
        and cmd["parameters"]
        and isinstance(cmd["parameters"][0], str)
    )


def _find_threshold_block(cmds):
    """(start_idx, end_idx) of the dict-with-fallback threshold block.

    The block is a contiguous run of code=355 (1 cmd) followed by code=655
    (>=1 cmd) whose concatenated source contains BOTH:
      - `$gameVariables.value(105)` OR `$gameVariables.value(100)`, AND
      - a threshold token: `{ 1: 200`, `{ 1:200`, `thresholds[raceId]`,
        or any of the literals 200/400/600 in a dict/comparison context.

    Returns (-1, -1) if no such block exists.
    """
    n = len(cmds)
    for i in range(n):
        if cmds[i]["code"] != CODE_SCRIPT:
            continue
        # Walk forward through 355 then any contiguous 655s.
        j = i
        while j + 1 < n and cmds[j + 1]["code"] == CODE_SCRIPT_CONTINUE:
            j += 1
        if j == i:
            continue  # isolated 355 with no continuation — not the block
        src = "\n".join(
            cmds[k]["parameters"][0] for k in range(i, j + 1)
        )
        has_var = (
            "$gameVariables.value(105)" in src
            or "$gameVariables.value(100)" in src
        )
        has_threshold_token = (
            "{ 1: 200" in src
            or "{ 1:200" in src
            or "thresholds[raceId]" in src
            or re.search(r"\{\s*1\s*:\s*200\b", src) is not None
        )
        if has_var and has_threshold_token:
            return (i, j)
    return (-1, -1)


# The 5 replacement command sources. Each becomes one cmd in CE 19.
#
# Distribution: cmd[6]=code 355 opens the if and carries the entire fallback
# body (so the fallback lives in a single line, isolated from the helper
# branch). cmds[7-9]=code 655 form the helper body. cmd[10]=code 655 closes
# the else block.
#
# Indent inside strings uses 4 spaces to match the surrounding JS style.
# Indent field on every cmd remains 0 (these are top-level Script commands
# inside CE 19, not nested inside a branch).

SRC_CMD6_OPEN_AND_FALLBACK = (
    'if (typeof window.JhonnyRace === "undefined") {'
    ' const pontos = $gameVariables.value(105);'
    ' const raceId = $gameVariables.value(100);'
    ' const thresholds = { 1: 200, 2: 400, 3: 600 };'
    ' const passou = pontos >= (thresholds[raceId] || 60);'
    ' $gameVariables.setValue(117, passou ? 1 : 0);'
    ' } else {'
)

SRC_CMD7_HELPER_RACE_ID = (
    '    const raceId = $gameVariables.value(100);'
)

SRC_CMD8_HELPER_PONTOS = (
    '    const pontos = $gameVariables.value(105);'
)

SRC_CMD9_HELPER_CALL = (
    '    $gameVariables.setValue(117,'
    ' window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0);'
)

SRC_CMD10_CLOSE = (
    '    }'
)

REPLACEMENT_SOURCES = [
    SRC_CMD6_OPEN_AND_FALLBACK,
    SRC_CMD7_HELPER_RACE_ID,
    SRC_CMD8_HELPER_PONTOS,
    SRC_CMD9_HELPER_CALL,
    SRC_CMD10_CLOSE,
]


def patch_m_replace_threshold_with_helper(ces):
    """Rewrite CE 19 cmd[6-10] to use window.JhonnyRace.isVictory.

    Returns (status_str, ces). Status starts with "applied" or "skipped".
    """
    if (
        CE_INDEX_VITORIA >= len(ces)
        or ces[CE_INDEX_VITORIA] is None
        or ces[CE_INDEX_VITORIA].get("name") != CE_EXPECTED_NAME
    ):
        return (
            "skipped (CE 19 is not EV_VitoriaCorrida; manual review)",
            ces,
        )

    cmds = ces[CE_INDEX_VITORIA]["list"]

    # Idempotency predicate: helper call already present.
    src_all = _concat_script_source(cmds)
    if "window.JhonnyRace.isVictory" in src_all:
        return ("skipped (helper call already present)", ces)

    # Locate the threshold block.
    start_idx, end_idx = _find_threshold_block(cmds)
    if start_idx == -1 or end_idx == -1:
        return (
            "skipped (threshold dict-with-fallback block not found; manual review)",
            ces,
        )

    block_size = end_idx - start_idx + 1
    if block_size != 5:
        return (
            f"skipped (threshold block has {block_size} cmds, expected 5; manual review)",
            ces,
        )

    # Ceremony-lock invariant: confirm the lock head (SW_INPUT_LOCKED=ON,
    # SW_PAUSED=ON) is intact BEFORE we mutate. We don't touch code=121
    # anywhere, but assert defensively.
    head = cmds[:8]
    sw_on_101 = any(
        c["code"] == 121
        and c.get("parameters", [])[:2] == [SW_INPUT_LOCKED, SW_INPUT_LOCKED]
        and c["parameters"][2] == 0
        for c in head
    )
    sw_on_104 = any(
        c["code"] == 121
        and c.get("parameters", [])[:2] == [SW_PAUSED, SW_PAUSED]
        and c["parameters"][2] == 0
        for c in head
    )
    if not (sw_on_101 and sw_on_104):
        return (
            "skipped (ceremony-lock head missing SW_INPUT_LOCKED=ON or SW_PAUSED=ON; manual review)",
            ces,
        )

    # Apply: rewrite each of the 5 cmds in-place. Same indent (0), same
    # codes (355 for the head, 655 for the rest), only the source string
    # changes.
    for offset, new_src in enumerate(REPLACEMENT_SOURCES):
        target = cmds[start_idx + offset]
        # Sanity: don't silently flip codes.
        expected_code = CODE_SCRIPT if offset == 0 else CODE_SCRIPT_CONTINUE
        if target["code"] != expected_code:
            return (
                f"skipped (cmd[{start_idx + offset}] has code {target['code']}, expected {expected_code}; manual review)",
                ces,
            )
        target["parameters"] = [new_src]

    return (
        f"applied (rewrote CE 19 cmd[{start_idx}-{end_idx}] to use window.JhonnyRace.isVictory; {len(cmds)} cmds)",
        ces,
    )


def main():
    if not PATH.exists():
        print(f"ERRO: {PATH} não encontrado", file=sys.stderr)
        sys.exit(1)

    ces = json.loads(PATH.read_text(encoding="utf-8"))
    print(f"Estado inicial: {len(ces)} slots CE\n")

    print("--- Patch M: CE 19 — replace threshold dict with window.JhonnyRace.isVictory ---")
    result_m, ces = patch_m_replace_threshold_with_helper(ces)
    print(f"  Patch M: {result_m}\n")

    if result_m.startswith("applied"):
        _write_back(ces)
        print(f"JSON escrito: {PATH}")
    else:
        print("Nenhuma mudança aplicada — JSON não regravado.")

    print("\n--- Snapshot final ---")
    ce = ces[CE_INDEX_VITORIA]
    print(f"  CE[{CE_INDEX_VITORIA:2}] {ce['name']!r:30} cmds={len(ce['list'])}")


if __name__ == "__main__":
    main()
