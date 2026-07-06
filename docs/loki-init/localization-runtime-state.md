---
title: "Loki Init - Localization Runtime State"
type: "runtime-localization-inventory"
status: "static-inventory"
date: 2026-07-06
tags:
  - loki-init
  - localization
  - rpg-maker-mz
  - message-core
  - lqa
---

# Loki Init - Localization Runtime State

Inventario estatico do estado de localizacao observado no workspace em
2026-07-06. Este documento promove para `/docs/loki-init` o que apareceu nos
changes atuais do git, sem declarar Playtest ou LQA concluido.

## Fontes Lidas

- Demanda transiente de localizacao, path omitido por politica de durabilidade
  de `docs/**`.
- `Jhonny/js/plugins.js`
- `Jhonny/js/plugins/VisuMZ_1_MessageCore.js`
- `Jhonny/data/Languages.csv`
- `Jhonny/data/System.json`
- `Jhonny/data/Map005.json`
- `Jhonny/data/Map006.json`
- `Jhonny/data/Map007.json`
- `Jhonny/data/Map009.json`
- `Jhonny/data/Map010.json`
- `Jhonny/data/Map011.json`
- `Jhonny/data/Map012.json`
- `Jhonny/data/Map013.json`
- `Jhonny/data/Map015.json`
- `Jhonny/data/Map016.json`

## Demanda Implementada

A demanda de localizacao pedia localizar o jogo tambem para ingles e usar
Message Core para habilitar portugues e ingles.

O estado atual mostra implementacao parcial dessa demanda:

- `VisuMZ_1_MessageCore` esta ativo.
- O `Localization:struct` esta habilitado.
- O menu Options deve exibir `Idioma / Language`.
- O locale padrao configurado e `Portuguese`.
- Os idiomas configurados sao `Portuguese` e `English`.
- `Jhonny/data/Languages.csv` foi criado como tabela de idioma.
- `System.json` e mapas de dialogo foram trocados para referencias `\tl{...}`.

## Plugin State

Plugins ativos observados em `Jhonny/js/plugins.js`:

| Ordem | Plugin |
| --- | --- |
| 0 | `TextPicture` |
| 1 | `ButtonPicture` |
| 2 | `Jhonny_RaceHelper` |
| 3 | `VisuMZ_0_CoreEngine` |
| 4 | `VisuMZ_1_MessageCore` |
| 5 | `VisuMZ_1_OptionsCore` |
| 6 | `VisuMZ_1_SaveCore` |
| 7 | `VisuMZ_2_VNPictureBusts` |
| 8 | `VisuMZ_2_PictureChoices` |
| 9 | `VisuMZ_2_ExtMessageFunc` |
| 10 | `VisuMZ_3_ChoiceCmnEvts` |
| 11 | `VisuMZ_3_MessageLog` |
| 12 | `VisuMZ_3_MsgLetterSounds` |
| 13 | `VisuMZ_4_MessageVisibility` |

`VisuMZ_1_MessageCore.js` declara `Version 1.51`. Esta versao local expõe CSV
como formato de localizacao no schema observado. O plano de migracao para TSV
precisa atualizar ou confirmar uma versao com suporte TSV antes de trocar a
tabela de runtime.

## Localization Struct

Estado observado na entrada ativa `VisuMZ_1_MessageCore`:

| Campo | Valor |
| --- | --- |
| `Enable:eval` | `true` |
| `CsvFilename:str` | `Languages.csv` |
| `Name:str` | `Idioma / Language` |
| `DefaultLocale:str` | `Portuguese` |
| `Languages:arraystr` | `["Portuguese","English"]` |
| `LangFiletype:str` | ausente no schema local observado |
| `TsvFilename:str` | ausente no schema local observado |

## Language Table

`Jhonny/data/Languages.csv` existe e usa header:

```csv
Key;Portuguese;English
```

Validacao estatica executada:

- 374 linhas de dados.
- 3 colunas por linha, incluindo header.
- 374 keys unicas apos normalizacao simples.
- 0 keys duplicadas encontradas.

## Localized Surfaces

Arquivos alterados com referencias `\tl{...}`:

| Arquivo | Referencias | Keys unicas | Missing na tabela |
| --- | ---: | ---: | ---: |
| `Jhonny/data/Map005.json` | 153 | 74 | 0 |
| `Jhonny/data/Map006.json` | 20 | 20 | 0 |
| `Jhonny/data/Map007.json` | 10 | 10 | 0 |
| `Jhonny/data/Map009.json` | 36 | 22 | 0 |
| `Jhonny/data/Map010.json` | 40 | 40 | 0 |
| `Jhonny/data/Map011.json` | 4 | 4 | 0 |
| `Jhonny/data/Map012.json` | 12 | 12 | 0 |
| `Jhonny/data/Map013.json` | 3465 | 63 | 0 |
| `Jhonny/data/Map015.json` | 1 | 1 | 0 |
| `Jhonny/data/Map016.json` | 2 | 2 | 0 |
| `Jhonny/data/System.json` | 97 | 92 | 0 |

Total observado: 3840 referencias `\tl{...}`, 340 keys unicas, 0 referencias
sem key correspondente na tabela CSV.

## Git Changes Promovidos Para Contexto

Promover para memoria duradoura:

- `Jhonny/js/plugins.js`: Message Core foi ativado para PT/EN.
- `Jhonny/data/Languages.csv`: nova tabela de idioma.
- `Jhonny/data/System.json`: termos basicos, comandos, parametros e mensagens
  foram convertidos para keys `system.*`.
- `Jhonny/data/Map005.json`, `Map006.json`, `Map007.json`, `Map009.json`,
  `Map010.json`, `Map011.json`, `Map012.json`, `Map013.json`,
  `Map015.json`, `Map016.json`: falas, choices e textos de mapa foram
  convertidos para keys `maps.*`.
- Artefato de demanda transiente atualizado para apontar para a documentacao
  local usada durante a implementacao; path omitido por politica de
  durabilidade de `docs/**`.

Nao promover como contexto de produto ou runtime:

- `.serena/project.yml`: alteracao de ferramenta local, fora do escopo de
  documentacao duradoura do projeto.

## Validation Gates

Concluido estaticamente:

- parse estrutural dos JSONs alvo durante a contagem;
- estrutura basica de `Languages.csv`;
- cobertura de keys para os arquivos alterados e `System.json`;
- identificacao da versao local do Message Core.

Pendente:

- Playtest do boot;
- confirmacao de carregamento HTTP de `data/Languages.csv`;
- confirmacao de que o menu Options mostra `Idioma / Language`;
- troca manual entre portugues e ingles;
- LQA das traducoes;
- validacao de layout, line breaks, word wrap, fontes e glifos;
- auditoria de assets com texto embutido.

## Relacao Com CSV Para TSV

O runtime atual esta em CSV. Para migrar para TSV, seguir
[RPG Maker MZ - VisuStella Message Core Localization](../03-Tech/RPG%20Maker%20MZ%20-%20VisuStella%20Message%20Core%20Localization.md#plano-para-migrar-de-csv-para-tsv).

A migracao TSV deve ser bloqueada enquanto o Message Core local permanecer em
`1.51` sem `LangFiletype:str` e `TsvFilename:str` no schema observado.
