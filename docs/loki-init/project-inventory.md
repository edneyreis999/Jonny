---
title: "Loki Init - Project Inventory"
tipo: "inventario de projeto"
status: "parcial"
tags:
  - loki-init
  - inventario
  - rpg-maker-mz
  - jhonny
---

# Loki Init - Project Inventory

Data: 2026-06-30
Agente: main orchestrator
Escopo: `/Users/edney/projects/coreto/summer26`

---

## Status

Inventario comum sequencial produzido para `loki:init` em modo `full-init`.
Este documento mapeia evidencias locais suficientes para orientar agentes de
inventario sem tocar runtime, mirrors de instalacao, arquivos de instrucao ou
artefatos locais proibidos.

## Escopo e limites de escrita

Allowed writes declarados para esta execucao:

- `docs/**`
- `planos/000-init-loki/**`

Forbidden writes preservados:

- Runtime, engine, assets, dados gerados, build outputs, dependencias e codigo.
- `Jhonny/**` runtime, `data/*.json`, `js/plugins/**`, `js/plugins.js`,
  assets, saves e planos historicos.
- `.agents/**`, `.codex/**`, `.claude/**`.
- `AGENTS.md` e `CLAUDE.md` em qualquer nivel.
- `.obsidian/**`, exceto em tarefa futura explicitamente aprovada.

## Estrutura observada

| Area | Evidencia | Observacao |
| --- | --- | --- |
| `docs/` | Vault Obsidian com `docs/index.xml`, docs de core loop e docs tecnicos. | Fonte duradoura principal. |
| `Jhonny/` | Projeto RPG Maker MZ com `game.rmmzproject`, `index.html`, `package.json`, `data/*.json`, `js/rmmz_*.js`, `js/plugins/` e assets. | Runtime sensivel; somente leitura neste init. |
| `Jhonny/planos/` | Planos historicos, scripts e retrospectivas de desenvolvimento do jogo. | Evidencia historica; scripts nao sao reexecutaveis sem preflight futuro. |
| `planos/` | Nao existia no root antes desta execucao. | `planos/000-init-loki/**` e o estado operacional retomavel do init. |
| `.agents/`, `.codex/`, `.claude/` | Superficies de agente/config locais quando presentes. | Leitura apenas como evidencia de capacidade; escrita proibida. |
| `.obsidian/` e `docs/.obsidian/` | Configuracao local do Obsidian. | Machine/vault state; nao editar neste init. |
| `Excalidraw/` | Artefatos Excalidraw fora de `docs/`. | Fora do escopo de escrita do init. |

## Documentacao existente

`docs/index.xml` existe e foi lido primeiro como catalogo navegavel. O catalogo
declara documentacao duradoura do projeto Jhonny e lista documentos de corrida,
runtime, debug e scripts de plano. Ele tambem lista muitos documentos
`docs/loki-init/**` que estavam ausentes no filesystem no inicio desta execucao.

Docs duradouros principais consultados:

- [[Corrida - Core Loop]]: especificacao mecanica da corrida, pontuacao,
  thresholds, variaveis, switches e Common Events.
- [[Corrida - Runtime e Eventos]]: contratos runtime da corrida, lifecycle de
  Common Events, input lock, retry e tela de resultado.
- [[RPG Maker MZ - Debug Playtest]]: procedimento de debug e Playtest para bugs
  perceptiveis.
- [[RPG Maker MZ - Scripts de Plano]]: procedimento para auditar ou reutilizar
  scripts historicos em `Jhonny/planos`.

## Evidencias tecnicas lidas

| Fonte | Evidencia extraida |
| --- | --- |
| `docs/index.xml` | Catalogo XML versao 1.0, owner `catalogador`, atualizado em 2026-06-30, com entradas `docs/loki-init/**` atualmente stale. |
| `docs/CLAUDE.md` e `docs/AGENTS.md` | Vault Obsidian; novas notas Markdown devem usar frontmatter, tags kebab-case e wikilinks quando fizer sentido. |
| `Jhonny/CLAUDE.md` e `Jhonny/AGENTS.md` | Projeto RPG Maker MZ completo; consultar `../docs/index.xml` antes de alterar runtime da corrida. |
| `Jhonny/package.json` | App com `main: index.html`, titulo "Bye Bye Jhonny", janela 1280x720. |
| `Jhonny/data/System.json` | `gameTitle: Bye Bye Jhonny`, `locale: pt_BR`, resolucao/UI 1280x720, start map 11 em `(13, 6)`. |
| `Jhonny/data/System.json` | Switches 101-106 incluem `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `SW_CRASH_FLAG`, `SW_LAST_ACTION_SAFE`, `SW_PAUSED`, `SW_IS_CURVA_DIABO`. |
| `Jhonny/data/System.json` | Variaveis 101-122 incluem `VAR_RACE_ID`, `VAR_SCENE_INDEX`, `VAR_P_CENA`, `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_ATTEMPT_N`, `VAR_VITORIA_PASSOU`, `VAR_GLORIA_META`. |
| `Jhonny/data/CommonEvents.json` | Eventos de corrida relevantes incluem CE3, CE5-7, CE10-13, CE16, CE18 e CE19, com comandos `117`, `357`, pictures, switches e variaveis. |
| `Jhonny/data/MapInfos.json` | 16 mapas nomeados, incluindo `Prologo`, mapas VN, finais e mapas de corrida/teste. |
| `Jhonny/js/plugins.js` | Plugins ativos: `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`, `VisuMZ_0_CoreEngine`, `VisuMZ_2_VNPictureBusts`. |
| `Jhonny/js/plugins/Jhonny_RaceHelper.js` | Helper com `EnableDebugLogs`, W/S/A/D, thresholds e comandos `PluginManager.registerCommand`. |
| `Jhonny/img/pictures/race/**` | Assets visuais de corrida existem, incluindo fundos, botoes, barras, overlays e placa da Curva do Diabo. |

## Git e ambiente

- `git status --short` mostrou muitos arquivos `docs/loki-init/**` e
  `planos/000-init-loki/**` como deletados antes desta recriacao.
- Conflito de ambiente: a instrucao de workspace dizia que o repo nao tinha
  `.git/`, mas o estado atual e um worktree Git valido.
- Git foi usado apenas como evidencia auxiliar, sem `checkout`, `reset` ou
  reversao destrutiva.

## Superficies sensiveis

Nao declarar validado sem gate humano:

- Gameplay, input, UI, audio, pictures, TextPicture, VisuMZ, Common Events,
  save/load, deploy e estado persistido.
- Qualquer alteracao futura em `Jhonny/data/*.json`, `Jhonny/js/plugins*.js`,
  `Jhonny/img/**`, `Jhonny/audio/**`, `Jhonny/save/**` ou scripts mutadores em
  `Jhonny/planos/**`.

## Lacunas

- Nenhum Playtest foi executado neste init.
- Nenhum runtime, data JSON, plugin, asset ou save foi alterado.
- O catalogo `docs/index.xml` estava stale para `docs/loki-init/**` no inicio.
- Este inventario nao auditou profundamente todos os mapas, eventos, assets,
  dialogos, rotas, economia ou scripts historicos; esses itens devem ser
  cobertos por agentes de dominio e por `loki:tech-analysis` quando houver uma
  pergunta tecnica concreta.
