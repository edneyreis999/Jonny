---
title: "Retrospectiva Tecnica - narrative-qa"
tipo: "loki-retrospectiva-tecnica"
status: "concluida"
agent: "narrative-qa"
phase: "fase1"
date: "2026-06-30"
tags:
  - loki-init
  - retrospectiva
  - narrative-qa
---

# Retrospectiva Tecnica - narrative-qa

## Objetivo E Resultado

Objetivo: produzir inventario factual de QA narrativo para o `loki:init`,
cobrindo continuidade, flags narrativas, rotas, regressao de conteudo,
alcancabilidade documentada, fontes de QA e lacunas de validacao.

Resultado entregue:

- `docs/loki-init/narrative-qa/inventory.md`
- `planos/000-init-loki/retrospetivas/fase1/narrative-qa-retrospectiva.md`

Criterio de conclusao: pasta `docs/loki-init/narrative-qa/**` materializada
com inventario de dominio e retrospectiva propria escrita no caminho exato do
envelope.

## Restricoes Relevantes

- Escrita permitida somente em `docs/loki-init/narrative-qa/**` e neste
  arquivo de retrospectiva.
- Leitura limitada aos documentos autorizados pelo envelope e ao contrato de
  inventario do package.
- Proibido editar runtime, `Jhonny/**`, `docs/index.xml`, `.agents/**`,
  `.codex/**`, `.claude/**`, `AGENTS.md` e `CLAUDE.md`.
- Nenhuma validacao de runtime, Playtest, route reachability, save/load,
  pacing ou leitura humana podia ser declarada.

## Artefatos Consultados

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `docs/index.xml`
- `docs/02-Core-Loop/Corrida - Core Loop.md`
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`
- `Jhonny/data/MapInfos.json`
- `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`
- Skills lidas: `loki-init`, `loki-rpg-maker-mz-project-inventory`,
  `loki-retrospectiva-tecnica`
- Referencias lidas do inventario RPG Maker MZ: `inventory-checklist.md` e
  `game-dev-domain-inventories.md`

## Validacoes

Feitas:

- Parsing JSON estatico de `Jhonny/data/MapInfos.json` com `node -e`.
- Revisao estatica dos docs autorizados com `sed`, `rg` e `nl`.
- Escrita limitada aos destinos permitidos.
- Inventario afirma explicitamente que reachability e runtime permanecem
  pendentes.

Nao feitas:

- Nenhum Playtest.
- Nenhuma leitura profunda de `Map*.json`, `CommonEvents.json` ou `System.json`.
- Nenhuma validacao de editor RPG Maker MZ.
- Nenhum teste de save/load ou de input.

Dependentes de gate humano:

- Route reachability.
- Pacing de retry sem VN.
- Clareza de tentativa, resultado e final MVP.
- Sensibilidade narrativa de batida, sabotagem, finais e possivel dano/luto.

## Decisoes E Pendencias

Decisoes humanas novas: nenhuma durante esta execucao.

Pendencias:

- Construir route matrix futura com `System.json`, `CommonEvents.json` e uma
  amostra dirigida de `Map*.json`.
- Resolver fonte canonica de `ConcernScore`, finais 1/2/3 e intervencao por
  sabotagem antes de declarar cobertura narrativa.
- Confirmar diretamente IDs de switches/variaveis em `System.json` antes de
  qualquer plano de edicao.

## Rastro Operacional Material

Comandos e leituras uteis:

- `sed` nos `SKILL.md` de `loki-init`, inventario RPG Maker MZ e retrospectiva.
- `rg --files` para localizar `loki-init-inventory-contracts.md`.
- `sed` nas fontes autorizadas de docs.
- `rg -n` para localizar `ConcernScore`, finais, variaveis, switches, retry e
  decisoes abertas.
- `node -e` para parsear `Jhonny/data/MapInfos.json`.
- `nl -ba` para coletar trechos com linhas de evidencia.
- `apply_patch` para criar o inventario e esta retrospectiva.

Nenhum script mutador, gerador, formatter, test runner ou comando destrutivo
foi executado.

## Atritos De Execucao

### source-friction

- What Happened: o documento de core loop referencia `Roleta Paulista` como
  fonte de VN, `ConcernScore`, finais e direcao de arte, mas essa fonte nao
  estava autorizada para leitura.
- Expected Behavior: a matriz narrativa teria fonte canonica disponivel.
- Actual Behavior: apenas referencias indiretas estavam disponiveis.
- Evidence: `Corrida - Core Loop.md` separa `Consciência` de `ConcernScore` e
  aponta cenas VN/finais para outro documento.
- Cause: envelope de leitura focado e propositalmente restrito.
- Resolution Or Outcome: inventario marcou finais e intervencao como
  referenciados, nao inventariados.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: para route matrix, incluir `Roleta Paulista` e mapas/finais
  no envelope.
- Avoid Next Time: pedir fontes canonicas de narrativa quando a tarefa exigir
  endings ou escolhas globais.
- Minimum Next Step: `loki:tech-analysis` focado em route matrix.

### validation-friction

- What Happened: as fontes documentam fluxo e contracts, mas nao provam
  reachability.
- Expected Behavior: route QA exigiria fixtures, mapas e Playtest.
- Actual Behavior: a execucao podia apenas inventariar evidencia estatica.
- Evidence: `MapInfos.json` contem nomes de mapas, nao transferencias ou
  predicados; docs afirmam que Playtest e gates humanos sao pendentes.
- Cause: escopo de init inventory sem runtime.
- Resolution Or Outcome: todas as afirmacoes de alcance foram classificadas
  como documentadas ou pendentes.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: manter a distincao entre rota documentada e rota validada.
- Avoid Next Time: nao usar nomes de mapas como prova de final alcancavel.
- Minimum Next Step: auditar `Map*.json` e `CommonEvents.json` com skill de
  data JSON em plano aprovado.

### inference-good

- What Happened: tratar `MapInfos.json` como superficie de nomes, nao como
  evidencia de reachability, evitou uma conclusao falsa.
- Expected Behavior: inventario narrativo deve mapear risco sem declarar
  validade.
- Actual Behavior: inventario registrou mapas de final/sabotagem/celular como
  superficies a auditar.
- Evidence: `MapInfos.json` lista nomes, `game-dev-domain-inventories.md`
  orienta separar estrutura estatica de validacao.
- Cause: aplicacao correta do recorte de inventario RPG Maker MZ.
- Resolution Or Outcome: achado registrado como lacuna.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: usar MapInfos primeiro para escopo, depois MapXXX para
  predicados reais.
- Avoid Next Time: nao inferir conteudo de rota apenas por nome de mapa.
- Minimum Next Step: selecionar mapas de finais para amostra dirigida.

### source-friction

- What Happened: havia discrepancia entre faixas de IDs resumidas pelo
  `project-inventory.md` e IDs listados no core loop.
- Expected Behavior: uma unica fonte de verdade ja resolvida.
- Actual Behavior: o inventario comum resume faixas enquanto o core loop pede
  confirmacao direta em `System.json`.
- Evidence: `project-inventory.md` lista switches 101-106 e variaveis 101-122;
  `Corrida - Core Loop.md` lista variaveis 100-117 e switches 100-105.
- Cause: possivel resumo deslocado, convencao historica ou divergencia de
  documentacao; nao confirmada porque `System.json` nao estava no envelope.
- Resolution Or Outcome: inventario marcou confirmacao direta em `System.json`
  como requisito antes de edicao.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: sempre imprimir faixa real de `System.json` antes de mexer em
  flags/variaveis.
- Avoid Next Time: nao consolidar IDs a partir de resumos quando o arquivo de
  dados real for a fonte de verdade.
- Minimum Next Step: incluir `System.json` em analise tecnica focada.

## Desperdicios Evitados

- Nao houve deep-read de todos os mapas.
- Nao houve leitura de runtime proibido fora da lista autorizada.
- Nao houve tentativa de validar gameplay com docs estaticos.
- Nao houve edicao em `docs/index.xml` apesar de o indice listar contexto antigo
  de `narrative-qa`.

## Caminho Minimo Recomendado

Para repetir esta tarefa com menor custo:

1. Ler contrato de inventario e envelope de escrita.
2. Ler `project-inventory.md`, `technology-context.md` e `docs/index.xml`.
3. Ler apenas os docs de corrida autorizados e parsear `MapInfos.json`.
4. Buscar termos `ConcernScore`, `VAR_`, `SW_`, `final`, `retry`, `Curva do Diabo`
   e `VN`.
5. Escrever inventario separando fato, inferencia, risco e gate humano.
6. Escrever retrospectiva antes do final.

## Aprendizados Reutilizaveis

- Validado nesta execucao: `MapInfos.json` e util para mapear superficies de
  finais, mas insuficiente para reachability.
- Validado nesta execucao: `ConcernScore` e a fronteira narrativa central que
  exige fonte canonica adicional.
- Validado nesta execucao: retry sem VN e `EV_VitoriaCorrida` sao os pontos
  mais sensiveis para regressao narrativa no recorte lido.
- Hipotese: a divergencia de ID entre inventario comum e core loop pode ser
  drift documental; precisa de `System.json`.

## Candidatos Para Melhoria Continua

Nenhum candidato promovido. A execucao nao justifica alterar skill, agente,
template ou standard sem technical-review.

## Riscos Residuais

- Inventario nao cobre dialogos, escolhas VN, textos de finais ou mapa/evento
  real.
- Nao ha route matrix validada.
- Nao ha fixtures de save intermediario.
- Nao ha validacao perceptivel de tela de resultado, retry, input lock ou
  pacing.

## Proximo Passo

Rodar `loki:tech-analysis` focado em QA narrativo de rotas, com envelope que
inclua `System.json`, `CommonEvents.json`, mapas de VN/finais selecionados,
fonte canonica de `ConcernScore`/`Roleta Paulista`, validadores JSON e gate de
Playtest/human-validation.
