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

Inventario comum sequencial produzido para `loki:init`. Este documento mapeia evidencias locais suficientes para inicializar a documentacao Loki sem tocar runtime, mirrors de instalacao ou arquivos de instrucao globais.

## Escopo e limites de escrita

Allowed writes declarados para este init:

- `docs/**`
- `planos/000-init-loki/**`

Forbidden writes preservados:

- `Jhonny/**` runtime, assets, data JSON, plugins, scripts e planos historicos.
- `.agents/**`, `.codex/**`, `.claude/**`.
- `AGENTS.md` e `CLAUDE.md` em qualquer nivel.
- `.obsidian/**`, exceto se houver tarefa futura explicita de configuracao do vault.

## Estrutura observada

| Area | Evidencia | Observacao |
| --- | --- | --- |
| `docs/` | Vault Obsidian com `docs/index.xml`, docs de core loop e docs tecnicos. | Fonte duradoura principal. |
| `Jhonny/` | Projeto RPG Maker MZ com `game.rmmzproject`, `package.json`, `data/*.json`, `js/rmmz_*.js`, `js/plugins/`, assets e planos historicos. | Runtime sensivel; somente leitura neste init. |
| `planos/` | Diretoria operacional no root, vazia antes do init. | `planos/000-init-loki/**` foi criado para estado retomavel. |
| `.agents/` | Mirrors/symlinks Loki e manifest local. | Deny-by-default para escrita; leitura usada apenas como evidencia de instalacao. |
| `.codex/agents/` | Symlinks para agentes Codex do Loki package. | Evidencia de disponibilidade do adapter, nao fonte primaria de tags. |
| `.obsidian/` e `docs/.obsidian/` | Configuracao local do Obsidian. | Machine/vault state; nao editar neste init. |
| `Excalidraw/` | Artefatos Excalidraw. | Fora do escopo do init. |

## Documentacao existente

`docs/index.xml` existe e foi lido primeiro como catalogo navegavel. O catalogo atual se declara como "documentacao duradoura do projeto Jhonny" e lista quatro documentos principais:

- [[Corrida - Core Loop]]: especificacao mecanica da corrida, pontuacao, thresholds, variaveis, switches e Common Events.
- [[Corrida - Runtime e Eventos]]: contratos runtime da corrida, lifecycle de Common Events, input lock, retry e tela de resultado.
- [[RPG Maker MZ - Debug Playtest]]: procedimento de debug e Playtest para bugs perceptiveis.
- [[RPG Maker MZ - Scripts de Plano]]: procedimento para auditar/reutilizar scripts historicos em `Jhonny/planos`.

Outros documentos sob `docs/03-Tech/` sao prompts e procedimentos de trabalho para feedback, planejamento, enriquecimento de tasks e revisao de plano.

## Evidencias tecnicas lidas

| Fonte | Evidencia extraida |
| --- | --- |
| `docs/index.xml` | Catalogo XML versao 1.0, owner `catalogador`, atualizado em 2026-06-27. |
| `docs/CLAUDE.md` e `docs/AGENTS.md` | Vault Obsidian; novas notas devem usar frontmatter, tags kebab-case e wikilinks preferencialmente. |
| `Jhonny/CLAUDE.md` | Projeto RPG Maker MZ completo; `docs/index.xml` deve ser consultado antes de alterar runtime da corrida. |
| `Jhonny/package.json` | App NW.js/Electron-like com `main: index.html`, titulo "Bye Bye Jhonny", janela 1280x720. |
| `Jhonny/js/rmmz_core.js` | `Utils.RPGMAKER_NAME = "MZ"` e `Utils.RPGMAKER_VERSION = "1.10.0"`. |
| `Jhonny/js/libs/pixi.js` | PixiJS `5.3.12`. |
| `Jhonny/js/plugins.js` | Plugins ativos incluem `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`, `VisuMZ_0_CoreEngine` e `VisuMZ_2_VNPictureBusts`. |
| `Jhonny/js/plugins/Jhonny_RaceHelper.js` | Helper da corrida com comandos/logs, key mapper W/S/A/D, thresholds 200/400/600, API `window.JhonnyRace`. |

## Git e ambiente

- `git rev-parse --is-inside-work-tree`: `true`.
- `git status --short`: vazio antes dos writes do init.
- Conflito de ambiente: a instrucao de workspace dizia que o repo nao tinha `.git/`, mas o estado atual possui `.git/` e e um work tree valido.
- Git foi usado apenas como evidencia auxiliar.

## Superficies sensiveis

Nao declarar validado sem gate humano:

- Gameplay, input, UI, audio, pictures, TextPicture, VisuMZ, Common Events, save/load, deploy e estado persistido.
- Qualquer alteracao em `Jhonny/data/*.json`, `Jhonny/js/plugins*.js`, `Jhonny/img/**`, `Jhonny/audio/**`, `Jhonny/save/**` ou scripts mutadores em `Jhonny/planos/**`.

## Lacunas

- Nenhum Playtest foi executado neste init.
- O catalogo `docs/index.xml` ainda nao inclui os novos documentos `docs/loki-init/**`.
- A classificacao de projeto e feita no root do workspace, mas a evidencia de dominio vem de `docs/**` e `Jhonny/**`.
- Este inventario nao auditou profundamente todos os `data/*.json`, mapas, Common Events ou planos historicos; isso fica para workflow tecnico posterior com skill RPG Maker MZ aplicavel.

## Context Budget Used

- Leitura profunda: contrato `loki:init`, skills requeridas, manifest Loki, `docs/index.xml`, docs de runtime/debug/scripts, `Jhonny/CLAUDE.md`, `Jhonny/package.json`, `plugins.js` e `Jhonny_RaceHelper.js`.
- Leitura superficial: arvore de arquivos, tamanhos de diretorio, lista de docs, manifestos e surfaces de agentes.
- Ignorados por custo/risco: assets binarios, audio, imagens, save data, cache, `.git/objects`, runtime JSON completo e planos historicos extensos.
