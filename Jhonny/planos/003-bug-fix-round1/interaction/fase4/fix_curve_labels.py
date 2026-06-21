"""Phase 4 — Curve label/binding inversion fix.

Two patches:
  patch_k_mouse_bindings    — CE 9 (EV_RenderCurva) cmds 12/13: swap which
                              picture is bound to CE 11 (Safe) vs CE 12 (Risk).
  patch_l_keyboard_bindings — CE 13 (EV_KeyInput) cmd 4: in the Curva branch
                              of the inline JS, swap right/left CE IDs.

Spec reference: docs/02-Core-Loop/Corrida - Core Loop.md §5 (corrected
2026-06-21) — Direita = Risk, Esquerda = Safe.

Patch letters K and L were chosen because Phases 1/2/3 already used A–J
(see `rg "patch_[a-z]_" builds/ interaction/`).

Idempotency contract:
  - 1st run: prints "applied: ..." for each patch and rewrites the JSON.
  - 2nd run: prints "skip: ..." for each patch and leaves JSON unchanged
    (empty git diff).

Conventions:
  - Code 355 = Script; params[0] is the JS source string
    (confirmed via Game_Interpreter.prototype.command355 in
    Jhonny/js/rmmz_objects.js).
  - Never delete or null a CE. These patches only mutate one string per
    command.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[5]
PATH = REPO_ROOT / "Jhonny" / "data" / "CommonEvents.json"

CE_RENDER_CURVA = 9
CE_KEY_INPUT = 13
CE_ID_SAFE = 11
CE_ID_RISK = 12


def _expected_mouse_src(pic_id: int, ce_id: int) -> str:
    return (
        f"const p = $gameScreen.picture({pic_id}); "
        f"if (p) p.mzkp_commonEventId = {ce_id};"
    )


def patch_k_mouse_bindings(ces: list) -> tuple[str, list]:
    """Swap mouse CE bindings on CE 9 (EV_RenderCurva) cmds 12 and 13.

    Pre-patch:  picture(43) -> CE 11 (Safe),  picture(44) -> CE 12 (Risk).
    Post-patch: picture(43) -> CE 12 (Risk),  picture(44) -> CE 11 (Safe).
    """
    ce = ces[CE_RENDER_CURVA]
    if ce is None or ce.get("name") != "EV_RenderCurva":
        return "skip: CE 9 is not EV_RenderCurva", ces

    cmds = ce["list"]
    c12 = cmds[12]
    c13 = cmds[13]
    if c12.get("code") != 355 or c13.get("code") != 355:
        return "skip: CE 9 cmds 12/13 are not Script (code 355)", ces

    src12 = c12["parameters"][0]
    src13 = c13["parameters"][0]

    target_pic43 = _expected_mouse_src(43, CE_ID_RISK)
    target_pic44 = _expected_mouse_src(44, CE_ID_SAFE)

    if src12 == target_pic43 and src13 == target_pic44:
        return "skip: CE 9 cmds 12/13 already bound direita->12, esquerda->11", ces

    if not (
        "picture(43)" in src12 and "mzkp_commonEventId" in src12
        and "picture(44)" in src13 and "mzkp_commonEventId" in src13
    ):
        return (
            "skip: CE 9 cmds 12/13 do not match expected picture-id pattern",
            ces,
        )

    c12["parameters"][0] = target_pic43
    c13["parameters"][0] = target_pic44
    return (
        f"applied: CE 9 cmds 12/13 swapped "
        f"(pic43 -> CE {CE_ID_RISK}, pic44 -> CE {CE_ID_SAFE})",
        ces,
    )


def patch_l_keyboard_bindings(ces: list) -> tuple[str, list]:
    r"""Swap keyboard CE reservations in the Curva branch of CE 13 cmd 4.

    Pre-patch: ``right`` -> CE 11, ``left`` -> CE 12.
    Post-patch: ``right`` -> CE 12, ``left`` -> CE 11.
    The Sinal branch (``down`` -> CE 11, ``up`` -> CE 12) is untouched.

    Uses regex to tolerate the variable whitespace that the original
    source uses to align ``'left'`` with ``'right'`` (two spaces after
    ``('left'))`` vs one after ``('right'))``).
    """
    ce = ces[CE_KEY_INPUT]
    if ce is None or ce.get("name") != "EV_KeyInput":
        return "skip: CE 13 is not EV_KeyInput", ces

    cmd = ce["list"][4]
    if cmd.get("code") != 355:
        return "skip: CE 13 cmd 4 is not Script (code 355)", ces

    src = cmd["parameters"][0]

    # Shape gate: must reference both Curva and Sinal keys + reserveCommonEvent.
    if not (
        "'right'" in src and "'left'" in src
        and "'down'" in src and "'up'" in src
        and "reserveCommonEvent" in src
    ):
        return "skip: CE 13 cmd 4 does not match expected key-handler shape", ces

    # Regex captures: key + optional alignment whitespace + reserveCommonEvent(N).
    # \s+ (not literal space) handles the alignment between 'left' and 'right'.
    pattern_right = re.compile(
        r"(isTriggered\('right'\)\)\s+\$gameTemp\.reserveCommonEvent\()(\d+)(\))"
    )
    pattern_left = re.compile(
        r"(isTriggered\('left'\)\)\s+\$gameTemp\.reserveCommonEvent\()(\d+)(\))"
    )

    m_right = pattern_right.search(src)
    m_left = pattern_left.search(src)
    if m_right is None or m_left is None:
        return "skip: CE 13 cmd 4 right/left patterns not found", ces

    right_ce = int(m_right.group(2))
    left_ce = int(m_left.group(2))

    if right_ce == CE_ID_RISK and left_ce == CE_ID_SAFE:
        return "skip: CE 13 cmd 4 Curva branch already fixed (right->12, left->11)", ces

    if right_ce != CE_ID_SAFE or left_ce != CE_ID_RISK:
        return (
            f"skip: CE 13 cmd 4 unexpected state "
            f"(right->{right_ce}, left->{left_ce})",
            ces,
        )

    src = pattern_right.sub(lambda m: f"{m.group(1)}{CE_ID_RISK}{m.group(3)}", src)
    src = pattern_left.sub(lambda m: f"{m.group(1)}{CE_ID_SAFE}{m.group(3)}", src)
    cmd["parameters"][0] = src
    return "applied: CE 13 cmd 4 Curva branch swapped (right->CE 12, left->CE 11)", ces


def _load() -> list:
    with PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def _write_back(ces: list) -> None:
    # Match RPG Maker MZ's `indent=4` formatting to avoid reflowing every
    # line in the file. HEAD was verified as 4-space before this script
    # was first written.
    with PATH.open("w", encoding="utf-8") as f:
        json.dump(ces, f, indent=4, ensure_ascii=False)


def main() -> int:
    ces = _load()
    msg_k, ces = patch_k_mouse_bindings(ces)
    msg_l, ces = patch_l_keyboard_bindings(ces)
    _write_back(ces)
    print(msg_k)
    print(msg_l)
    return 0


if __name__ == "__main__":
    sys.exit(main())
