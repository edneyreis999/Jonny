---
task_id: 2.1
phase: 2
generated_at: 2026-06-20
---

# ME Asset Choice — Phase 2

## Inventory — `Jhonny/audio/me/`

28 `.ogg` files. Relevant candidates:

| File           | Role                                     |
| -------------- | ---------------------------------------- |
| `Victory1.ogg` | Current Victory audio (CE 19 cmd[6])     |
| `Victory2.ogg` | Alternate victory                        |
| `Victory3.ogg` | Alternate victory                        |
| `Defeat1.ogg`  | **System.json `defeatMe.name` (canonical)** |
| `Defeat2.ogg`  | Alternate defeat                         |
| `Gameover1.ogg`| System.json `gameoverMe.name`            |
| `Gameover2.ogg`| Alternate gameover                       |

Other files (`Curse*`, `Fanfare*`, `Gag`, `Horror`, `Inn*`, `Item`, `Like`,
`Musical*`, `Mystery`, `Organ`, `Refresh`, `Shock*`) are tonally unrelated to
a loss screen.

## Victory ME (excluded from defeat candidates)

- **Name:** `Victory1`
- **Source:** `Jhonny/data/System.json` → `victoryMe.name == "Victory1"`,
  with `volume=90, pitch=100, pan=0`.
- **Currently used as:** CE 19 cmd[6] audio — `PlaySE` code **249** (folder
  mismatch: `Victory1.ogg` lives in `audio/me/`, not `audio/se/`; Patch H
  flips the opcode to 246 so it resolves through the ME channel).

## Defeat ME (chosen)

- **Name:** `Defeat1`
- **Path:** `Jhonny/audio/me/Defeat1.ogg` (confirmed via `test -f`).
- **Canonical status:** `Jhonny/data/System.json` →
  `defeatMe == {"name": "Defeat1", "volume": 90, "pitch": 100, "pan": 0}`.
  This wins over `Defeat2` / `Gameover1` / `Gameover2` per task-2.1 §3
  "Canonical preference."
- **Rationale:** `Defeat1` is the system-canonical defeat ME; using it
  matches RMMZ's own `Defeat` flow and is the strongest audible signal to
  the player that the race was lost.

## Parameter levels (matched to original PlaySE)

Both Play ME commands in Patch H will use:

```
{"name": "<Victory1|Defeat1>", "volume": 90, "pitch": 100, "pan": 0}
```

These match the original CE 19 cmd[6] `PlaySE Victory1` dict and the
System.json `victoryMe` / `defeatMe` levels, so the only difference between
the two branches is the asset name.
