---
title: "Loki Init - Quest Content Designer Inventory"
tipo: "inventario quest-content-designer"
status: "static-only"
agent: "quest-content-designer"
tags:
  - loki-init
  - quest-content
  - rpg-maker-mz
  - corrida
---

# Loki Init - Quest Content Designer Inventory

Data: 2026-06-30
Consumer root: `/Users/edney/projects/coreto/summer26`
Runtime project observed: `Jhonny/`
Mode: focused static inventory for quest/content surfaces.

## Scope

This inventory covers quest/content evidence only: quests or quest-like chains,
objectives, NPC/content roles, stages, rewards/payoffs, flags, preconditions,
postconditions, source locations, and missing quest-log/objective evidence.

It does not edit quest logs, event data, maps, rewards, database records,
dialogue, plugins, assets, or runtime files. It does not validate pacing,
comprehension, reachability, Common Event execution, save/load, input, audio,
visuals, or player-facing clarity.

## Sources Read

| Source | Use | Evidence level |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Common init inventory, write limits, RPG Maker MZ signature, known switches/variables/Common Events. | static inventory |
| `docs/loki-init/technology-context.md` | Selected project type, detected stack, validators and human gates. | static inventory |
| `docs/index.xml` | Catalog navigation and quest-content-designer entries. | catalog metadata |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Main design source for race objectives, stages, rewards, flags and open questions. | design spec |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Runtime contract for Common Event graph, result screen, retry and input lock. | runtime contract, static only |
| `Jhonny/data/MapInfos.json` | Map names and IDs. | parse-valid |
| Selected maps: `Map001`, `Map002`, `Map003`, `Map004`, `Map005`, `Map006`, `Map007`, `Map008`, `Map009`, `Map010`, `Map011`, `Map012`, `Map013`, `Map014`, `Map015`, `Map016` | Static event summaries for VN/race/final map flow, speakers, choices, transfers, variable writes and Common Event calls. | parse-valid, editor-structural |

Not read in this task: `Jhonny/data/CommonEvents.json`, `Jhonny/data/System.json`,
plugin files, all database files, assets, audio, saves, editor state and
Playtest/runtime state. Some facts from those files are reused only where the
common init inventory or durable docs already recorded them.

## Location Map

| Content type | Where to look |
| --- | --- |
| Race quest-like chain design | `docs/02-Core-Loop/Corrida - Core Loop.md`, sections 1, 6, 7, 8, 11, 12/13. |
| Runtime race ownership | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`, Common Event graph and result screen sections. |
| Map entry into races | `Jhonny/data/Map001.json` event `Init Corrida`, pages gated by variable 100. |
| VN setup before race 1 | `Map011` transfers to `Map010`; `Map010` transfers to `Map001` and sets variables 1 and 100. |
| VN setup before race 2 | `Map005` transfers to `Map001` and sets variables 2 and 100. |
| VN setup before race 3 | `Map013` transfers to `Map001` and sets variables 4 and 100. |
| True/sabotage ending chain | `Map013` can transfer to `Map006`; then `Map006 -> Map007 -> Map008 -> Map015 -> Map014`. |
| False/crash ending chain | `Map013` can transfer to `Map001`; `Map016 -> Map012 -> Map009` is present as a separate ending path surface, but static reachability from the inspected flow is not proven here. |
| Quest log/objective UI evidence | No explicit quest log, journal, mission, objective, task, or reward-log surface was found in the inspected docs/maps. |

## Current Quest-Like Chains

### Race Chain: Lenda -> Rachadura -> Abismo

The main quest-like content is the race progression chain. The docs describe
three fixed narrative races:

| Stage | Runtime state | Objective | Success | Failure/retry | Reward/payoff |
| --- | --- | --- | --- | --- | --- |
| Corrida 1: Lenda | `VAR_RACE_ID = 1`; `VAR_RACE_N_CENAS = 6` | Complete all scenes and reach `VAR_PONTOS_GLORIA >= 200`. | `VAR_VITORIA_PASSOU = 1`; increment `VAR_RACE_ID` and call race orchestrator for Corrida 2. | Below threshold or crash restarts Corrida 1 via `EV_Crash`; `VAR_ATTEMPT_N` increments. | Access to Corrida 2; victory result screen. |
| Corrida 2: Rachadura | `VAR_RACE_ID = 2`; `VAR_RACE_N_CENAS = 8` | Complete all scenes and reach `VAR_PONTOS_GLORIA >= 400`. | `VAR_VITORIA_PASSOU = 1`; increment `VAR_RACE_ID` and call race orchestrator for Corrida 3. | Below threshold or crash restarts Corrida 2 via `EV_Crash`; `VAR_ATTEMPT_N` increments. | Access to Corrida 3; victory result screen. |
| Corrida 3: Abismo | `VAR_RACE_ID = 3`; `VAR_RACE_N_CENAS = 10` | Complete all scenes and reach `VAR_PONTOS_GLORIA >= 600`. | `VAR_VITORIA_PASSOU = 1`; show final "FIM" / "Obrigado por jogar!" in the documented MVP path. | Below threshold or crash restarts Corrida 3 via `EV_Crash`; `VAR_ATTEMPT_N` increments. | End-state payoff; no endless mode in MVP. |

Static evidence:

- `Corrida - Core Loop.md` defines the chain, thresholds, scene counts, restart
  semantics, score rewards and post-input branch table.
- `Corrida - Runtime e Eventos.md` identifies `EV_RaceRenderer`, `EV_Crash`,
  `EV_RaceOrchestrator` and `EV_VitoriaCorrida` as owners of this flow.
- `Map001` has event `Init Corrida` with three autorun pages gated by
  `var100>=1`, `var100>=2` and `var100>=3`, each calling Common Event 5 and
  erasing the event.

Static limits:

- This inventory did not parse `CommonEvents.json`; it relies on the durable
  docs and common inventory for CE IDs and names.
- Runtime execution of `command117`, result screen, retry and event erasure was
  not validated.

### VN-To-Race Setup Chain

The inspected maps show a VN setup flow that sets race state before transferring
into the race-init map:

| Segment | Static map evidence | State write evidence | Transfer evidence |
| --- | --- | --- | --- |
| Prologue to VN1 | `Map011` has one autorun event with Show Text and transfer. | No variable write in inspected summary. | `Map011 -> Map010`. |
| VN1 to race 1 | `Map010` has one autorun event, 31 Show Text commands, speaker counts `Jonny:16`, `Chance:14`, and CE calls 20/21. | Writes variable 1 to 1 and variable 100 to 1. | `Map010 -> Map001`. |
| VN2 to race 2 | `Map005` has one autorun event across 3 pages, 62 Show Text commands, 15 three-option choice groups, speakers `Jonny:52`, `Chance:10`, and CE calls 20/21. | Writes variable 2 to 1, variable 2 to 2, and variable 100 to 2. | `Map005 -> Map001`. |
| VN3 to race 3 / endings | `Map013` has one large autorun event, 1310 Show Text commands, 446 choice groups, speakers `Jonny:1291`, `Chance:19`, and CE calls 20/21. | Writes variable 4 to 1 several times and variable 100 to 3 once. | `Map013 -> Map006` appears 19 times; `Map013 -> Map001` appears once. |

Interpretation, static only: variables 1, 2 and 4 appear to be local VN page
progression or route-state variables; variable 100 is the race ID based on the
durable docs. The exact meaning of variables 1, 2 and 4 was not established
from `System.json` in this task.

### Ending/Payoff Chains

Inspected ending maps contain static payoff surfaces:

| Chain | Static evidence | Notes |
| --- | --- | --- |
| Sabotage/true chain | `Map006` speakers `Jonny:9`, `Chance:11`, transfers to `Map007`; `Map007` speaker `Principal:9`, transfers to `Map008`; `Map008` transfers to `Map015`; `Map015` shows one message and transfers to `Map014`; `Map014` returns to title. | Map names indicate `FIM_TRUE_Estrada_VN4_SABOTAGEM`, `Formatura_True`, `JonnyFormando`, `Formatura_True2`, `CelularVazio`. |
| False/crash chain | `Map016` speaker `Jonny:1`, transfers to `Map012`; `Map012` speakers `Principal:4`, `Student:5`, transfers to `Map009`; `Map009` speaker `Chance:2`, scrolling text and return to title. | Map names indicate `Batida`, `FIM_FALSE_Formatura_False`, `Celular`. Static reachability from the inspected race result flow was not proven. |

## Objectives

| Objective surface | Evidence | Explicit to player? | Missing evidence |
| --- | --- | --- | --- |
| Finish each race without fatal crash. | Core loop docs and runtime docs. | Implemented as gameplay/result flow, not as a separate quest log in inspected sources. | No objective tracker, journal or mission UI found. |
| Earn enough `Pontos de Gloria` to pass thresholds. | Core loop section 8 and result screen docs. | Result screen shows `Pontos de Gloria: \\V[105]`; thresholds are design/runtime contract. | No evidence that target threshold is shown before/during the race. Player comprehension requires Playtest. |
| Choose safe/risk actions per scene. | Core loop sections 3-5 and map/runtime docs. | Button/textpicture UI expected, but not validated here. | No runtime preview. |
| Progress from race 1 to race 2 to race 3. | Core loop branch table and `Map001` race-ID pages. | Result screen confirmation exists in docs; runtime not validated here. | No explicit quest-step text found. |
| Possible intervention/sabotage around Curva do Diabo. | Core loop mentions ConcernScore and intervention as outside core loop/pitch-owned; `Map013` has many choices and transfers to true/sabotage map. | Branching content exists statically in maps. | ConcernScore owner, exact predicate and reachability are not proven from inspected sources. |

## NPC And Content Roles

| Role/name | Evidence | Current role in quest/content |
| --- | --- | --- |
| Jonny / Johnny / Joao | Core loop POV note; map speakers `Jonny` across VN and endings. | Central character/racer; race POV shifts to him during races. Name spelling varies across sources and text. |
| Chance | Map speakers `Chance` in VN and ending maps. | Friend/player-facing dialogue role in VN choices and payoff maps. |
| Principal | `Map007` and `Map012` speaker counts. | Graduation/ending payoff speaker. |
| Student | `Map012` speaker counts. | False-ending graduation surface. |
| Unnamed player/friend POV | Core loop says between races player is the friend; race POV becomes Joao. | Implied player role; not represented as a named speaker in every map. |

NPC gap: no separate NPC registry, quest-giver table, objective owner list or
canonical spelling table was found in the inspected sources.

## Rewards And Payoffs

| Reward/payoff | Source | Type | Static status |
| --- | --- | --- | --- |
| `+10 Consciência` and `+10 Pontos de Gloria` for safe actions. | Core loop mechanics sections. | In-race mechanical reward. | Design/runtime contract; execution not validated. |
| `P_cena * 2` `Pontos de Gloria` for successful risk actions. | Core loop mechanics sections. | In-race score reward. | Design/runtime contract; execution not validated. |
| Victory result screen. | Core loop section 8 and runtime docs. | Feedback/payoff. | Docs state TextPictures for VITORIA/DERROTA and score. |
| Unlock next race. | Core loop branch table. | Progression reward. | `VAR_RACE_ID` increments when victory passes and race ID is below 3. |
| Final/end screens. | Core loop branch table and inspected maps 6-16. | Narrative payoff. | Static maps exist; route reachability needs branch/runtime validation. |

No inventory, item, currency, shop, XP, equipment, database reward or external
reward table was found in the inspected sources.

## Flags, Variables And Conditions

From durable docs/common inventory:

| ID | Name | Quest/content relevance |
| --- | --- | --- |
| Variable 100 | `VAR_RACE_ID` | Stage selector for Corrida 1/2/3; `Map001` pages are gated by this variable. |
| Variable 101 | `VAR_SCENE_INDEX` | Current scene progress within a race. |
| Variable 103 | `VAR_P_CENA` | Per-scene risk/reward magnitude. |
| Variable 104 | `VAR_CONSCIENCIA` | In-race resource; reset on crash/init. |
| Variable 105 | `VAR_PONTOS_GLORIA` | Score used for pass/fail thresholds. |
| Variable 110 | `VAR_SEED` | Procedural sequence seed; reset on crash. |
| Variable 111 | `VAR_RACE_N_CENAS` | Stage length: 6/8/10. |
| Variable 112 | `VAR_ATTEMPT_N` | Retry counter; incremented by crash/init flow. |
| Variable 117 | `VAR_VITORIA_PASSOU` | Result flag for victory/defeat post-input branch. |
| Switch 100 | `SW_RACE_ACTIVE` | Race lifecycle. |
| Switch 101 | `SW_INPUT_LOCKED` | Blocks gameplay input during result/resolution. |
| Switch 102 | `SW_CRASH_FLAG` | Crash/retry trigger. |
| Switch 105 | `SW_IS_CURVA_DIABO` | Reserved post-MVP; should remain untouched in MVP according to docs. |

From selected maps:

| Map | Variable/page evidence |
| --- | --- |
| `Map001` | Event `Init Corrida` pages require `var100>=1`, `var100>=2`, `var100>=3` and call CE5. |
| `Map010` | Writes variable 1 to 1 and variable 100 to 1 before transfer to `Map001`. |
| `Map005` | Pages require `var2>=1` and `var2>=2`; writes variable 2 to 1/2 and variable 100 to 2. |
| `Map013` | Writes variable 4 to 1 multiple times and variable 100 to 3 once; transfers mostly to `Map006`, once to `Map001`. |

Open ownership gap: variable IDs 1, 2 and 4 are used by VN maps, but their
canonical names and intended lifecycle were not established by the allowed
source set for this task.

## Preconditions And Postconditions

| Flow | Preconditions | Postconditions |
| --- | --- | --- |
| Start race 1 | `Map010` must set variable 100 to 1 and transfer to `Map001`; `Map001` page for `var100>=1` must call CE5. | Race orchestrator starts; race state initialized according to docs. |
| Start race 2 | `Map005` must set variable 100 to 2 and transfer to `Map001`; `Map001` page for `var100>=2` must call CE5. | Race orchestrator starts for race 2. |
| Start race 3 | `Map013` must set variable 100 to 3 and transfer to `Map001`; `Map001` page for `var100>=3` must call CE5. | Race orchestrator starts for race 3. |
| Finish race with threshold met | `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`; `VAR_PONTOS_GLORIA` meets threshold; `EV_VitoriaCorrida` remains alive through input. | `VAR_VITORIA_PASSOU = 1`; next race starts or final screen appears. |
| Finish race below threshold | End of race reached but threshold not met. | `VAR_VITORIA_PASSOU = 0`; `EV_Crash` restarts same race. |
| Fatal crash/risk failure | Risk roll fails or crash flag set. | Same race restarts; `Consciência`, score and scene index reset; `VAR_ATTEMPT_N` increments. |

## Quest Log And Objective Evidence Gap

Searches across the inspected docs and selected maps found no explicit quest
log, journal, mission list, objective tracker, quest ID, objective ID, reward
table, or player-facing task system. The available evidence supports a
quest-like race chain and branching VN content, but not a formal quest system.

Concrete missing evidence:

- No durable quest manifest.
- No objective text registry.
- No explicit quest log UI.
- No NPC quest-giver ownership table.
- No final route matrix proving ending reachability.
- No source of truth for variables 1, 2 and 4.
- No validated player-facing clarity for thresholds, objective progression,
  retry state or final branch meaning.

## Static Content Risks

| Risk | Evidence | Required validation |
| --- | --- | --- |
| Objective clarity may depend on result screen and implicit play, not a quest log. | No explicit quest/objective UI found; thresholds exist in docs. | Human Playtest/readability gate. |
| VN branch volume is high in `Map013`. | 446 choice groups and 1310 Show Text commands in one autorun event. | Branch coverage matrix and Playtest. |
| Name spelling drift may affect content consistency. | Sources contain `Jonny`, `Johnny` and doc references to Joao/João. | Narrative/editorial review. |
| ConcernScore/intervention ownership is unresolved in this inventory. | Core loop says ConcernScore is outside the core loop; maps show true/sabotage branch surfaces. | Branching/narrative tech analysis or route QA. |
| Race progression relies on variable 100 and event erasure/retry behavior. | `Map001` pages and runtime docs. | Runtime QA Playtest; no static claim of execution validity. |

## Coverage

Inspected in detail:

- Durable race design/runtime docs.
- `docs/index.xml` catalog entries relevant to quest/content.
- `MapInfos.json`.
- Selected VN, race-init and ending maps using structured JSON parsing.
- `Map002` and `Map003` were opened as race/test map candidates; their inspected
  events had no quest/objective text, transfers, variables, switches or Common
  Event calls in the static summaries.

Mapped but not inspected deeply:

- Common Events named by the durable docs.
- TextPicture/Common Event calls 20 and 21 seen in VN maps.
- Plugin-rendered text or picture ownership.

Not found in inspected sources:

- Formal quest log.
- Objective tracker.
- Reward table outside race score/progression.
- NPC quest registry.

Out of scope for this static inventory:

- Editing `Jhonny/**`.
- Validating Common Event runtime, result screen, input, save/load, UI fit,
  audio, route reachability, pacing, emotional effect or comprehension.

## Required Validations

- `technical-review` before using this inventory as basis for implementation.
- Human Playtest/human-validation before declaring quest flow, objective
  clarity, pacing, branch reachability, rewards, endings or runtime behavior
  valid.
- `loki-rpg-maker-mz-data-json` before future edits to `data/*.json`.
- `loki:tech-analysis` recommended before changing VN variables, race
  Common Events, quest/objective UI, or final route predicates.
