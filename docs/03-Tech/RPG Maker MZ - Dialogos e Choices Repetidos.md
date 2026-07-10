---
title: "RPG Maker MZ - Dialogos e Choices Repetidos"
type: "project-runtime-editing-convention"
status: "active-reference"
tags:
  - rpg-maker-mz
  - choices
  - localization
  - visustella
---

# RPG Maker MZ - Dialogos e Choices Repetidos

Referencia duradoura para editar dialogos, choices, bustos VN, Picture Choices
e Choice Common Events repetidos no projeto `Jhonny/`.

Este documento registra uma convencao do projeto consumidor. Ele nao e regra do
pacote Loki e nao substitui Playtest, LQA, route matrix ou validacao visual.

## Quando Usar

Use antes de editar mapas ou Common Events com dialogos, choices, bustos VN,
Picture Choices ou Choice Common Events quando houver falas, keys de
localizacao ou opcoes repetidas.

A regra vale para qualquer mapa ou evento repetitivo. `Map013` e evidencia
forte do risco, nao limite de escopo.

## Convencao

Em estruturas repetidas, nao assumir que o primeiro match representa todas as
ocorrencias.

Antes de escrever, enumerar todas as ocorrencias equivalentes por chave estavel:

- key de localizacao `\tl{...}`;
- texto ou key de choice;
- tag de plugin, como `<Choice Common Event: ...>`;
- posicao em branch;
- assinatura estrutural do comando.

Preservar todas as referencias `\tl{...}` existentes e todas as tags
`<Choice Common Event: ...>` existentes, salvo decisao humana explicita em
contrario.

Nao substituir texto localizado por literal hardcoded durante patches de busto,
choice ou roteamento.

## Checklist Antes De Escrever

- Parsear JSON estruturalmente.
- Evitar busca textual ampla em mapas grandes quando um scan por parser puder
  filtrar `code`, `parameters`, indice e `indent`.
- Contar ocorrencias totais por key ou assinatura alvo.
- Registrar cobertura esperada antes do patch.
- Confirmar plugins envolvidos no estado local quando relevantes:
  `VisuMZ_2_VNPictureBusts`, `VisuMZ_2_PictureChoices` e
  `VisuMZ_3_ChoiceCmnEvts`.
- Confirmar que qualquer Common Event chamada existe em `CommonEvents.json`,
  esta salva em disco e e adequada para chamada finita via `command117`.

## Validacao Apos Patch

Validar novamente as contagens por key ou assinatura.

Para Choice Common Events em branches RPG Maker MZ, confirmar que cada comando
`code === 402` alvo e seguido pelo `code === 117` esperado no nivel correto,
com `indent = branch.indent + 1`.

Confirmar que as contagens de `\tl{...}` e `<Choice Common Event: ...>` nao
cairam por acidente.

## Exemplo Local

Em 2026-07-10, a correcao de bustos e choices em `Map013` exigiu cobrir duas
choices repetidas 88 vezes cada.

O resultado aceito preservou:

- 1464 referencias `\tl{...}`;
- 1319 tags `<Choice Common Event: ...>`;
- 176 chamadas `command117 -> CE31`.

Esses numeros sao evidencia do padrao de risco, nao regra fixa para outros
mapas.

## Limites

A validacao humana da cena afetada nao equivale a Playtest automatizado,
screenshot automatizado ou varredura completa do jogo.

Nao declarar alcance narrativo, semantica de multiplas tags em uma choice ou
seguranca universal de Common Events sem validacao especifica.
