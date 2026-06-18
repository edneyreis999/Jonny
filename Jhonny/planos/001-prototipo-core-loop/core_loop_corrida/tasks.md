---
title: "Plano de Ação — Core Loop da Corrida"
description: "Plano de execução em 7 fases para o protótipo jogável do minigame de Corrida em RPG Maker MZ (projeto Jhonny)."
tags: [plano-acao, core-loop, corrida, rpg-maker-mz, prototipo]
type: plano-acao
version: "1.0"
data_criacao: "2026-06-17"
executor: "agente IA"
validacao: "RPG Maker MZ (playtest ao fim de cada fase)"
guia_referencia: "[[Guia de Implementação - Core Loop da Corrida]]"
spec_referencia: "[[Corrida - Core Loop]]"
---

# Plano de Ação — Core Loop da Corrida

> Gerado a partir de [[Guia de Implementação - Core Loop da Corrida]] (Guia Técnico, 1191 linhas) e [[Corrida - Core Loop]] (Spec de Domínio, 614 linhas).
> **Executor:** agente IA. **Validação:** RPG Maker MZ (playtest visual ao fim de cada fase).
> **Convenções:** artefatos em pt-BR; identificadores/código em inglês (seguindo `.claude/rules/basci-rules.json`).

## Overview

Plano de execução para o protótipo jogável do minigame de Corrida (QTE timer-based binário com recurso de Consciência e Pontos de Glória). O minigame é decomposto em 5 subsistemas fracamente acoplados (Orchestrator, Timer, Renderer, Input, Restart) coordenados por variáveis/switches globais do RPG Maker MZ. Implementação 100% nativa (sem plugins de lógica de jogo) — apenas um plugin utilitário mínimo `Jhonny_RaceHelper.js` (fornecido completo no Apêndice A do Guia Técnico).

**Decisões técnicas críticas (load-bearing):**
- Timer em **frames** (240/210), não em segundos (drift de 16% com `Wait 0.1s`)
- **Contrato de escrita única** por variável (evita race conditions no loop cooperativo)
- `Math.random()` para v1; PRNG `mulberry32` reservado para v2
- `SW_INPUT_LOCKED` obrigatório nos handlers (anti-re-entrada)
- **Sorteio lazy** por cena (não pré-compõe array — MZ não tem array nativo em eventos)
- Botões com IDs 41-50 (z-order acima de overlays e HUD)
- Restart corta **fadeout/fadein** (não hover da barra) para ficar <1s sem perder comunicação de custo

## Fases

### Fase 1 — Setup MZ + Plugin Helper
**Objetivo:** infraestrutura mínima no MZ Editor + plugin utilitário ativo.
**Dependências:** nenhuma (paralela a F2).
**Validação visual:** ao abrir o projeto no RMMZ e rodar o jogo (Playtest), o console (F12) mostra `[Jhonny_RaceHelper] JhonnyRace helper inicializado.` e F9 (debug) → abas Variables/Switches mostram os IDs 101-113 / 101-106 com nomes descritos no Guia Técnico §3.1.

> **STATUS: COMPLETA E VALIDADA** (2026-06-17)
> - [x] task-1.1 — Registrar variáveis (IDs 101-113) e switches (IDs 101-106) no Database · ~2h · deps: nenhuma
> - [x] task-1.2 — Criar plugin `Jhonny_RaceHelper.js` (Apêndice A do Guia Técnico) · ~1h · deps: 1.1
> - [x] task-1.3 — Ativar plugins ButtonPicture + TextPicture + Jhonny_RaceHelper em `plugins.js` · ~1h · deps: 1.2

### Fase 2 — Pipeline de Assets
**Objetivo:** todas as pictures e sound effects criados e pré-carregáveis.
**Dependências:** nenhuma (paralela a F1).
**Validação visual:** ao chamar o evento de teste `EV_Preload`, todas as pictures da corrida aparecem na tela por 1 frame sem hitch de carregamento (sem "loading stutter" entre frames).

> **STATUS: COMPLETA E VALIDADA** (2026-06-18)
> **Formato obrigatório:** Pictures em PNG (canal alpha para botões/overlays), áudio em OGG Vorbis (não MP3).
> **Nota:** `EV_Preload` foi criado diretamente em `CommonEvents.json` (ID 3) e validado em Playtest no RPG Maker MZ.

- [x] task-2.1 — Criar pictures (backgrounds + botões + HUD + overlays + placa Curva do Diabo + assets referenciados na F3) · ~3h · deps: nenhuma
- [x] task-2.2 — Criar 3 Sound Effects (crash_metal, freada, pneu_cantando) · ~1h · deps: nenhuma
- [x] task-2.3 — Criar `EV_Preload` (Common Event com Show+Erase sequencial) · ~2h · deps: 2.1

### Fase 3 — Orchestrator + Renderização Estática
**Objetivo:** ao iniciar a corrida, fundo da cena + HUD de Consciência aparecem com fade.
**Dependências:** F1 (variáveis/switches) + F2 (pictures) — **ambas completas**.
**Validação visual:** ao iniciar a corrida via evento autorun em Map001, a tela escurece e volta (fadein 18 frames) revelando o fundo da cena de Sinal e a barra de Consciência vazia (sépia escuro) no topo da tela.

> **STATUS: IMPLEMENTADA — AGUARDANDO PLAYTEST MZ** (2026-06-18)
> Implementação JSON de todas as 5 tasks concluída e validada sintaticamente (`python -m json.tool` OK em System.json, CommonEvents.json, Map001.json).
> **Validação visual pendente** — usuário precisa abrir o projeto no RPG Maker MZ e rodar Playtest (ver [[fase-3-completa]] para o checklist detalhado).
> **Correções vs spec original:** task specs 3.1/3.2 tinham formatos errados para o If MZ (exemplos usavam `[1, sw, 0]` para switch quando o canônico é `[0, sw, 1]`). Implementação segue o código-fonte MZ em `js/rmmz_objects.js`.
>
> **APRENDIZADO F1+F2 — Automação via JSON controlada:** Common Events simples (comandos MZ conhecidos) **podem ser criados diretamente em `Jhonny/data/CommonEvents.json`** quando houver slot vazio confirmado (IDs 4+ livres) — playbook validado na task 2.3. Eventos com `Parallel trigger`, loops `Label/Jump`, ou `Script` inline exigem maior cuidado — ver coluna "JSON" abaixo. **Sempre** validar com `python -m json.tool` + Playtest MZ obrigatório.
>
> **Pré-condições já satisfeitas (não recriar):**
> - Variáveis 101-113 nomeadas em `System.json` (F1). **Falta nomear var ID 114 = `VAR_LAST_RENDERED_INDEX`** (subtarefa 3.2.1) — único ajuste de Database nesta fase.
> - Switches 101-106 nomeadas (F1).
> - 16 PNGs em `Jhonny/img/pictures/race/` (F2) — todos os nomes referenciados pela F3 já existem: `bg_sinal`, `bg_curva`, `opala_pov`, `sinal_red`, `placa_curva_dir`, `bar_consciencia_bg`, `bar_consciencia_fill`.
> - `EV_Preload` (CE ID 3) já criado (F2).
> - **Reaproveitar SEs padrão** (F2 heurística): para tocar efeitos em playtests pontuais da F3, usar `crash_metal.ogg`, `freada.ogg`, `pneu_cantando.ogg` — não gerar áudio novo.

| Task | JSON-automatizável? | Notas de implementação |
|------|---------------------|------------------------|
| 3.1 `EV_RaceOrchestrator` | **Sim** (códigos 122/121/111/411/412/355/117/223/222) | Script inline `Math.random()` é simples; If/Else para `VAR_RACE_N_CENAS` é direto. |
| 3.2 `EV_RaceRenderer` | **Parcial — alta complexidade** (Parallel trigger + loop Label/Jump) | `trigger: 2` (Parallel) + `condition: 1` + `switchId: 101`. Validar MZ Editor obrigatório após escrita JSON. |
| 3.3 `EV_RenderSinal` + `EV_RenderCurva` | **Sim** (código 231 Show Picture) | Animação de fade-in (opcional) usa `Move Picture` (232) — semelhante a `EV_Preload`. |
| 3.4 HUD Consciência | **Sim para setup inicial** (Show Picture 231) | `Move Picture` com `scaleX` por variável é mais fiável via `Script` (355) chamando `$gameScreen.picture(21).move(...)` — documentar na task. |
| 3.5 Map001 autorun | **Sim** (Map001 já existe; adicionar 1 evento no array `events`) | Trigger `autorun` = `"trigger": 3`. Editar `Map001.json` com Python+json. |

- [x] task-3.1 — Criar `EV_RaceOrchestrator` (INIT block + fadein) · ~2h · deps: 1.1, 2.3 · **JSON: Sim** · CE ID 5 (24 cmds)
- [x] task-3.2 — Criar `EV_RaceRenderer` (Parallel, switch `SW_RACE_ACTIVE`) · ~3h · deps: 3.1, 3.4 · **JSON: Parcial (validar MZ)** · CE ID 7 (36 cmds, trigger=2, switchId=101)
- [x] task-3.3 — Criar `EV_RenderSinal` + `EV_RenderCurva` · ~3h · deps: 3.2 · **JSON: Sim** · CE IDs 8/9
- [x] task-3.4 — Implementar HUD de Consciência (bar bg ID 20 + fill ID 21 com scaleX dinâmico) · ~2h · deps: 3.1 · **JSON: Sim (setup) + Script para animação** · CE ID 6 + Pictures 20/21 no Orchestrator
- [x] task-3.5 — Criar mapa "garagem" (Map001) com event autorun chamando `EV_RaceOrchestrator` · ~1h · deps: 3.1, 3.4 · **JSON: Sim** · Event "Init Corrida" x=8 y=6 trigger=3

### Fase 4 — Input + Timer
**Objetivo:** botões aparecem, são clicáveis via ButtonPicture, e disparam handlers; timer corre.
**Dependências:** F3 (orchestrator e renderer ativos).
**Validação visual:** ao iniciar a corrida, botões Parar/Furar (ou Direita/Esquerda) surgem na parte inferior da tela; ao passar o mouse, eles destacam; ao clicar, algo visível acontece (fade out); a barra de timer horizontal diminui progressivamente.

- task-4.1 — Criar `EV_RaceTimer` (Parallel, tick por frame, 3 guardas) · ~2h · deps: 3.2
- task-4.2 — Implementar botões clicáveis via `ButtonPicture` Plugin Command: Set (IDs 41-50) · ~3h · deps: 3.3
- task-4.3 — Criar `EV_OnSafe` + `EV_OnRisk` (handlers com 3 guardas de re-entrada) · ~3h · deps: 4.1, 4.2
- task-4.4 — Validar input W/S/A/D via `Input.keyMapper` extendido · ~2h · deps: 1.2, 4.3

### Fase 5 — Lógica de Estado e Resolução
**Objetivo:** ao clicar Safe, Consciência sobe e cena avança; ao clicar Risk, rola o d100, aplica custo, e Glória atualiza.
**Dependências:** F4 (handlers esqueleto prontos).
**Validação visual:** barra de Consciência sobe 10 pontos visivelmente no Safe; desce `P_cena` no Risk (ambos resultados); texto de Pontos de Glória no canto atualiza (+10 no Safe, +`P_cena×2` no Risk-sucesso); hover no botão Risk pisca vermelho-sangue em 3 níveis discretos.

> **STATUS: ARTEFATOS CRIADOS** (2026-06-18) — tasks .md geradas, prontas para execução pelo agente IA implementador.

- task-5.1 — Implementar lógica Safe no `EV_OnSafe` (Consciência +10 clamp, Glória +10, cena++) · ~2h · deps: 4.3
- task-5.2 — Implementar lógica Risk no `EV_OnRisk` (clamp, roll d100, custo aplicado, Glória ×2) · ~3h · deps: 4.3, 5.1
- task-5.3 — Criar `EV_ResolucaoSafe` + `EV_ResolucaoRiskOK` (animações de flash + zoom) · ~3h · deps: 5.1, 5.2
- task-5.4 — Implementar HUD de Pontos de Glória via `TextPicture` · ~2h · deps: 5.1
- task-5.5 — Implementar hover vermelho-sangue 3 níveis discretos via overlays (ID 22-24) · ~3h · deps: 3.4, 4.2

### Fase 6 — Crash, Restart e Curva do Diabo
**Objetivo:** falha no Risk → crash visual → restart <1s; cena 9 da Corrida 3 é a Curva do Diabo com `P_CENA=100`.
**Dependências:** F5 (lógica completa).
**Validação visual:** ao clicar Risk com falha no roll, tela shake + flash branco + fade para preto + reset de variáveis + fadein direto na cena 1 — total <1s cronometrado; na Corrida 3 (10 cenas), a última cena mostra a placa "CURVA DO DIABO" diferenciada; ao terminar todas as cenas sem crash, tela de vitória reconhece pontuação.

> **STATUS: ARTEFATOS CRIADOS** (2026-06-18) — tasks .md geradas, prontas para execução pelo agente IA implementador.

- task-6.1 — Criar `EV_Crash` (shake + flash + hover + fadeout + reset + erase pictures 1-60 + fadein <1s) · ~3h · deps: 5.2
- task-6.2 — Implementar Curva do Diabo (Corrida 3, cena 9, `VAR_P_CENA=100` fixo) · ~2h · deps: 3.2, 6.1
- task-6.3 — Configurar variação de corridas (6/8/10 cenas por `VAR_RACE_ID`) · ~2h · deps: 3.1
- task-6.4 — Implementar tela de vitória da corrida (maior pontuação → próxima corrida) · ~2h · deps: 5.4

### Fase 7 — Polish + Observabilidade
**Objetivo:** audio feedback, indicador "TENTATIVA N" discreto, e logger estruturado para playtest.
**Dependências:** F6 (loop completo funcional).
**Validação visual:** a cada ação (Safe/Risk-sucesso/Risk-falha/Crash), o som correspondente toca (freada/motor/impacto); indicador "TENTATIVA N" aparece discreto no canto; ao abrir o console F12, cada ação registra um JSON estruturado (`RACE_EVENT`).

> **STATUS: ARTEFATOS CRIADOS** (2026-06-18) — tasks .md geradas, prontas para execução pelo agente IA implementador.

- task-7.1 — Adicionar `Play SE` nos handlers (Safe=freada, Risk-sucesso=motor, Risk-falha=impacto) · ~2h · deps: 2.2, 5.3
- task-7.2 — Implementar indicador "TENTATIVA N" discreto via `TextPicture` · ~2h · deps: 5.4
- task-7.3 — Adicionar plugin command `logRaceEvent` no `Jhonny_RaceHelper.js` (Apêndice B do Guia Técnico) · ~2h · deps: 1.2

## Tabela de Tasks

| ID | Título | Fase | Deps | Tempo | JSON? |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Registrar variáveis (101-113) e switches (101-106) no Database | F1 | — | 2h | Python+json |
| 1.2 | Criar plugin `Jhonny_RaceHelper.js` | F1 | 1.1 | 1h | Write direto |
| 1.3 | Ativar plugins ButtonPicture + TextPicture + Jhonny_RaceHelper | F1 | 1.2 | 1h | **MZ Editor** |
| 2.1 | Criar pictures (16 PNGs) | F2 | — | 3h | Python+Pillow |
| 2.2 | Criar 3 Sound Effects (aliases de sons padrão) | F2 | — | 1h | `cp` OGGs locais |
| 2.3 | Criar `EV_Preload` (CE ID 3) | F2 | 2.1 | 2h | Python+json |
| 3.1 | Criar `EV_RaceOrchestrator` | F3 | 1.1, 2.3 | 2h | **Python+json** |
| 3.2 | Criar `EV_RaceRenderer` (Parallel) | F3 | 3.1, 3.4 | 3h | Python+json + **validar MZ** |
| 3.3 | Criar `EV_RenderSinal` + `EV_RenderCurva` | F3 | 3.2 | 3h | **Python+json** |
| 3.4 | Implementar HUD de Consciência | F3 | 3.1 | 2h | **Python+json + Script inline** |
| 3.5 | Criar Map001 com event autorun | F3 | 3.1, 3.4 | 1h | **Python+json** |
| 4.1 | Criar `EV_RaceTimer` | F4 | 3.2 | 2h | Python+json |
| 4.2 | Botões clicáveis via `ButtonPicture` | F4 | 3.3 | 3h | **MZ Editor** (Plugin Cmd) |
| 4.3 | Criar `EV_OnSafe` + `EV_OnRisk` | F4 | 4.1, 4.2 | 3h | Python+json |
| 4.4 | Validar W/S/A/D via `Input.keyMapper` | F4 | 1.2, 4.3 | 2h | Write no plugin |
| 5.1 | Implementar lógica Safe | F5 | 4.3 | 2h | Python+json |
| 5.2 | Implementar lógica Risk | F5 | 4.3, 5.1 | 3h | Python+json |
| 5.3 | Criar `EV_ResolucaoSafe` + `EV_ResolucaoRiskOK` | F5 | 5.1, 5.2 | 3h | Python+json |
| 5.4 | HUD de Pontos de Glória via `TextPicture` | F5 | 5.1 | 2h | **MZ Editor** (Plugin Cmd) |
| 5.5 | Hover vermelho-sangue 3 níveis discretos | F5 | 3.4, 4.2 | 3h | Python+json |
| 6.1 | Criar `EV_Crash` (restart <1s) | F6 | 5.2 | 3h | Python+json |
| 6.2 | Implementar Curva do Diabo | F6 | 3.2, 6.1 | 2h | Python+json |
| 6.3 | Configurar variação de corridas (6/8/10) | F6 | 3.1 | 2h | Python+json |
| 6.4 | Implementar tela de vitória | F6 | 5.4 | 2h | Python+json |
| 7.1 | Adicionar `Play SE` nos handlers | F7 | 2.2, 5.3 | 2h | Python+json |
| 7.2 | Indicador "TENTATIVA N" via `TextPicture` | F7 | 5.4 | 2h | **MZ Editor** (Plugin Cmd) |
| 7.3 | Plugin command `logRaceEvent` | F7 | 1.2 | 2h | Write no plugin |

## Ordem de Execução Recomendada

```
Paralelo inicial (F1 ∥ F2):
  Track A: 1.1 → 1.2 → 1.3
  Track B: 2.1 → 2.3  (2.2 paralelo)

Sync point: ambos tracks completos ✓ (estado atual do projeto)

Pré-passos F3 (uma única vez):
  - Python+json: nomear VAR_LAST_RENDERED_INDEX (ID 114) em System.json
    (subtarefa 3.2.1 antecipada — evita reabrir Database depois)

Linear daí em diante:
  3.4 → 3.1 → 3.5 → 3.2 → 3.3
  → 4.1 → 4.2 → 4.3 → 4.4
  → 5.1 → 5.2 → 5.3 → 5.4 → 5.5
  → 6.1 → 6.2 → 6.3 → 6.4
  → 7.1 → 7.2 → 7.3
```

> **Nota sobre ordem F3:** 3.4 antes de 3.1 porque o Orchestrator faz `Show Picture: 20/21` (setup do HUD) em seu INIT — reescrever o Orchestrator depois do HUD estar definido evita retrabalho. 3.5 depois de 3.1 porque o Map001 chama o Orchestrator. 3.2 depois de 3.1+3.4 porque o Renderer chama `EV_RenderSinal/Curva` e a barra de HUD precisa existir.
>
> **Nota sobre paralelismo:** F1 (Setup) e F2 (Assets) são independentes — podem ser executados em paralelo. O ponto de sincronização é o início de F3, que precisa de variáveis nomeadas (F1) E pictures no disco (F2).

## Fora de Escopo

- **Cenas VN (Visual Novel)** — corrida só inicia após VN terminar, mas VN em si é sistema separado.
- **ConcernScore** — variável oculta acumulada nas cenas VN; não afeta o core loop da corrida diretamente.
- **BGM da corrida** — spec menciona transição de música mas não detalha; adicionar depois de playtest.
- **Save/Load** — não mencionado no spec; ignorar no protótipo.
- **PRNG seedável** — usar `Math.random()` em v1; reservar `mulberry32` para v2 (debug de replay).
- **Pesos SINAL/CURVA diferenciados por corrida** — manter 60/40 fixo; variar em v2.
- **Distribuição triangular de `P_cena`** — manter uniforme; variar em v2 após playtest.

## Referências

- **Guia Técnico:** [[Guia de Implementação - Core Loop da Corrida]]
- **Spec de Domínio:** [[Corrida - Core Loop]]
- **Pitch (contexto narrativo):** [[Roleta Paulista]]
- **Prompt que originou este plano:** [[Prompt-plano-implementação-v2]]
- **Templates usados:** `.claude/templates/tasks-template.md` (índice), `.claude/templates/task-template.md` (por task)
- **Regras de código:** `.claude/rules/basci-rules.json`

---

## Aprendizados Consolidados (Fases 1 e 2 — Aplicáveis às Fases Seguintes)

Baseado nas retrospectivas [[fase1/retrospectiva]] e [[fase2/retrospectiva]], estes são os conhecimentos críticos adquiridos:

### Restrições técnicas confirmadas
- **System.json usa arrays 0-based**: índice 0 = ID 1 no editor MZ; índice 100 = ID 101
- **Plugin MZ requer IIFE** com tags `@target MZ`, `@plugindesc`, `@help`
- **Plugin Manager (F10) só acessível via GUI MZ** — não automatizável via CLI
- **Para JSON estruturado, usar Python + json** — Edit tool falha em JSON linha única
- **Common Events SIMPLES podem ser criados via JSON** (validado na task 2.3) quando:
  - Há slot vazio confirmado (`CommonEvents.json` com `null` ou CE vazio)
  - Os códigos de comando MZ são conhecidos
  - A alteração é validada por `python -m json.tool` + Playtest MZ
- **Common Events COMPLEXOS** (Plugin Commands, escolhas aninhadas, conditional branches profundas) **devem ser revisados no MZ Editor**
- **Pictures em subpasta** usam nome sem extensão no comando `Show Picture` (ex.: `race/bg_sinal`)
- **Códigos MZ canônicos** (uso frequente na F3 em diante):
  - `231` Show Picture, `232` Move Picture, `235` Erase Picture, `230` Wait
  - `121` Control Switches, `122` Control Variables
  - `111` If, `411` Else, `412` End
  - `117` Call Common Event
  - `118` Label, `119` Jump to Label, `115` Exit Event Processing
  - `223` Tint Screen, `221` Fadeout Screen, `222` Fadein Screen
  - `355` Script (inline), `655` Script (continuação do anterior)

### Heurísticas de implementação
- Se plano já existe, **implementar diretamente** sem replanejamento (evitar `mcp__pal__planner` redundante)
- Criar **instruções markdown** apenas para tarefas estritamente manuais (MZ Editor GUI)
- Validar plugins com `node -c` antes de considerar completa
- Validar JSON do RPG Maker com `python -m json.tool` antes de abrir o MZ
- **Antes de gerar assets, buscar todas as referências futuras por nome de arquivo** (evita descoberta tardia como `sinal_red`/`placa_curva_dir` na F2)
- **Local-first para assets:** verificar assets padrão em `Jhonny/audio/se/` antes de gerar/baixar novos
- TaskCreate não persiste entre sessões — usar arquivos markdown para rastreamento
- Escrever JSON do RPG Maker com `indent=4` para reduzir diff e facilitar revisão

### Formatos de arquivo (consolidado)
- **Pictures**: Obrigatório PNG com canal alpha (para botões/overlays transparentes) — nunca JPEG
- **Áudio**: OGG Vorbis é o formato canônico (não MP3) para estabilidade em NW.js; `afconvert` falha codificando Vorbis no macOS, preferir aliases de sons padrão
- **Resolução base**: 816×624 (conforme `System.json`)
- **Pictures em subpasta**: nome sem extensão (ex.: `race/bg_sinal`)

### Estado de pré-requisitos para a Fase 3 (snapshot 2026-06-18)
- **Variáveis 101-113** nomeadas em `System.json`
- **Variável 114 está VAZIA** — nomear como `VAR_LAST_RENDERED_INDEX` (subtarefa 3.2.1)
- **Switches 101-106** nomeadas em `System.json`
- **16 PNGs** em `Jhonny/img/pictures/race/` (incluindo `sinal_red` e `placa_curva_dir`)
- **3 OGGs** em `Jhonny/audio/se/`: `crash_metal.ogg` (=Crash), `freada.ogg` (=Evasion1), `pneu_cantando.ogg` (=Move2)
- **CE ID 3 `EV_Preload`** já criado em `CommonEvents.json` (49 comandos)
- **CEs IDs 1, 2** ocupados (`acelerador`, `freio`) — não sobrescrever
- **Slots livres para novos CEs**: ID 4+ (CE ID 4 existe mas está vazio — descartável)

### Caminho mínimo recomendado para Fase 3
1. **Pré-passo único (Python+json):** nomear `VAR_LAST_RENDERED_INDEX` em `System.json` (var ID 114)
2. **Task 3.4 (HUD Consciência):** `Show Picture 20/21` no INIT + `EV_UpdateHud` com `Script` para animar `scaleX`
3. **Task 3.1 (`EV_RaceOrchestrator`):** criar via JSON (CE ID 4+); INIT block + fadein 18 frames; integra com HUD
4. **Task 3.5 (Map001):** adicionar evento autorun em `Map001.json` via Python+json; trigger=3, chama Orchestrator
5. **Task 3.2 (`EV_RaceRenderer`):** Parallel CE via JSON; estrutura `Label/Jump` + `Wait 1 frame`; **validar MZ Editor obrigatório**
6. **Task 3.3 (`EV_RenderSinal/Curva`):** criar via JSON (códigos 231); chamar a partir do Renderer
7. **Playtest MZ** após cada task (validação visual no RPG Maker MZ)
8. Atualizar `tasks.md` marcando fase 3 como completa
9. Criar registro de conclusão em `fase-3-completa.md`

### Erros comuns a evitar
- Não usar Edit tool em JSON linha única — usar Python + json desde início
- Não confundir índices 0-based com IDs 1-based — documentar mapeamento
- Não usar TaskCreate para rastreamento persistente — usar markdown
- Não escrever JSON minificado — sempre `indent=4`
- Não ativar ferramentas de análise (Serena, etc.) para tarefas simples de JSON/assets
- Não sobrescrever CEs existentes (`acelerador`, `freio`, `EV_Preload`) — verificar `CommonEvents.json` antes
