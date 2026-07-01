# Melhoria continua - catalogo de retrospectivas

Data: 2026-06-26

Entrada: `Jhonny/planos/007-extracao-conhecimento/catalogo-retrospectivas.md`

Modo de execucao: proposta aprovada e aplicada. O usuario aprovou todos os
achados `ci-*` e pediu expansao previa com agentes em paralelo antes do update.
Foram disparados agentes read-only para revisar standards, pesquisar fontes,
catalogar docs do consumidor e digerir retrospectivas adicionais. A escrita
duradoura foi aplicada depois da consolidacao dos agentes.

## Status pos-aprovacao

| Area | Estado | Arquivos alterados |
| --- | --- | --- |
| Docs duraveis do consumidor | Aplicado | `docs/index.xml`; `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`; `docs/03-Tech/RPG Maker MZ - Debug Playtest.md`; `docs/02-Core-Loop/Corrida - Core Loop.md` |
| Roteamento local do projeto | Aplicado | `Jhonny/CLAUDE.md` |
| Skill RMMZ data JSON | Aplicado | `loki-rpg-maker-mz-data-json/SKILL.md`; referencias em `loki-rpg-maker-mz-data-json/references/` |
| Skill RMMZ plugin workflow | Aplicado | `loki-rpg-maker-mz-plugin-workflow/SKILL.md`; referencia em `loki-rpg-maker-mz-plugin-workflow/references/` |
| `ci-010` | Record-only | Nao promovido como regra nova porque ja estava coberto por regra operacional geral |

## Validacoes executadas

- `docs/index.xml` parseia como XML.
- Todos os paths declarados em `docs/index.xml` existem.
- Referencias novas das skills existem.
- Pacote Loki ficou sem paths de consumidor (`Jhonny/`, `/Users/`, `planos/`) e sem dependencia em artefatos locais.
- Nao ha `.md` solto diretamente em `skills/`.
- `60/100/150` permanece apenas como spec historica; runtime atual esta documentado como `200/400/600`.

## Escopo processado

- Catalogo fonte: 31 retrospectivas em `Jhonny/planos`.
- Fontes reabertas para evidencia focada:
  - R015: `003-bug-fix-round1/retrospetivas/fase1/retrospectiva-fase1-ce19-wait-input-race-active.md`
  - R016: `003-bug-fix-round1/retrospetivas/fase2/retrospectiva-fase2-opcode-inversion.md`
  - R018: `003-bug-fix-round1/retrospetivas/fase3/retrospectiva-fase3-textpicture-bake-timing.md`
  - R019: `003-bug-fix-round1/retrospetivas/fase4/retrospectiva-fase4-curve-event-binding.md`
  - R021: `003-bug-fix-round1/retrospetivas/fase5/2026-06-21-retrospectiva-fase5-thresholds-refactor.md`
  - R022/R023: merge de `feat/release-phase-b`
  - R028/R030: retry/preload e black screen lifecycle
  - R031: joices da corrida

## Sintese de classificacao

| Grupo | Destino duradouro recomendado | Acao agora |
| --- | --- | --- |
| Procedimentos RMMZ reutilizaveis para `data/*.json`, opcodes, Common Events e merges estruturais | `loki-rpg-maker-mz-data-json` e referencias da skill | Aplicado |
| Procedimentos RMMZ reutilizaveis para plugin, parametros ativos e smoke tests | `loki-rpg-maker-mz-plugin-workflow` e referencias da skill | Aplicado |
| Fatos especificos da corrida, mapa de CEs, switches, variaveis, thresholds e lifecycle de retry | `docs/**/*.md` do consumidor + `docs/index.xml` | Aplicado |
| Roteamento minimo para futuras LLMs no projeto `Jhonny/` | `Jhonny/CLAUDE.md` | Aplicado apos docs existirem |
| Itens ja cobertos por `Jhonny/CLAUDE.md` ou skills atuais | Record-only | Nao duplicar |
| Falhas isoladas ou preferencias locais sem repeticao suficiente | Backlog/record-only | Nao promover agora |

## Candidatos

### ci-001 - Contrato de opcodes e audits semanticos RMMZ

**Evidencia:** R016 mostra regressao por confiar em `task-2.2.md` para opcodes:
`command246` era `fadeOutBgs` e `command249` era `playMe`, enquanto a spec
estava invertida. A retrospectiva tambem registra que audits que repetiam o
mesmo opcode errado passaram falsamente. R018 reforca que `rmmz_objects.js` e a
fonte de verdade para opcodes.

**Classificacao:** `validation-gap`, severidade alta, escopo
`probable-universal` para RPG Maker MZ.

**Destino recomendado:** skill `loki-rpg-maker-mz-data-json`, provavelmente uma
referencia nova `references/common-event-command-contracts.md`, com ponteiro
curto no `SKILL.md`.

**Mudanca proposta:** exigir, antes de escrever ou auditar command codes RMMZ,
lookup em `rmmz_objects.js` para `Game_Interpreter.prototype.commandNNN`;
audits devem validar semantica e tipo de `parameters`, nao apenas numero do
opcode. Incluir tabela minima para codes recorrentes: `111`, `117`, `118`,
`119`, `121`, `122`, `230`, `231`, `235`, `242`, `246`, `249`, `250`, `355`,
`655`, `411`, `412`.

**Por que previne repeticao:** teria impedido a regressao de audio e os audits
tautologicos.

**Gates:** `technical-review`, `approval` - satisfeitos para este update.

**Validacao esperada:** frontmatter da skill valido, referencia autocontida,
sem paths de consumidor como fonte normativa, manifest se aplicavel.

**Estado pos-aprovacao:** aplicado em
`loki-rpg-maker-mz-data-json/SKILL.md` e
`loki-rpg-maker-mz-data-json/references/common-event-command-contracts.md`.

### ci-002 - Lifecycle de Common Events paralelos, `SW_RACE_ACTIVE` e `command117`

**Evidencia:** R015 registra que desligar `SW_RACE_ACTIVE` no topo do CE19
matava o parallel owner antes do `WAIT_INPUT`. R030 registra que
`Game_CommonEvent.refresh()` limpa o interpreter quando o CE paralelo deixa de
estar ativo. R018 registra que `command117` executa o CE chamado
sincronamente, entao converter um CE chamado para parallel com loop sem remover
callers causa hang.

**Classificacao:** `workflow-gap`, severidade alta, escopo
`probable-universal` para RPG Maker MZ Common Events.

**Destino recomendado:** skill `loki-rpg-maker-mz-data-json`.

**Mudanca proposta:** adicionar regra de preflight para Common Events:
mapear owner/trigger/switch antes de alterar lifecycle; nao desligar o switch
que mantem vivo um CE paralelo antes de concluir waits, labels, jumps, input
loops ou handoffs criticos; antes de converter CE action para parallel com loop,
buscar todos os callers `code=117 [id]` e decidir se devem ser removidos ou
substituidos.

**Por que previne repeticao:** teria evitado as regressoes de tela travada,
tela preta e hang por caller sincronico.

**Gates:** `technical-review`, `approval` - satisfeitos para este update.

**Validacao esperada:** exemplos genericos, sem `Jhonny/` como fonte normativa;
usar placeholders para `<consumer_runtime_surfaces>` e `<domain_ids>`.

**Estado pos-aprovacao:** aplicado em
`loki-rpg-maker-mz-data-json/SKILL.md` e
`loki-rpg-maker-mz-data-json/references/common-event-lifecycle.md`.

### ci-003 - Escrita estruturada de JSON RMMZ preservando estilo e diffs pequenos

**Evidencia:** R019 registra reflow de 3773 linhas por usar `json.dump(indent=2)`
em arquivo com `indent=4`. R031 repetiu diff ruidoso por indentacao 2. R021
confirma formato canonico local `json.dumps(..., indent=4, ensure_ascii=False)
+ "\n"` para `CommonEvents.json`, mas a regra reutilizavel e preservar o estilo
existente, nao hardcodar `4` no pacote.

**Classificacao:** `format-friction`, severidade alta, escopo misto:
procedimento universal na skill, fato local no contexto do consumidor.

**Destino recomendado:**
- Skill `loki-rpg-maker-mz-data-json`: regra generica "detectar/preservar
  estilo existente antes da primeira escrita".
- `Jhonny/CLAUDE.md` ou doc do consumidor: fato local "`CommonEvents.json` e
  `System.json` usam indentacao 4 neste projeto".

**Mudanca proposta:** preflight antes de escrita JSON: checar amostra do arquivo
versionado/atual, preservar indentacao, `ensure_ascii` e newline final; validar
diff restrito imediatamente apos a primeira escrita; se diff reflowar o arquivo
inteiro, parar e corrigir o writer antes de seguir.

**Por que previne repeticao:** evita reflows massivos e ciclos de restore/rewrite.

**Gates:** `technical-review`, `approval` - satisfeitos para este update.

**Estado pos-aprovacao:** aplicado como regra generica em
`loki-rpg-maker-mz-data-json/references/json-write-style-and-diff.md`.
O fato local de estilo ficou em
`docs/02-Core-Loop/Corrida - Runtime e Eventos.md`, sem hardcodar `indent=4`
na skill reutilizavel.

### ci-004 - Documentacao duradoura da arquitetura runtime da corrida

**Evidencia:** R015, R028, R030 e R031 repetem fatos de lifecycle: CE7 e
paralelos dependem de `SW_RACE_ACTIVE`; CE19 e a tela de resultado canonica;
derrota/retry deve chegar a `CE5`; `V[112]` distingue cold start de retry;
CE3 preload so deve rodar no bootstrap frio; crash deve redirecionar para a
mesma tela de derrota de `EV_VitoriaCorrida`.

**Classificacao:** `missing-context`, severidade alta, escopo
`project-specific`.

**Destino recomendado:** novo doc do consumidor, por exemplo
`docs/03-Tech/RPG Maker MZ - Contratos tecnicos.md` ou
`docs/02-Core-Loop/Corrida - Runtime e Eventos.md`, mais `docs/index.xml`.

**Mudanca proposta:** criar uma referencia duradoura com:
- mapa de Common Events da corrida, pelo menos CEs 3, 5, 6, 7, 10, 11, 12, 13,
  16, 18, 19;
- switches 100-105 e variaveis 100-121;
- contrato de `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `SW_PAUSED` e `V[112]`;
- fluxo de resultado/retry: `CE19 -> CE5`, sem `SW_RACE_ACTIVE OFF` antes de
  handoffs de derrota;
- checks de validacao estrutural e Playtest.

**Por que previne repeticao:** evita redescobrir o grafo real dos CEs em cada
plano e reduz bugs por cleanup global.

**Gates:** `approval` para docs do consumidor e `docs/index.xml` - satisfeito.

**Observacao:** antes de escrever em `docs/`, carregar `obsidian-markdown` e
`obsidian-cli`, conforme `docs/CLAUDE.md`.

**Estado pos-aprovacao:** aplicado em
`docs/02-Core-Loop/Corrida - Runtime e Eventos.md` e catalogado em
`docs/index.xml`.

### ci-005 - Divergencia de thresholds entre spec e codigo

**Evidencia:** R021 confirma que o codigo canonico usou `{1:200, 2:400, 3:600}`
com default `60`, enquanto a spec `docs/02-Core-Loop/Corrida - Core Loop.md`
ainda declara 60/100/150. R021 tambem registra que alterar os valores durante
o refactor seria mudanca de balance fora de escopo.

**Classificacao:** `factual-error`, severidade alta, escopo `project-specific`.

**Destino recomendado:** `docs/02-Core-Loop/Corrida - Core Loop.md` ou uma nota
tecnica linkada a ela, mais `docs/index.xml`.

**Mudanca proposta:** registrar claramente o estado atual:
"codigo atual usa thresholds 200/400/600; spec historica menciona 60/100/150;
qualquer alteracao desses valores e tuning de balance e exige decisao de design
separada". Se a spec for atualizada, alinhar secao 8, TL;DR e parametros.

**Por que previne repeticao:** evita que refactors futuros "corrijam" o codigo
para a spec desatualizada e mudem balance sem querer.

**Gates:** `approval` para docs do consumidor - satisfeito.

**Estado pos-aprovacao:** aplicado em
`docs/02-Core-Loop/Corrida - Core Loop.md`. O doc agora separa runtime atual
`200/400/600` da spec historica `60/100/150`.

### ci-006 - Debug runtime e Playtest: snapshots, logs curtos e F12/cache

**Evidencia:** R015, R028, R030 e R031 registram que Playtest e gate final para
input, audio, pictures e runtime; R021 registra que F12 pausa o game loop e
hard-refresh pode ser necessario; R028 registra que probes devem dizer
"Objetivo: provar X" ou "Objetivo: descartar Y" e evitar traces continuos.

**Classificacao:** `execution-friction`, severidade media-alta, escopo misto.

**Destino recomendado:**
- Docs do consumidor: guia curto de debug Playtest para `Jhonny`.
- Possivel backlog para skill `loki-rpg-maker-mz-data-json` se generalizado
  como "runtime validation probes".

**Mudanca proposta:** documentar roteiro minimo:
snapshot primeiro em tela preta (`mapId`, pictures, tint, switches, vars,
interpreter/child/reservation, evento Init); logs com throttle/filtro; cada
probe deve informar objetivo; nao declarar runtime resolvido sem Playtest; em
testes de input, evitar F12/canvas sem foco; hard-refresh/restart apos JSON.

**Por que previne repeticao:** reduz loops de probes redundantes e investigacao
por hipotese errada.

**Gates:** `approval` para docs; `technical-review` se virar skill. A parte
documental foi aprovada e aplicada; a generalizacao para skill ficou fora deste
update.

**Estado pos-aprovacao:** aplicado em
`docs/03-Tech/RPG Maker MZ - Debug Playtest.md` e reforcado em
`docs/02-Core-Loop/Corrida - Runtime e Eventos.md`.

### ci-007 - Plugin workflow: parametros ativos em `plugins.js` e namespace acumulador

**Evidencia:** retrospectiva de frame debug logs registrou que `@param` no
header nao basta para alterar valor ativo se `js/plugins.js` nao tiver os
parametros. R021 registra que reescrever `window.JhonnyRace = {...}` poderia
sobrescrever APIs existentes, e que `Object.assign(existing, newProps)` preservou
o namespace.

**Classificacao:** `workflow-gap`, severidade media, escopo
`probable-universal` para RPG Maker MZ plugins.

**Destino recomendado:** skill `loki-rpg-maker-mz-plugin-workflow`.

**Mudanca proposta:** expandir o workflow de plugin com:
- quando adicionar `@param`, revisar/atualizar entrada ativa em `js/plugins.js`
  ou fornecer instrucao manual de ativacao;
- usar `node -c` e smoke tests quando plugin expor helper/namespace;
- ao estender namespace global existente, preferir pattern acumulador em vez de
  reassignment destrutivo.

**Por que previne repeticao:** evita parametros que existem no editor mas nao
no runtime e evita shadow de APIs do helper.

**Gates:** `technical-review`, `approval` - satisfeitos para este update.

**Estado pos-aprovacao:** aplicado em
`loki-rpg-maker-mz-plugin-workflow/SKILL.md` e
`loki-rpg-maker-mz-plugin-workflow/references/plugin-activation-and-namespace.md`.

### ci-008 - Merge estrutural de Common Events e slots criados pelo editor

**Evidencia:** R022 registra falha de criar slots CE 20-23 via script apesar de
JSON canonico; R023 confirma estrategia bem-sucedida: usuario pre-cria slots
via editor, script sobrescreve conteudo preservando IDs, maps remapeiam
`code=117`.

**Classificacao:** `environment-friction`, severidade alta, escopo
`probable-universal` para RPG Maker MZ Database/Common Events, com exemplos
project-specific.

**Destino recomendado:** skill `loki-rpg-maker-mz-data-json` para regra
generica; docs do consumidor para fatos `Fala-ID1-4`, switches 43-46 e mapas
VN3 se ainda forem relevantes.

**Mudanca proposta:** adicionar regra:
nao assumir que aumentar `CommonEvents.json` por script cria slots aceitaveis
pelo editor; para merges que adicionam CEs, criar slots pelo editor ou exigir
gate humano equivalente antes de preencher por script; conflitos estruturais em
arrays JSON devem ser reconstruidos por script, e todo `code=117` nos maps deve
ser remapeado quando IDs mudarem.

**Por que previne repeticao:** evita merges que parseiam mas quebram o editor e
evita chamadas de mapa apontando para CEs errados.

**Gates:** `technical-review`, `approval` - satisfeitos para este update.

**Estado pos-aprovacao:** aplicado em
`loki-rpg-maker-mz-data-json/SKILL.md` e
`loki-rpg-maker-mz-data-json/references/common-event-merge-and-editor-slots.md`.

### ci-009 - Roteamento minimo em `Jhonny/CLAUDE.md`

**Evidencia:** varias regras ja foram promovidas para `Jhonny/CLAUDE.md`
parcialmente, mas os contratos completos ficariam grandes demais para esse
arquivo. O proprio contrato de melhoria continua recomenda colocar ponteiros
minimos em `CLAUDE.md` e detalhes em `/docs` ou skills.

**Classificacao:** `missing-context`, severidade media, escopo
`project-specific`.

**Destino recomendado:** depois que docs do consumidor existirem, adicionar em
`Jhonny/CLAUDE.md` apenas ponteiros como:
"Para contratos detalhados da corrida e Common Events, consulte
`docs/...` antes de editar `data/*.json` ou depurar runtime."

**Por que previne repeticao:** futuras LLMs carregam `Jhonny/CLAUDE.md` cedo e
vao ao documento certo sem duplicar regras longas nesse arquivo.

**Gates:** `approval` - satisfeito.

**Estado pos-aprovacao:** aplicado em `Jhonny/CLAUDE.md`, com ponteiros para
`../docs/index.xml`,
`../docs/02-Core-Loop/Corrida - Runtime e Eventos.md` e
`../docs/03-Tech/RPG Maker MZ - Debug Playtest.md`.

### ci-010 - Respeitar pedidos de analise antes de implementar

**Evidencia:** R031 registra que o pedido continha objetivo de analise/guia,
mas a execucao editou diretamente; o usuario corrigiu: "eu te pedi para rodar
analise e nao ja fazer a implementacao direto".

**Classificacao:** `prompt-gap`, severidade media, escopo `project-specific`
ou `probable-universal`, mas ja parcialmente coberto por instrucoes operacionais
do agente.

**Destino recomendado:** record-only por enquanto. Se voltar a repetir, promover
um ponteiro curto em `Jhonny/CLAUDE.md` ou regra de workflow: quando o usuario
pedir explicitamente "analise", "guia", "plano" ou "diagnostico", nao editar
arquivos ate nova autorizacao.

**Por que nao aplicar agora:** evidencia forte, mas a regra global do ambiente
ja cobre a distincao entre pergunta/plano e implementacao. Promover agora pode
duplicar politica existente.

**Estado pos-aprovacao:** mantido como `record-only`. Nao houve escrita
duradoura nova para `ci-010`.

## Itens record-only / ja cobertos

- `Jhonny/` e o projeto RPG Maker MZ real: ja esta em `Jhonny/CLAUDE.md`.
- Edicoes em `data/*.json` exigem parser/writer estruturado, parse JSON, diff
  restrito e Playtest quando runtime muda: ja coberto por
  `Jhonny/CLAUDE.md` e `loki-rpg-maker-mz-data-json`.
- Plugins devem usar `@target MZ`, `@plugindesc`, `@help`, `node -c` e evitar
  patch direto em `rmmz_*.js`: ja coberto por `Jhonny/CLAUDE.md` e
  `loki-rpg-maker-mz-plugin-workflow`.
- Pictures da corrida em `img/pictures/race/`, nomes sem extensao, `EV_Preload`
  com `Show Picture -> Wait 1 frame -> Erase Picture`: ja coberto em
  `Jhonny/CLAUDE.md`.
- `.agents/**` deny-by-default e nao deve receber artefatos duradouros:
  ja coberto no AGENTS/CLAUDE da raiz.

## Backlog tecnico remanescente

1. Criar scripts/validators reutilizaveis somente se houver nova aprovacao:
   dump de CEs por ID, audit de callers `code=117`, audit de estilo JSON,
   audit de rota CE19/CE5/CE3 e checagem de opcodes vs `rmmz_objects.js`.
2. Reavaliar `ci-010` apenas se o erro de implementar quando o pedido era
   analise/plano voltar a repetir.
3. Avaliar candidatos novos sugeridos pelos agentes antes de qualquer promocao:
   persistencia Picture/TextPicture/ButtonPicture, guardrail contra comandos git
   destrutivos e probes runtime ainda mais especificos.

## Proximo caminho minimo

1. Validar o conteudo dos docs e referencias aplicados.
2. Se houver ajuste fino de texto, editar os arquivos duraveis diretamente.
3. Se houver novo aprendizado ou candidato, abrir novo ciclo
   `loki:continuous-improvement` em vez de reabrir este draft como plano futuro.
