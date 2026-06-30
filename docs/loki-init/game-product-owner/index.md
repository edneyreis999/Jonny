---
title: "Loki Init - Game Product Owner Inventory"
tipo: "inventario de produto"
status: "parcial"
agent: "game-product-owner"
tags:
  - loki-init
  - game-product-owner
  - produto
  - game-dev
  - rpg-maker-mz
---

# Loki Init - Game Product Owner Inventory

Data: 2026-06-30
Consumer root: `/Users/edney/projects/coreto/summer26`
Escopo inventariado: promessa de produto, escopo atual, prioridades documentadas, publico/personas quando presentes, marcos, fontes de roadmap/brief, criterios de aceite/gates e lacunas do projeto game-dev Jhonny.

Este inventario e factual e separa inferencias de fatos. Ele nao decide implementacao, nao valida experiencia perceptivel e nao promove decisao final de produto.

## Fontes Lidas

| Fonte | Uso no inventario | Cobertura |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Inventario comum, superficie de projeto, docs existentes, limites de escrita e superficies sensiveis. | Lido em detalhe. |
| `docs/loki-init/technology-context.md` | Classificacao `game-dev`, stack RPG Maker MZ, plugins ativos, validators e gates. | Lido em detalhe. |
| `docs/index.xml` | Catalogo de documentos duradouros e prioridades declaradas. | Lido parcialmente ate entradas relevantes de corrida e init. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Promessa jogavel, MVP, mecanica, riscos, milestones e proximos passos. | Lido em detalhe nas secoes de visao, loop, vitoria/derrota, riscos, dependencias, decisoes abertas e roadmap. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contratos runtime aprovados, tela de resultado, retry, invariantes e gates antes de editar JSON. | Lido em detalhe. |
| `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` | Gate humano e procedimento de evidencia para bugs perceptiveis. | Lido em detalhe. |
| `Jhonny/CLAUDE.md` | Roteamento do projeto RPG Maker MZ, docs duradouros e restricoes de Playtest. | Lido em detalhe. |
| `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md` | Contrato universal e contrato `game-product-owner`. | Lido em detalhe. |

## Mapa De Localizacao

| Tipo de informacao | Onde procurar |
| --- | --- |
| Promessa e core loop da corrida | `docs/02-Core-Loop/Corrida - Core Loop.md`, especialmente visao geral, principio de design, vitoria/derrota, riscos e proximos passos. |
| Contrato runtime e aceite tecnico da corrida | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`. |
| Procedimento de validacao perceptivel | `docs/03-Tech/RPG Maker MZ - Debug Playtest.md`. |
| Stack, projeto runtime e gates do init | `docs/loki-init/project-inventory.md` e `docs/loki-init/technology-context.md`. |
| Roteamento para alterar o projeto RPG Maker MZ | `Jhonny/CLAUDE.md`. |
| Catalogo de docs duradouros | `docs/index.xml`. |

## Fatos Atuais De Produto

### Promessa do produto

- O projeto documentado e o jogo RPG Maker MZ "Jhonny", com runtime real em `Jhonny/`.
- O documento de core loop declara o contexto "Summer Tavern Games (Tavern Jam)", time Coreto e engine "RPG Maker MZ (web-playable HTML5)".
- A promessa jogavel documentada para a corrida e um roguelite timer-based de decisoes binarias com recurso, nao um jogo de steering. O jogador resolve cenas de Sinal e Curva com acoes `safe` e `risk`.
- O principio de design declarado e que a mecanica deve ser rasa e que a profundidade vem da leitura contextual e do arco emocional.
- A fantasia central da corrida, conforme doc, e fazer o jogador sentir a tensao de obedecer ou apostar, alinhada ao tema "let chance decide".
- A corrida usa `Consciencia` como barra visivel de minigame e `Pontos de Gloria` como pontuacao de corrida. O doc separa `Consciencia` de `ConcernScore`, que pertence as cenas VN e finais.

### Escopo atual e escopo futuro

- O core loop documentado cobre apenas corrida, sinais, curvas, Consciencia e restart procedural. Cenas VN, ConcernScore, finais e direcao de arte sao apontados como pertencentes a fontes externas, especialmente `Roleta Paulista`.
- O MVP documentado adia a Fase Especial da Curva do Diabo. Para o MVP, a Corrida 3 tem 10 cenas normais com sorteio 60/40 Sinal/Curva, sem cena especial de climax.
- `SW_IS_CURVA_DIABO` e `placa_curva_dir.png` aparecem como reservados para uso futuro, sem serem parte do MVP atual.
- O full-product vision ainda menciona Curva do Diabo como climax futuro: ultima cena da Corrida 3, `P_cena = 100`, com tratamento visual/audio proprio.
- O roadmap do proprio core-loop doc aponta: validar spec contra pitch, prototipar uma corrida de 6 cenas e restart, fazer playtest cego, definir parametros apos 3+ playtests, e conectar com ConcernScore para intervencao na Corrida 3.

### Prioridades documentadas

- `docs/index.xml` marca como `high` os documentos `Corrida - Core Loop`, `Corrida - Runtime e Eventos`, `RPG Maker MZ - Debug Playtest`, `RPG Maker MZ - Scripts de Plano`, `project-inventory`, `technology-context`, `conflicts-and-decisions` e `open-questions`.
- A prioridade pratica recorrente nos docs e preservar o contrato da corrida antes de qualquer mudanca em runtime, Common Events, retry, tela de resultado, input, thresholds ou helper plugins.
- O MVP prioriza simplicidade de implementacao, restart barato e validacao por playtest sobre features de polish ou aprofundamento futuro.
- O runtime aprovado prioriza a tela canonica `EV_VitoriaCorrida`, `SW_INPUT_LOCKED` durante resultado, e retry sem repetir VN/preload completo quando o fluxo ja validado pula essas etapas.

### Personas, publico e audiencia

- Nao foi encontrado documento de persona formal nas fontes lidas.
- Fatos de audiencia presentes: o jogo e de gamejam, web-playable HTML5, em portugues (`pt_BR`) e deve ser validado por "playtest cego" com alguem sem contexto do pitch.
- O doc considera jogador mobile/browser em entradas de mouse, teclado e tap, mas isso aparece como requisito de input/UX da corrida, nao como persona.

### Marcos e milestones

- O core loop registra uma meta de gamejam: prototipar uma corrida de 6 cenas com restart funcional como D1 da jam.
- O MVP e associado a "Fase 6 do plano de implementacao" no aviso da Curva do Diabo.
- Decisoes datadas em 2026-06-19 aparecem no core-loop doc para thresholds/runtime, reset de seed, indicador "TENTATIVA N", som de crash, TextPicture de resultado e reset defensivo de `VAR_VITORIA_PASSOU`.
- A fase F7 registra a decisao de implementar indicador "TENTATIVA N" via TextPicture, ainda com hipotese de playtest para avaliar discrecao.
- A tecnologia/contexto do init foi produzido em 2026-06-30 e classifica o projeto como `game-dev`.

### Roadmap e brief sources

- Fontes de brief/roadmap encontradas nas fontes permitidas:
  - `Corrida - Core Loop.md`, com roadmap explicito em "Proximos passos sugeridos".
  - `docs/index.xml`, que cataloga documentos de corrida, runtime, debug e init.
  - `Jhonny/CLAUDE.md`, que aponta planos historicos em `Jhonny/planos/` mas os trata como contexto de desenvolvimento, nao como fonte duradoura primaria.
- Fontes referenciadas mas nao lidas por restricao do envelope:
  - `Roleta Paulista`
  - `Direcao de arte`
  - `Inspiracoes`
  - `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/task-6.2.md`
  - `RPG Maker MZ - Scripts de Plano.md`

## Criterios De Aceite E Gates Existentes

| Gate ou criterio | Fonte | Status neste inventario |
| --- | --- | --- |
| `human-validation` antes de declarar gameplay, UI, audio, input, Common Events, save/load ou deploy validado | `technology-context.md`, `Debug Playtest.md`, `Jhonny/CLAUDE.md` | Pendente; nenhum Playtest executado por este agente. |
| `technical-review` antes de alterar contratos Loki, package, agentes, skills, templates ou validators | `technology-context.md` | Pendente para mudancas de contrato; nao aplicavel a este inventario factual. |
| `approval` para writes fora de `docs/**` e `planos/000-init-loki/**` | `technology-context.md`, contrato Loki | Nao solicitado; este agente nao escreveu fora do escopo. |
| Playtest humano como gate final para visual, input, audio, pictures, plugins e Common Events | `Debug Playtest.md` | Pendente. |
| Antes de editar JSON: confirmar IDs em `System.json`, command codes em `rmmz_objects.js`, parse JSON, diff restrito e Playtest quando afetar engine/input/pictures/audio/plugins/CEs | `Corrida - Runtime e Eventos.md` | Gate documentado para workflows futuros; nao executado aqui. |
| Product feel: se o tema "let chance decide" emerge organicamente em playtest cego | `Corrida - Core Loop.md` | Pendente e nao validado por inventario estatico. |
| Definir parametros apos 3+ playtests | `Corrida - Core Loop.md` | Pendente. |

## Inferencias Separadas Dos Fatos

- Inferencia: a principal promessa de produto atualmente documentada esta concentrada na corrida, nao no jogo completo, porque as fontes permitidas detalham extensivamente a corrida e apenas referenciam pitch, VN, finais e direcao de arte.
- Inferencia: o publico operacional minimo para validacao e um jogador/playtester sem contexto do pitch, porque o roadmap pede playtest cego e nao ha persona formal nas fontes lidas.
- Inferencia: a prioridade de produto imediata e estabilizar/validar o MVP da corrida antes de expandir Curva do Diabo, ConcernScore ou polish, porque esses itens sao marcados como pos-MVP, v2/v3 ou dependentes de playtest.
- Inferencia: conflitos entre promessa completa e MVP devem ser tratados como decisao de produto antes de qualquer action plan que inclua Curva do Diabo ou ConcernScore.

## Conflitos E Lacunas Para O Orquestrador

- A fonte `Corrida - Core Loop.md` tem status `v1-rascunho`, enquanto `Corrida - Runtime e Eventos.md` tem status `aprovado`. Para qualquer decisao divergente, o orquestrador deve confirmar qual fonte manda no escopo de produto.
- O core-loop doc contem uma tensao de escopo: descreve a Curva do Diabo como parte da visao completa e tambem afirma que ela esta fora do MVP. Isso esta claro como boundary, mas precisa continuar protegido em stories futuras.
- Ha linguagem conflitante sobre timeout: em alguns pontos timeout aparece como safe automatico; em outro ponto de restart aparece como erro fatal/crash. Isso precisa de decisao de produto/design antes de alterar runtime ou criterios de aceite.
- O core-loop doc afirma solucao "sem plugins" em contexto historico, mas o technology context registra plugins ativos, incluindo `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper` e VisuMZ. Isso e doc-runtime drift a ser tratado por analise tecnica, nao por decisao deste inventario.
- Personas, publico-alvo comercial, plataformas-alvo formais, promessa de jogo completo, criterios de sucesso fora da corrida e release milestone final nao foram encontrados nas fontes permitidas.
- As fontes `Roleta Paulista`, `Direcao de arte`, `Inspiracoes` e planos historicos foram referenciadas, mas nao estavam dentro do conjunto de leitura autorizado para este agente.
- Nenhuma validacao humana de gameplay feel, leitura, UI, audio, input, pacing, balanceamento ou narrativa foi concluida por este inventario.

## Cobertura

Inspecionado em detalhe:

- Documentos duradouros permitidos de corrida, runtime e debug.
- Inventario comum e contexto tecnico do init.
- Contrato universal e contrato `game-product-owner`.
- Roteamento do projeto RPG Maker MZ em `Jhonny/CLAUDE.md`.

Apenas mapeado:

- `docs/index.xml` como catalogo e prioridade, sem auditoria completa de todas as entradas.
- Runtime `Jhonny/` por meio dos inventarios comuns e roteamento; este agente nao leu nem validou diretamente data JSON, plugins, mapas, assets ou saves.

Nao encontrado nas fontes lidas:

- Persona formal.
- Documento de PRD/MVP unico para o jogo completo.
- Roadmap de release alem dos proximos passos do core-loop e marcos F6/F7 citados.
- Matriz formal de aceite de produto separada dos gates tecnicos e de Playtest.

## Handoff

Para `game-design`:

- Resolver o conflito de timeout e confirmar se o MVP deve manter timeout como safe automatico, crash ou outro comportamento.
- Confirmar se thresholds 200/400/600 continuam sendo criterio de produto ou apenas estado runtime atual.

Para `narrative-design`:

- Validar a separacao `Consciencia` versus `ConcernScore` contra o pitch completo e confirmar se algum cross-talk fica para v3.
- Confirmar como a promessa emocional da corrida conecta com VN/finais sem depender da Curva do Diabo no MVP.

Para `ux-ui`:

- Preparar validacao de playtest cego para clareza de risco sem mostrar `P_cena` numericamente.
- Validar o indicador "TENTATIVA N" e a tela cerimonial de resultado.

Para `runtime-qa`:

- Usar `RPG Maker MZ - Debug Playtest.md` e `Corrida - Runtime e Eventos.md` antes de declarar comportamento perceptivel validado.

Para `game-business-analyst`:

- Transformar os gates e conflitos acima em criterios de aceite testaveis sem decidir implementacao.

## Contract Snapshot

```yaml
parallel_agent_response:
  agent: "game-product-owner"
  mode: "scoped-writer"
  summary: "Inventario factual de promessa, escopo, prioridades, audiencia, marcos, fontes de roadmap/brief, gates e lacunas de produto para Jhonny/corrida."
  affected_files:
    - "docs/loki-init/game-product-owner/index.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/game-product-owner/index.md"
    allowed_writes:
      - "docs/loki-init/game-product-owner/**"
      - "planos/000-init-loki/retrospetivas/fase1/game-product-owner-retrospectiva.md"
    scoped_write_domains:
      - "requirements"
      - "acceptance-criteria"
      - "product-scope-docs"
    validators:
      - "static inventory contract coverage"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "Jhonny/ runtime mapped as read-only only"
  affected_domain_ids:
    - "corrida"
    - "Curva do Diabo"
    - "VAR_PONTOS_GLORIA"
    - "VAR_CONSCIENCIA"
    - "EV_VitoriaCorrida"
  evidence:
    - "docs/loki-init/project-inventory.md"
    - "docs/loki-init/technology-context.md"
    - "docs/index.xml"
    - "docs/02-Core-Loop/Corrida - Core Loop.md"
    - "docs/02-Core-Loop/Corrida - Runtime e Eventos.md"
    - "docs/03-Tech/RPG Maker MZ - Debug Playtest.md"
    - "Jhonny/CLAUDE.md"
    - "/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md"
  findings:
    - type: "product-value"
      detail: "A promessa documentada da corrida e uma cadeia roguelite timer-based de decisoes binarias em que profundidade vem da leitura contextual e do arco emocional."
    - type: "scope"
      detail: "Curva do Diabo e visao completa/futura e esta explicitamente fora do MVP atual."
    - type: "priority"
      detail: "Docs de corrida, runtime e debug tem prioridade alta no catalogo."
    - type: "audience"
      detail: "Nao ha persona formal; ha evidencia de gamejam, web HTML5, pt_BR e playtest cego sem contexto do pitch."
    - type: "success-criteria"
      detail: "Aceite perceptivel depende de Playtest/human-validation; parametros finais pedem 3+ playtests."
    - type: "open-question"
      detail: "Timeout aparece com tratamento divergente e requer decisao antes de story ou patch."
  risks:
    - "Doc-runtime drift entre promessa 'sem plugins' e plugins ativos registrados no contexto tecnico."
    - "Confundir full vision com MVP pode expandir escopo indevidamente."
    - "Declarar feel, clareza, balanceamento ou narrativa como validos sem playtest violaria os gates."
  confidence: "medium"
  model_class: "frontier_reasoning"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Consolidar conflitos de produto em open questions e, antes de action plan, decidir timeout/MVP Curva do Diabo/criterios de playtest."
```
