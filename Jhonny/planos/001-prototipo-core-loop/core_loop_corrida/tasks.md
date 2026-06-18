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

- task-1.1 — Registrar variáveis (IDs 101-113) e switches (IDs 101-106) no Database · ~2h · deps: nenhuma
- task-1.2 — Criar plugin `Jhonny_RaceHelper.js` (Apêndice A do Guia Técnico) · ~1h · deps: 1.1
- task-1.3 — Ativar plugins ButtonPicture + TextPicture + Jhonny_RaceHelper em `plugins.js` · ~1h · deps: 1.2

### Fase 2 — Pipeline de Assets
**Objetivo:** todas as pictures e sound effects criados e pré-carregáveis.
**Dependências:** nenhuma (paralela a F1).
**Validação visual:** ao chamar o evento de teste `EV_Preload`, todas as pictures da corrida aparecem na tela por 1 frame sem hitch de carregamento (sem "loading stutter" entre frames).

- task-2.1 — Criar 11 pictures (backgrounds + botões + HUD + overlays + placa Curva do Diabo) · ~3h · deps: nenhuma
- task-2.2 — Criar 3 Sound Effects (crash_metal, freada, pneu_cantando) · ~1h · deps: nenhuma
- task-2.3 — Criar `EV_Preload` (Common Event com Show+Erase sequencial) · ~2h · deps: 2.1

### Fase 3 — Orchestrator + Renderização Estática
**Objetivo:** ao iniciar a corrida, fundo da cena + HUD de Consciência aparecem com fade.
**Dependências:** F1 (variáveis/switches) + F2 (pictures).
**Validação visual:** ao iniciar a corrida via evento autorun em Map001, a tela escurece e volta (fadein 18 frames) revelando o fundo da cena de Sinal e a barra de Consciência vazia (sépia escuro) no topo da tela.

- task-3.1 — Criar `EV_RaceOrchestrator` (INIT block + fadein) · ~2h · deps: 1.1, 2.3
- task-3.2 — Criar `EV_RaceRenderer` (Parallel, switch `SW_RACE_ACTIVE`) · ~3h · deps: 3.1
- task-3.3 — Criar `EV_RenderSinal` + `EV_RenderCurva` · ~3h · deps: 3.2
- task-3.4 — Implementar HUD de Consciência (bar bg ID 20 + fill ID 21 com scaleX dinâmico) · ~2h · deps: 3.1
- task-3.5 — Criar mapa "garagem" (Map001) com event autorun chamando `EV_RaceOrchestrator` · ~1h · deps: 3.1

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

- task-5.1 — Implementar lógica Safe no `EV_OnSafe` (Consciência +10 clamp, Glória +10, cena++) · ~2h · deps: 4.3
- task-5.2 — Implementar lógica Risk no `EV_OnRisk` (clamp, roll d100, custo aplicado, Glória ×2) · ~3h · deps: 4.3, 5.1
- task-5.3 — Criar `EV_ResolucaoSafe` + `EV_ResolucaoRiskOK` (animações de flash + zoom) · ~3h · deps: 5.1, 5.2
- task-5.4 — Implementar HUD de Pontos de Glória via `TextPicture` · ~2h · deps: 5.1
- task-5.5 — Implementar hover vermelho-sangue 3 níveis discretos via overlays (ID 22-24) · ~3h · deps: 3.4, 4.2

### Fase 6 — Crash, Restart e Curva do Diabo
**Objetivo:** falha no Risk → crash visual → restart <1s; cena 9 da Corrida 3 é a Curva do Diabo com `P_CENA=100`.
**Dependências:** F5 (lógica completa).
**Validação visual:** ao clicar Risk com falha no roll, tela shake + flash branco + fade para preto + reset de variáveis + fadein direto na cena 1 — total <1s cronometrado; na Corrida 3 (10 cenas), a última cena mostra a placa "CURVA DO DIABO" diferenciada; ao terminar todas as cenas sem crash, tela de vitória reconhece pontuação.

- task-6.1 — Criar `EV_Crash` (shake + flash + hover + fadeout + reset + erase pictures 1-60 + fadein <1s) · ~3h · deps: 5.2
- task-6.2 — Implementar Curva do Diabo (Corrida 3, cena 9, `VAR_P_CENA=100` fixo) · ~2h · deps: 3.2, 6.1
- task-6.3 — Configurar variação de corridas (6/8/10 cenas por `VAR_RACE_ID`) · ~2h · deps: 3.1
- task-6.4 — Implementar tela de vitória da corrida (maior pontuação → próxima corrida) · ~2h · deps: 5.4

### Fase 7 — Polish + Observabilidade
**Objetivo:** audio feedback, indicador "TENTATIVA N" discreto, e logger estruturado para playtest.
**Dependências:** F6 (loop completo funcional).
**Validação visual:** a cada ação (Safe/Risk-sucesso/Risk-falha/Crash), o som correspondente toca (freada/motor/impacto); indicador "TENTATIVA N" aparece discreto no canto; ao abrir o console F12, cada ação registra um JSON estruturado (`RACE_EVENT`).

- task-7.1 — Adicionar `Play SE` nos handlers (Safe=freada, Risk-sucesso=motor, Risk-falha=impacto) · ~2h · deps: 2.2, 5.3
- task-7.2 — Implementar indicador "TENTATIVA N" discreto via `TextPicture` · ~2h · deps: 5.4
- task-7.3 — Adicionar plugin command `logRaceEvent` no `Jhonny_RaceHelper.js` (Apêndice B do Guia Técnico) · ~2h · deps: 1.2

## Tabela de Tasks

| ID | Título | Fase | Deps | Tempo |
| --- | --- | --- | --- | --- |
| 1.1 | Registrar variáveis (101-113) e switches (101-106) no Database | F1 | — | 2h |
| 1.2 | Criar plugin `Jhonny_RaceHelper.js` | F1 | 1.1 | 1h |
| 1.3 | Ativar plugins ButtonPicture + TextPicture + Jhonny_RaceHelper | F1 | 1.2 | 1h |
| 2.1 | Criar 11 pictures | F2 | — | 3h |
| 2.2 | Criar 3 Sound Effects | F2 | — | 1h |
| 2.3 | Criar `EV_Preload` | F2 | 2.1 | 2h |
| 3.1 | Criar `EV_RaceOrchestrator` | F3 | 1.1, 2.3 | 2h |
| 3.2 | Criar `EV_RaceRenderer` | F3 | 3.1 | 3h |
| 3.3 | Criar `EV_RenderSinal` + `EV_RenderCurva` | F3 | 3.2 | 3h |
| 3.4 | Implementar HUD de Consciência | F3 | 3.1 | 2h |
| 3.5 | Criar Map001 com event autorun | F3 | 3.1 | 1h |
| 4.1 | Criar `EV_RaceTimer` | F4 | 3.2 | 2h |
| 4.2 | Botões clicáveis via `ButtonPicture` | F4 | 3.3 | 3h |
| 4.3 | Criar `EV_OnSafe` + `EV_OnRisk` | F4 | 4.1, 4.2 | 3h |
| 4.4 | Validar W/S/A/D via `Input.keyMapper` | F4 | 1.2, 4.3 | 2h |
| 5.1 | Implementar lógica Safe | F5 | 4.3 | 2h |
| 5.2 | Implementar lógica Risk | F5 | 4.3, 5.1 | 3h |
| 5.3 | Criar `EV_ResolucaoSafe` + `EV_ResolucaoRiskOK` | F5 | 5.1, 5.2 | 3h |
| 5.4 | HUD de Pontos de Glória via `TextPicture` | F5 | 5.1 | 2h |
| 5.5 | Hover vermelho-sangue 3 níveis discretos | F5 | 3.4, 4.2 | 3h |
| 6.1 | Criar `EV_Crash` (restart <1s) | F6 | 5.2 | 3h |
| 6.2 | Implementar Curva do Diabo | F6 | 3.2, 6.1 | 2h |
| 6.3 | Configurar variação de corridas (6/8/10) | F6 | 3.1 | 2h |
| 6.4 | Implementar tela de vitória | F6 | 5.4 | 2h |
| 7.1 | Adicionar `Play SE` nos handlers | F7 | 2.2, 5.3 | 2h |
| 7.2 | Indicador "TENTATIVA N" via `TextPicture` | F7 | 5.4 | 2h |
| 7.3 | Plugin command `logRaceEvent` | F7 | 1.2 | 2h |

## Ordem de Execução Recomendada

```
Paralelo inicial (F1 ∥ F2):
  Track A: 1.1 → 1.2 → 1.3
  Track B: 2.1 → 2.3  (2.2 paralelo)

Sync point: ambos tracks completos

Linear daí em diante:
  3.5 → 3.1 → 3.4 → 3.2 → 3.3
  → 4.1 → 4.2 → 4.3 → 4.4
  → 5.1 → 5.2 → 5.3 → 5.4 → 5.5
  → 6.1 → 6.2 → 6.3 → 6.4
  → 7.1 → 7.2 → 7.3
```

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
