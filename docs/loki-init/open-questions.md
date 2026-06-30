---
title: "Loki Init - Open Questions"
tipo: "questoes abertas"
status: "concluido"
tags:
  - loki-init
  - open-questions
  - human-gates
---

# Loki Init - Open Questions

Data: 2026-06-30

## Product

- Curva do Diabo is MVP scope, future scope, or dormant runtime support that must remain unreachable?
- Should the current thresholds 200/400/600 intentionally require risk actions to win?
- Is safe-only failure acceptable design, or should safe-only remain a viable but lower-score path?
- Should crash, defeat by score and victory share the same result screen flow?
- What is the release stance for debug logs and helper plugin logging?

## Runtime And Technical

- Is timeout canonically safe automatic or crash/restart?
- Does race RNG need deterministic seeding from `VAR_SEED`, or is non-deterministic `Math.random` acceptable?
- Where is race progression between races owned: Common Events, maps, plugin helper or VN flow?
- What save/load behavior is allowed during race, result screen, crash, retry and input lock?
- Which plugin files need read-only source mapping before any Common Event or UI change?
- Are ButtonPicture callbacks, TextPicture rendering, input locks and parallel Common Events reliable under Playtest?

## Narrative

- What is the canonical spelling and naming surface: `Jhonny`, `Jonny`, `Johnny` or `João/Joao` where each appears?
- Should route and ending logic depend on `ConcernScore`, race victory, Curva do Diabo, safe/risk profile or a separate VN state?
- Which endings are reachable in MVP, and which are future-only?
- What is the intended language policy for UI, result text and route labels: Portuguese-only, English-only or mixed?
- What is the tone safety target for dangerous driving, depression/loss, farewell and dissociative POV themes?

## Audio

- Is crash audio `Shock1`, `crash_metal`, `Defeat1`, silence, or a layered sequence?
- Should timer ticking exist in MVP, and what accessibility fallback is required if it does?
- Are Curva do Diabo audio cues future-only?
- What mix priority should BGM, ME, safe/risk SE, crash feedback and result cues use?
- Does audio-off Playtest still communicate timer, risk cost, crash and result clearly?

## UX/UI

- Should `P_cena` be hidden, shown numerically, or represented only as visual intensity?
- Which input schemes are officially supported: mouse/tap, arrow keys, WASD, or all of them?
- What is the minimum readable result screen copy, and should runtime text be localized to `pt_BR`?
- Are hover risk overlays required for MVP?
- What are contrast, timing and comfort requirements for tint, shake, flash and fade effects?

## Human Gates

- Run Playtest before validating gameplay feel, input, UI, audio, pictures, Common Events, save/load, retry or result flow.
- Run focused `loki:tech-analysis` before creating implementation tasks for `Jhonny/data/*.json`, `Jhonny/js/plugins/**`, `Jhonny/js/plugins.js`, assets or runtime behavior.
- Obtain product approval before changing MVP scope, Curva do Diabo reachability, timeout semantics, language policy, thresholds or crash presentation.
